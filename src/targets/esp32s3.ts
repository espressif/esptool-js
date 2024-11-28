import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";

export class ESP32S3ROM extends ROM {
  public CHIP_NAME = "ESP32-S3";
  public IMAGE_CHIP_ID = 9;
  public EFUSE_BASE = 0x60007000;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x44;
  public EFUSE_BLOCK2_ADDR = this.EFUSE_BASE + 0x5c;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x60000014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x60000080;

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0x0;

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

  public USB_RAM_BLOCK = 0x800;
  public UARTDEV_BUF_NO_USB = 3;
  public UARTDEV_BUF_NO = 0x3fcef14c; // Variable in ROM .bss which indicates the port in use
  public UARTDEV_BUF_NO_USB_OTG = 3; // The above var when USB-OTG is used
  public UARTDEV_BUF_NO_USB_JTAG_SERIAL = 4; // The above var when USB-JTAG/Serial is used

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

  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 20;

  public EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
  public EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 18;

  public EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
  public EFUSE_SECURE_BOOT_EN_MASK = 1 << 20;

  public EFUSE_RD_REPEAT_DATA3_REG = this.EFUSE_BASE + 0x3c;
  public EFUSE_RD_REPEAT_DATA3_REG_FLASH_TYPE_MASK = 1 << 9;

  public PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
  public PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
  public PURPOSE_VAL_XTS_AES128_KEY = 4;

  public RTCCNTL_BASE_REG = 0x60008000;
  public RTC_CNTL_SWD_CONF_REG = this.RTCCNTL_BASE_REG + 0x00b4;
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 31;
  public RTC_CNTL_SWD_WPROTECT_REG = this.RTCCNTL_BASE_REG + 0x00b8;
  public RTC_CNTL_SWD_WKEY = 0x8f1d312a;

  public RTC_CNTL_WDTCONFIG0_REG = this.RTCCNTL_BASE_REG + 0x0098;
  public RTC_CNTL_WDTCONFIG1_REG = this.RTCCNTL_BASE_REG + 0x009c;
  public RTC_CNTL_WDTWPROTECT_REG = this.RTCCNTL_BASE_REG + 0x00b0;
  public RTC_CNTL_WDT_WKEY = 0x50d83aa1;

  public GPIO_STRAP_REG = 0x60004038;
  public GPIO_STRAP_SPI_BOOT_MASK = 1 << 3; // Not download mode
  public GPIO_STRAP_VDDSPI_MASK = 1 << 4;
  public RTC_CNTL_OPTION1_REG = 0x6000812c;
  public RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK = 0x1; // Is download mode forced over USB?

