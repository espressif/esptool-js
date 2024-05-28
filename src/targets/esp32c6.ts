import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";
import ESP32C6_STUB from "./stub_flasher/stub_flasher_32c6.json";

export class ESP32C6ROM extends ROM {
  public CHIP_NAME = "ESP32-C6";
  public IMAGE_CHIP_ID = 13;
  public EFUSE_BASE = 0x600b0800;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x3ff40014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x6000007c;

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0;

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

  public TEXT_START = ESP32C6_STUB.text_start;
  public ENTRY = ESP32C6_STUB.entry;
  public DATA_START = ESP32C6_STUB.data_start;
  public ROM_DATA = ESP32C6_STUB.data;
  public ROM_TEXT = ESP32C6_STUB.text;

  public async getPkgVersion(loader: ESPLoader) {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const word3 = await loader.readReg(addr);
    const pkgVersion = (word3 >> 21) & 0x07;
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

  public async getChipDescription(loader: ESPLoader) {
    let desc: string;
    const pkgVer = await this.getPkgVersion(loader);
    if (pkgVer === 0) {
      desc = "ESP32-C6";
    } else {
      desc = "unknown ESP32-C6";
    }
    const chipRev = await this.getChipRevision(loader);
    desc += " (revision " + chipRev + ")";
    return desc;
  }

  public async getChipFeatures() {
    return ["Wi-Fi"];
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
