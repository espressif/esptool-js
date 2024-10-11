import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";
import ESP32S2_STUB from "./stub_flasher/stub_flasher_32s2.json";

export class ESP32S2ROM extends ROM {
  public CHIP_NAME = "ESP32-S2";
  public IMAGE_CHIP_ID = 2;
  public MAC_EFUSE_REG = 0x3f41a044;
  public EFUSE_BASE = 0x3f41a000;
  public UART_CLKDIV_REG = 0x3f400014;
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

  public SPI_REG_BASE = 0x3f402000;
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_W0_OFFS = 0x58;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;

  public TEXT_START = ESP32S2_STUB.text_start;
  public ENTRY = ESP32S2_STUB.entry;
  public DATA_START = ESP32S2_STUB.data_start;
  public ROM_DATA = ESP32S2_STUB.data;
  public ROM_TEXT = ESP32S2_STUB.text;

  public SUPPORTS_ENCRYPTED_FLASH = true;
  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_BASE + 0x30;
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 19;

  public EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034; // EFUSE_BLK0_WDATA0_REG
  public EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 0x7 << 18; // EFUSE_FLASH_CRYPT_CNT

  public EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
  public EFUSE_SECURE_BOOT_EN_MASK = 1 << 20;

  public async getSecureBootEnabled(loader: ESPLoader): Promise<boolean> {
    const secureBootEnableReg = await loader.readReg(this.EFUSE_SECURE_BOOT_EN_REG);
    return (secureBootEnableReg & this.EFUSE_SECURE_BOOT_EN_MASK) !== 0;
  }

  public async getEncryptedDownloadDisabled(loader: ESPLoader): Promise<boolean> {
    return (
      ((await loader.readReg(this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG)) & this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT) !==
      0
    );
  }

  public async getFlashEncryptionEnabled(loader: ESPLoader): Promise<boolean> {
    const flashCryptCounter =
      (await loader.readReg(this.EFUSE_SPI_BOOT_CRYPT_CNT_REG)) & this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK;

    const binaryString = flashCryptCounter.toString(2);
    const onesCount = binaryString.split("").filter((char) => char === "1").length & 1;
    return onesCount !== 0;
  }

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const word3 = await loader.readReg(addr);
    const pkgVersion = (word3 >> 21) & 0x0f;
    return pkgVersion;
  }

  public async getChipDescription(loader: ESPLoader) {
    const chipDesc = ["ESP32-S2", "ESP32-S2FH16", "ESP32-S2FH32"];
    const pkgVer = await this.getPkgVersion(loader);
    if (pkgVer >= 0 && pkgVer <= 2) {
      return chipDesc[pkgVer];
    } else {
      return "unknown ESP32-S2";
    }
  }

  public async getFlashCap(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const flashCap = (registerValue >> 21) & 0x0f;
    return flashCap;
  }

  public async getPsramCap(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const psramCap = (registerValue >> 28) & 0x0f;
    return psramCap;
  }

  public async getBlock2Version(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    const block2Addr = this.EFUSE_BASE + 0x05c;
    const addr = block2Addr + 4 * numWord;
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
