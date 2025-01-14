#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as crypto from 'crypto';
// import * as yargs from 'yargs';
// import { hideBin } from 'yargs/helpers';

const MAX_PARTITION_LENGTH = 0xc00; // 3K for partition data (96 entries) leaves 1K in a 4K sector for signature
const MD5_PARTITION_BEGIN = Buffer.concat([Buffer.from([0xEB, 0xEB]), Buffer.alloc(14, 0xFF)]);
// const PARTITION_TABLE_SIZE = 0x1000; // Size of partition table

// const MIN_PARTITION_SUBTYPE_APP_OTA = 0x10;
// const NUM_PARTITION_SUBTYPE_APP_OTA = 16;

// const SECURE_NONE = null;
// const SECURE_V1 = 'v1';
// const SECURE_V2 = 'v2';

// const __version__ = '1.3';

const APP_TYPE = 0x00;
const DATA_TYPE = 0x01;
const BOOTLOADER_TYPE = 0x02;
const PARTITION_TABLE_TYPE = 0x03;

export const TYPES: Record<string, number> = {
  'bootloader': BOOTLOADER_TYPE,
  'partition_table': PARTITION_TABLE_TYPE,
  'app': APP_TYPE,
  'data': DATA_TYPE,
};

// function getPtypeAsInt(ptype: string | number): number {
//   if (typeof ptype === 'number') return ptype;
//   return TYPES[ptype] ?? parseInt(ptype, 0);
// }

export const SUBTYPES: Record<number, Record<string, number>> = {
  [BOOTLOADER_TYPE]: {
    'primary': 0x00,
    'ota': 0x01,
  },
  [PARTITION_TABLE_TYPE]: {
    'primary': 0x00,
    'ota': 0x01,
  },
  [APP_TYPE]: {
    'factory': 0x00,
    'test': 0x20,
  },
  [DATA_TYPE]: {
    'ota': 0x00,
    'phy': 0x01,
    'nvs': 0x02,
    'coredump': 0x03,
    'nvs_keys': 0x04,
    'efuse': 0x05,
    'undefined': 0x06,
    'esphttpd': 0x80,
    'fat': 0x81,
    'spiffs': 0x82,
    'littlefs': 0x83,
  },
};

// function getSubtypeAsInt(ptype: string | number, subtype: string | number): number {
//   ptype = getPtypeAsInt(ptype);
//   if (typeof subtype === 'number') return subtype;
//   return SUBTYPES[ptype][subtype] ?? parseInt(subtype, 0);
// }

// const ALIGNMENT: Record<number, number> = {
//   [APP_TYPE]: 0x10000,
//   [DATA_TYPE]: 0x1000,
//   [BOOTLOADER_TYPE]: 0x1000,
//   [PARTITION_TABLE_TYPE]: 0x1000,
// };

// function getAlignmentOffsetForType(ptype: number): number {
//   return ALIGNMENT[ptype] ?? ALIGNMENT[DATA_TYPE];
// }

// function getAlignmentSizeForType(ptype: number, secure: string): number {
//   if (ptype === APP_TYPE) {
//     if (secure === SECURE_V1) {
//       return 0x10000;
//     } else if (secure === SECURE_V2) {
//       return 0x1000;
//     } else {
//       return 0x1000;
//     }
//   }
//   return 0x1;
// }

// function getPartitionType(ptype: string): number {
//   switch (ptype) {
//     case 'app':
//       return APP_TYPE;
//     case 'data':
//       return DATA_TYPE;
//     case 'bootloader':
//       return BOOTLOADER_TYPE;
//     case 'partition_table':
//       return PARTITION_TABLE_TYPE;
//     default:
//       throw new Error('Invalid partition type');
//   }
// }

function parseIntWithSuffix(value: string, keywords: Record<string, number> = {}): number {
  const lowerValue = value.toLowerCase();
  for (const [suffix, multiplier] of Object.entries({ 'k': 1024, 'm': 1024 * 1024 })) {
    if (lowerValue.endsWith(suffix)) {
      return parseIntWithSuffix(lowerValue.slice(0, -1), keywords) * multiplier;
    }
  }
  if (keywords[lowerValue] !== undefined) return keywords[lowerValue];
  return parseInt(value, 0);
}

