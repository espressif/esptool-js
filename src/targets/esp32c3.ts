import { ESPLoader } from "../esploader";
import { ROM } from "./rom";
import ESP32C3_STUB from "./stub_flasher/stub_flasher_32c3.json";

export class ESP32C3ROM extends ROM {
  public CHIP_NAME = "ESP32-C3";
  public IMAGE_CHIP_ID = 5;
  public EFUSE_BASE = 0x60008800;
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

  public TEXT_START = ESP32C3_STUB.text_start;
  public ENTRY = ESP32C3_STUB.entry;
  public DATA_START = ESP32C3_STUB.data_start;
  public ROM_DATA = ESP32C3_STUB.data;
  public ROM_TEXT = ESP32C3_STUB.text;

  public async get_pkg_version(loader: ESPLoader) {
    const num_word = 3;
    const block1_addr = this.EFUSE_BASE + 0x044;
    const addr = block1_addr + 4 * num_word;
    const word3 = await loader.read_reg(addr);
    const pkg_version = (word3 >> 21) & 0x07;
    return pkg_version;
  }

  public async get_chip_revision(loader: ESPLoader) {
    const block1_addr = this.EFUSE_BASE + 0x044;
    const num_word = 3;
    const pos = 18;
    const addr = block1_addr + 4 * num_word;
    const ret = ((await loader.read_reg(addr)) & (0x7 << pos)) >> pos;
    return ret;
  }

  public async get_chip_description(loader: ESPLoader) {
    let desc: string;
    const pkg_ver = await this.get_pkg_version(loader);
    if (pkg_ver === 0) {
      desc = "ESP32-C3";
    } else {
      desc = "unknown ESP32-C3";
    }
    const chip_rev = await this.get_chip_revision(loader);
    desc += " (revision " + chip_rev + ")";
    return desc;
  }

  public async get_chip_features(loader: ESPLoader) {
    return ["Wi-Fi"];
  }

  public async get_crystal_freq(loader: ESPLoader) {
    return 40;
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

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
  }

  public get_erase_size(offset: number, size: number) {
    return size;
  }
}
