import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";
import ESP32_STUB from "./stub_flasher/stub_flasher_32.json";

export class ESP32ROM extends ROM {
  public CHIP_NAME = "ESP32";
  public IMAGE_CHIP_ID = 0;
  public EFUSE_RD_REG_BASE = 0x3ff5a000;
  public DR_REG_SYSCON_BASE = 0x3ff66000;
  public UART_CLKDIV_REG = 0x3ff40014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x60000078;
  public XTAL_CLK_DIVIDER = 1;

  public FLASH_SIZES: { [key: string]: number } = {
    "1MB": 0x00,
    "2MB": 0x10,
    "4MB": 0x20,
    "8MB": 0x30,
    "16MB": 0x40,
  };

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0x1000;

  public SPI_REG_BASE = 0x3ff42000;
  public SPI_USR_OFFS = 0x1c;
  public SPI_USR1_OFFS = 0x20;
  public SPI_USR2_OFFS = 0x24;
  public SPI_W0_OFFS = 0x80;
  public SPI_MOSI_DLEN_OFFS = 0x28;
  public SPI_MISO_DLEN_OFFS = 0x2c;

  public TEXT_START = ESP32_STUB.text_start;
  public ENTRY = ESP32_STUB.entry;
  public DATA_START = ESP32_STUB.data_start;
  public ROM_DATA = ESP32_STUB.data;
  public ROM_TEXT = ESP32_STUB.text;

  public async readEfuse(loader: ESPLoader, offset: number): Promise<number> {
    const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
    loader.debug("Read efuse " + addr);
    return await loader.readReg(addr);
  }

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const word3 = await this.readEfuse(loader, 3);
    let pkgVersion = (word3 >> 9) & 0x07;
    pkgVersion += ((word3 >> 2) & 0x1) << 3;
    return pkgVersion;
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    const word3 = await this.readEfuse(loader, 3);
    const word5 = await this.readEfuse(loader, 5);
    const apbCtlDate = await loader.readReg(this.DR_REG_SYSCON_BASE + 0x7c);

    const revBit0 = (word3 >> 15) & 0x1;
    const revBit1 = (word5 >> 20) & 0x1;
    const revBit2 = (apbCtlDate >> 31) & 0x1;
    if (revBit0 != 0) {
      if (revBit1 != 0) {
        if (revBit2 != 0) {
          return 3;
        } else {
          return 2;
        }
      } else {
        return 1;
      }
    }
    return 0;
  }

  public async getChipDescription(loader: ESPLoader) {
    const chipDesc = [
      "ESP32-D0WDQ6",
      "ESP32-D0WD",
      "ESP32-D2WD",
      "",
      "ESP32-U4WDH",
      "ESP32-PICO-D4",
      "ESP32-PICO-V3-02",
    ];
    let chipName = "";
    const pkgVersion = await this.getPkgVersion(loader);
    const chipRevision = await this.getChipRevision(loader);
    const rev3 = chipRevision == 3;
    const single_core = (await this.readEfuse(loader, 3)) & (1 << 0);

    if (single_core != 0) {
      chipDesc[0] = "ESP32-S0WDQ6";
      chipDesc[1] = "ESP32-S0WD";
    }
    if (rev3) {
      chipDesc[5] = "ESP32-PICO-V3";
    }
    if (pkgVersion >= 0 && pkgVersion <= 6) {
      chipName = chipDesc[pkgVersion];
    } else {
      chipName = "Unknown ESP32";
    }

    if (rev3 && (pkgVersion === 0 || pkgVersion === 1)) {
      chipName += "-V3";
    }
    return chipName + " (revision " + chipRevision + ")";
  }

  public async getChipFeatures(loader: ESPLoader) {
    const features = ["Wi-Fi"];
    const word3 = await this.readEfuse(loader, 3);

    const chipVerDisBt = word3 & (1 << 1);
    if (chipVerDisBt === 0) {
      features.push(" BT");
    }

    const chipVerDisAppCpu = word3 & (1 << 0);
    if (chipVerDisAppCpu !== 0) {
      features.push(" Single Core");
    } else {
      features.push(" Dual Core");
    }

    const chipCpuFreqRated = word3 & (1 << 13);
    if (chipCpuFreqRated !== 0) {
      const chipCpuFreqLow = word3 & (1 << 12);
      if (chipCpuFreqLow !== 0) {
        features.push(" 160MHz");
      } else {
        features.push(" 240MHz");
      }
    }

    const pkgVersion = await this.getPkgVersion(loader);
    if ([2, 4, 5, 6].indexOf(pkgVersion) !== -1) {
      features.push(" Embedded Flash");
    }

    if (pkgVersion === 6) {
      features.push(" Embedded PSRAM");
    }

    const word4 = await this.readEfuse(loader, 4);
    const adcVref = (word4 >> 8) & 0x1f;
    if (adcVref !== 0) {
      features.push(" VRef calibration in efuse");
    }

    const blk3PartRes = (word3 >> 14) & 0x1;
    if (blk3PartRes !== 0) {
      features.push(" BLK3 partially reserved");
    }

    const word6 = await this.readEfuse(loader, 6);
    const codingScheme = word6 & 0x3;
    const codingSchemeArr = ["None", "3/4", "Repeat (UNSUPPORTED)", "Invalid"];
    features.push(" Coding Scheme " + codingSchemeArr[codingScheme]);

    return features;
  }

  public async getCrystalFreq(loader: ESPLoader) {
    const uartDiv = (await loader.readReg(this.UART_CLKDIV_REG)) & this.UART_CLKDIV_MASK;
    const etsXtal = (loader.romBaudrate * uartDiv) / 1000000 / this.XTAL_CLK_DIVIDER;
    let normXtal;
    if (etsXtal > 33) {
      normXtal = 40;
    } else {
      normXtal = 26;
    }
    if (Math.abs(normXtal - etsXtal) > 1) {
      loader.info("WARNING: Unsupported crystal in use");
    }
    return normXtal;
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async readMac(loader: ESPLoader) {
    let mac0 = await this.readEfuse(loader, 1);
    mac0 = mac0 >>> 0;
    let mac1 = await this.readEfuse(loader, 2);
    mac1 = mac1 >>> 0;
    const mac = new Uint8Array(6);
    mac[0] = (mac1 >> 8) & 0xff;
    mac[1] = mac1 & 0xff;
    mac[2] = (mac0 >> 24) & 0xff;
    mac[3] = (mac0 >> 16) & 0xff;
    mac[4] = (mac0 >> 8) & 0xff;
    mac[5] = mac0 & 0xff;

    return (
      this._d2h(mac[0]) +
      ":" +
      this._d2h(mac[1]) +
      ":" +
      this._d2h(mac[2]) +
      ":" +
      this._d2h(mac[3]) +
      ":" +
      this._d2h(mac[4]) +
      ":" +
      this._d2h(mac[5])
    );
  }
}
