import { FlashFreqValues, FlashModeValues } from "./arguments";

/**
 * Options for flashing a device with firmware.
 * @interface FlashOptions
 */
export interface FlashOptions {
  /**
   * An array of file objects representing the data to be flashed.
   * @type {Array<{ data: Uint8Array; address: number }>}
   */
  fileArray: { data: Uint8Array; address: number }[];

  /**
   * The flash mode to be used (e.g., QIO, QOUT, DIO, DOUT).
   * @type {FlashModeValues}
   */
  flashMode: FlashModeValues;

  /**
   * The flash frequency to be used (e.g., 40MHz, 80MHz).
   * @type {FlashFreqValues}
   */
  flashFreq: FlashFreqValues;

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
   * @type {(image: Uint8Array) => string}
   */
  calculateMD5Hash?: (image: Uint8Array) => string;
}
