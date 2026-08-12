import type { EspDevice } from "../wasm/bindings.js";
import { ESP32C6ROM } from "./esp32c6.js";

export class ESP32C61ROM extends ESP32C6ROM {
  CHIP_NAME = "ESP32-C61";
  EFUSE_BASE = 0x600b4800;
  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;

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
    const name = pkgVer === 0 ? "ESP32-C61" : "Unknown ESP32-C61";
    return `${name} (revision v${majorRev}.${minorRev})`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    void esp;
    return ["Wi-Fi 6", "BT 5 (LE)"];
  }
}
