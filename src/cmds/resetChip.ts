import type { EspDevice } from "../wasm/bindings.js";

/**
 * Reset the target chip (hard reset via port ops).
 * @param esp
 */
export async function resetChip(esp: EspDevice): Promise<void> {
  await esp.bindings.resetTarget();
}
