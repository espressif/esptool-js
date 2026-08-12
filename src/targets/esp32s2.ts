import type { EspDevice } from "../wasm/bindings.js";
import { ESP32ROM } from "./esp32.js";

export class ESP32S2ROM extends ESP32ROM {
  CHIP_NAME = "ESP32-S2";
  EFUSE_BASE = 0x3f41a000;
  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  EFUSE_BLOCK2_ADDR = this.EFUSE_BASE + 0x05c;
  MAC_EFUSE_REG = 0x3f41a044;
  UART_CLKDIV_REG = 0x3f400014;
  UART_CLKDIV_MASK = 0xfffff;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 4)) >> 0) & 0x0f;
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    const hi = ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 20) & 0x01;
    const low = ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 4)) >> 4) & 0x07;
    return (hi << 3) + low;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 18) & 0x03;
  }

  async getFlashCap(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 21) & 0x0f;
  }

  async getPsramCap(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 28) & 0x0f;
  }

  async getBlock2Version(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK2_ADDR + 4 * 4)) >> 4) & 0x07;
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const chipDesc: Record<number, string> = {
      0: "ESP32-S2",
      1: "ESP32-S2FH2",
      2: "ESP32-S2FH4",
      102: "ESP32-S2FNR2",
      100: "ESP32-S2R2",
    };
    const chipIndex = (await this.getFlashCap(esp)) + (await this.getPsramCap(esp)) * 100;
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    return `${chipDesc[chipIndex] ?? "Unknown ESP32-S2"} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    const features = ["Wi-Fi", "Single Core", "240MHz"];
    const flashVersion =
      ({ 0: "No Embedded Flash", 1: "Embedded Flash 2MB", 2: "Embedded Flash 4MB" } as Record<number, string>)[
        await this.getFlashCap(esp)
      ] ?? "Unknown Embedded Flash";
    features.push(flashVersion);

    const psramVersion =
      ({ 0: "No Embedded PSRAM", 1: "Embedded PSRAM 2MB", 2: "Embedded PSRAM 4MB" } as Record<number, string>)[
        await this.getPsramCap(esp)
      ] ?? "Unknown Embedded PSRAM";
    features.push(psramVersion);

    const block2Version =
      (
        {
          0: "No calibration in BLK2 of efuse",
          1: "ADC and temperature sensor calibration in BLK2 of eFuse V1",
          2: "ADC and temperature sensor calibration in BLK2 of eFuse V2",
        } as Record<number, string>
      )[await this.getBlock2Version(esp)] ?? "Unknown calibration in BLK2";
    features.push(block2Version);
    return features;
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    void esp;
    return 40;
  }

  async readMac(esp: EspDevice): Promise<Uint8Array> {
    const mac0 = (await this.readReg(esp, this.MAC_EFUSE_REG)) >>> 0;
    const mac1 = ((await this.readReg(esp, this.MAC_EFUSE_REG + 4)) >>> 0) & 0xffff;
    return new Uint8Array([
      (mac1 >> 8) & 0xff,
      mac1 & 0xff,
      (mac0 >> 24) & 0xff,
      (mac0 >> 16) & 0xff,
      (mac0 >> 8) & 0xff,
      mac0 & 0xff,
    ]);
  }
}
