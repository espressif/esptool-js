import { ESPError } from "../types/error.js";

/** Flash sector size used by esptool when checking Intel HEX regions for overlap. */
const FLASH_SECTOR_SIZE = 0x1000;

/**
 * One contiguous region from an Intel HEX file.
 * Addresses are absolute flash offsets taken from the HEX records.
 * @interface IntelHexSegment
 */
export interface IntelHexSegment {
  /**
   * Absolute flash offset of the first byte.
   * @type {number}
   */
  address: number;

  /**
   * Bytes that were present in the HEX file for this region.
   * Gaps between regions are omitted.
   * @type {Uint8Array}
   */
  data: Uint8Array;
}

interface HexRecord {
  type: number;
  offset: number;
  data: Uint8Array;
}

interface PendingSegment {
  address: number;
  parts: Uint8Array[];
  length: number;
}

/**
 * Parse one Intel HEX line.
 * @param {string} line Trimmed record, including the leading colon.
 * @param {number} lineNumber 1-based line number for error messages.
 * @returns {HexRecord} Decoded record. The checksum is verified.
 */
function parseRecord(line: string, lineNumber: number): HexRecord {
  if (!line.startsWith(":")) {
    throw new ESPError(`Intel HEX line ${lineNumber} does not start with ':'`);
  }
  const raw = line.slice(1);
  if (raw.length < 10 || raw.length % 2 !== 0 || !/^[0-9A-Fa-f]+$/.test(raw)) {
    throw new ESPError(`Intel HEX line ${lineNumber} is not a valid record`);
  }

  const bytes = new Uint8Array(raw.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(raw.slice(i * 2, i * 2 + 2), 16);
  }

  const length = bytes[0];
  if (bytes.length !== length + 5) {
    throw new ESPError(`Intel HEX line ${lineNumber} length does not match the record`);
  }

  let sum = 0;
  for (let i = 0; i < bytes.length; i++) {
    sum = (sum + bytes[i]) & 0xff;
  }
  if (sum !== 0) {
    throw new ESPError(`Intel HEX checksum mismatch at line ${lineNumber}`);
  }

  return {
    type: bytes[3],
    offset: (bytes[1] << 8) | bytes[2],
    data: bytes.slice(4, 4 + length),
  };
}

/**
 * Group populated addresses into contiguous regions, matching esptool's gap split.
 * @param {Map<number, number>} bytes Address to byte value. Keys are unique.
 * @returns {IntelHexSegment[]} Regions in ascending address order.
 */
function segmentsFromMap(bytes: Map<number, number>): IntelHexSegment[] {
  if (bytes.size === 0) {
    return [];
  }

  const addresses = Array.from(bytes.keys()).sort((a, b) => a - b);
  const segments: IntelHexSegment[] = [];
  let rangeStart = addresses[0];
  let previous = addresses[0];

  const pushRange = (start: number, endInclusive: number) => {
    const data = new Uint8Array(endInclusive - start + 1);
    for (let i = 0; i < data.length; i++) {
      const value = bytes.get(start + i);
      if (value === undefined) {
        throw new ESPError(`Intel HEX internal error: missing byte at 0x${(start + i).toString(16)}`);
      }
      data[i] = value;
    }
    segments.push({ address: start, data });
  };

  for (let i = 1; i < addresses.length; i++) {
    const address = addresses[i];
    if (address !== previous + 1) {
      pushRange(rangeStart, previous);
      rangeStart = address;
    }
    previous = address;
  }
  pushRange(rangeStart, previous);
  return segments;
}

/**
 * Copy fast-path segments into a single buffer each.
 * @param {PendingSegment[]} segments Segments built by appending contiguous records.
 * @returns {IntelHexSegment[]} Concrete regions.
 */
function finalizeSegments(segments: PendingSegment[]): IntelHexSegment[] {
  return segments.map((segment) => {
    const data = new Uint8Array(segment.length);
    let offset = 0;
    for (const part of segment.parts) {
      data.set(part, offset);
      offset += part.length;
    }
    return { address: segment.address, data };
  });
}

/**
 * Reject regions whose 4 KiB erase sectors overlap, matching esptool's address/file check.
 * A hole inside one sector cannot be preserved: the stub erases that whole sector.
 * @param {IntelHexSegment[]} segments Regions in ascending address order.
 * @returns {void}
 */
