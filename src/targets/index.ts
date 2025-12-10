import { ESP32ROM } from "./esp32";
import { ESP32C2ROM } from "./esp32c2";
import { ESP32C3ROM } from "./esp32c3";
import { ESP32C5ROM } from "./esp32c5";
import { ESP32C6ROM } from "./esp32c6";
import { ESP32C61ROM } from "./esp32c61";
import { ESP32H2ROM } from "./esp32h2";
import { ESP32P4ROM } from "./esp32p4";
import { ESP32S2ROM } from "./esp32s2";
import { ESP32S3ROM } from "./esp32s3";
import { ESP8266ROM } from "./esp8266";

export const CHIP_DEFS = {
  esp8266: new ESP8266ROM(),
  esp32: new ESP32ROM(),
  esp32s2: new ESP32S2ROM(),
  esp32s3: new ESP32S3ROM(),
  esp32c3: new ESP32C3ROM(),
  esp32c2: new ESP32C2ROM(),
  esp32c6: new ESP32C6ROM(),
  esp32c61: new ESP32C61ROM(),
  esp32c5: new ESP32C5ROM(),
  esp32h2: new ESP32H2ROM(),
  esp32p4: new ESP32P4ROM(),
};

export const CHIP_LIST = Object.keys(CHIP_DEFS) as Array<keyof typeof CHIP_DEFS>;
export const ROM_LIST = Object.values(CHIP_DEFS);
