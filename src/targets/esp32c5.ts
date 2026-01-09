import { ESPLoader } from "../esploader";
import { ESP32C6ROM } from "./esp32c6";
import { MemoryMapEntry } from "./rom";

export class ESP32C5ROM extends ESP32C6ROM {
  public CHIP_NAME = "ESP32-C5";
  public IMAGE_CHIP_ID = 23;
  public BOOTLOADER_FLASH_OFFSET = 0x2000;

  public EFUSE_BASE = 0x600b4800;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x60000014;

  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address

  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 10;
  public FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;

  public EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY0_SHIFT = 22;
  public EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY1_SHIFT = 27;
  public EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY2_SHIFT = 0;
  public EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY3_SHIFT = 5;
  public EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY4_SHIFT = 10;
  public EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
  public EFUSE_PURPOSE_KEY5_SHIFT = 15;

  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 20;

  public EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
  public EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 18;

  public EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
  public EFUSE_SECURE_BOOT_EN_MASK = 1 << 20;

  public IROM_MAP_START = 0x42000000;
  public IROM_MAP_END = 0x44000000;
  public DROM_MAP_START = 0x42000000;
  public DROM_MAP_END = 0x44000000;

  public PCR_SYSCLK_CONF_REG = 0x60096110;
  public PCR_SYSCLK_XTAL_FREQ_V = 0x7f << 24;
  public PCR_SYSCLK_XTAL_FREQ_S = 24;

  public XTAL_CLK_DIVIDER = 1;

  public UARTDEV_BUF_NO = 0x4085f514; // Variable in ROM .bss which indicates the port in use

  // Magic value for ESP32C5
  public CHIP_DETECT_MAGIC_VALUE = [0x1101406f, 0x63e1406f, 0x5fd1406f];

  public FLASH_FREQUENCY = {
    "80m": 0xf,
    "40m": 0x0,
    "20m": 0x2,
  };

