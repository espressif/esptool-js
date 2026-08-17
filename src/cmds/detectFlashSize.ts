import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";

/**
 * Detect attached SPI flash size in bytes.
 * Device must already be connected (connectEsp).
 * @param esp
 */
export async function detectFlashSize(esp: EspDevice): Promise<number> {
  const ptr = esp.module._malloc(4);
  try {
    checkResult(await esp.bindings.flashDetectSize(ptr), "detectFlashSize");
    return esp.module.getValue(ptr, "i32") >>> 0;
  } finally {
    esp.module._free(ptr);
  }
}
