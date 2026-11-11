import { ESPLoader } from "../esploader.js";
import { ESP32C5ROM } from "./esp32c5.js";
import { MemoryMapEntry } from "./rom.js";

export class ESP32S31ROM extends ESP32C5ROM {
  public CHIP_NAME = "ESP32-S31";
  public IMAGE_CHIP_ID = 32;
  public USES_MAGIC_VALUE = false;

  public IROM_MAP_START = 0x40000000;
  public IROM_MAP_END = 0x54000000;
  public DROM_MAP_START = 0x40000000;
  public DROM_MAP_END = 0x54000000;

  public BOOTLOADER_FLASH_OFFSET = 0x2000;

  public UART_DATE_REG_ADDR = 0x2038a000 + 0x8c;
  public UART_CLKDIV_REG = 0x2038a000 + 0x14;

  public EFUSE_BASE = 0x20715000;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x050;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x050;

  public SPI_REG_BASE = 0x20501000;
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;
  public SPI_W0_OFFS = 0x58;

  public SPI_ADDR_REG_MSB = false;

  public DR_REG_LP_WDT_BASE = 0x20801000;
  public RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0;
  public RTC_CNTL_WDTCONFIG1_REG = this.DR_REG_LP_WDT_BASE + 0x4;
  public RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x18;
  public RTC_CNTL_WDT_WKEY = 0x50d83aa1;
  // SWD addresses are not the C6 defaults. USB-Serial/JTAG leaves these watchdogs running.
  public RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x20;
  public RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x1c;
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 18;
  public RTC_CNTL_SWD_WKEY = 0x50d83aa1;

  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;

  public EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY0_SHIFT = 0;
  public EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY1_SHIFT = 5;
  public EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY2_SHIFT = 10;
  public EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY3_SHIFT = 15;
  public EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY4_SHIFT = 20;

  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 20;

  public EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
  public EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 21;

  public EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x03c;
  public EFUSE_SECURE_BOOT_EN_MASK = 1 << 2;

  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x034;
  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 12;
  public FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;

  public PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
  public PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
  public PURPOSE_VAL_XTS_AES128_KEY = 4;

  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public USB_RAM_BLOCK = 0x800;
  public USB_OTG_SUPPORTED = true;

