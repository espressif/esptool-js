import type { EspDevice } from "../wasm/bindings.js";
import { ESP32ROM } from "./esp32.js";

export class ESP32C3ROM extends ESP32ROM {
  CHIP_NAME = "ESP32-C3";
  EFUSE_BASE = 0x60008800;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    const addr = this.EFUSE_BASE + 0x044 + 4 * 3;
    return ((await this.readReg(esp, addr)) >> 21) & 0x07;
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    const hi = ((await this.readReg(esp, this.EFUSE_BASE + 0x044 + 4 * 5)) >> 23) & 0x01;
    const low = ((await this.readReg(esp, this.EFUSE_BASE + 0x044 + 4 * 3)) >> 18) & 0x07;
    return (hi << 3) + low;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BASE + 0x044 + 4 * 5)) >> 24) & 0x03;
  }

  async getFlashCap(esp: EspDevice): Promise<number> {
    const addr = this.EFUSE_BASE + 0x044 + 4 * 3;
    return ((await this.readReg(esp, addr)) >> 27) & 0x07;
  }

  async getFlashVendor(esp: EspDevice): Promise<string> {
    const addr = this.EFUSE_BASE + 0x044 + 4 * 4;
    const vendorId = ((await this.readReg(esp, addr)) >> 0) & 0x07;
    return ({ 1: "XMC", 2: "GD", 3: "FM", 4: "TT", 5: "ZBIT" } as Record<number, string>)[vendorId] ?? "";
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const chipDesc: Record<number, string> = {
      0: "ESP32-C3 (QFN32)",
      1: "ESP8685 (QFN28)",
      2: "ESP32-C3 AZ (QFN32)",
      3: "ESP8686 (QFN24)",
    };
    const pkg = await this.getPkgVersion(esp);
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    return `${chipDesc[pkg] ?? "Unknown ESP32-C3"} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    const features = ["Wi-Fi", "BT 5 (LE)", "Single Core", "160MHz"];
    const flashMap: Record<number, string | null> = {
      0: null,
      1: "Embedded Flash 4MB",
      2: "Embedded Flash 2MB",
      3: "Embedded Flash 1MB",
      4: "Embedded Flash 8MB",
    };
    const flashCap = await this.getFlashCap(esp);
    const flashVendor = await this.getFlashVendor(esp);
    const flash = Object.prototype.hasOwnProperty.call(flashMap, flashCap)
      ? flashMap[flashCap]
      : "Unknown Embedded Flash";
    if (flash !== null) {
      features.push(flashVendor ? `${flash} (${flashVendor})` : flash);
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
