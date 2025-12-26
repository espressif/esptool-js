import { ESPLoader } from "../esploader.js";
import { ESP32ROM } from "./esp32.js";
import { MemoryMapEntry } from "./rom.js";

export class ESP32P4ROM extends ESP32ROM {
  public CHIP_NAME = "ESP32-P4";
  public IMAGE_CHIP_ID = 18;

  public IROM_MAP_START = 0x40000000;
  public IROM_MAP_END = 0x4c000000;
  public DROM_MAP_START = 0x40000000;
  public DROM_MAP_END = 0x4c000000;

  public BOOTLOADER_FLASH_OFFSET = 0x2000; // First 2 sectors are reserved for FE purposes

  public CHIP_DETECT_MAGIC_VALUE = [0x0, 0x0addbad0];

  public UART_DATE_REG_ADDR = 0x500ca000 + 0x8c;

  public EFUSE_BASE = 0x5012d000;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;

  public SPI_REG_BASE = 0x5008d000; // SPIMEM1
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;
  public SPI_W0_OFFS = 0x58;

  public SPI_ADDR_REG_MSB = false;

  public USES_MAGIC_VALUE = false;

  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address

  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 9;
  public FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;

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

  public PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
  public PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
  public PURPOSE_VAL_XTS_AES128_KEY = 4;

  public SUPPORTS_ENCRYPTED_FLASH = true;

  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public USB_RAM_BLOCK = 0x800; // Max block size USB-OTG is used

  public GPIO_STRAP_REG = 0x500e0038;
  public GPIO_STRAP_SPI_BOOT_MASK = 0x8; // Not download mode
  public RTC_CNTL_OPTION1_REG = 0x50110008;
  public RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK = 0x4; // Is download mode forced over USB?

  // Flash power-on related registers and bits needed for ECO6
  public DR_REG_LPAON_BASE = 0x50110000;
  public DR_REG_PMU_BASE = this.DR_REG_LPAON_BASE + 0x5000;
  public DR_REG_LP_SYS_BASE = this.DR_REG_LPAON_BASE + 0x0;
  public LP_SYSTEM_REG_ANA_XPD_PAD_GROUP_REG = this.DR_REG_LP_SYS_BASE + 0x10c;
  public PMU_EXT_LDO_P0_0P1A_ANA_REG = this.DR_REG_PMU_BASE + 0x1bc;
  public PMU_ANA_0P1A_EN_CUR_LIM_0 = 1 << 27;
  public PMU_EXT_LDO_P0_0P1A_REG = this.DR_REG_PMU_BASE + 0x1b8;
  public PMU_0P1A_TARGET0_0 = 0xff << 23;
  public PMU_0P1A_FORCE_TIEH_SEL_0 = 1 << 7;
  public PMU_DATE_REG = this.DR_REG_PMU_BASE + 0x3fc;

  // The value from UARTDEV_BUF_NO when USB-OTG is used
  public UARTDEV_BUF_NO_USB_OTG = 5;

  // The value from UARTDEV_BUF_NO when USB-JTAG/Serial is used
  public UARTDEV_BUF_NO_USB_JTAG_SERIAL = 6;

  // Watchdog related registers
  public DR_REG_LP_WDT_BASE = 0x50116000;
  public RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0; // LP_WDT_CONFIG0_REG
  public RTC_CNTL_WDTCONFIG1_REG = this.DR_REG_LP_WDT_BASE + 0x0004; // LP_WDT_CONFIG1_REG
  public RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0018; // LP_WDT_WPROTECT_REG
  public RTC_CNTL_WDT_WKEY = 0x50d83aa1;

  public RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x001c; // RTC_WDT_SWD_CONFIG_REG
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 18;
  public RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0020; // RTC_WDT_SWD_WPROTECT_REG
  public RTC_CNTL_SWD_WKEY = 0x50d83aa1; // RTC_WDT_SWD_WKEY, same as WDT key in this case

