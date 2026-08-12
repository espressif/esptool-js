import type { EspDevice } from "../wasm/bindings.js";
import { ESP32C6ROM } from "./esp32c6.js";

export class ESP32C5ROM extends ESP32C6ROM {
  CHIP_NAME = "ESP32-C5";
  EFUSE_BASE = 0x600b4800;
  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;
  XTAL_CLK_DIVIDER = 1;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 2)) >> 26) & 0x07;
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 2)) >> 0) & 0x0f;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 2)) >> 4) & 0x03;
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const pkgVer = await this.getPkgVersion(esp);
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    const name = pkgVer === 0 ? "ESP32-C5" : "Unknown ESP32-C5";
    return `${name} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    void esp;
    return ["Wi-Fi 6 (dual-band)", "BT 5 (LE)", "IEEE802.15.4", "Single Core + LP Core", "240MHz"];
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    return this.measureCrystalFreq(esp, true);
  }
}
