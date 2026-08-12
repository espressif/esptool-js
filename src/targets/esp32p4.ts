import type { EspDevice } from "../wasm/bindings.js";
import { ESP32ROM } from "./esp32.js";

export class ESP32P4ROM extends ESP32ROM {
  CHIP_NAME = "ESP32-P4";
  EFUSE_BASE = 0x5012d000;
  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  UART_CLKDIV_REG = 0x50000014;
  UART_CLKDIV_MASK = 0xfffff;

  async getPkgVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 2)) >> 20) & 0x07;
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 2)) >> 0) & 0x0f;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    const v = await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 2);
    return (((v >> 23) & 1) << 2) | ((v >> 4) & 0x03);
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const pkgVersion = await this.getPkgVersion(esp);
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    const name = pkgVersion === 0 ? "ESP32-P4" : "Unknown ESP32-P4";
    return `${name} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    void esp;
    return ["High-Performance MCU"];
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