export class Partitions {
  partitions: PartitionDefinition[] = [];

  static async fromFile(filePath: string): Promise<[Partitions, boolean]> {
    const data = await fs.promises.readFile(filePath);
    if (data.slice(0, 2).equals(PartitionDefinition.MAGIC_BYTES)) {
      console.log('Parsing binary partition input...');
      return [Partitions.fromBinary(data), true];
    }
    console.log('Parsing CSV input...');
    return [Partitions.fromCSV(data.toString()), false];
  }

  static fromCSV(csvContents: string): Partitions {
    const result = new Partitions();
    const lines = csvContents.split('\n').map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('#'));

    for (const [index, line] of lines.entries()) {
      try {
        result.partitions.push(PartitionDefinition.fromCSV(line, index + 1));
      } catch (error) {
        console.error(`Error parsing CSV line ${index + 1}: ${line}`, error);
        throw error;
      }
    }
    return result;
  }

  static fromBinary(data: Buffer): Partitions {
    data = Buffer.from(data);
    const result = new Partitions();
    const md5 = crypto.createHash('md5');
    for (let offset = 0; offset < data.length; offset += 32) {
      const chunk = data.slice(offset, offset + 32);
      if (chunk.length !== 32 || chunk.equals(Buffer.alloc(32, 0xFF))) break;
      if (chunk.slice(0, 2).equals(MD5_PARTITION_BEGIN.slice(0, 2))) {
        if (chunk.slice(16).equals(md5.digest())) continue;
        else throw new Error("MD5 checksums don't match!");
      }
      md5.update(Buffer.from(chunk));
      result.partitions.push(PartitionDefinition.fromBinary(chunk));
    }
    return result;
  }

  toCSV(): string {
    const rows = ['# ESP-IDF Partition Table', '# Name, Type, SubType, Offset, Size, Flags'];
    for (const partition of this.partitions) {
      rows.push(partition.toCSV());
    }
    return rows.join('\n');
  }

  toBinary(): Buffer {
    let result = Buffer.concat(this.partitions.map((partition) => partition.toBinary()));
    if (result.length >= MAX_PARTITION_LENGTH) throw new Error('Binary partition table length longer than max');
    if (result.length > 0) result = Buffer.concat([result, MD5_PARTITION_BEGIN, crypto.createHash('md5').update(result).digest()]);
    return Buffer.concat([result, Buffer.alloc(MAX_PARTITION_LENGTH - result.length, 0xFF)]);
    // const flags = (this.encrypted ? 1 : 0) | (this.readonly ? 2 : 0);
    // let b = new Buffer(PartitionDefinition.MAGIC_BYTES);
    // this.partitions.forEach(element => {
    //   b = Buffer.concat([
    //     // todo: fix to use actual partitions collection
    //   ]);
    // });
    // return b;
  }
}

export class PartitionDefinition {
  static MAGIC_BYTES = Buffer.from([0xAA, 0x50]);
  name = "";
  type: number | null = null;
  subtype: number | null = null;
  offset: number | null = null;
  size: number | null = null;
  encrypted = false;
  readonly = false;

  static fromCSV(line: string, lineNo: number): PartitionDefinition {
    const fields = line.split(',').map(field => field.trim());
    const result = new PartitionDefinition();
    result.name = fields[0];
    result.type = parseIntWithSuffix(fields[1], TYPES);
    result.subtype = parseIntWithSuffix(fields[2], SUBTYPES[result.type] ?? {});
    result.offset = parseIntWithSuffix(fields[3]);
    result.size = parseIntWithSuffix(fields[4]);
    for (const flag of fields[5].split(':')) {
      if (flag === 'encrypted') result.encrypted = true;
      if (flag === 'readonly') result.readonly = true;
    }
    return result;
  }