  public MEMORY_MAP: MemoryMapEntry[] = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x42000000, 0x44000000, "DROM"],
    [0x40800000, 0x40860000, "DRAM"],
    [0x40800000, 0x40860000, "BYTE_ACCESSIBLE"],
    [0x4003a000, 0x40040000, "DROM_MASK"],
    [0x40000000, 0x4003a000, "IROM_MASK"],
    [0x42000000, 0x44000000, "IROM"],
    [0x40800000, 0x40860000, "IRAM"],
    [0x50000000, 0x50004000, "RTC_IRAM"],
    [0x50000000, 0x50004000, "RTC_DRAM"],
    [0x600fe000, 0x60100000, "MEM_INTERNAL2"],
  ];

  UF2_FAMILY_ID = 0xf71c0343;

  EFUSE_MAX_KEY = 5;
  PURPOSE_VAL_XTS_AES128_KEY = 4;
  KEY_PURPOSES: { [key: number]: string } = {
    0: "USER/EMPTY",
    1: "ECDSA_KEY",
    4: "XTS_AES_128_KEY",
    5: "HMAC_DOWN_ALL",
    6: "HMAC_DOWN_JTAG",
    7: "HMAC_DOWN_DIGITAL_SIGNATURE",
    8: "HMAC_UP",
    9: "SECURE_BOOT_DIGEST0",
    10: "SECURE_BOOT_DIGEST1",
    11: "SECURE_BOOT_DIGEST2",
    12: "KM_INIT_KEY",
    15: "XTS_AES_128_PSRAM_KEY",
    16: "ECDSA_KEY_P192",
    17: "ECDSA_KEY_P384_L",
    18: "ECDSA_KEY_P384_H",
  };

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 26) & 0x07;
  }

  public async getMinorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 0) & 0x0f;
  }

  public async getMajorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 4) & 0x03;
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVer = await this.getPkgVersion(loader);
    let desc: string;
    if (pkgVer === 0) {
      desc = "ESP32-C5";
    } else {
      desc = "unknown ESP32-C5";
    }
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${desc} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    return ["Wi-Fi 6 (dual-band)", "BT 5 (LE)", "IEEE802.15.4", "Single Core + LP Core", "240MHz"];
  }

  public async getCrystalFreq(loader: ESPLoader): Promise<number> {
    // The crystal detection algorithm of ESP32/ESP8266
    // works for ESP32-C5 as well.
    const uartDiv = (await loader.readReg(this.UART_CLKDIV_REG)) & this.UART_CLKDIV_MASK;
    const etsXtal = (loader.transport.baudrate * uartDiv) / 1000000 / this.XTAL_CLK_DIVIDER;
    let normXtal;
    if (etsXtal > 45) {
      normXtal = 48;
    } else if (etsXtal > 33) {
      normXtal = 40;
    } else {
      normXtal = 26;
    }
    if (Math.abs(normXtal - etsXtal) > 1) {
      loader.info("WARNING: Unsupported crystal in use");
    }
    return normXtal;
  }

  public async getCrystalFreqRomExpect(loader: ESPLoader) {
    return (
      ((await loader.readReg(this.PCR_SYSCLK_CONF_REG)) & this.PCR_SYSCLK_XTAL_FREQ_V) >> this.PCR_SYSCLK_XTAL_FREQ_S
    );
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
      [this.EFUSE_PURPOSE_KEY5_REG, this.EFUSE_PURPOSE_KEY5_SHIFT],
    ];
    const [reg, shift] = regShiftDictionary[keyBlock];

    const registerValue = await loader.readReg(reg);
    return (registerValue >> shift) & 0x1f;
  }

  public async isFlashEncryptionKeyValid(loader: ESPLoader): Promise<boolean> {
    // Need to see an AES-128 key
    const purposes = [];
    for (let i = 0; i <= this.EFUSE_MAX_KEY; i++) {
      const purpose = await this.getKeyBlockPurpose(loader, i);
      purposes.push(purpose);
    }

    if (purposes.some((p) => p === this.PURPOSE_VAL_XTS_AES128_KEY)) {
      return true;
    }

    const registerValue = await loader.readReg(this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG);
    return (
      ((registerValue >> this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT) & this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY) !== 0
    );
  }

  public checkSpiConnection(loader: ESPLoader, spiConnection: number[]): void {
    if (!spiConnection.every((pin) => pin >= 0 && pin <= 28)) {
      throw new Error("SPI Pin numbers must be in the range 0-28.");
    }
    if (spiConnection.some((pin) => pin === 13 || pin === 14)) {
      loader.info(
        "GPIO pins 13 and 14 are used by USB-Serial/JTAG, " + "consider using other pins for SPI flash connection.",
      );
    }
  }

  public async usesUsbJtagSerial(loader: ESPLoader): Promise<boolean> {
    const uartBufNoAddr = this.UARTDEV_BUF_NO;
    const uartNo = (await loader.readReg(uartBufNoAddr)) & 0xff;
    // ESP32-C5 uses value 3 for USB-JTAG/Serial (similar to ESP32-S3/H2)
    return uartNo === 3;
  }

  public async watchdogReset(loader: ESPLoader): Promise<void> {
    // Watchdog reset disabled in parent (ESP32-C6) ROM, re-enable it
    // This should call the ESP32C3ROM.watchdogReset method
    // Note: This is a placeholder - the actual implementation would need
    // the watchdog registers from ESP32C3ROM
    loader.info("Hard resetting with a watchdog...");
    // TODO: Implement watchdog reset using ESP32C3ROM registers
    throw new Error("watchdogReset not yet implemented for ESP32-C5");
  }

  public async changeBaud(loader: ESPLoader): Promise<void> {
    // Note: secure_download_mode check would need to be added to ESPLoader if needed
    // if (loader.secureDownloadMode) {
    //   loader.info(
    //     "Baud rate change is not supported in secure download mode. " + "Keeping 115200 baud.",
    //   );
    //   return;
    // }
    if (!loader.IS_STUB) {
      const crystalFreqRomExpect = await this.getCrystalFreqRomExpect(loader);
      const crystalFreqDetect = await this.getCrystalFreq(loader);
      loader.info(`ROM expects crystal freq: ${crystalFreqRomExpect} MHz, ` + `detected ${crystalFreqDetect} MHz.`);
      // If detect the XTAL is 48MHz, but the ROM code expects it to be 40MHz
      if (crystalFreqDetect === 48 && crystalFreqRomExpect === 40) {
        loader.info(
          "Crystal frequency mismatch detected. " +
            "Baud rate adjustment may be needed but is not fully implemented in this version.",
        );
      }
      // If detect the XTAL is 40MHz, but the ROM code expects it to be 48MHz
      else if (crystalFreqDetect === 40 && crystalFreqRomExpect === 48) {
        loader.info(
          "Crystal frequency mismatch detected. " +
            "Baud rate adjustment may be needed but is not fully implemented in this version.",
        );
      }
    }
    // Call the standard changeBaud method
    await loader.changeBaud();
  }
}
