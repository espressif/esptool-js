import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";
import { FLASH_BLOCK_SIZE } from "./writeFlash.js";

export type ReadFlashOptions = {
  chunkSize?: number;
  onProgress?: (percent: number, bytesRead: number, totalBytes: number) => void;
};

/**
 * Read flash memory into a Uint8Array.
 * Reads in chunks so progress can be reported for large regions.
 * @param esp
 * @param address
 * @param length
 * @param options
 */
export async function readFlash(
  esp: EspDevice,
  address: number,
  length: number,
  options: ReadFlashOptions = {},
): Promise<Uint8Array> {
  const chunkSize = options.chunkSize ?? FLASH_BLOCK_SIZE;
  const out = new Uint8Array(length);
  let offset = 0;

  while (offset < length) {
    const n = Math.min(chunkSize, length - offset);
    const ptr = esp.module._malloc(n);
    try {
      checkResult(
        await esp.bindings.flashRead(ptr, address + offset, n),
        `readFlash @ 0x${(address + offset).toString(16)}`,
      );
      out.set(esp.module.HEAPU8.subarray(ptr, ptr + n), offset);
    } finally {
      esp.module._free(ptr);
    }
    offset += n;
    if (options.onProgress && length > 0) {
      options.onProgress((offset / length) * 100, offset, length);
    }
  }

  return out;
}
