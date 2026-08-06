import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";

/**
 * Erase the entire flash chip.
 * @param esp
 */
export async function eraseFlash(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.flashErase(), "eraseFlash");
}

/**
 * Erase a flash region (offset and size must be 4096-byte aligned).
 * @param esp
 * @param offset
 * @param size
 */
export async function eraseRegion(esp: EspDevice, offset: number, size: number): Promise<void> {
  checkResult(await esp.bindings.flashEraseRegion(offset, size), "eraseRegion");
}
