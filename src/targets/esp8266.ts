import type { EspDevice } from "../wasm/bindings.js";
import { ROM } from "./rom.js";

export class ESP8266ROM extends ROM {
  CHIP_NAME = "ESP8266";
  EFUSE_RD_REG_BASE = 0x3ff00050;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;
  XTAL_CLK_DIVIDER = 2;

  async readEfuse(esp: EspDevice, offset: number): Promise<number> {
    return this.readReg(esp, this.EFUSE_RD_REG_BASE + 4 * offset);
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const efuse3 = await this.readEfuse(esp, 2);
    const efuse0 = await this.readEfuse(esp, 0);
    const is8285 = ((efuse0 & (1 << 4)) | (efuse3 & (1 << 16))) !== 0;
    return is8285 ? "ESP8285" : "ESP8266EX";
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    const features = ["WiFi"];
    if ((await this.getChipDescription(esp)) === "ESP8285") {
      features.push("Embedded Flash");
    }
    return features;
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    return this.measureCrystalFreq(esp);
  }

  async readMac(esp: EspDevice): Promise<Uint8Array> {
    const mac0 = (await this.readEfuse(esp, 0)) >>> 0;
    const mac1 = (await this.readEfuse(esp, 1)) >>> 0;
    const mac3 = (await this.readEfuse(esp, 3)) >>> 0;

    let oui: number[];
    if (mac3 !== 0) {
      oui = [(mac3 >> 16) & 0xff, (mac3 >> 8) & 0xff, mac3 & 0xff];
    } else if (((mac1 >> 16) & 0xff) === 0) {
      oui = [0x18, 0xfe, 0x34];
    } else if (((mac1 >> 16) & 0xff) === 1) {
      oui = [0xac, 0xd0, 0x74];
    } else {
      oui = [0x18, 0xfe, 0x34];
    }

    return new Uint8Array([oui[0], oui[1], oui[2], (mac1 >> 8) & 0xff, mac1 & 0xff, (mac0 >> 24) & 0xff]);
  }
}