  public MEMORY_MAP: MemoryMapEntry[] = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x40000000, 0x4c000000, "DROM"],
    [0x4ff00000, 0x4ffa0000, "DRAM"],
    [0x4ff00000, 0x4ffa0000, "BYTE_ACCESSIBLE"],
    [0x4fc00000, 0x4fc20000, "DROM_MASK"],
    [0x4fc00000, 0x4fc20000, "IROM_MASK"],
    [0x40000000, 0x4c000000, "IROM"],
    [0x4ff00000, 0x4ffa0000, "IRAM"],
    [0x50108000, 0x50110000, "RTC_IRAM"],
    [0x50108000, 0x50110000, "RTC_DRAM"],
    [0x600fe000, 0x60100000, "MEM_INTERNAL2"],
  ];

  public UF2_FAMILY_ID = 0x3d308e94;

  public EFUSE_MAX_KEY = 5;
  public KEY_PURPOSES = {
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
  };

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    return (registerValue >> 20) & 0x07;
  }

  public async getMinorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    return (registerValue >> 0) & 0x0f;
  }

  public async getMajorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    return (((registerValue >> 23) & 1) << 2) | ((registerValue >> 4) & 0x03);
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    // ESP32-P4 uses major and minor version, but getChipRevision returns a combined value
    // For compatibility, we'll return major version * 100 + minor version
    const major = await this.getMajorChipVersion(loader);
    const minor = await this.getMinorChipVersion(loader);
    return major * 100 + minor;
  }

  public async getStubJsonPath(loader: ESPLoader): Promise<string> {
    const chipRevision = await this.getChipRevision(loader);
    if (chipRevision < 300) {
      return "./targets/stub_flasher/stub_flasher_32p4rc1.json";
    } else {
      return "./targets/stub_flasher/stub_flasher_32p4.json";
    }
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVersion = await this.getPkgVersion(loader);
    const chipNameMap: { [key: number]: string } = {
      0: "ESP32-P4",
    };
    const chipName = chipNameMap[pkgVersion] || "Unknown ESP32-P4";
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${chipName} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    return ["High-Performance MCU"];
  }

  public async getCrystalFreq(loader: ESPLoader): Promise<number> {
    return 40; // ESP32P4 XTAL is fixed to 40MHz
  }

  public async getFlashVoltage(loader: ESPLoader) {
    return;
  }

  public async overrideVddsdio(loader: ESPLoader) {
    loader.debug("VDD_SDIO overrides are not supported for ESP32-P4");
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

  public async getFlashCryptConfig(loader: ESPLoader) {
    return; // doesn't exist on ESP32-P4
  }

  public async getSecureBootEnabled(loader: ESPLoader) {
    const registerValue = await loader.readReg(this.EFUSE_SECURE_BOOT_EN_REG);
    return (registerValue & this.EFUSE_SECURE_BOOT_EN_MASK) !== 0;
  }

  /**
   * Get the UARTDEV_BUF_NO address based on chip revision
   * Variable .bss.UartDev.buff_uart_no in ROM .bss which indicates the port in use.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {number} The UARTDEV_BUF_NO address.
   */
  public async getUartdevBufNo(loader: ESPLoader): Promise<number> {
    const BUF_UART_NO_OFFSET = 24;
    const chipRev = await this.getChipRevision(loader);
    const BSS_UART_DEV_ADDR = chipRev < 300 ? 0x4ff3feb0 : 0x4ffbfeb0;
    return BSS_UART_DEV_ADDR + BUF_UART_NO_OFFSET;
  }

  /**
   * Check the UARTDEV_BUF_NO register to see if USB-OTG console is being used
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {boolean} True if USB-OTG console is being used, false otherwise.
   */
  public async usesUsbOtg(loader: ESPLoader): Promise<boolean> {
    const uartBufNoAddr = await this.getUartdevBufNo(loader);
    const uartNo = (await loader.readReg(uartBufNoAddr)) & 0xff;
    return uartNo === this.UARTDEV_BUF_NO_USB_OTG;
  }

  /**
   * Check the UARTDEV_BUF_NO register to see if USB-JTAG/Serial is being used
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {boolean} True if USB-JTAG/Serial is being used, false otherwise.
   */
  public async usesUsbJtagSerial(loader: ESPLoader): Promise<boolean> {
    // Can't detect USB-JTAG/Serial in secure download mode
    // Note: secure_download_mode check would need to be added to ESPLoader if needed
    // if (loader.secureDownloadMode) {
    //   return false;
    // }
    const uartBufNoAddr = await this.getUartdevBufNo(loader);
    const uartNo = (await loader.readReg(uartBufNoAddr)) & 0xff;
    return uartNo === this.UARTDEV_BUF_NO_USB_JTAG_SERIAL;
  }

  public async getKeyBlockPurpose(loader: ESPLoader, keyBlock: number) {
    if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) {
      loader.debug(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
      return;
    }

    const regShiftDictionary = [
      [this.EFUSE_PURPOSE_KEY0_REG, this.EFUSE_PURPOSE_KEY0_SHIFT],
      [this.EFUSE_PURPOSE_KEY1_REG, this.EFUSE_PURPOSE_KEY1_SHIFT],
      [this.EFUSE_PURPOSE_KEY2_REG, this.EFUSE_PURPOSE_KEY2_SHIFT],
      [this.EFUSE_PURPOSE_KEY3_REG, this.EFUSE_PURPOSE_KEY3_SHIFT],
      [this.EFUSE_PURPOSE_KEY4_REG, this.EFUSE_PURPOSE_KEY4_SHIFT],
      [this.EFUSE_PURPOSE_KEY5_REG, this.EFUSE_PURPOSE_KEY5_SHIFT],
    ];
    const [reg, shift] = regShiftDictionary[keyBlock];

    const registerValue = await loader.readReg(reg);
    return (registerValue >> shift) & 0xf;
  }

  public async isFlashEncryptionKeyValid(loader: ESPLoader) {
    // Need to see either an AES-128 key or two AES-256 keys
    const purposes = [];
    for (let i = 0; i <= this.EFUSE_MAX_KEY; i++) {
      const purpose = await this.getKeyBlockPurpose(loader, i);
      purposes.push(purpose);
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

    // Check if force use key manager key is set
    const registerValue = await loader.readReg(this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG);
    return (
      ((registerValue >> this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT) & this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY) !== 0
    );
  }

  /**
   * Function to be executed after chip connection
   * Sets ESP_RAM_BLOCK if USB OTG is used and disables watchdogs if needed
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  public async postConnect(loader: ESPLoader) {
    if (await this.usesUsbOtg(loader)) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
    // Disable watchdogs if not in stub mode (stub manages its own watchdogs)
    // Note: syncStubDetected is private in ESPLoader, but postConnect is called
    // before runStub(), so we're in ROM mode at this point
    if (!loader.IS_STUB) {
      await this.disableWatchdogs(loader);
    }
  }

  /**
   * Disable watchdogs when USB-JTAG/Serial is used
   * The RTC WDT and SWD watchdog are not reset and can reset the board during flashing
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  public async disableWatchdogs(loader: ESPLoader) {
    if (await this.usesUsbJtagSerial(loader)) {
      // Disable RTC WDT
      await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY);
      await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, 0);
      await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0);

      // Automatically feed SWD
      await loader.writeReg(this.RTC_CNTL_SWD_WPROTECT_REG, this.RTC_CNTL_SWD_WKEY);
      const swdConfReg = await loader.readReg(this.RTC_CNTL_SWD_CONF_REG);
      await loader.writeReg(this.RTC_CNTL_SWD_CONF_REG, swdConfReg | this.RTC_CNTL_SWD_AUTO_FEED_EN);
      await loader.writeReg(this.RTC_CNTL_SWD_WPROTECT_REG, 0);
    }
  }

  /**
   * Check SPI connection pin numbers
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @param {number[]} spiConnection - The SPI connection pin numbers.
   */
  public checkSpiConnection(loader: ESPLoader, spiConnection: number[]) {
    if (!spiConnection.every((pin) => pin >= 0 && pin <= 54)) {
      throw new Error("SPI Pin numbers must be in the range 0-54.");
    }
    if (spiConnection.some((pin) => pin === 24 || pin === 25)) {
      loader.debug(
        "GPIO pins 24 and 25 are used by USB-Serial/JTAG, " + "consider using other pins for SPI flash connection.",
      );
    }
  }

  /**
   * Reset the chip using watchdog
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  public async watchdogReset(loader: ESPLoader) {
    loader.info("Hard resetting with a watchdog...");
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY); // unlock
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG1_REG, 2000); // set WDT timeout
    await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, (1 << 31) | (5 << 28) | (1 << 8) | 2); // enable WDT
    await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0); // lock
    await new Promise((resolve) => setTimeout(resolve, 500)); // wait for reset to take effect
  }

  /**
   * Power on the flash chip by setting the appropriate registers
   * Required for ECO6+ when default flash voltage changed from 1.8V to 3.3V
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  public async powerOnFlash(loader: ESPLoader) {
    // Note: secure_download_mode check would need to be added to ESPLoader if needed
    // if (loader.secureDownloadMode) {
    //   throw new Error("Powering on flash in secure download mode");
    // }

    const chipRev = await this.getChipRevision(loader);
    if (chipRev <= 300) {
      // <=ECO5: The flash chip is powered off by default on >=ECO6, when the default flash
      // voltage changed from 1.8V to 3.3V. This is to prevent damage to 1.8V flash
      // chips. Board designers must set the appropriate voltage level in eFuse.
      return;
    }

    // Power up pad group
    await loader.writeReg(this.LP_SYSTEM_REG_ANA_XPD_PAD_GROUP_REG, 1);
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Flash power up sequence
    let regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG);
    await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG, regValue | this.PMU_ANA_0P1A_EN_CUR_LIM_0);

    regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
    await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue | this.PMU_0P1A_FORCE_TIEH_SEL_0);

    regValue = await loader.readReg(this.PMU_DATE_REG);
    await loader.writeReg(this.PMU_DATE_REG, regValue | (3 << 0));
    await new Promise((resolve) => setTimeout(resolve, 50)); // 0.05 seconds = 50ms

    regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG);
    await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG, regValue & ~this.PMU_ANA_0P1A_EN_CUR_LIM_0);

    regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
    await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue & ~this.PMU_0P1A_TARGET0_0);

    // Update eFuse voltage to PMU
    regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
    await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue | 0x80);

    regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
    await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue & ~this.PMU_0P1A_FORCE_TIEH_SEL_0);
    await new Promise((resolve) => setTimeout(resolve, 1800)); // 1.8 seconds = 1800ms
  }
}
