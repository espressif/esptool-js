import type { EspDevice } from "../wasm/bindings.js";
import { ROM } from "./rom.js";

export class ESP32ROM extends ROM {
  CHIP_NAME = "ESP32";
  EFUSE_RD_REG_BASE = 0x3ff5a000;
  DR_REG_SYSCON_BASE = 0x3ff66000;
  UART_CLKDIV_REG = 0x3ff40014;
  UART_CLKDIV_MASK = 0xfffff;
  XTAL_CLK_DIVIDER = 1;

  async readEfuse(esp: EspDevice, offset: number): Promise<number> {
    return this.readReg(esp, this.EFUSE_RD_REG_BASE + 4 * offset);
  }

  async getPkgVersion(esp: EspDevice): Promise<number> {
    const word3 = await this.readEfuse(esp, 3);
    let pkgVersion = (word3 >> 9) & 0x07;
    pkgVersion += ((word3 >> 2) & 0x1) << 3;
    return pkgVersion;
  }

  async getChipRevision(esp: EspDevice): Promise<number> {
    const word3 = await this.readEfuse(esp, 3);
    const word5 = await this.readEfuse(esp, 5);
    const apbCtlDate = await this.readReg(esp, this.DR_REG_SYSCON_BASE + 0x7c);
    const revBit0 = (word3 >> 15) & 0x1;
    const revBit1 = (word5 >> 20) & 0x1;
    const revBit2 = (apbCtlDate >> 31) & 0x1;
    if (revBit0 !== 0) {
      if (revBit1 !== 0) {
        return revBit2 !== 0 ? 3 : 2;
      }
      return 1;
    }
    return 0;
  }

  async getChipDescription(esp: EspDevice): Promise<string> {
    const chipDesc = [
      "ESP32-D0WDQ6",
      "ESP32-D0WD",
      "ESP32-D2WD",
      "",
      "ESP32-U4WDH",
      "ESP32-PICO-D4",
      "ESP32-PICO-V3-02",
      "ESP32-D0WDR2-V3",
    ];
    const pkgVersion = await this.getPkgVersion(esp);
    const chipRevision = await this.getChipRevision(esp);
    const rev3 = chipRevision === 3;
    const singleCore = (await this.readEfuse(esp, 3)) & (1 << 0);

    if (singleCore !== 0) {
      chipDesc[0] = "ESP32-S0WDQ6";
      chipDesc[1] = "ESP32-S0WD";
    }
    if (rev3) {
      chipDesc[5] = "ESP32-PICO-V3";
    }

    let chipName =
      pkgVersion >= 0 && pkgVersion < chipDesc.length && chipDesc[pkgVersion] ? chipDesc[pkgVersion] : "Unknown ESP32";

    if (rev3 && (pkgVersion === 0 || pkgVersion === 1)) {
      chipName += "-V3";
    }
    return `${chipName} (revision v${chipRevision}.0)`;
  }

  async getChipFeatures(esp: EspDevice): Promise<string[]> {
    const features = ["Wi-Fi"];
    const word3 = await this.readEfuse(esp, 3);

    if ((word3 & (1 << 1)) === 0) {
      features.push("BT");
    }
    if ((word3 & (1 << 0)) !== 0) {
      features.push("Single Core");
    } else {
      features.push("Dual Core");
    }
    if ((word3 & (1 << 13)) !== 0) {
      features.push((word3 & (1 << 12)) !== 0 ? "160MHz" : "240MHz");
    }

    const pkgVersion = await this.getPkgVersion(esp);
    if ([2, 4, 5, 6].includes(pkgVersion)) {
      features.push("Embedded Flash");
    }
    if (pkgVersion === 6) {
      features.push("Embedded PSRAM");
    }

    const word4 = await this.readEfuse(esp, 4);
    if (((word4 >> 8) & 0x1f) !== 0) {
      features.push("VRef calibration in efuse");
    }
    if (((word3 >> 14) & 0x1) !== 0) {
      features.push("BLK3 partially reserved");
    }

    const word6 = await this.readEfuse(esp, 6);
    const codingScheme = ["None", "3/4", "Repeat (UNSUPPORTED)", "None (may contain encoding data)"];
    features.push(`Coding Scheme ${codingScheme[word6 & 0x3]}`);
    return features;
  }

  async getCrystalFreq(esp: EspDevice): Promise<number> {
    return this.measureCrystalFreq(esp);
  }

  async readMac(esp: EspDevice): Promise<Uint8Array> {
    const mac0 = (await this.readEfuse(esp, 1)) >>> 0;
    const mac1 = (await this.readEfuse(esp, 2)) >>> 0;
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
