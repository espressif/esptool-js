import type { EspDevice, TargetChip } from "../wasm/bindings.js";

/**
 * Return the connected chip type.
 * @param esp
 */
export async function getTarget(esp: EspDevice): Promise<TargetChip> {
  return (await esp.bindings.getTarget()) as TargetChip;
}
