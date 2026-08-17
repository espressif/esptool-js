import { TargetChip } from "../wasm/bindings.js";
import type { ROM } from "./rom.js";
import { ESP8266ROM } from "./esp8266.js";
import { ESP32ROM } from "./esp32.js";
import { ESP32S2ROM } from "./esp32s2.js";
import { ESP32C3ROM } from "./esp32c3.js";
import { ESP32S3ROM } from "./esp32s3.js";
import { ESP32C2ROM } from "./esp32c2.js";
import { ESP32C5ROM } from "./esp32c5.js";
import { ESP32H2ROM } from "./esp32h2.js";
import { ESP32C6ROM } from "./esp32c6.js";
import { ESP32P4ROM } from "./esp32p4.js";
import { ESP32C61ROM } from "./esp32c61.js";

const ROM_BY_CHIP: Partial<Record<TargetChip, () => ROM>> = {
  [TargetChip.Esp8266]: () => new ESP8266ROM(),
  [TargetChip.Esp32]: () => new ESP32ROM(),
  [TargetChip.Esp32S2]: () => new ESP32S2ROM(),
  [TargetChip.Esp32C3]: () => new ESP32C3ROM(),
  [TargetChip.Esp32S3]: () => new ESP32S3ROM(),
  [TargetChip.Esp32C2]: () => new ESP32C2ROM(),
  [TargetChip.Esp32C5]: () => new ESP32C5ROM(),
  [TargetChip.Esp32H2]: () => new ESP32H2ROM(),
  [TargetChip.Esp32C6]: () => new ESP32C6ROM(),
  [TargetChip.Esp32P4]: () => new ESP32P4ROM(),
  [TargetChip.Esp32C61]: () => new ESP32C61ROM(),
};

/**
 * Return the chip-info ROM helper for a detected TargetChip.
 * @param chip
 */
export function getRom(chip: TargetChip): ROM {
  const factory = ROM_BY_CHIP[chip];
  if (!factory) {
    throw new Error(`No chip-info ROM for TargetChip ${chip}`);
  }
  return factory();
}

export { ROM } from "./rom.js";
export { ESP8266ROM } from "./esp8266.js";
export { ESP32ROM } from "./esp32.js";
export { ESP32S2ROM } from "./esp32s2.js";
export { ESP32C3ROM } from "./esp32c3.js";
export { ESP32S3ROM } from "./esp32s3.js";
export { ESP32C2ROM } from "./esp32c2.js";
export { ESP32C5ROM } from "./esp32c5.js";
export { ESP32H2ROM } from "./esp32h2.js";
export { ESP32C6ROM } from "./esp32c6.js";
export { ESP32P4ROM } from "./esp32p4.js";
export { ESP32C61ROM } from "./esp32c61.js";
