import { ESPLoader } from "../esploader.js";
import { ESP32C6ROM } from "./esp32c6.js";

export class ESP32H2ROM extends ESP32C6ROM {
  public CHIP_NAME = "ESP32-H2";
  public IMAGE_CHIP_ID = 16;
  public CHIP_DETECT_MAGIC_VALUE = [0xd7b73e80];

  public DR_REG_LP_WDT_BASE = 0x600b1c00;
  public RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0; // LP_WDT_RWDT_CONFIG0_REG
  public RTC_CNTL_WDTCONFIG1_REG = this.DR_REG_LP_WDT_BASE + 0x0004; // LP_WDT_RWDT_CONFIG1_REG
  public RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x001c; // LP_WDT_RWDT_WPROTECT_REG

  public RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x0020; // LP_WDT_SWD_CONFIG_REG
  public RTC_CNTL_SWD_AUTO_FEED_EN = 1 << 18;
  public RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0024; // LP_WDT_SWD_WPROTECT_REG
  public RTC_CNTL_SWD_WKEY = 0x50d83aa1; // LP_WDT_SWD_WKEY, same as WDT key in this case

  public FLASH_FREQUENCY = {
    "48m": 0xf,
    "24m": 0x0,
    "16m": 0x1,
    "12m": 0x2,
  };

  public UF2_FAMILY_ID = 0x332726f6;

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
  };

  public async getPkgVersion(loader: ESPLoader) {
    const numWord = 4;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 0) & 0x07;
  }

  public async get_minorChipVersion(loader: ESPLoader) {
    const numWord = 3;
    return (await loader.readReg(this.EFUSE_BLOCK1_ADDR + (4 * numWord)) >> 18) & 0x07;
  }

  public async getMajorChipVersion(loader: ESPLoader) {
    const numWord = 3;
    return (await loader.readReg(this.EFUSE_BLOCK1_ADDR + (4 * numWord)) >> 21) & 0x03;
  }

  public async getChipDescription(loader: ESPLoader) {
    const chipDesc: { [key: number]: string } = {
      0: "ESP32-H2",
    };
    const chipIndex = await this.getPkgVersion(loader);
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${chipDesc[chipIndex] || "unknown ESP32-H2"} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader) {
    return ["BLE", "IEEE802.15.4"];
  }

  public async getCrystalFreq(loader: ESPLoader) {
    // ESP32H2 XTAL is fixed to 32MHz
    return 32;
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
  public async hardReset(loader: ESPLoader) {
    return await loader.hardReset();
  }
}