  public async getChipDescription(loader: ESPLoader) {
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    const pkgVersion = await this.getPkgVersion(loader);

    const chipName: { [key: number]: string } = {
      0: "ESP32-S3 (QFN56)",
      1: "ESP32-S3-PICO-1 (LGA56)",
    };
    return `${chipName[pkgVersion] || "unknown ESP32-S3"} (revision v${majorRev}.${minorRev})`;
  }

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 21) & 0x07;
  }

  public async getRawMinorChipVersion(loader: ESPLoader) {
    const hiNumWord = 5;
    const hi = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * hiNumWord)) >> 23) & 0x01;
    const lowNumWord = 3;
    const low = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * lowNumWord)) >> 18) & 0x07;
    return (hi << 3) + low;
  }

  public async getMinorChipVersion(loader: ESPLoader) {
    const minorRaw = await this.getRawMinorChipVersion(loader);
    if (await this.isEco0(loader, minorRaw)) {
      return 0;
    }
    return this.getRawMinorChipVersion(loader);
  }

  public async getRawMajorChipVersion(loader: ESPLoader) {
    const numWord = 5;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 24) & 0x03;
  }

  public async getMajorChipVersion(loader: ESPLoader) {
    const minorRaw = await this.getRawMinorChipVersion(loader);
    if (await this.isEco0(loader, minorRaw)) {
      return 0;
    }
    return this.getRawMajorChipVersion(loader);
  }

  public async getBlkVersionMajor(loader: ESPLoader) {
    const numWord = 4;
    return ((await loader.readReg(this.EFUSE_BLOCK2_ADDR + 4 * numWord)) >> 0) & 0x03;
  }

  public async getBlkVersionMinor(loader: ESPLoader) {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 24) & 0x07;
  }

  public async isEco0(loader: ESPLoader, minorRaw: number) {
    // Workaround: The major version field was allocated to other purposes
    // when block version is v1.1.
    // Luckily only chip v0.0 have this kind of block version and efuse usage.
    return (
      (minorRaw & 0x7) === 0 &&
      (await this.getBlkVersionMajor(loader)) === 1 &&
      (await this.getBlkVersionMinor(loader)) === 1
    );
  }

  public async getFlashCap(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
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
      5: "BY",
    };
    return vendorMap[vendorId] || "";
  }

  public async getPsramCap(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const psramCap = (registerValue >> 3) & 0x03;
    const capHiBitNumWord = 5;
    const psramCapHiBit = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * capHiBitNumWord)) >> 19) & 0x01;
    return (psramCapHiBit << 2) | psramCap;
  }

  public async getPsramVendor(loader: ESPLoader): Promise<string> {
    const numWord = 4;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const vendorId = (registerValue >> 7) & 0x03;
    const vendorMap: { [key: number]: string } = {
      1: "AP_3v3",
      2: "AP_1v8",
    };
    return vendorMap[vendorId] || "";
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    const features: string[] = ["Wi-Fi", "BLE"];

    const flashMap: { [key: number]: string | null } = {
      0: null,
      1: "Embedded Flash 8MB",
      2: "Embedded Flash 4MB",
    };
    const flashCap = await this.getFlashCap(loader);
    const flashVendor = await this.getFlashVendor(loader);
    const flash = flashMap[flashCap];
    const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
    if (flash !== null) {
      features.push(`${flashDescription} (${flashVendor})`);
    }

    const psramMap: { [key: number]: string | null } = {
      0: null,
      1: "Embedded PSRAM 8MB",
      2: "Embedded PSRAM 2MB",
      3: "Embedded PSRAM 16MB",
      4: "Embedded PSRAM 4MB",
    };
    const psramCap = await this.getPsramCap(loader);
    const psramVendor = await this.getPsramVendor(loader);
    const psram = psramMap[psramCap];
    const psramDescription = psram !== undefined ? psram : "Unknown Embedded PSRAM";
    if (psram !== null) {
      features.push(`${psramDescription} (${psramVendor})`);
    }
    return features;
  }

  public async getCrystalFreq(loader: ESPLoader) {
    return 40;
  }
  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async postConnect(loader: ESPLoader) {
    const bufNo = (await loader.readReg(this.UARTDEV_BUF_NO)) & 0xff;
    loader.debug("In _post_connect " + bufNo);
    if (bufNo == this.UARTDEV_BUF_NO_USB) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
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

  public async usingUsbOtg(loader: ESPLoader) {
    const uartNo = (await loader.readReg(this.UARTDEV_BUF_NO)) & 0xff;
    return uartNo === this.UARTDEV_BUF_NO_USB_OTG;
  }

  public async useUsbJTAGSerial(loader: ESPLoader) {
    const reg = (await loader.readReg(this.UARTDEV_BUF_NO)) & 0xff; // uart_no
    return this.UARTDEV_BUF_NO_USB_JTAG_SERIAL === reg;
  }

  public async rtcWdtReset(loader: ESPLoader) {
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY); // unlock
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG1_REG, 5000); // set WDT timeout
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, (1 << 31) | (5 << 28) | (1 << 8) | 2); //  enable WDT
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0); // lock
  }

  public async hardReset(loader: ESPLoader) {
    try {
      // Clear force download boot mode to avoid the chip being stuck in download mode after reset
      await loader.writeReg(this.RTC_CNTL_OPTION1_REG, 0, this.RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK);
    } catch (error) {
      let msg = "Error while clearing force download boot mode";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      console.log(msg);
    }
    const isUsingUsbOtg = await this.usingUsbOtg(loader);
    const isUsingUsbJTAGSerial = await this.useUsbJTAGSerial(loader);
    if (isUsingUsbOtg || isUsingUsbJTAGSerial) {
      const strapReg = await loader.readReg(this.GPIO_STRAP_REG);
      const forceDlReg = await loader.readReg(this.RTC_CNTL_OPTION1_REG);
      if (
        (strapReg & this.GPIO_STRAP_SPI_BOOT_MASK) === 0 &&
        (forceDlReg & this.RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK) === 0
      ) {
        // GPIO0 Low
        await this.rtcWdtReset(loader);
      }
    } else {
      loader.hardReset();
    }
  }
}
