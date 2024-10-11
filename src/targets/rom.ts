import { ESPLoader } from "../esploader.js";

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

  /**
   * Check if download has been disabled due to encryption
   * @returns {boolean} Is encrypted download disabled (EFUSE_RD_DISABLE_DL_ENCRYPT).
   */
  abstract getEncryptedDownloadDisabled(loader: ESPLoader): Promise<boolean>;

  /**
   * Check if flash encryption is enabled
   * @returns {boolean} Is flash encryption enabled (EFUSE_FLASH_CRYPT_CNT).
   */
  abstract getFlashEncryptionEnabled(loader: ESPLoader): Promise<boolean>;

  /**
   * Check if secure boot is enabled
   * @returns {number} Is Secure boot enabled (EFUSE_RD_ABS_DONE_REG).
   */
  abstract getSecureBootEnabled(loader: ESPLoader): Promise<boolean>;

  abstract FLASH_SIZES: { [key: string]: number };

  abstract BOOTLOADER_FLASH_OFFSET: number;
  abstract CHIP_NAME: string;
  abstract DATA_START: number;
  // abstract DR_REG_SYSCON_BASE: number; //esp32
  // abstract EFUSE_RD_REG_BASE: number; //esp32
  abstract ENTRY: number;

  abstract FLASH_WRITE_SIZE: number;
  // abstract IMAGE_CHIP_ID: number; // not in esp8266
  abstract ROM_DATA: string;
  abstract ROM_TEXT: string;
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
  abstract TEXT_START: number;
  // abstract XTAL_CLK_DIVIDER: number; //esp32

  abstract SUPPORTS_ENCRYPTED_FLASH: boolean;
  abstract FLASH_ENCRYPTED_WRITE_ALIGN: number;
}
