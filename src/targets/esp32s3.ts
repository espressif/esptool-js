import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";
import ESP32S3_STUB from "./stub_flasher/stub_flasher_32s3.json";

export class ESP32S3ROM extends ROM {
  public CHIP_NAME = "ESP32-S3";
  public IMAGE_CHIP_ID = 9;
  public EFUSE_BASE = 0x60007000;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x60000014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x60000080;

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

  public USB_RAM_BLOCK = 0x800;
  public UARTDEV_BUF_NO_USB = 3;
  public UARTDEV_BUF_NO = 0x3fcef14c;

  public TEXT_START = ESP32S3_STUB.text_start;
  public ENTRY = ESP32S3_STUB.entry;
  public DATA_START = ESP32S3_STUB.data_start;
  public ROM_DATA = ESP32S3_STUB.data;
  public ROM_TEXT = ESP32S3_STUB.text;

  public SUPPORTS_ENCRYPTED_FLASH = true;
  public FLASH_ENCRYPTED_WRITE_ALIGN = 16;

  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_BASE + 0x30;
  public EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1 << 20;

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

  public async getChipDescription(loader: ESPLoader) {
    return "ESP32-S3";
  }

  public async getFlashCap(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const flashCap = (registerValue >> 27) & 0x07;
    return flashCap;
  }

  public async getFlashVendor(loader: ESPLoader): Promise<string> {
    const numWord = 4;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const vendorId = (registerValue >> 0) & 0x07;
    const vendorMap: { [key: number]: string } = {
      1: "XMC",
      2: "GD",
      3: "FM",
      4: "TT",
      5: "BY",
    };
    return vendorMap[vendorId] || "";
  }

  public async getPsramCap(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const psramCap = (registerValue >> 3) & 0x03;
    return psramCap;
  }

  public async getPsramVendor(loader: ESPLoader): Promise<string> {
    const numWord = 4;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const vendorId = (registerValue >> 7) & 0x03;
    const vendorMap: { [key: number]: string } = {
      1: "AP_3v3",
      2: "AP_1v8",
    };
    return vendorMap[vendorId] || "";
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    const features: string[] = ["Wi-Fi", "BLE"];

    const flashMap: { [key: number]: string | null } = {
      0: null,
      1: "Embedded Flash 8MB",
      2: "Embedded Flash 4MB",
    };
    const flashCap = await this.getFlashCap(loader);
    const flashVendor = await this.getFlashVendor(loader);
    const flash = flashMap[flashCap];
    const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
    if (flash !== null) {
      features.push(`${flashDescription} (${flashVendor})`);
    }

    const psramMap: { [key: number]: string | null } = {
      0: null,
      1: "Embedded PSRAM 8MB",
      2: "Embedded PSRAM 2MB",
    };
    const psramCap = await this.getPsramCap(loader);
    const psramVendor = await this.getPsramVendor(loader);
    const psram = psramMap[psramCap];
    const psramDescription = psram !== undefined ? psram : "Unknown Embedded PSRAM";
    if (psram !== null) {
      features.push(`${psramDescription} (${psramVendor})`);
    }
    return features;
  }

  public async getCrystalFreq(loader: ESPLoader) {
    return 40;
  }
  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async postConnect(loader: ESPLoader) {
    const bufNo = (await loader.readReg(this.UARTDEV_BUF_NO)) & 0xff;
    loader.debug("In _post_connect " + bufNo);
    if (bufNo == this.UARTDEV_BUF_NO_USB) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
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
