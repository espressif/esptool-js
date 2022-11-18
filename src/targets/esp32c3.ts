import ESPLoader from "../espLoader";
import { ROM } from "./rom";

export default class ESP32C3ROM extends ROM {
  public CHIP_NAME = "ESP32-C3";
  public IMAGE_CHIP_ID = 5;
  public EFUSE_BASE = 0x60008800;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x3ff40014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x6000007c;

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0x1000;

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

  public TEXT_START = 0x40380000;
  public ENTRY = 0x403805c8;
  public DATA_START = 0x3fc96ba8;
  public ROM_DATA = "DEDIPw==";
  public ROM_TEXT =
    "" +
    "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";

  public get_pkg_version = async (loader: ESPLoader) => {
    const num_word = 3;
    const block1_addr = this.EFUSE_BASE + 0x044;
    const addr = block1_addr + 4 * num_word;
    const word3 = await loader.read_reg(addr);
    const pkg_version = (word3 >> 21) & 0x07;
    return pkg_version;
  };

  public get_chip_revision = async (loader: ESPLoader) => {
    const block1_addr = this.EFUSE_BASE + 0x044;
    const num_word = 3;
    const pos = 18;
    const addr = block1_addr + 4 * num_word;
    const ret = ((await loader.read_reg(addr)) & (0x7 << pos)) >> pos;
    return ret;
  };

  public get_chip_description = async (loader: ESPLoader) => {
    let desc;
    const pkg_ver = await this.get_pkg_version(loader);
    if (pkg_ver === 0) {
      desc = "ESP32-C3";
    } else {
      desc = "unknown ESP32-C3";
    }
    const chip_rev = await this.get_chip_revision(loader);
    desc += " (revision " + chip_rev + ")";
    return desc;
  };

  public get_chip_features = async (loader: ESPLoader) => {
    return ["Wi-Fi"];
  };

  public get_crystal_freq = async (loader: ESPLoader) => {
    return 40;
  };

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public read_mac = async (loader: ESPLoader) => {
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

  public get_erase_size = function (offset: number, size: number) {
    return size;
  };
}
