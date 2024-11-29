import { ESPLoader } from "../esploader.js";
import { ESP32C3ROM } from "./esp32c3.js";

export class ESP32C6ROM extends ESP32C3ROM {
  public CHIP_NAME = "ESP32-C6";
  public IMAGE_CHIP_ID = 13;
  public EFUSE_BASE = 0x600b0800;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x3ff40014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x6000007c;

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

  public UARTDEV_BUF_NO = 0x4087f580; // Variable in ROM .bss which indicates the port in use
  public UARTDEV_BUF_NO_USB_JTAG_SERIAL = 3; // The above var when USB-JTAG/Serial is used

  public DR_REG_LP_WDT_BASE = 0x600b1c00;

  public RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0; // LP_WDT_RWDT_CONFIG0_REG
  public RTC_CNTL_WDTCONFIG1_REG = this.DR_REG_LP_WDT_BASE + 0x0004; // LP_WDT_RWDT_CONFIG1_REG
  public RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0018; // LP_WDT_RWDT_WPROTECT_REG

  public RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x001c; // LP_WDT_SWD_CONFIG_REG
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 18;
  public RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0020; // LP_WDT_SWD_WPROTECT_REG
  public RTC_CNTL_SWD_WKEY = 0x50d83aa1; // LP_WDT_SWD_WKEY, same as WDT key in this case

  public IROM_MAP_START = 0x42000000;
  public IROM_MAP_END = 0x42800000;
  public DROM_MAP_START = 0x42800000;
  public DROM_MAP_END = 0x43000000;

  // Magic value for ESP32C6
  CHIP_DETECT_MAGIC_VALUE = [0x2ce0806f];

  EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;

  EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address

  EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
  EFUSE_PURPOSE_KEY0_SHIFT = 24;
  EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
  EFUSE_PURPOSE_KEY1_SHIFT = 28;
  EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
  EFUSE_PURPOSE_KEY2_SHIFT = 0;
  EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
  EFUSE_PURPOSE_KEY3_SHIFT = 4;
  EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
  EFUSE_PURPOSE_KEY4_SHIFT = 8;
  EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
  EFUSE_PURPOSE_KEY5_SHIFT = 12;

  EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
  EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 20;

  EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
  EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 18;

  EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
  EFUSE_SECURE_BOOT_EN_MASK = 1 << 20;

  PURPOSE_VAL_XTS_AES128_KEY = 4;

  SUPPORTS_ENCRYPTED_FLASH = true;

  FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public async getPkgVersion(loader: ESPLoader) {
    const numWord = 3;
    const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
    const word3 = await loader.readReg(addr);
    const pkgVersion = (word3 >> 24) & 0x07;
    return pkgVersion;
  }

  public async getChipRevision(loader: ESPLoader) {
    const block1Addr = this.EFUSE_BASE + 0x044;
    const numWord = 3;
    const pos = 18;
    const addr = block1Addr + 4 * numWord;
    const ret = ((await loader.readReg(addr)) & (0x7 << pos)) >> pos;
    return ret;
  }

  public async getMinorChipVersion(loader: ESPLoader) {
    const numWord = 3;
    const regValue = await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord);
    return (regValue >> 18) & 0x0f;
  }

  public async getMajorChipVersion(loader: ESPLoader) {
    const numWord = 3;
    const regValue = await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord);
    return (regValue >> 22) & 0x03;
  }

  public async getChipDescription(loader: ESPLoader) {
    const pkgVer = await this.getPkgVersion(loader);
    const chipDesc: { [key: number]: string } = {
      0: "ESP32-C6 (QFN40)",
      1: "ESP32-C6FH4 (QFN32)",
    };
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${chipDesc[pkgVer] || "unknown ESP32-C6"} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures() {
    return ["Wi-Fi 6", "BT 5", "IEEE802.15.4"];
  }

  public async getCrystalFreq() {
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
