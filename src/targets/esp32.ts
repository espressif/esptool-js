import { ESPLoader } from "../esploader";
import { ROM } from "./rom";

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

  public TEXT_START = 0x400be000;
  public ENTRY = 0x400be598;
  public DATA_START = 0x3ffdeba8;
  public ROM_DATA = "CMD8Pw==";
  public ROM_TEXT =
    "" +
    "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" +
    "wqvdldrZOj9LCYJ8mer+L0DR4a0UDQAA";

  public async read_efuse(loader: ESPLoader, offset: number) {
    const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
    loader.log("Read efuse " + addr);
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
      loader.log("WARNING: Unsupported crystal in use");
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
