/**
 * Options for flashing a device with firmware.
 * @interface FlashOptions
 */
export interface FlashOptions {
  /**
   * An array of file objects representing the data to be flashed.
   * @type {Array<{ data: string; address: number }>}
   */
  fileArray: { data: string; address: number }[];

  /**
   * The size of the flash memory to be used.
   * @type {string}
   */
  flashSize: string;

  /**
   * The flash mode to be used (e.g., QIO, QOUT, DIO, DOUT).
   * @type {string}
   */
  flashMode: string;

  /**
   * The flash frequency to be used (e.g., 40MHz, 80MHz).
   * @type {string}
   */
  flashFreq: string;

  /**
   * Flag indicating whether to erase all existing data in the flash memory before flashing.
   * @type {boolean}
   */
  eraseAll: boolean;

  /**
   * Flag indicating whether to compress the data before flashing.
   * @type {boolean}
   */
  compress: boolean;

  /**
   * A function to report the progress of the flashing operation (optional).
   * @type {(fileIndex: number, written: number, total: number) => void}
   */
  reportProgress?: (fileIndex: number, written: number, total: number) => void;

  /**
   * A function to calculate the MD5 hash of the firmware image (optional).
   * @type {(image: string) => string}
   */
  calculateMD5Hash?: (image: string) => string;
}
