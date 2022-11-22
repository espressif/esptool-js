import { ESPLoader } from "../esploader";
import { ROM } from "./rom";

export default class ESP32S3ROM extends ROM {
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

  public TEXT_START = 0x40378000;
  public ENTRY = 0x40378978;
  public DATA_START = 0x3fcb2bf4;
  public ROM_DATA = "CADKPw==";
  public ROM_TEXT =
    "" +
    "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";

  public async get_chip_description(loader: ESPLoader) {
    return "ESP32-S3";
  };
  public async get_chip_features(loader: ESPLoader) {
    return ["Wi-Fi", "BLE"];
  };
  public async get_crystal_freq(loader: ESPLoader) {
    return 40;
  };
  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async _post_connect(loader: ESPLoader) {
    const buf_no = (await loader.read_reg(this.UARTDEV_BUF_NO)) & 0xff;
    console.log("In _post_connect " + buf_no);
    if (buf_no == this.UARTDEV_BUF_NO_USB) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
  };

  public async read_mac(loader: ESPLoader) {
    let mac0 = await loader.read_reg(this.MAC_EFUSE_REG);
    mac0 = mac0 >>> 0;
    let mac1 = await loader.read_reg(this.MAC_EFUSE_REG + 4);
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
  };

  public get_erase_size(offset: number, size: number) {
    return size;
  };
}
