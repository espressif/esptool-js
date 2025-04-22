import { ESPLoader } from "../esploader.js";

export type MemoryMapEntry = [number, number, string];

/**
 * Represents a chip ROM with basic registers field and abstract functions.
 */
export abstract class ROM {
  /**
   * Read ESP32 eFuse.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @param {number} offset - Offset to start erase.
   * @returns {number} The eFuse number.
   */
  protected readEfuse?(loader: ESPLoader, offset: number): Promise<number>;

  /**
   * Get the package version number.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {number} The package version number.
   */
  protected getPkgVersion?(loader: ESPLoader): Promise<number>;

  /**
   * Get the chip revision number.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {number} The chip revision number.
   */
  protected getChipRevision?(loader: ESPLoader): Promise<number>;

  /**
   * Get the chip description.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {string} The chip description as string.
   */
  abstract getChipDescription(loader: ESPLoader): Promise<string>;
  /**
   * Get the chip features.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {string} The chip features as string.
   */
  abstract getChipFeatures(loader: ESPLoader): Promise<string[]>;
  /**
   * Get the crystal frequency for the chip.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {string} The crystal frequency as number.
   */
  abstract getCrystalFreq(loader: ESPLoader): Promise<number>;

  /**
   * Convert a number to hex string.
   * @param {number} d - Number to convert to hex string.
   * @returns {string} The hex string.
   */
  abstract _d2h(d: number): string;

  /**
   * Get the chip mac address.
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   * @returns {string} The mac address string.
   */
  abstract readMac(loader: ESPLoader): Promise<string>;

  /**
   * Function to be executed after chip connection
   * @param {ESPLoader} loader - Loader class to communicate with chip.
   */
  postConnect?(loader: ESPLoader): Promise<void>;

  /**
   * Get the chip erase size.
   * @param {number} offset - Offset to start erase.
   * @param {number} size - Size to erase.
   * @returns {number} The erase size of the chip as number.
   */
  getEraseSize(offset: number, size: number): number {
    return size;
  }

  public FLASH_SIZES: { [key: string]: number } = {
    "1MB": 0x00,
    "2MB": 0x10,
    "4MB": 0x20,
    "8MB": 0x30,
    "16MB": 0x40,
    "32MB": 0x50,
    "64MB": 0x60,
    "128MB": 0x70,
  };

  public FLASH_FREQUENCY: { [key: string]: number } = {
    "80m": 0xf,
    "40m": 0x0,
    "26m": 0x1,
    "20m": 0x2,
  };

  abstract BOOTLOADER_FLASH_OFFSET: number;
  abstract CHIP_NAME: string;
  // abstract DR_REG_SYSCON_BASE: number; //esp32
  // abstract EFUSE_RD_REG_BASE: number; //esp32

  abstract FLASH_WRITE_SIZE: number;
  abstract IMAGE_CHIP_ID: number; // not in esp8266
  abstract SPI_MOSI_DLEN_OFFS: number; // not in esp8266
  abstract SPI_MISO_DLEN_OFFS: number; // not in esp8266
  abstract SPI_REG_BASE: number;
  abstract SPI_USR_OFFS: number;
  abstract SPI_USR1_OFFS: number;
  abstract SPI_USR2_OFFS: number;
  abstract SPI_W0_OFFS: number;
  abstract UART_CLKDIV_MASK: number;
  abstract UART_CLKDIV_REG: number;
  abstract UART_DATE_REG_ADDR: number; // not in esp8266
  // abstract XTAL_CLK_DIVIDER: number; //esp32
  abstract MEMORY_MAP: MemoryMapEntry[];
}
