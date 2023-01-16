import { ESPLoader } from "../esploader";
import { ROM } from "./rom";
import ESP32_STUB from "./stub_flasher/stub_flasher_32.json";

export class ESP32ROM extends ROM {
  public CHIP_NAME = "ESP32";
  public IMAGE_CHIP_ID = 0;
  public EFUSE_RD_REG_BASE = 0x3ff5a000;
  public DR_REG_SYSCON_BASE = 0x3ff66000;
  public UART_CLKDIV_REG = 0x3ff40014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x60000078;
  public XTAL_CLK_DIVIDER = 1;

  public FLASH_SIZES: { [key: string]: number } = {
    "1MB": 0x00,
    "2MB": 0x10,
    "4MB": 0x20,
    "8MB": 0x30,
    "16MB": 0x40,
  };

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0x1000;

  public SPI_REG_BASE = 0x3ff42000;
  public SPI_USR_OFFS = 0x1c;
  public SPI_USR1_OFFS = 0x20;
  public SPI_USR2_OFFS = 0x24;
  public SPI_W0_OFFS = 0x80;
  public SPI_MOSI_DLEN_OFFS = 0x28;
  public SPI_MISO_DLEN_OFFS = 0x2c;

  public TEXT_START = ESP32_STUB.text_start;
  public ENTRY = ESP32_STUB.entry;
  public DATA_START = ESP32_STUB.data_start;
  public ROM_DATA = ESP32_STUB.data;
  public ROM_TEXT = ESP32_STUB.text;

  public async read_efuse(loader: ESPLoader, offset: number) {
    const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
    loader.debug("Read efuse " + addr);
    return await loader.read_reg(addr);
  }

  public async get_pkg_version(loader: ESPLoader) {
    const word3 = await this.read_efuse(loader, 3);
    let pkg_version = (word3 >> 9) & 0x07;
    pkg_version += ((word3 >> 2) & 0x1) << 3;
    return pkg_version;
  }

  public async get_chip_revision(loader: ESPLoader) {
    const word3 = await this.read_efuse(loader, 3);
    const word5 = await this.read_efuse(loader, 5);
    const apb_ctl_date = await loader.read_reg(this.DR_REG_SYSCON_BASE + 0x7c);

    const rev_bit0 = (word3 >> 15) & 0x1;
    const rev_bit1 = (word5 >> 20) & 0x1;
    const rev_bit2 = (apb_ctl_date >> 31) & 0x1;
    if (rev_bit0 != 0) {
      if (rev_bit1 != 0) {
        if (rev_bit2 != 0) {
          return 3;
        } else {
          return 2;
        }
      } else {
        return 1;
      }
    }
    return 0;
  }

  public async get_chip_description(loader: ESPLoader) {
    const chip_desc = [
      "ESP32-D0WDQ6",
      "ESP32-D0WD",
      "ESP32-D2WD",
      "",
      "ESP32-U4WDH",
      "ESP32-PICO-D4",
      "ESP32-PICO-V3-02",
    ];
    let chip_name = "";
    const pkg_version = await this.get_pkg_version(loader);
    const chip_revision = await this.get_chip_revision(loader);
    const rev3 = chip_revision == 3;
    const single_core = (await this.read_efuse(loader, 3)) & (1 << 0);

    if (single_core != 0) {
      chip_desc[0] = "ESP32-S0WDQ6";
      chip_desc[1] = "ESP32-S0WD";
    }
    if (rev3) {
      chip_desc[5] = "ESP32-PICO-V3";
    }
    if (pkg_version >= 0 && pkg_version <= 6) {
      chip_name = chip_desc[pkg_version];
    } else {
      chip_name = "Unknown ESP32";
    }

    if (rev3 && (pkg_version === 0 || pkg_version === 1)) {
      chip_name += "-V3";
    }
    return chip_name + " (revision " + chip_revision + ")";
  }

  public async get_chip_features(loader: ESPLoader) {
    const features = ["Wi-Fi"];
    const word3 = await this.read_efuse(loader, 3);

    const chip_ver_dis_bt = word3 & (1 << 1);
    if (chip_ver_dis_bt === 0) {
      features.push(" BT");
    }

    const chip_ver_dis_app_cpu = word3 & (1 << 0);
    if (chip_ver_dis_app_cpu !== 0) {
      features.push(" Single Core");
    } else {
      features.push(" Dual Core");
    }

    const chip_cpu_freq_rated = word3 & (1 << 13);
    if (chip_cpu_freq_rated !== 0) {
      const chip_cpu_freq_low = word3 & (1 << 12);
      if (chip_cpu_freq_low !== 0) {
        features.push(" 160MHz");
      } else {
        features.push(" 240MHz");
      }
    }

    const pkg_version = await this.get_pkg_version(loader);
    if ([2, 4, 5, 6].indexOf(pkg_version) !== -1) {
      features.push(" Embedded Flash");
    }

    if (pkg_version === 6) {
      features.push(" Embedded PSRAM");
    }

    const word4 = await this.read_efuse(loader, 4);
    const adc_vref = (word4 >> 8) & 0x1f;
    if (adc_vref !== 0) {
      features.push(" VRef calibration in efuse");
    }

    const blk3_part_res = (word3 >> 14) & 0x1;
    if (blk3_part_res !== 0) {
      features.push(" BLK3 partially reserved");
    }

    const word6 = await this.read_efuse(loader, 6);
    const coding_scheme = word6 & 0x3;
    const coding_scheme_arr = ["None", "3/4", "Repeat (UNSUPPORTED)", "Invalid"];
    features.push(" Coding Scheme " + coding_scheme_arr[coding_scheme]);

    return features;
  }

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
      loader.info("WARNING: Unsupported crystal in use");
    }
    return norm_xtal;
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  public async read_mac(loader: ESPLoader) {
    let mac0 = await this.read_efuse(loader, 1);
    mac0 = mac0 >>> 0;
    let mac1 = await this.read_efuse(loader, 2);
    mac1 = mac1 >>> 0;
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
}
