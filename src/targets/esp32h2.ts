import type { EspDevice } from "../wasm/bindings.js";
import { ESP32C6ROM } from "./esp32c6.js";

export class ESP32H2ROM extends ESP32C6ROM {
  CHIP_NAME = "ESP32-H2";

  async getPkgVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 4)) >> 0) & 0x07;
  }

  async getMinorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 18) & 0x07;
  }

  async getMajorChipVersion(esp: EspDevice): Promise<number> {
    return ((await this.readReg(esp, this.EFUSE_BLOCK1_ADDR + 4 * 3)) >> 21) & 0x03;
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const pkgVer = await this.getPkgVersion(esp);
    const majorRev = await this.getMajorChipVersion(esp);
    const minorRev = await this.getMinorChipVersion(esp);
    const name = pkgVer === 0 ? "ESP32-H2" : "Unknown ESP32-H2";
    return `${name} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    void esp;
    return ["BT 5 (LE)", "IEEE802.15.4", "Single Core", "96MHz"];
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    void esp;
    return 32;
  }
}
