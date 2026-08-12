import type { EspDevice } from "../wasm/bindings.js";
import { ESP32C3ROM } from "./esp32c3.js";

export class ESP32C6ROM extends ESP32C3ROM {
  CHIP_NAME = "ESP32-C6";
  EFUSE_BASE = 0x600b0800;
  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 21) & 0x07;
  }

  async getFlashCap(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 27) & 0x07;
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 18) & 0x07;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 5)) >> 24) & 0x03;
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const pkgVer = await this.getPkgVersion(esp);
    let chipName = "Unknown ESP32-C6";
    if (pkgVer === 0) {
      chipName = "ESP32-C6 (QFN40)";
    } else if (pkgVer === 1) {
      const flashCap = await this.getFlashCap(esp);
      if (flashCap === 1) {
        chipName = "ESP32-C6FH4 (QFN32)";
      } else if (flashCap === 2) {
        chipName = "ESP32-C6FH8 (QFN32)";
      }
    }
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    return `${chipName} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    const flashVersion =
      ({ 1: "Embedded Flash 4MB", 2: "Embedded Flash 8MB" } as Record<number, string>)[await this.getFlashCap(esp)] ??
      "Unknown Embedded Flash";
    return ["Wi-Fi 6", "BT 5 (LE)", "IEEE802.15.4", "Single Core + LP Core", "160MHz", flashVersion];
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    void esp;
    return 40;
  }
}
