import atob from "atob-lite";

export interface Stub {
  bss_start?: number;
  data: string;
  decodedData: Uint8Array;
  data_start: number;
  entry: number;
  text: string;
  decodedText: Uint8Array;
  text_start: number;
}

/**
 * Import flash stub json for the given chip name.
 * @param {string} chipName Name of chip to obtain flasher stub
 * @returns {Promise<Stub | undefined>} Stub information and decoded text and data
 */
export async function getStubJsonByChipName(chipName: string): Promise<Stub | undefined> {
  let jsonStub;
  switch (chipName) {
    case "ESP32":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32.json");
      break;
    case "ESP32-C2":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32c2.json");
      break;
    case "ESP32-C3":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32c3.json");
      break;
    case "ESP32-C5":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32c5.json");
      break;
    case "ESP32-C6":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32c6.json");
      break;
    case "ESP32-C61":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32c61.json");
      break;
    case "ESP32-H2":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32h2.json");
      break;
    case "ESP32-P4":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32p4.json");
      break;
    case "ESP32-S2":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32s2.json");
      break;
    case "ESP32-S3":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_32s3.json");
      break;
    case "ESP8266":
      jsonStub = await import("./targets/stub_flasher/stub_flasher_8266.json");
      break;
    default:
      return undefined;
  }

  if (jsonStub) {
    return {
      bss_start: jsonStub.bss_start,
      data: jsonStub.data,
      data_start: jsonStub.data_start,
      entry: jsonStub.entry,
      text: jsonStub.text,
      text_start: jsonStub.text_start,
      decodedData: decodeBase64Data(jsonStub.data),
      decodedText: decodeBase64Data(jsonStub.text),
    } as Stub;
  }
  return undefined;
}

/**
 * Convert a base 64 string to Uint8Array.
 * @param {string} dataStr Base64 String to decode
 * @returns {Uint8Array} Decoded Uint8Array
 */
export function decodeBase64Data(dataStr: string): Uint8Array {
  const decoded = atob(dataStr);
  const chardata = decoded.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  return new Uint8Array(chardata);
}
