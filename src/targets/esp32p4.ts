import { ESPLoader } from "../esploader.js";
import { ESP32ROM } from "./esp32.js";
import ESP32P4_STUB from "./stub_flasher/stub_flasher_32p4.json";

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

  public PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
  public PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
  public PURPOSE_VAL_XTS_AES128_KEY = 4;

  public SUPPORTS_ENCRYPTED_FLASH = true;

  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public MEMORY_MAP = [
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

  public TEXT_START = ESP32P4_STUB.text_start;
  public ENTRY = ESP32P4_STUB.entry;
  public DATA_START = ESP32P4_STUB.data_start;
  public ROM_DATA = ESP32P4_STUB.data;
  public ROM_TEXT = ESP32P4_STUB.text;

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 2;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    return (registerValue >> 27) & 0x07;
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
    return (registerValue >> 4) & 0x03;
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVersion = await this.getPkgVersion(loader);
    const chipName = pkgVersion === 0 ? "ESP32-P4" : "unknown ESP32-P4";
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

  public async getSecureBootEnabled(laoder: ESPLoader) {
    const registerValue = await laoder.readReg(this.EFUSE_SECURE_BOOT_EN_REG);
    return registerValue & this.EFUSE_SECURE_BOOT_EN_MASK;
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
    const purposes = [];
    for (let i = 0; i <= this.EFUSE_MAX_KEY; i++) {
      const purpose = await this.getKeyBlockPurpose(loader, i);
      purposes.push(purpose);
    }
    const isXtsAes128Key = purposes.find((p) => p === this.PURPOSE_VAL_XTS_AES128_KEY);
    if (typeof isXtsAes128Key !== undefined) {
      return true;
    }
    const isXtsAes256Key1 = purposes.find((p) => p === this.PURPOSE_VAL_XTS_AES256_KEY_1);
    const isXtsAes256Key2 = purposes.find((p) => p === this.PURPOSE_VAL_XTS_AES256_KEY_2);
    if (typeof isXtsAes256Key1 !== undefined && typeof isXtsAes256Key2 !== undefined) {
      return true;
    }
    return false;
  }
}
