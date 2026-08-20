import { ESPLoader } from "../esploader.js";
import { ESP32C5ROM } from "./esp32c5.js";
import { MemoryMapEntry } from "./rom.js";

export class ESP32S31ROM extends ESP32C5ROM {
  public CHIP_NAME = "ESP32-S31";
  public IMAGE_CHIP_ID = 32;

  public IROM_MAP_START = 0x40000000;
  public IROM_MAP_END = 0x54000000;
  public DROM_MAP_START = 0x40000000;
  public DROM_MAP_END = 0x54000000;

  public BOOTLOADER_FLASH_OFFSET = 0x2000;

  public UART_DATE_REG_ADDR = 0x2038a08c;

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

  public UF2_FAMILY_ID = 0x3101f7c1;
  public USB_RAM_BLOCK = 0x800;

  public EFUSE_MAX_KEY = 4;
  public KEY_PURPOSES: { [key: number]: string } = {
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
    const numWord = 4; // EFUSE_RD_MAC_SYS4_REG
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 6) & 0x03;
  }

  public async getMinorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3; // EFUSE_RD_MAC_SYS3_REG
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 18) & 0x0f;
  }

  public async getMajorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3; // EFUSE_RD_MAC_SYS3_REG
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 22) & 0x03;
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVer = await this.getPkgVersion(loader);
    const chipName: { [key: number]: string } = {
      0: "ESP32-S31",
    };
    const desc = chipName[pkgVer] || "unknown ESP32-S31";
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${desc} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    return ["Wi-Fi 6", "BT 5.4 (LE)", "IEEE802.15.4", "Dual Core + LP Core", "300MHz"];
  }

  public async getCrystalFreq(loader: ESPLoader): Promise<number> {
    // ESP32-S31 XTAL is fixed to 40MHz
    return 40;
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async readMac(loader: ESPLoader): Promise<string> {
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

  public async postConnect(loader: ESPLoader) {
    // If using USB-OTG, reduce RAM block size
    const bufNo = (await loader.readReg(this.UARTDEV_BUF_NO)) & 0xff;
    if (bufNo === 3) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
  }

  public getEraseSize(offset: number, size: number) {
    return size;
  }
}
