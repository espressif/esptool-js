import { ESPLoader } from "../esploader";
import { ROM } from "./rom";
import ESP8266_STUB from "./stub_flasher/stub_flasher_8266.json";

export class ESP8266ROM extends ROM {
  public CHIP_NAME = "ESP8266";
  public CHIP_DETECT_MAGIC_VALUE = [0xfff0c101];
  public EFUSE_RD_REG_BASE = 0x3ff00050;
  public UART_CLKDIV_REG = 0x60000014;
  public UART_CLKDIV_MASK = 0xfffff;
  public XTAL_CLK_DIVIDER = 2;

  public FLASH_WRITE_SIZE = 0x4000;

  // NOT IMPLEMENTED, SETTING EMPTY VALUE
  public BOOTLOADER_FLASH_OFFSET = 0;
  public UART_DATE_REG_ADDR = 0;

  public FLASH_SIZES = {
    "512KB": 0x00,
    "256KB": 0x10,
    "1MB": 0x20,
    "2MB": 0x30,
    "4MB": 0x40,
    "2MB-c1": 0x50,
    "4MB-c1": 0x60,
    "8MB": 0x80,
    "16MB": 0x90,
  };

  public SPI_REG_BASE = 0x60000200;
  public SPI_USR_OFFS = 0x1c;
  public SPI_USR1_OFFS = 0x20;
  public SPI_USR2_OFFS = 0x24;
  public SPI_MOSI_DLEN_OFFS = 0; // not in esp8266
  public SPI_MISO_DLEN_OFFS = 0; // not in esp8266
  public SPI_W0_OFFS = 0x40;

  public TEXT_START = ESP8266_STUB.text_start;
  public ENTRY = ESP8266_STUB.entry;
  public DATA_START = ESP8266_STUB.data_start;
  public ROM_DATA = ESP8266_STUB.data;
  public ROM_TEXT = ESP8266_STUB.text;

  public async read_efuse(loader: ESPLoader, offset: number) {
    const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
    loader.debug("Read efuse " + addr);
    return await loader.read_reg(addr);
  }

  public async get_chip_description(loader: ESPLoader) {
    const efuse3 = await this.read_efuse(loader, 2);
    const efuse0 = await this.read_efuse(loader, 0);

    const is_8285 = ((efuse0 & (1 << 4)) | (efuse3 & (1 << 16))) != 0; // One or the other efuse bit is set for ESP8285
    return is_8285 ? "ESP8285" : "ESP8266EX";
  }

  public get_chip_features = async (loader: ESPLoader) => {
    const features = ["WiFi"];
    if ((await this.get_chip_description(loader)) == "ESP8285") features.push("Embedded Flash");
    return features;
  };

  public async get_crystal_freq(loader: ESPLoader) {
    const uart_div = (await loader.read_reg(this.UART_CLKDIV_REG)) & this.UART_CLKDIV_MASK;
    const ets_xtal = (loader.transport.baudrate * uart_div) / 1000000 / this.XTAL_CLK_DIVIDER;
    let norm_xtal;
    if (ets_xtal > 33) {
      norm_xtal = 40;
    } else {
      norm_xtal = 26;
    }
    if (Math.abs(norm_xtal - ets_xtal) > 1) {
      loader.info(
        "WARNING: Detected crystal freq " +
          ets_xtal +
          "MHz is quite different to normalized freq " +
          norm_xtal +
          "MHz. Unsupported crystal in use?",
      );
    }
    return norm_xtal;
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async read_mac(loader: ESPLoader) {
    let mac0 = await this.read_efuse(loader, 0);
    mac0 = mac0 >>> 0;
    let mac1 = await this.read_efuse(loader, 1);
    mac1 = mac1 >>> 0;
    let mac3 = await this.read_efuse(loader, 3);
    mac3 = mac3 >>> 0;
    const mac = new Uint8Array(6);

    if (mac3 != 0) {
      mac[0] = (mac3 >> 16) & 0xff;
      mac[1] = (mac3 >> 8) & 0xff;
      mac[2] = mac3 & 0xff;
    } else if (((mac1 >> 16) & 0xff) == 0) {
      mac[0] = 0x18;
      mac[1] = 0xfe;
      mac[2] = 0x34;
    } else if (((mac1 >> 16) & 0xff) == 1) {
      mac[0] = 0xac;
      mac[1] = 0xd0;
      mac[2] = 0x74;
    } else {
      loader.error("Unknown OUI");
    }

    mac[3] = (mac1 >> 8) & 0xff;
    mac[4] = mac1 & 0xff;
    mac[5] = (mac0 >> 24) & 0xff;

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
