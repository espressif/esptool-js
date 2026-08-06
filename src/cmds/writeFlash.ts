import { deflate } from "pako";
import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";

/** Default block size for stub-mode flash writes (16 KiB). */
export const FLASH_BLOCK_SIZE = 0x4000;

export type FlashImage = {
  address: number;
  data: Uint8Array;
};

export type WriteFlashOptions = {
  blockSize?: number;
  /** Compress with deflate and use the stub compressed flash path. */
  compress?: boolean;
  /** Skip MD5 verify on finish (uncompressed path only). */
  skipVerify?: boolean;
  onProgress?: (percent: number, bytesWritten: number, totalBytes: number) => void;
};

/**
 * Write one or more binary images to flash.
 * Mirrors esptool.cmds.write_flash (uncompressed or compressed).
 * @param esp
 * @param addrData
 * @param options
 */
export async function writeFlash(
  esp: EspDevice,
  addrData: FlashImage[],
  options: WriteFlashOptions = {},
): Promise<void> {
  const blockSize = options.blockSize ?? FLASH_BLOCK_SIZE;
  const compress = options.compress ?? false;
  const skipVerify = options.skipVerify ?? false;
  const totalBytes = addrData.reduce((sum, img) => sum + img.data.length, 0);
  let bytesWrittenTotal = 0;

  for (const image of addrData) {
    const { address, data } = image;
    const fileSize = data.length;
    const baseWritten = bytesWrittenTotal;

    if (compress) {
      const compressed = deflate(data);
      checkResult(
        await esp.bindings.flashDeflateStart(address, fileSize, compressed.length, blockSize),
        `writeFlash deflate start @ 0x${address.toString(16)}`,
      );

      const totalBlocks = Math.ceil(compressed.length / blockSize) || 1;
      for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        const offset = blockIndex * blockSize;
        const currentBlockSize = Math.min(blockSize, compressed.length - offset);
        const block = compressed.subarray(offset, offset + currentBlockSize);
        const ptr = esp.module._malloc(currentBlockSize);
        try {
          esp.module.HEAPU8.set(block, ptr);
          checkResult(
            await esp.bindings.flashDeflateWrite(ptr, currentBlockSize),
            `writeFlash deflate block ${blockIndex}`,
          );
        } finally {
          esp.module._free(ptr);
        }

        const imageDone = Math.floor(((blockIndex + 1) / totalBlocks) * fileSize);
        bytesWrittenTotal = baseWritten + imageDone;
        if (options.onProgress && totalBytes > 0) {
          options.onProgress((bytesWrittenTotal / totalBytes) * 100, bytesWrittenTotal, totalBytes);
        }
      }

      checkResult(await esp.bindings.flashDeflateFinish(), `writeFlash deflate finish @ 0x${address.toString(16)}`);
      bytesWrittenTotal = baseWritten + fileSize;
    } else {
      checkResult(
        await esp.bindings.flashStart(address, fileSize, blockSize, skipVerify ? 1 : 0),
        `writeFlash start @ 0x${address.toString(16)}`,
      );

      const totalBlocks = Math.ceil(fileSize / blockSize);
      for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
        const offset = blockIndex * blockSize;
        const currentBlockSize = Math.min(blockSize, fileSize - offset);
        const block = data.subarray(offset, offset + currentBlockSize);

        const ptr = esp.module._malloc(currentBlockSize);
        try {
          esp.module.HEAPU8.set(block, ptr);
          checkResult(await esp.bindings.flashWrite(ptr, currentBlockSize), `writeFlash block ${blockIndex}`);
        } finally {
          esp.module._free(ptr);
        }

        bytesWrittenTotal += currentBlockSize;
        if (options.onProgress && totalBytes > 0) {
          options.onProgress((bytesWrittenTotal / totalBytes) * 100, bytesWrittenTotal, totalBytes);
        }
      }

      checkResult(await esp.bindings.flashFinish(), `writeFlash finish @ 0x${address.toString(16)}`);
    }
  }
}
