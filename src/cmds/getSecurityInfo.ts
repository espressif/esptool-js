import type { EspDevice, SecurityInfo } from "../wasm/bindings.js";
import { SECURITY_INFO_SIZE, checkResult, decodeSecurityInfo } from "../wasm/bindings.js";

/**
 * Read target security info (secure boot, flash encryption, etc.).
 * @param esp
 */
export async function getSecurityInfo(esp: EspDevice): Promise<SecurityInfo> {
  const ptr = esp.module._malloc(SECURITY_INFO_SIZE);
  try {
    checkResult(await esp.bindings.getSecurityInfo(ptr), "getSecurityInfo");
    return decodeSecurityInfo(esp.module.HEAPU8.slice(ptr, ptr + SECURITY_INFO_SIZE));
  } finally {
    esp.module._free(ptr);
  }
}
