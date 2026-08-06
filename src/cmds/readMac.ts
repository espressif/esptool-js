import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";

/**
 * Read the chip MAC address (6 bytes).
 * @param esp
 */
export async function readMac(esp: EspDevice): Promise<Uint8Array> {
  const ptr = esp.module._malloc(6);
  try {
    checkResult(await esp.bindings.readMac(ptr), "readMac");
    return esp.module.HEAPU8.slice(ptr, ptr + 6);
  } finally {
    esp.module._free(ptr);
  }
}