function assertNoSectorOverlap(segments: IntelHexSegment[]): void {
  let occupiedUntil = 0;
  for (const segment of segments) {
    const sectorStart = segment.address & ~(FLASH_SECTOR_SIZE - 1);
    const sectorEnd = ((segment.address + segment.data.length + FLASH_SECTOR_SIZE - 1) & ~(FLASH_SECTOR_SIZE - 1)) - 1;
    if (sectorStart < occupiedUntil) {
      throw new ESPError(
        `Detected overlap at address: 0x${segment.address.toString(16)} ` +
          `(regions share a ${FLASH_SECTOR_SIZE} byte flash sector)`,
      );
    }
    occupiedUntil = sectorEnd;
  }
}

/**
 * Parse an Intel HEX file into contiguous flash regions.
 *
 * Gaps in the address map become separate regions, so a later `writeFlash` of
 * those regions leaves partitions that have no records (for example NVS and
 * factory data) unerased. Addresses come from the HEX file: extended linear
 * address (type 04) and extended segment address (type 02) set the upper bits.
 * Do not add a caller-supplied base offset on top of the returned addresses.
 *
 * The HEX must be sparse. A file converted from a padded merged binary still
 * contains the gap bytes and will erase those partitions.
 * @param {string | Uint8Array} input Intel HEX text, or the same text as bytes.
 * @returns {IntelHexSegment[]} Contiguous regions in ascending address order.
 */
export function parseIntelHex(input: string | Uint8Array): IntelHexSegment[] {
  const text = typeof input === "string" ? input : new TextDecoder().decode(input);
  const lines = text.split(/\r\n|\n|\r/);

  const segments: PendingSegment[] = [];
  let randomBytes: Map<number, number> | null = null;
  let base = 0;
  let sawEof = false;

  const spillToMap = (): Map<number, number> => {
    if (randomBytes) {
      return randomBytes;
    }
    const map = new Map<number, number>();
    for (const segment of segments) {
      let address = segment.address;
      for (const part of segment.parts) {
        for (let i = 0; i < part.length; i++) {
          map.set(address + i, part[i]);
        }
        address += part.length;
      }
    }
    segments.length = 0;
    randomBytes = map;
    return map;
  };

  const writeData = (address: number, data: Uint8Array) => {
    if (data.length === 0) {
      return;
    }
    if (randomBytes) {
      for (let i = 0; i < data.length; i++) {
        randomBytes.set(address + i, data[i]);
      }
      return;
    }

    const last = segments[segments.length - 1];
    if (!last) {
      segments.push({ address, parts: [data], length: data.length });
      return;
    }
    const lastEnd = last.address + last.length;
    if (address === lastEnd) {
      last.parts.push(data);
      last.length += data.length;
      return;
    }
    if (address > lastEnd) {
      segments.push({ address, parts: [data], length: data.length });
      return;
    }

    const map = spillToMap();
    for (let i = 0; i < data.length; i++) {
      map.set(address + i, data[i]);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) {
      continue;
    }
    if (sawEof) {
      throw new ESPError(`Intel HEX data after end-of-file record at line ${i + 1}`);
    }

    const record = parseRecord(line, i + 1);
    switch (record.type) {
      case 0x00:
        writeData(base + record.offset, record.data);
        break;
      case 0x01:
        sawEof = true;
        break;
      case 0x02: {
        if (record.data.length !== 2) {
          throw new ESPError(`Intel HEX extended segment address at line ${i + 1} must be 2 bytes`);
        }
        const segment = (record.data[0] << 8) | record.data[1];
        base = segment << 4;
        break;
      }
      case 0x03:
      case 0x05:
        break;
      case 0x04: {
        if (record.data.length !== 2) {
          throw new ESPError(`Intel HEX extended linear address at line ${i + 1} must be 2 bytes`);
        }
        const upper = (record.data[0] << 8) | record.data[1];
        base = upper << 16;
        break;
      }
      default:
        throw new ESPError(`Intel HEX unsupported record type 0x${record.type.toString(16)} at line ${i + 1}`);
    }
  }

  const built = randomBytes ? segmentsFromMap(randomBytes) : finalizeSegments(segments);
  assertNoSectorOverlap(built);
  return built;
}
