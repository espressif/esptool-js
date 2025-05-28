import { ROM } from "../targets/rom";
import { ESPError } from "../types/error";
import { bstrToUi8 } from "../util";
import { BaseFirmwareImage, ESP_IMAGE_MAGIC } from "./base";
import { ESP32FirmwareImage } from "./esp32";
import { ESP8266ROMFirmwareImage, ESP8266V2FirmwareImage } from "./esp8266";
import {
  ESP32C2FirmwareImage,
  ESP32C3FirmwareImage,
  ESP32C5FirmwareImage,
  ESP32C61FirmwareImage,
  ESP32C6FirmwareImage,
  ESP32H2FirmwareImage,
  ESP32P4FirmwareImage,
  ESP32S2FirmwareImage,
  ESP32S3FirmwareImage,
} from "./others";

/**
 * Function to load a firmware image from a string (from FileReader)
 * @param {ROM} rom - The ROM object representing the target device
 * @param imageData Image data as a string
 * @returns {Promise<BaseFirmwareImage>} - A promise that resolves to the loaded firmware image
 */
export async function loadFirmwareImage(rom: ROM, imageData: string): Promise<BaseFirmwareImage> {
  // Convert the string data to a Uint8Array
  const binaryData = bstrToUi8(imageData);

  // Select the appropriate image class based on the chip
  const chipName = rom.CHIP_NAME.toLowerCase().replace(/[-()]/g, "");

  let firmwareImageClass: typeof BaseFirmwareImage;

  if (chipName !== "esp8266") {
    switch (chipName) {
      case "esp32":
        firmwareImageClass = ESP32FirmwareImage;
        break;
      case "esp32s2":
        firmwareImageClass = ESP32S2FirmwareImage;
        break;
      case "esp32s3":
        firmwareImageClass = ESP32S3FirmwareImage;
        break;
      case "esp32c3":
        firmwareImageClass = ESP32C3FirmwareImage;
        break;
      case "esp32c2":
        firmwareImageClass = ESP32C2FirmwareImage;
        break;
      case "esp32c6":
        firmwareImageClass = ESP32C6FirmwareImage;
        break;
      case "esp32c61":
        firmwareImageClass = ESP32C61FirmwareImage;
        break;
      case "esp32c5":
        firmwareImageClass = ESP32C5FirmwareImage;
        break;
      case "esp32h2":
        firmwareImageClass = ESP32H2FirmwareImage;
        break;
      case "esp32p4":
        firmwareImageClass = ESP32P4FirmwareImage;
        break;
      default:
        throw new ESPError(`Unsupported chip name: ${chipName}`);
    }
  } else {
    const magic = binaryData[0];
    if (magic === ESP_IMAGE_MAGIC) {
      firmwareImageClass = ESP8266ROMFirmwareImage;
    } else if (magic === ESP8266V2FirmwareImage.IMAGE_V2_MAGIC) {
      firmwareImageClass = ESP8266V2FirmwareImage;
    } else {
      throw new ESPError(`Invalid image magic number: ${magic}`);
    }
  }

  // Create an instance of the selected image class
  const image = new firmwareImageClass(rom);

  return image;
}
