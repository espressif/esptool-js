import { ESPLoader } from "../esploader";
import { ROM } from "./rom";

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

  public TEXT_START = 0x40028000;
  public ENTRY = 0x4002873c;
  public DATA_START = 0x3ffe2bf4;
  public ROM_DATA = "CAD9Pw==";
  public ROM_TEXT =
    "" +
    "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";

  public async get_pkg_version(loader: ESPLoader) {
    const num_word = 3;
    const block1_addr = this.EFUSE_BASE + 0x044;
    const addr = block1_addr + 4 * num_word;
    const word3 = await loader.read_reg(addr);
    const pkg_version = (word3 >> 21) & 0x0f;
    return pkg_version;
  }

  public async get_chip_description(loader: ESPLoader) {
    const chip_desc = ["ESP32-S2", "ESP32-S2FH16", "ESP32-S2FH32"];
    const pkg_ver = await this.get_pkg_version(loader);
    if (pkg_ver >= 0 && pkg_ver <= 2) {
      return chip_desc[pkg_ver];
    } else {
      return "unknown ESP32-S2";
    }
  }

  public async get_chip_features(loader: ESPLoader) {
    const features = ["Wi-Fi"];
    const pkg_ver = await this.get_pkg_version(loader);
    if (pkg_ver == 1) {
      features.push("Embedded 2MB Flash");
    } else if (pkg_ver == 2) {
      features.push("Embedded 4MB Flash");
    }
    const num_word = 4;
    const block2_addr = this.EFUSE_BASE + 0x05c;
    const addr = block2_addr + 4 * num_word;
    const word4 = await loader.read_reg(addr);
    const block2_ver = (word4 >> 4) & 0x07;

    if (block2_ver == 1) {
      features.push("ADC and temperature sensor calibration in BLK2 of efuse");
    }
    return features;
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
