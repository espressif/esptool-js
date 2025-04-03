import ELFFile, { CompileUnit, Die, DWARFInfo } from "jselftools";
import { AddressLocation } from "./types/decoder";
import { getSHA256 } from "./util";

const ADDRESS_RE = /0x[0-9a-f]{8}/gi;

interface ParsedElfFile {
  dwarfinfo: DWARFInfo;
  subprograms: Die[];
  intervals: number[][];
  sha: string;
}

interface Interval {
  start: number;
  end: number;
  elfIdx: number;
}

/**
 * Class to check and decode an address
 */
export class AddressDecoder {
  private static elfFiles: ParsedElfFile[] = [];
  private static sha = "";
  private static intervals: Interval[] = [];

  /**
   * load elf files and filter for faster address decoding
   * @param {ArrayBufferLike[]} elfFileBuffers elf file buffers
   * @param appIdx the index in the {@link elfFileBuffers} array to use for the sha
   */
  static async update(elfFileBuffers: ArrayBufferLike[], appIdx = 0): Promise<void> {
    for (const elfFileBuffer of elfFileBuffers) {
      this.elfFiles.push(await this.loadElfFile(elfFileBuffer));
    }
    this.sha = this.elfFiles[appIdx].sha;
    let i = 0;
    for (const elfFile of this.elfFiles) {
      for (const interval of elfFile.intervals) {
        this.intervals.push({
          start: interval[0],
          end: interval[1],
          elfIdx: i,
        });
      }
      i++;
    }
    this.intervals.sort((a, b) => a.start - b.start);
  }

  /**
   * load elf file and parse it
   * @param {ArrayBufferLike} elfFileBuffer elf file buffer
   * @returns {Promise<ParsedElfFile>} parsed elf file
   */
  static async loadElfFile(elfFileBuffer: ArrayBufferLike): Promise<ParsedElfFile> {
    const sha = await getSHA256(elfFileBuffer);
    const elffile = new ELFFile(elfFileBuffer);
    const dwarfinfo = elffile.get_dwarf_info();
    const subprograms: Die[] = [];

    for (const CU of dwarfinfo.get_CUs()) {
      for (const die of CU.dies) {
        if (die.has_children) {
          for (const child of die.children) {
            if (child.tag === "DW_TAG_subprogram") {
              const highPc = child.attributes["DW_AT_high_pc"];
              const lowPc = child.attributes["DW_AT_low_pc"];
              if (lowPc && lowPc.value > 0 && highPc.value > 0) {
                subprograms.push(child);
              }
            }
          }
        }
      }
    }

    const intervals: number[][] = [];
    for (const section of elffile.body.sections) {
      if (section.flags["execinstr"]) {
        const addr = section.addr;
        intervals.push([Number(addr), Number(addr) + Number(section.size)]);
      }
    }
    intervals.sort((a, b) => a[0] - b[0]);
    return {
      intervals,
      sha,
      dwarfinfo,
      subprograms,
    };
  }

  /**
   * get the index of the elf file that contains the address
   * @param address resolves an address to an elf file index
   * @returns the elf index of the elf file that contains the address or -1 if no elf file contains the address
   */
  static getElfIdx(address: number): number | undefined {
    for (const { start, end, elfIdx } of this.intervals) {
      if (start > address) {
        break;
      } else if (start <= address && address < end) {
        return elfIdx;
      }
    }
    return undefined;
  }

  static getDecodedAddress(address: number): { fnName: string; line: AddressLocation | undefined } | undefined {
    const addressElfIdx = this.getElfIdx(address);
    if (addressElfIdx === undefined) {
      return undefined;
    }

    const subprograms = this.elfFiles[addressElfIdx].subprograms;
    for (const subprogram of subprograms) {
      const lowPc = subprogram.attributes["DW_AT_low_pc"].value;
      const highPc = subprogram.attributes["DW_AT_high_pc"].value + lowPc;
      if (address >= lowPc && address < highPc) {
        const line = this.checkLineprogram(subprogram.cu, address, addressElfIdx);
        return {
          fnName: subprogram.attributes["DW_AT_name"].value,
          line,
        };
      }
    }
    return undefined;
  }

  /**
   * decode the address and call the output function with the decoded address
   * @param address the address to decode
   * @param outputFn the function to call with the decoded address
   * @returns true if the address was decoded, false otherwise
   */
  static decode(address: number, outputFn: (message: string) => void): boolean {
    const decodedAddress = this.getDecodedAddress(address);
    if (decodedAddress === undefined || decodedAddress.line === undefined) {
      return false;
    }
    const hexAddress = address.toString(16);
    const { fnName, line } = decodedAddress;
    const { directory, filename, lineNumber, column, discriminator } = line;
    if (discriminator > 0) {
      // eslint-disable-next-line prettier/prettier
      outputFn("0x" + hexAddress + ": " + fnName + " at " + directory + "/" + filename + ":" + lineNumber + ":" + column + " (discriminator " + discriminator + ")");
    } else {
      // eslint-disable-next-line prettier/prettier
      outputFn("0x" + hexAddress + ": " + fnName + " at " + directory + "/" + filename + ":" + lineNumber + ":" + column);
    }
    return true;
  }

  static parser(line: string, outputFn: (message: string) => void) {
    const parserOutput = (line: string) => {
      outputFn("\x1b[33m-- " + line + "\x1b[0m");
    };
    if (ADDRESS_RE.test(line)) {
      outputFn(line);
      const match = line.match(ADDRESS_RE) ?? [];
      const addrMap = match.map((hex) => parseInt(hex, 16));
      let decoded = false;
      for (const addr of addrMap) {
        if (this.decode(addr, parserOutput)) {
          decoded = true;
        }
      }
      if (decoded) {
        outputFn("");
      }
      return;
    } else if (line.includes("ELF file SHA256:")) {
      const hash = this.extractHash(line);
      if (hash && this.sha) {
        outputFn(line);
        if (!this.sha.startsWith(hash)) {
          parserOutput(
            "Warning: Checksum mismatch between flashed and built applications. Checksum of built application is " +
              this.sha,
          );
        }
        return;
      }
    }
    outputFn(line);
  }

  static extractHash(line: string): string {
    const pattern = /(?:I \(\d+\) cpu_start: )?ELF file SHA256:\s+(\w+)/;
    const match = line.match(pattern);
    return match ? match[1] : "";
  }

  private static checkLineprogram(
    cu: CompileUnit,
    address: number,
    elfIdx: number | undefined,
  ): AddressLocation | undefined {
    if (elfIdx === undefined) {
      elfIdx = this.getElfIdx(address);
      if (elfIdx === undefined) {
        return undefined;
      }
    }
    const dwarfinfo = this.elfFiles[elfIdx].dwarfinfo;

    const lineprog = dwarfinfo.line_program_for_CU(cu);
    if (!lineprog) {
      return undefined;
    }
    const delta = lineprog.header.version < 5 ? 1 : 0;
    let prevstate = null;
    for (const entry of lineprog.get_entries()) {
      if (entry.state === null) {
        continue;
      }
      if (prevstate && prevstate.address <= address && address < entry.state.address) {
        const filename = lineprog.header.file_entry[prevstate.file - delta];
        const directory = lineprog.header.include_directory[filename.dir_index - delta];
        return {
          directory,
          filename: filename.name,
          lineNumber: prevstate.line,
          column: prevstate.column,
          discriminator: prevstate.discriminator,
        };
      }
      if (entry.state.end_sequence) {
        prevstate = null;
      } else {
        prevstate = entry.state;
      }
    }
    return undefined;
  }
}
