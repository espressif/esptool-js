import type { EspDevice } from "../wasm/bindings.js";
import { checkResult } from "../wasm/bindings.js";

/**
 * Read a 32-bit register.
 * @param esp
 * @param address
 */
export async function readRegister(esp: EspDevice, address: number): Promise<number> {
  const ptr = esp.module._malloc(4);
  try {
    checkResult(await esp.bindings.readRegister(address, ptr), "readRegister");
    return esp.module.getValue(ptr, "i32") >>> 0;
  } finally {
    esp.module._free(ptr);
  }
}

/**
 * Write a 32-bit register.
 * @param esp
 * @param address
 * @param value
 */
export async function writeRegister(esp: EspDevice, address: number, value: number): Promise<void> {
  checkResult(await esp.bindings.writeRegister(address, value), "writeRegister");
}
