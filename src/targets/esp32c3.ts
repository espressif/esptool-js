import { ESPLoader } from "../esploader.js";
import { ESP32ROM } from "./esp32.js";
import { MemoryMapEntry } from "./rom.js";

export class ESP32C3ROM extends ESP32ROM {
  public CHIP_NAME = "ESP32-C3";
  public IMAGE_CHIP_ID = 5;
  public EFUSE_BASE = 0x60008800;
  public MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  public UART_CLKDIV_REG = 0x3ff40014;
  public UART_CLKDIV_MASK = 0xfffff;
  public UART_DATE_REG_ADDR = 0x6000007c;

  public FLASH_WRITE_SIZE = 0x400;
  public BOOTLOADER_FLASH_OFFSET = 0;

  public SPI_REG_BASE = 0x60002000;
  public SPI_USR_OFFS = 0x18;
  public SPI_USR1_OFFS = 0x1c;
  public SPI_USR2_OFFS = 0x20;
  public SPI_MOSI_DLEN_OFFS = 0x24;
  public SPI_MISO_DLEN_OFFS = 0x28;
  public SPI_W0_OFFS = 0x58;

  IROM_MAP_START = 0x42000000;
  IROM_MAP_END = 0x42800000;

  public MEMORY_MAP: MemoryMapEntry[] = [
    [0x00000000, 0x00010000, "PADDING"],
    [0x3c000000, 0x3c800000, "DROM"],
    [0x3fc80000, 0x3fce0000, "DRAM"],
    [0x3fc88000, 0x3fd00000, "BYTE_ACCESSIBLE"],
    [0x3ff00000, 0x3ff20000, "DROM_MASK"],
    [0x40000000, 0x40060000, "IROM_MASK"],
    [0x42000000, 0x42800000, "IROM"],
    [0x4037c000, 0x403e0000, "IRAM"],
    [0x50000000, 0x50002000, "RTC_IRAM"],
    [0x50000000, 0x50002000, "RTC_DRAM"],
    [0x600fe000, 0x60100000, "MEM_INTERNAL2"],
  ];

  public async getPkgVersion(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const word3 = await loader.readReg(addr);
    const pkgVersion = (word3 >> 21) & 0x07;
    return pkgVersion;
  }

  public async getChipRevision(loader: ESPLoader): Promise<number> {
    const block1Addr = this.EFUSE_BASE + 0x044;
    const numWord = 3;
    const pos = 18;
    const addr = block1Addr + 4 * numWord;
    const ret = ((await loader.readReg(addr)) & (0x7 << pos)) >> pos;
    return ret;
  }

  public async getChipDescription(loader: ESPLoader) {
    let desc: string;
    const pkgVer = await this.getPkgVersion(loader);
    if (pkgVer === 0) {
      desc = "ESP32-C3";
    } else {
      desc = "unknown ESP32-C3";
    }
    const chip_rev = await this.getChipRevision(loader);
    desc += " (revision " + chip_rev + ")";
    return desc;
  }

  public async getFlashCap(loader: ESPLoader): Promise<number> {
    const numWord = 3;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const flashCap = (registerValue >> 27) & 0x07;
    return flashCap;
  }

  public async getFlashVendor(loader: ESPLoader): Promise<string> {
    const numWord = 4;
    const block1Addr = this.EFUSE_BASE + 0x044;
    const addr = block1Addr + 4 * numWord;
    const registerValue = await loader.readReg(addr);
    const vendorId = (registerValue >> 0) & 0x07;
    const vendorMap: { [key: number]: string } = {
      1: "XMC",
      2: "GD",
      3: "FM",
      4: "TT",
      5: "ZBIT",
    };
    return vendorMap[vendorId] || "";
  }

  public async getChipFeatures(loader: ESPLoader): Promise<string[]> {
    const features: string[] = ["Wi-Fi", "BLE"];

    const flashMap: { [key: number]: string | null } = {
      0: null,
      1: "Embedded Flash 4MB",
      2: "Embedded Flash 2MB",
      3: "Embedded Flash 1MB",
      4: "Embedded Flash 8MB",
    };
    const flashCap = await this.getFlashCap(loader);
    const flashVendor = await this.getFlashVendor(loader);
    const flash = flashMap[flashCap];
    const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
    if (flash !== null) {
      features.push(`${flashDescription} (${flashVendor})`);
    }
    return features;
  }

  public async getCrystalFreq(loader: ESPLoader) {
    return 40;
  }

  public _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
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
