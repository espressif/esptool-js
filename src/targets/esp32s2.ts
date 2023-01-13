import { ESPLoader } from "../esploader";
import { ROM } from "./rom";
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
