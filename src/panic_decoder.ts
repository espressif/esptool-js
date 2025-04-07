import ELFFile, { CompileUnit, DWARFInfo } from "jselftools";
import { AddressLocation } from "./types/decoder";
import { getSHA256 } from "./util";

const ADDRESS_RE = /0x[0-9a-f]{8}/gi;

type SubprogramInfo = [start: number, end: number, fnName: string, dwarfinfo?: DWARFInfo, CU?: CompileUnit];

/**
 * Class to check and decode an address
 */
export class AddressDecoder {
  private static subprograms: SubprogramInfo[][] = [];
  private static sha: string[] = [];
  private static intervals: number[][] = [];

  /**
   * load elf files and filter for faster address decoding
   * @param {ArrayBufferLike[]} elfFileBuffers elf file buffers
   */
  static async update(elfFileBuffers: ArrayBufferLike[]): Promise<void> {
    this.subprograms = [];
    this.sha = [];
    for (const elfFileBuffer of elfFileBuffers) {
      const { subprograms, isRom } = await this.loadElfFile(elfFileBuffer);
      if (!isRom) {
        this.sha.push(await getSHA256(elfFileBuffer));
      }
      const start = subprograms[0][0];
      const end = subprograms[subprograms.length - 1][1];
      this.intervals.push([start, end]);
      this.subprograms.push(subprograms);
    }
  }

  /**
   * load elf file and parse it
   * @param {ArrayBufferLike} elfFileBuffer elf file buffer
   * @returns {Promise<SubprogramInfo[]>} sorted subprograms
   */
  static async loadElfFile(elfFileBuffer: ArrayBufferLike): Promise<{
    subprograms: SubprogramInfo[];
    isRom: boolean;
  }> {
    const elffile = new ELFFile(elfFileBuffer);
    const subprograms: SubprogramInfo[] = [];
    let isRom = false;
    if (elffile.has_dwarf_info()) {
      // most app elf files have dwarf info
      const dwarfinfo = elffile.get_dwarf_info();
      for (const CU of dwarfinfo.get_CUs()) {
        for (const die of CU.dies) {
          if (die.has_children) {
            for (const child of die.children) {
              if (child.tag === "DW_TAG_subprogram") {
                const lowPc = child.attributes["DW_AT_low_pc"];
                const highPc = child.attributes["DW_AT_high_pc"];
                if (lowPc && lowPc.value > 0 && highPc.value > 0) {
                  const fnName = child.attributes["DW_AT_name"]?.value;
                  subprograms.push([lowPc.value, highPc.value + lowPc.value, fnName, dwarfinfo, CU]);
                }
              }
            }
          }
        }
      }
    } else {
      // rom elf files don't have dwarf info
      isRom = true;
      const symtab = elffile.get_symtab();
      if (symtab) {
        for (const symbol of symtab.iter_symbols()) {
          if (symbol.info.type == "STT_FUNC") {
            const start = Number(symbol.value);
            const end = start + Number(symbol.size);
            subprograms.push([start, end, symbol.name]);
          }
        }
      }
    }
    subprograms.sort((a, b) => a[0] - b[0]);
    return { subprograms, isRom };
  }

  /**
   * Given an address, decode it and return the function name and line
   * @param { number } address the address to decode
   * @returns { { fnName: string; line: AddressLocation | undefined } | undefined } the decoded address or undefined if it wasn't decoded
   */
  static getDecodedAddress(address: number): { fnName: string; line: AddressLocation | undefined } | undefined {
    let i = 0;
    for (const [start, end] of this.intervals) {
      if (start <= address && address < end) {
        for (const [start, end, fnName, dwarfinfo, cu] of this.subprograms[i]) {
          if (end < address) {
            continue;
          }
          if (start > address) {
            // already after the function
            break;
          }
          let line = undefined;
          if (cu && dwarfinfo) {
            line = this.checkLineprogram(cu, address, dwarfinfo);
          }
          return {
            fnName: fnName,
            line,
          };
        }
      }
      i++;
    }
    return undefined;
  }

  /**
   * decode the address and call the output function with the decoded address
   * @param {number} address the address to decode
   * @param {(message: string) => void} outputFn the function to call with the decoded address
   * @returns {boolean} true if the address was decoded, false otherwise
   */
  static decode(address: number, outputFn: (message: string) => void): boolean {
    const decodedAddress = this.getDecodedAddress(address);
    if (decodedAddress === undefined) {
      return false;
    }
    const hexAddress = address.toString(16);
    const { fnName, line } = decodedAddress;
    let decodedLine = "0x" + hexAddress + ": " + fnName;
    if (line !== undefined) {
      decodedLine += ` at ${line.directory}/${line.filename}:${line.lineNumber}:${line.column}`;
      if (line.discriminator > 0) {
        decodedLine += ` (discriminator ${line.discriminator})`;
      }
    } else {
      decodedLine += " in ROM";
    }
    outputFn(decodedLine);
    return true;
  }

  static parser(line: string, outputFn: (message: string) => void) {
    const parserOutput = (line: string) => {
      outputFn("\x1b[33m-- " + line + "\x1b[0m");
    };
    const match = line.match(ADDRESS_RE);
    if (match) {
      outputFn(line);
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
        if (this.sha.length !== 0) {
          let foundHash = false;
          for (const sha of this.sha) {
            if (sha.startsWith(hash)) {
              foundHash = true;
            }
          }
          if (!foundHash) {
            parserOutput(
              "Warning: Checksum mismatch between flashed and built applications. Checksum of built application is " +
                this.sha.join(", "),
            );
          }
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

  private static checkLineprogram(cu: CompileUnit, address: number, dwarfinfo: DWARFInfo): AddressLocation | undefined {
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
