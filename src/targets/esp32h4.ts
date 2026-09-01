import { ESPLoader } from "../esploader.js";
import { ESP32C3ROM } from "./esp32c3.js";
import { MemoryMapEntry } from "./rom.js";

export class ESP32H4ROM extends ESP32C3ROM {
  public CHIP_NAME = "ESP32-H4";
  public IMAGE_CHIP_ID = 28;
  public USES_MAGIC_VALUE = false;

  public IROM_MAP_START = 0x42000000;
  public IROM_MAP_END = 0x42800000;
  public DROM_MAP_START = 0x42800000;
  public DROM_MAP_END = 0x43000000;

  public BOOTLOADER_FLASH_OFFSET = 0x2000;

  public SPI_REG_BASE = 0x60099000;
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;
  public SPI_W0_OFFS = 0x58;

  public UART_DATE_REG_ADDR = 0x60012000 + 0x7c;

  public EFUSE_BASE = 0x600b1800;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;

  public EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;

  public EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY0_SHIFT = 0;
  public EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY1_SHIFT = 5;
  public EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY2_SHIFT = 10;
  public EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY3_SHIFT = 15;
  public EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY4_SHIFT = 20;
  public EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x34;
  public EFUSE_PURPOSE_KEY5_SHIFT = 25;

  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 14;

  public EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x030;
  public EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 23;

  public EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
  public EFUSE_SECURE_BOOT_EN_MASK = 1 << 5;

  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x038;
  public EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 19;
  public FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;

  public PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
  public PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
  public PURPOSE_VAL_XTS_AES128_KEY = 4;

  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public FLASH_FREQUENCY: { [key: string]: number } = {
    "48m": 0xf,
    "24m": 0x0,
    "16m": 0x1,
    "12m": 0x2,
  };

  public MEMORY_MAP: MemoryMapEntry[] = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x42000000, 0x44000000, "DROM"],
    [0x40810000, 0x40860000, "DRAM"],
    [0x40810000, 0x40860000, "BYTE_ACCESSIBLE"],
    [0x40000000, 0x40050000, "DROM_MASK"],
    [0x40000000, 0x40050000, "IROM_MASK"],
    [0x42000000, 0x44000000, "IROM"],
    [0x40810000, 0x40860000, "IRAM"],
    [0x50000000, 0x50004000, "RTC_IRAM"],
    [0x50000000, 0x50004000, "RTC_DRAM"],
    [0x60000000, 0x60100000, "MEM_INTERNAL2"],
  ];

  public UF2_FAMILY_ID = 0x9e0baa8a;

  public EFUSE_MAX_KEY = 5;
  public KEY_PURPOSES: { [key: number]: string } = {
    0: "USER/EMPTY",
    1: "ECDSA_KEY",
    2: "XTS_AES_256_KEY_FLASH_1",
    3: "XTS_AES_256_KEY_FLASH_2",
    4: "XTS_AES_128_KEY",
    5: "HMAC_DOWN_ALL",
    6: "HMAC_DOWN_JTAG",
    7: "HMAC_DOWN_DIGITAL_SIGNATURE",
    8: "HMAC_UP",
    9: "SECURE_BOOT_DIGEST0",
    10: "SECURE_BOOT_DIGEST1",
    11: "SECURE_BOOT_DIGEST2",
    12: "KM_INIT_KEY",
    13: "XTS_AES_256_KEY_PSRAM_1",
    14: "XTS_AES_256_KEY_PSRAM_2",
    15: "XTS_AES_128_KEY_PSRAM",
    16: "ECDSA_KEY_P192",
    17: "ECDSA_KEY_P384_L",
    18: "ECDSA_KEY_P384_H",
  };

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 12) & 0x07;
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
    const desc = pkgVer === 0 ? "ESP32-H4 (QFN40)" : "Unknown ESP32-H4";
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${desc} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    return ["BT 5 (LE)", "IEEE802.15.4", "Dual Core", "96MHz"];
  }

  public async getCrystalFreq(loader: ESPLoader): Promise<number> {
    return 32;
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

  public checkSpiConnection(loader: ESPLoader, spiConnection: number[]): void {
    if (!spiConnection.every((pin) => pin >= 0 && pin <= 39)) {
      throw new Error("SPI Pin numbers must be in the range 0-39.");
    }
    if (spiConnection.some((pin) => pin === 13 || pin === 14)) {
      loader.info(
        "GPIO pins 13 and 14 are used by USB-Serial/JTAG, " + "consider using other pins for SPI flash connection.",
      );
    }
  }
}
