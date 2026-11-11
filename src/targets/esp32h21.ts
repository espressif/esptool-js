import { ESPLoader } from "../esploader.js";
import { ESP32H2ROM } from "./esp32h2.js";
import { MemoryMapEntry } from "./rom.js";

export class ESP32H21ROM extends ESP32H2ROM {
  public CHIP_NAME = "ESP32-H21";
  public IMAGE_CHIP_ID = 25;
  public USES_MAGIC_VALUE = false;

  public UF2_FAMILY_ID = 0xb6dd00af;

  public IROM_MAP_START = 0x42000000;
  public IROM_MAP_END = 0x43000000;
  public DROM_MAP_START = 0x42000000;
  public DROM_MAP_END = 0x43000000;

  public UART_DATE_REG_ADDR = 0x60000000 + 0x8c;

  public FLASH_FREQUENCY: { [key: string]: number } = {
    "48m": 0xf,
    "24m": 0x0,
  };

  public MEMORY_MAP: MemoryMapEntry[] = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x42000000, 0x43000000, "DROM"],
    [0x40800000, 0x40850000, "DRAM"],
    [0x40800000, 0x40850000, "BYTE_ACCESSIBLE"],
    [0x40000000, 0x40020000, "DROM_MASK"],
    [0x40000000, 0x40020000, "IROM_MASK"],
    [0x42000000, 0x43000000, "IROM"],
    [0x40800000, 0x40850000, "IRAM"],
    [0x50000000, 0x50001000, "RTC_IRAM"],
    [0x50000000, 0x50001000, "RTC_DRAM"],
    [0x40800000, 0x40850000, "MEM_INTERNAL"],
  ];

  public DR_REG_LP_WDT_BASE = 0x600b1c00;
  public RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0;
  public RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x001c;

  public RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x0020;
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 18;
  public RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0024;
  public RTC_CNTL_SWD_WKEY = 0x50d83aa1;

  public EFUSE_BASE = 0x600b4000;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;

  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;

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

  public KEY_PURPOSES: { [key: number]: string } = {
    0: "USER/EMPTY",
    1: "ECDSA_KEY",
    2: "RESERVED",
    4: "XTS_AES_128_KEY",
    5: "HMAC_DOWN_ALL",
    6: "HMAC_DOWN_JTAG",
    7: "HMAC_DOWN_DIGITAL_SIGNATURE",
    8: "HMAC_UP",
    9: "SECURE_BOOT_DIGEST0",
    10: "SECURE_BOOT_DIGEST1",
    11: "SECURE_BOOT_DIGEST2",
  };

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 5;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 11) & 0x07;
  }

  public async getMinorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 5;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 4) & 0x0f;
  }

  public async getMajorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 5;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 8) & 0x03;
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    const major = await this.getMajorChipVersion(loader);
    const minor = await this.getMinorChipVersion(loader);
    return major * 100 + minor;
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVer = await this.getPkgVersion(loader);
    const desc = pkgVer === 0 ? "ESP32-H21" : "Unknown ESP32-H21";
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${desc} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader) {
    return ["BT 5 (LE)", "IEEE802.15.4", "Single Core", "96MHz"];
  }

  public async getCrystalFreq(loader: ESPLoader) {
    return 32;
  }

  public checkSpiConnection(loader: ESPLoader, spiConnection: number[]): void {
    if (!spiConnection.every((pin) => pin >= 0 && pin <= 27)) {
      throw new Error("SPI Pin numbers must be in the range 0-27.");
    }
    if (spiConnection.some((pin) => pin === 26 || pin === 27)) {
      loader.info(
        "GPIO pins 26 and 27 are used by USB-Serial/JTAG, " + "consider using other pins for SPI flash connection.",
      );
    }
  }
}