  public MEMORY_MAP: MemoryMapEntry[] = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x40000000, 0x54000000, "DROM"],
    [0x2f000000, 0x2f080000, "DRAM"],
    [0x2f000000, 0x2f080000, "BYTE_ACCESSIBLE"],
    [0x2f800000, 0x2f850000, "DROM_MASK"],
    [0x2f800000, 0x2f850000, "IROM_MASK"],
    [0x40000000, 0x54000000, "IROM"],
    [0x2f000000, 0x2f080000, "IRAM"],
    [0x2e000000, 0x2e008000, "RTC_IRAM"],
    [0x2e000000, 0x2e008000, "RTC_DRAM"],
  ];

  UF2_FAMILY_ID = 0x3101f7c1;

  EFUSE_MAX_KEY = 4;
  KEY_PURPOSES: { [key: number]: string } = {
    0: "USER/EMPTY",
    1: "ECDSA_KEY",
    2: "XTS_AES_256_KEY_1",
    3: "XTS_AES_256_KEY_2",
    4: "XTS_AES_128_KEY",
    5: "HMAC_DOWN_ALL",
    6: "HMAC_DOWN_JTAG",
    7: "HMAC_DOWN_DIGITAL_SIGNATURE",
    8: "HMAC_UP",
    9: "SECURE_BOOT_DIGEST0",
    10: "SECURE_BOOT_DIGEST1",
    11: "SECURE_BOOT_DIGEST2",
    12: "KM_INIT_KEY",
    13: "XTS_AES_256_PSRAM_KEY_1",
    14: "XTS_AES_256_PSRAM_KEY_2",
    15: "XTS_AES_128_PSRAM_KEY",
    16: "ECDSA_KEY_P192",
    17: "ECDSA_KEY_P384_L",
    18: "ECDSA_KEY_P384_H",
    19: "SDC_KEY_DIGEST",
  };

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 6) & 0x03;
  }

  public async getMinorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 18) & 0x0f;
  }

  public async getMajorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 22) & 0x03;
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    const major = await this.getMajorChipVersion(loader);
    const minor = await this.getMinorChipVersion(loader);
    return major * 100 + minor;
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVer = await this.getPkgVersion(loader);
    const desc = pkgVer === 0 ? "ESP32-S31" : "unknown ESP32-S31";
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${desc} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    return ["Wi-Fi 6", "BT 5.4 (LE)", "IEEE802.15.4", "Dual Core + LP Core", "300MHz"];
  }

  public async getCrystalFreq(loader: ESPLoader): Promise<number> {
    return 40;
  }

  public async getKeyBlockPurpose(loader: ESPLoader, keyBlock: number): Promise<number> {
    if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) {
      throw new Error(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
    }

    const regShiftDictionary = [
      [this.EFUSE_PURPOSE_KEY0_REG, this.EFUSE_PURPOSE_KEY0_SHIFT],
      [this.EFUSE_PURPOSE_KEY1_REG, this.EFUSE_PURPOSE_KEY1_SHIFT],
      [this.EFUSE_PURPOSE_KEY2_REG, this.EFUSE_PURPOSE_KEY2_SHIFT],
      [this.EFUSE_PURPOSE_KEY3_REG, this.EFUSE_PURPOSE_KEY3_SHIFT],
      [this.EFUSE_PURPOSE_KEY4_REG, this.EFUSE_PURPOSE_KEY4_SHIFT],
    ];
    const [reg, shift] = regShiftDictionary[keyBlock];
    const registerValue = await loader.readReg(reg);
    return (registerValue >> shift) & 0x1f;
  }

  public async isFlashEncryptionKeyValid(loader: ESPLoader): Promise<boolean> {
    const purposes = [];
    for (let i = 0; i <= this.EFUSE_MAX_KEY; i++) {
      purposes.push(await this.getKeyBlockPurpose(loader, i));
    }

    if (purposes.some((p) => p === this.PURPOSE_VAL_XTS_AES128_KEY)) {
      return true;
    }

    if (
      purposes.some((p) => p === this.PURPOSE_VAL_XTS_AES256_KEY_1) &&
      purposes.some((p) => p === this.PURPOSE_VAL_XTS_AES256_KEY_2)
    ) {
      return true;
    }

    const registerValue = await loader.readReg(this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG);
    return (
      ((registerValue >> this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT) & this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY) !== 0
    );
  }

  public checkSpiConnection(loader: ESPLoader, spiConnection: number[]): void {
    if (!spiConnection.every((pin) => pin >= 0 && pin <= 60)) {
      throw new Error("SPI Pin numbers must be in the range 0-60.");
    }
    if (spiConnection.some((pin) => pin === 33 || pin === 34)) {
      loader.info(
        "GPIO pins 33 and 34 are used by USB-Serial/JTAG, " + "consider using other pins for SPI flash connection.",
      );
    }
  }

  public async postConnect(loader: ESPLoader): Promise<void> {
    // Python uses_usb_otg(): Espressif VID + IMAGE_CHIP_ID as USB-OTG PID
    if (await loader.usesUsbOtg()) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
    // C3 _post_connect disables watchdogs on USB-Serial/JTAG. Skip when a stub
    // is already running or register reads are refused in secure download mode.
    if (!loader.IS_STUB && !loader.detectedRunningStub() && !loader.secureDownloadMode) {
      await this.disableWatchdogs(loader);
    }
  }

  /**
   * USB-Serial/JTAG does not reset the RTC watchdog or super watchdog, so they
   * can reset the board during flashing. Detect the port by VID/PID, not the
   * inherited C5 UARTDEV_BUF_NO address.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  public async disableWatchdogs(loader: ESPLoader): Promise<void> {
    if (!loader.usesUsbJtagSerial()) {
      return;
    }

    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY);
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, 0);
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0);

    await loader.writeReg(this.RTC_CNTL_SWD_WPROTECT_REG, this.RTC_CNTL_SWD_WKEY);
    const swdConfReg = await loader.readReg(this.RTC_CNTL_SWD_CONF_REG);
    await loader.writeReg(this.RTC_CNTL_SWD_CONF_REG, swdConfReg | this.RTC_CNTL_SWD_AUTO_FEED_EN);
    await loader.writeReg(this.RTC_CNTL_SWD_WPROTECT_REG, 0);
  }

  /**
   * Reset via the LP watchdog. RTS does not reset the chip in USB-OTG mode.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  public async watchdogReset(loader: ESPLoader): Promise<void> {
    loader.info("Hard resetting with a watchdog...");
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY);
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG1_REG, 2000);
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, (1 << 31) | (5 << 28) | (1 << 8) | 2);
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  public async changeBaud(loader: ESPLoader): Promise<void> {
    await loader.changeBaud();
  }
}
