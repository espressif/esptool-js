import type { EspDevice } from "../wasm/bindings.js";
import { ESP32ROM } from "./esp32.js";

export class ESP32S3ROM extends ESP32ROM {
  CHIP_NAME = "ESP32-S3";
  EFUSE_BASE = 0x60007000;
  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  EFUSE_BLOCK2_ADDR = this.EFUSE_BASE + 0x05c;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 21) & 0x07;
  }

  async getRawMinorChipVersion(esp: EspDevice): Promise<number> {
    const hi = ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 5)) >> 23) & 0x01;
    const low = ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 18) & 0x07;
    return (hi << 3) + low;
  }

  async getBlkVersionMajor(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK2_ADDR + 4 * 4)) >> 0) & 0x03;
  }

  async getBlkVersionMinor(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 24) & 0x07;
  }

  async isEco0(esp: EspDevice, minorRaw: number): Promise<boolean> {
    return (
      (minorRaw & 0x7) === 0 && (await this.getBlkVersionMajor(esp)) === 1 && (await this.getBlkVersionMinor(esp)) === 1
    );
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    const minorRaw = await this.getRawMinorChipVersion(esp);
    if (await this.isEco0(esp, minorRaw)) {
      return 0;
    }
    return minorRaw;
  }

  async getRawMajorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 5)) >> 24) & 0x03;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    const minorRaw = await this.getRawMinorChipVersion(esp);
    if (await this.isEco0(esp, minorRaw)) {
      return 0;
    }
    return this.getRawMajorChipVersion(esp);
  }

  async getFlashCap(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 27) & 0x07;
  }

  async getFlashVendor(esp: EspDevice): Promise<string> {
    const vendorId = ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 4)) >> 0) & 0x07;
    return ({ 1: "XMC", 2: "GD", 3: "FM", 4: "TT", 5: "BY" } as Record<number, string>)[vendorId] ?? "";
  }

  async getPsramCap(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 4)) >> 3) & 0x03;
  }

  async getPsramVendor(esp: EspDevice): Promise<string> {
    const vendorId = ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 4)) >> 7) & 0x0f;
    return ({ 1: "AP_3v3", 2: "AP_1v8" } as Record<number, string>)[vendorId] ?? "";
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const pkgVersion = await this.getPkgVersion(esp);
    const chipDesc: Record<number, string> = {
      0: "ESP32-S3 (QFN56)",
      1: "ESP32-S3-PICO-1 (LGA56)",
    };
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    return `${chipDesc[pkgVersion] ?? "Unknown ESP32-S3"} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    const features = ["Wi-Fi", "BT 5 (LE)", "Dual Core + LP Core", "240MHz"];
    const flashMap: Record<number, string | null> = {
      0: null,
      1: "Embedded Flash 8MB",
      2: "Embedded Flash 4MB",
    };
    const flashCap = await this.getFlashCap(esp);
    const flashVendor = await this.getFlashVendor(esp);
    const flash = Object.prototype.hasOwnProperty.call(flashMap, flashCap)
      ? flashMap[flashCap]
      : "Unknown Embedded Flash";
    if (flash !== null) {
      features.push(flashVendor ? `${flash} (${flashVendor})` : flash);
    }

    const psramMap: Record<number, string | null> = {
      0: null,
      1: "Embedded PSRAM 8MB",
      2: "Embedded PSRAM 2MB",
    };
    const psramCap = await this.getPsramCap(esp);
    const psramVendor = await this.getPsramVendor(esp);
    const psram = Object.prototype.hasOwnProperty.call(psramMap, psramCap)
      ? psramMap[psramCap]
      : "Unknown Embedded PSRAM";
    if (psram !== null) {
      features.push(psramVendor ? `${psram} (${psramVendor})` : psram);
    }
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
