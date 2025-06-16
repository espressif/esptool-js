import { ESPLoader } from "../esploader.js";
import { ROM } from "./rom.js";

export class ESP32H2ROM extends ROM {
  public CHIP_NAME = "ESP32-H2";
  public IMAGE_CHIP_ID = 16;
  public EFUSE_BASE = 0x600b0800;
  public EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
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

  public USB_RAM_BLOCK = 0x800;
  public UARTDEV_BUF_NO_USB = 3;
  public UARTDEV_BUF_NO = 0x3fcef14c;

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 4;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 0) & 0x07;
  }

  public async getMinorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 18) & 0x07;
  }

  public async getMajorChipVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    return ((await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord)) >> 21) & 0x03;
  }

  public async getChipDescription(loader: ESPLoader): Promise<string> {
    const pkgVer = await this.getPkgVersion(loader);
    let desc: string;
    if (pkgVer === 0) {
      desc = "ESP32-H2";
    } else {
      desc = "unknown ESP32-H2";
    }
    const majorRev = await this.getMajorChipVersion(loader);
    const minorRev = await this.getMinorChipVersion(loader);
    return `${desc} (revision v${majorRev}.${minorRev})`;
  }

  public async getChipFeatures(loader: ESPLoader) {
    return ["BT 5 (LE)", "IEEE802.15.4", "Single Core", "96MHz"];
  }

  public async getCrystalFreq(loader: ESPLoader) {
    // ESP32H2 XTAL is fixed to 32MHz
    return 32;
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
