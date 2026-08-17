import type { EspDevice } from "../wasm/bindings.js";
import { EspLoaderError, FlasherError, checkResult } from "../wasm/bindings.js";

/**
 * Verify flash contents against a known 16-byte MD5 digest.
 * Mirrors esptool.cmds.verify_flash for a single region.
 * @param esp
 * @param address
 * @param size
 * @param md5
 */
export async function verifyFlash(esp: EspDevice, address: number, size: number, md5: Uint8Array): Promise<void> {
  if (md5.length !== 16) {
    throw new FlasherError(EspLoaderError.InvalidParam, "MD5 must be 16 raw bytes");
  }
  const ptr = esp.module._malloc(16);
  try {
    esp.module.HEAPU8.set(md5, ptr);
    checkResult(await esp.bindings.flashVerifyKnownMd5(address, size, ptr), "verifyFlash");
  } finally {
    esp.module._free(ptr);
  }
}
