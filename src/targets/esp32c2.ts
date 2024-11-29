import { ESPLoader } from "../esploader.js";
import { ESP32C3ROM } from "./esp32c3.js";

export class ESP32C2ROM extends ESP32C3ROM {
  public CHIP_NAME = "ESP32-C2";
  public IMAGE_CHIP_ID = 12;
  public EFUSE_BASE = 0x60008800;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x040;
  public UART_CLKDIV_REG = 0x60000014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x6000007c;
  public XTAL_CLK_DIVIDER = 1;

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0;

  public FLASH_SIZES = {
    "1MB": 0x00,
    "2MB": 0x10,
    "4MB": 0x20,
    "8MB": 0x30,
    "16MB": 0x40,
  };

  public SPI_REG_BASE = 0x60002000;
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;
  public SPI_W0_OFFS = 0x58;

  public RTCCNTL_BASE_REG = 0x60008000;
  public RTC_CNTL_WDTCONFIG0_REG = this.RTCCNTL_BASE_REG + 0x0084;
  public RTC_CNTL_WDTCONFIG1_REG = this.RTCCNTL_BASE_REG + 0x0088;
  public RTC_CNTL_WDTWPROTECT_REG = this.RTCCNTL_BASE_REG + 0x009c;
  public RTC_CNTL_WDT_WKEY = 0x50d83aa1;

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 1;
    const block1Addr = this.EFUSE_BASE + 0x040;
    const addr = block1Addr + 4 * numWord;
    const word3 = await loader.readReg(addr);
    const pkgVersion = (word3 >> 22) & 0x07;
    return pkgVersion;
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    const block1Addr = this.EFUSE_BASE + 0x040;
    const numWord = 1;
    const pos = 20;
    const addr = block1Addr + 4 * numWord;
    const ret = ((await loader.readReg(addr)) & (0x03 << pos)) >> pos;
    return ret;
  }

  public async getChipDescription(loader: ESPLoader) {
    let desc: string;
    const pkgVer = await this.getPkgVersion(loader);
    if (pkgVer === 0 || pkgVer === 1) {
      desc = "ESP32-C2";
    } else {
      desc = "unknown ESP32-C2";
    }
    const chip_rev = await this.getChipRevision(loader);
    desc += " (revision " + chip_rev + ")";
    return desc;
  }

  public async getChipFeatures() {
    return ["Wi-Fi", "BLE"];
  }

  public async getCrystalFreq(loader: ESPLoader) {
    const uartDiv = (await loader.readReg(this.UART_CLKDIV_REG)) & this.UART_CLKDIV_MASK;
    const etsXtal = (loader.transport.baudrate * uartDiv) / 1000000 / this.XTAL_CLK_DIVIDER;
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

  public async changeBaudRate(loader: ESPLoader) {
    const rom_with_26M_XTAL = await this.getCrystalFreq(loader);
    if (rom_with_26M_XTAL === 26) {
      loader.changeBaud();
    }
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async readMac(loader: ESPLoader) {
    let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
    mac0 = mac0 >>> 0;
    let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
    mac1 = (mac1 >>> 0) & 0x0000ffff;
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

  public getEraseSize(offset: number, size: number) {
    return size;
  }

  public async hardReset(loader: ESPLoader) {
    return await loader.hardReset();
  }
}
