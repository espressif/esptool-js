import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";
import { FLASH_BLOCK_SIZE } from "./writeFlash.js";

export type LoadRamOptions = {
  address: number;
  data: Uint8Array;
  entrypoint: number;
  blockSize?: number;
  onProgress?: (percent: number, bytesWritten: number, totalBytes: number) => void;
};

/**
 * Load a binary into RAM and jump to entrypoint.
 * Mirrors esptool.cmds.load_ram.
 * @param esp
 * @param options
 */
export async function loadRam(esp: EspDevice, options: LoadRamOptions): Promise<void> {
  const { address, data, entrypoint } = options;
  const blockSize = options.blockSize ?? FLASH_BLOCK_SIZE;
  const size = data.length;

  checkResult(await esp.bindings.memStart(address, size, blockSize), "loadRam start");

  const totalBlocks = Math.ceil(size / blockSize);
  for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
    const offset = blockIndex * blockSize;
    const currentBlockSize = Math.min(blockSize, size - offset);
    const block = data.subarray(offset, offset + currentBlockSize);
    const ptr = esp.module._malloc(currentBlockSize);
    try {
      esp.module.HEAPU8.set(block, ptr);
      checkResult(await esp.bindings.memWrite(ptr, currentBlockSize), `loadRam block ${blockIndex}`);
    } finally {
      esp.module._free(ptr);
    }
    if (options.onProgress && size > 0) {
      const written = Math.min((blockIndex + 1) * blockSize, size);
      options.onProgress((written / size) * 100, written, size);
    }
  }

  checkResult(await esp.bindings.memFinish(entrypoint), "loadRam finish");
}
