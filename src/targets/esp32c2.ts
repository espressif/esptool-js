import type { EspDevice } from "../wasm/bindings.js";
import { ESP32C3ROM } from "./esp32c3.js";

export class ESP32C2ROM extends ESP32C3ROM {
  CHIP_NAME = "ESP32-C2";
  EFUSE_BASE = 0x60008800;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x040;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;
  XTAL_CLK_DIVIDER = 1;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    const addr = this.EFUSE_BASE + 0x040 + 4 * 1;
    return ((await this.readReg(esp, addr)) >> 22) & 0x07;
  }

  async getChipRevision(esp: EspDevice): Promise<number> {
    const addr = this.EFUSE_BASE + 0x040 + 4 * 1;
    return ((await this.readReg(esp, addr)) & (0x03 << 20)) >> 20;
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const pkgVer = await this.getPkgVersion(esp);
    const chipRev = await this.getChipRevision(esp);
    const desc = pkgVer === 0 || pkgVer === 1 ? "ESP32-C2" : "Unknown ESP32-C2";
    return `${desc} (revision v${chipRev}.0)`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    void esp;
    return ["Wi-Fi", "BT 5 (LE)"];
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    return this.measureCrystalFreq(esp);
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
