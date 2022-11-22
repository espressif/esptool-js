import { ESPLoader } from "../esploader";
import { ROM } from "./rom";

export default class ESP8266ROM extends ROM {
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

  public TEXT_START = 0x4010e000;
  public ENTRY = 0x4010e004;
  public DATA_START = 0x3fffaca8;
  public ROM_DATA =
    "" +
    "CIH+PwUFBAACAwcAAwMLAFHnEECH5xBAtecQQFToEEAF9xBAuugQQBDpEEBc6RBA" +
    "BfcQQCLqEECf6hBAYOsQQAX3EEAF9xBA+OsQQAX3EEDX7hBAn+8QQNjvEEAF9xBA" +
    "BfcQQHXwEEAF9xBAW/EQQAHyEEBA8xBA//MQQND0EEAF9xBABfcQQAX3EEAF9xBA" +
    "/vUQQAX3EED09hBAL+0QQCfoEEBC9RBAS+oQQJjpEEAF9xBAiPYQQM/2EEAF9xBA" +
    "BfcQQAX3EEAF9xBABfcQQAX3EEAF9xBABfcQQMDpEED/6RBAWvUQQAEAAAACAAAA" +
    "AwAAAAQAAAAFAAAABwAAAAkAAAANAAAAEQAAABkAAAAhAAAAMQAAAEEAAABhAAAA" +
    "gQAAAMEAAAABAQAAgQEAAAECAAABAwAAAQQAAAEGAAABCAAAAQwAAAEQAAABGAAA" +
    "ASAAAAEwAAABQAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAA" +
    "AgAAAAIAAAADAAAAAwAAAAQAAAAEAAAABQAAAAUAAAAGAAAABgAAAAcAAAAHAAAA" +
    "CAAAAAgAAAAJAAAACQAAAAoAAAAKAAAACwAAAAsAAAAMAAAADAAAAA0AAAANAAAA" +
    "AAAAAAAAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAANAAAA" +
    "DwAAABEAAAATAAAAFwAAABsAAAAfAAAAIwAAACsAAAAzAAAAOwAAAEMAAABTAAAA" +
    "YwAAAHMAAACDAAAAowAAAMMAAADjAAAAAgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAA" +
    "AgAAAAMAAAADAAAAAwAAAAMAAAAEAAAABAAAAAQAAAAEAAAABQAAAAUAAAAFAAAA" +
    "BQAAAAAAAAAAAAAAAAAAABAREgAIBwkGCgULBAwDDQIOAQ8AAQEAAAEAAAAEAAAA";
  public ROM_TEXT =
    "" +
    "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" +
    "bcqT/wWthFLmqB8AAA==";

  public async read_efuse(loader: ESPLoader, offset: number) {
    const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
    loader.log("Read efuse " + addr);
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
      loader.log(
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
      loader.log("Unknown OUI");
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
