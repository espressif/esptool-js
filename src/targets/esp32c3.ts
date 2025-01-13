import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";

export class ESP32C3ROM extends ROM {
  public CHIP_NAME = "ESP32-C3";
  public IMAGE_CHIP_ID = 5;
  public EFUSE_BASE = 0x60008800;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x6000007c;

  public CHIP_DETECT_MAGIC_VALUE = [0x6921506f, 0x1b31506f, 0x4881606f, 0x4361606f];

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
  public RTC_CNTL_SWD_CONF_REG = this.RTCCNTL_BASE_REG + 0x00ac;
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 31;
  public RTC_CNTL_SWD_WPROTECT_REG = this.RTCCNTL_BASE_REG + 0x00b0;
  public RTC_CNTL_SWD_WKEY = 0x8f1d312a;

  public RTC_CNTL_WDTCONFIG0_REG = this.RTCCNTL_BASE_REG + 0x0090;
  public RTC_CNTL_WDTCONFIG1_REG = this.RTCCNTL_BASE_REG + 0x0094;
  public RTC_CNTL_WDTWPROTECT_REG = this.RTCCNTL_BASE_REG + 0x00a8;
  public RTC_CNTL_WDT_WKEY = 0x50d83aa1;

  public UART_CLKDIV_REG = 0x60000014;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;

  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address

  public EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY0_SHIFT = 24;
  public EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY1_SHIFT = 28;
  public EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY2_SHIFT = 0;
  public EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY3_SHIFT = 4;
  public EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY4_SHIFT = 8;
  public EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY5_SHIFT = 12;

  public UARTDEV_BUF_NO = 0x3fcdf07c; // Variable in ROM .bss which indicates the port in use
  public UARTDEV_BUF_NO_USB_JTAG_SERIAL = 3; // The above var when USB-JTAG/Serial is used

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const word3 = await loader.readReg(addr);
    const pkgVersion = (word3 >> 21) & 0x07;
    return pkgVersion;
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    const block1Addr = this.EFUSE_BASE + 0x044;
    const numWord = 3;
    const pos = 18;
    const addr = block1Addr + 4 * numWord;
    const ret = ((await loader.readReg(addr)) & (0x7 << pos)) >> pos;
    return ret;
  }

  public async getMajorChipVersion(loader: ESPLoader) {
    const numWord = 5;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 24) & 0x03;
  }

  public async getMinorChipVersion(loader: ESPLoader) {
    const hiNumWord = 5;
    const hi = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * hiNumWord)) >> 23) & 0x01;
    const lowNumWord = 3;
    const low = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * lowNumWord)) >> 18) & 0x07;
    return (hi << 3) + low;
  }

  public async getChipDescription(loader: ESPLoader) {
    const chipDesc: { [key: number]: string } = {
      0: "ESP32-C3 (QFN32)",
      1: "ESP8685 (QFN28)",
      2: "ESP32-C3 AZ (QFN32)",
      3: "ESP8686 (QFN24)",
    };
    const chipIndex = await this.getPkgVersion(loader);
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${chipDesc[chipIndex] || "unknown ESP32-C3"} (revision v${majorRev}.${minorRev})`;
  }

  public async getFlashCap(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const flashCap = (registerValue >> 27) & 0x07;
    return flashCap;
  }

  public async getFlashVendor(loader: ESPLoader): Promise<string> {
    const numWord = 4;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const vendorId = (registerValue >> 0) & 0x07;
    const vendorMap: { [key: number]: string } = {
      1: "XMC",
      2: "GD",
      3: "FM",
      4: "TT",
      5: "ZBIT",
    };
    return vendorMap[vendorId] || "";
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    const features: string[] = ["Wi-Fi", "BLE"];

    const flashMap: { [key: number]: string | null } = {
      0: null,
      1: "Embedded Flash 4MB",
      2: "Embedded Flash 2MB",
      3: "Embedded Flash 1MB",
      4: "Embedded Flash 8MB",
    };
    const flashCap = await this.getFlashCap(loader);
    const flashVendor = await this.getFlashVendor(loader);
    const flash = flashMap[flashCap];
    const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
    if (flash !== null) {
      features.push(`${flashDescription} (${flashVendor})`);
    }
    return features;
  }

  public async getCrystalFreq(loader?: ESPLoader) {
    return 40;
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

  public async useUsbJTAGSerial(loader: ESPLoader) {
    const reg = (await loader.readReg(this.UARTDEV_BUF_NO)) & 0xff;
    return this.UARTDEV_BUF_NO_USB_JTAG_SERIAL === reg;
  }

  public async rtcWdtReset(loader: ESPLoader) {
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY); // unlock
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG1_REG, 5000); // set WDT timeout
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, (1 << 31) | (5 << 28) | (1 << 8) | 2); //  enable WDT
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0); // lock
  }

  public async hardReset(loader: ESPLoader) {
    const isUsingUsbJTAGSerial = await this.useUsbJTAGSerial(loader);
    if (isUsingUsbJTAGSerial) {
      await this.rtcWdtReset(loader);
    } else {
      loader.hardReset();
    }
  }
}
