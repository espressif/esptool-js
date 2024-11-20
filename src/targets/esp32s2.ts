import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";

export class ESP32S2ROM extends ROM {
  public CHIP_NAME = "ESP32-S2";
  public IMAGE_CHIP_ID = 2;
  public IROM_MAP_START = 0x40080000;
  public IROM_MAP_END = 0x40b80000;
  public DROM_MAP_START = 0x3f000000;
  public DROM_MAP_END = 0x3f3f0000;

  public CHIP_DETECT_MAGIC_VALUE = [0x000007c6];

  public SPI_REG_BASE = 0x3f402000;
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;
  public SPI_W0_OFFS = 0x58;

  public SPI_ADDR_REG_MSB = false;

  public MAC_EFUSE_REG = 0x3f41a044; // ESP32-S2 has special block for MAC efuses

  public UART_CLKDIV_REG = 0x3f400014;

  public SUPPORTS_ENCRYPTED_FLASH = true;

  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  // todo: use espefuse APIs to get this info
  public EFUSE_BASE = 0x3f41a000;
  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  public EFUSE_BLOCK2_ADDR = this.EFUSE_BASE + 0x05c;

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
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 19;

  public EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
  public EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 18;

  public EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
  public EFUSE_SECURE_BOOT_EN_MASK = 1 << 20;

  public EFUSE_RD_REPEAT_DATA3_REG = this.EFUSE_BASE + 0x3c;
  public EFUSE_RD_REPEAT_DATA3_REG_FLASH_TYPE_MASK = 1 << 9;

  public PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
  public PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
  public PURPOSE_VAL_XTS_AES128_KEY = 4;

  public UARTDEV_BUF_NO = 0x3ffffd14; // Variable in ROM .bss which indicates the port in use
  public UARTDEV_BUF_NO_USB_OTG = 2; // Value of the above indicating that USB-OTG is in use

  public USB_RAM_BLOCK = 0x800; // Max block size USB-OTG is used

  public GPIO_STRAP_REG = 0x3f404038;
  public GPIO_STRAP_SPI_BOOT_MASK = 1 << 3; // Not download mode
  public GPIO_STRAP_VDDSPI_MASK = 1 << 4;
  public RTC_CNTL_OPTION1_REG = 0x3f408128;
  public RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK = 0x1; // Is download mode forced over USB?

  public RTCCNTL_BASE_REG = 0x3f408000;
  public RTC_CNTL_WDTCONFIG0_REG = this.RTCCNTL_BASE_REG + 0x0094;
  public RTC_CNTL_WDTCONFIG1_REG = this.RTCCNTL_BASE_REG + 0x0098;
  public RTC_CNTL_WDTWPROTECT_REG = this.RTCCNTL_BASE_REG + 0x00ac;
  public RTC_CNTL_WDT_WKEY = 0x50d83aa1;

  public MEMORY_MAP = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x3f000000, 0x3ff80000, "DROM"],
    [0x3f500000, 0x3ff80000, "EXTRAM_DATA"],
    [0x3ff9e000, 0x3ffa0000, "RTC_DRAM"],
    [0x3ff9e000, 0x40000000, "BYTE_ACCESSIBLE"],
    [0x3ff9e000, 0x40072000, "MEM_INTERNAL"],
    [0x3ffb0000, 0x40000000, "DRAM"],
    [0x40000000, 0x4001a100, "IROM_MASK"],
    [0x40020000, 0x40070000, "IRAM"],
    [0x40070000, 0x40072000, "RTC_IRAM"],
    [0x40080000, 0x40800000, "IROM"],
    [0x50000000, 0x50002000, "RTC_DATA"],
  ];

  public EFUSE_VDD_SPI_REG = this.EFUSE_BASE + 0x34;
  public VDD_SPI_XPD = 1 << 4;
  public VDD_SPI_TIEH = 1 << 5;
  public VDD_SPI_FORCE = 1 << 6;

  public UF2_FAMILY_ID = 0xbfdd4eee;

  public EFUSE_MAX_KEY = 5;
  public KEY_PURPOSES = {
    0: "USER/EMPTY",
    1: "RESERVED",
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
  };

  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x60000078;

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0x1000;

  public FLASH_SIZES = {
    "1MB": 0x00,
    "2MB": 0x10,
    "4MB": 0x20,
    "8MB": 0x30,
    "16MB": 0x40,
  };

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const word = await loader.readReg(addr);
    const pkgVersion = (word >> 0) & 0x0f;
    return pkgVersion;
  }

  public async getMinorChipVersion(loader: ESPLoader) {
    const hiNumWord = 3;
    const hi = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * hiNumWord)) >> 20) & 0x01;
    const lowNumWord = 4;
    const low = ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * lowNumWord)) >> 4) & 0x07;
    return (hi << 3) + low;
  }

  public async getMajorChipVersion(loader: ESPLoader) {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 18) & 0x03;
  }

  public async getFlashVersion(loader: ESPLoader) {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 21) & 0x0f;
  }

  public async getChipDescription(loader: ESPLoader) {
    const chipDesc: { [key: number]: string } = {
      0: "ESP32-S2",
      1: "ESP32-S2FH2",
      2: "ESP32-S2FH4",
      102: "ESP32-S2FNR2",
      100: "ESP32-S2R2",
    };
    const chipIndex = (await this.getFlashCap(loader)) + (await this.getPsramCap(loader)) * 100;
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${chipDesc[chipIndex] || "unknown ESP32-S2"} (revision v${majorRev}.${minorRev})`;
  }

  public async getFlashCap(loader: ESPLoader): Promise<number> {
    return await this.getFlashVersion(loader);
  }

  public async getPsramVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const psramCap = (registerValue >> 28) & 0x0f;
    return psramCap;
  }

  public async getPsramCap(loader: ESPLoader): Promise<number> {
    return await this.getPsramVersion(loader);
  }

  public async getBlock2Version(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    const addr = this.EFUSE_BLOCK2_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const block2Ver = (registerValue >> 4) & 0x07;
    return block2Ver;
  }

  public async getChipFeatures(loader: ESPLoader) {
    const features: string[] = ["Wi-Fi"];

    const flashMap: { [key: number]: string | null } = {
      0: "No Embedded Flash",
      1: "Embedded Flash 2MB",
      2: "Embedded Flash 4MB",
    };
    const flashCap = await this.getFlashCap(loader);
    const flashDescription = flashMap[flashCap] || "Unknown Embedded Flash";
    features.push(flashDescription);

    const psramMap: { [key: number]: string | null } = {
      0: "No Embedded Flash",
      1: "Embedded PSRAM 2MB",
      2: "Embedded PSRAM 4MB",
    };
    const psramCap = await this.getPsramCap(loader);
    const psramDescription = psramMap[psramCap] || "Unknown Embedded PSRAM";
    features.push(psramDescription);

    const block2VersionMap: { [key: number]: string | null } = {
      0: "No calibration in BLK2 of efuse",
      1: "ADC and temperature sensor calibration in BLK2 of efuse V1",
      2: "ADC and temperature sensor calibration in BLK2 of efuse V2",
    };
    const block2Ver = await this.getBlock2Version(loader);
    const block2VersionDescription = block2VersionMap[block2Ver] || "Unknown Calibration in BLK2";
    features.push(block2VersionDescription);

    return features;
  }

  public async getCrystalFreq(loader: ESPLoader) {
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
}