  static fromBinary(data: Buffer): PartitionDefinition {
    data = Buffer.from(data); // avoid method not found
    const result = new PartitionDefinition();
    const [magic, type, subtype, offset, size, name, flags] = [
      data.slice(0, 2),
      data.readUInt8(2),
      data.readUInt8(3),
      data.readUInt32LE(4),
      data.readUInt32LE(8),
      data.slice(12, 28).toString('utf-8').replace(/\0/g, ''),
      data.readUInt32LE(28)
    ];
    if (!magic.equals(PartitionDefinition.MAGIC_BYTES)) throw new Error('Invalid magic bytes for partition definition');
    result.type = type;
    result.subtype = subtype;
    result.offset = offset;
    result.size = size;
    result.name = name;
    result.encrypted = !!(flags & 1);
    result.readonly = !!(flags & 2);
    return result;
  }

  toCSV(): string {
    return [
      this.name,
      this.type !== null ? Object.keys(TYPES).find(key => TYPES[key] === this.type) : '',
      this.subtype !== null ? Object.keys(SUBTYPES[this.type ?? 0]).find(key => SUBTYPES[this.type ?? 0][key] === this.subtype) : '',
      `0x${this.offset?.toString(16) ?? '0'}`,
      `0x${this.size?.toString(16) ?? '0'}`,
      this.encrypted ? 'encrypted' : '',
      this.readonly ? 'readonly' : ''
    ].join(',');
  }

  toBinary(): Buffer {
    const flags = (this.encrypted ? 1 : 0) | (this.readonly ? 2 : 0);
    const offsetBytes = Buffer.alloc(4);
    offsetBytes.writeUInt32LE(this.offset ?? 0, 0);
    const sizeBytes = Buffer.alloc(4);
    sizeBytes.writeUInt32LE(this.size ?? 0, 0);
    const flagBytes = Buffer.alloc(4);
    flagBytes.writeUInt32LE(flags, 0);
    return Buffer.concat([
      Buffer.from([this.type ?? 0, this.subtype ?? 0]),
      offsetBytes, // {writeUInt32LE(this.offset ?? 0, 0),
      sizeBytes,
      Buffer.alloc(16, this.name, 'utf-8'),
      flagBytes
    ]);
  }
}

// async function main() {
//   // Ensure yargs argv is properly typed
// const argv = yargs(hideBin(process.argv)).options({
//   'flash-size': { choices: ['1MB', '2MB', '4MB', '8MB', '16MB', '32MB', '64MB', '128MB'], describe: 'Optional flash size limit, checks partition table fits in flash' },
//   'disable-md5sum': { type: 'boolean', describe: 'Disable md5 checksum for the partition table' },
//   'no-verify': { type: 'boolean', describe: "Don't verify partition table fields", default: false },
//   'offset': { type: 'string', default: '0x8000', describe: 'Set offset partition table' },
//   'input': { type: 'string', demandOption: true, describe: 'Path to CSV or binary file to parse.' },
//   'output': { type: 'string', default: '-', describe: 'Path to output converted binary or CSV file. Will use stdout if omitted.' }
// }).argv as {
//   'flashSize'?: string;
//   'disableMd5sum'?: boolean;
//   'noVerify'?: boolean;
//   'offset': string;
//   'input': string;
//   'output': string;
// };

//   const [partitions, inputIsBinary] = await Partitions.fromFile(argv.input);

//   if (!argv.noVerify) {
//     console.log('Verifying table...');
//     // partitions.verify(); // Implement verification logic similar to Python code
//   }

//   const output = inputIsBinary ? partitions.toCSV() : partitions.toBinary();
//   const outputPath = argv.output === '-' ? '/dev/stdout' : argv.output;
//   await fs.promises.writeFile(outputPath, output);
// }

// main().catch(error => {
//   console.error(error);
//   process.exit(2);
// });

// export class DummyImporter {
//   started = false;
//   constructor(){//self:DummyImporter) {
//     console.log("ESP32 Partition Reader loading...");
//     // this.started = true;
//   }

//   static start(self:DummyImporter, inputBinary: ArrayBuffer){
//     self.started = false;
//   }
// }
