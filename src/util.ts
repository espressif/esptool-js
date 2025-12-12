/**
 * Pad to the next alignment boundary
 * @param {Uint8Array} data Uint8Array data to pad
 * @param {number} alignment Alignment boundary to fulfill
 * @param {number} padCharacter Character to fill with
 * @returns {Uint8Array} Padded UInt8Array image
 */
export function padTo(data: Uint8Array, alignment: number, padCharacter = 0xff): Uint8Array {
  const padMod = data.length % alignment;
  if (padMod !== 0) {
    const padding = new Uint8Array(alignment - padMod).fill(padCharacter);
    const paddedData = new Uint8Array(data.length + padding.length);
    paddedData.set(data);
    paddedData.set(padding, data.length);
    return paddedData;
  }
  return data;
}

export const ESP_CHECKSUM_MAGIC = 0xef;

/**
 * Get the checksum for given unsigned 8-bit array
 * @param {Uint8Array} data Unsigned 8-bit integer array
 * @param {number} state Initial checksum
 * @returns {number} - Array checksum
 */
export function checksum(data: Uint8Array, state: number = ESP_CHECKSUM_MAGIC): number {
  for (let i = 0; i < data.length; i++) {
    state ^= data[i];
  }
  return state;
}

/**
 * Convert a byte string to unsigned 8 bit integer array.
 * @param {string} bStr - binary string input
 * @returns {Uint8Array} Return a 8 bit unsigned integer array.
 */
export function bstrToUi8(bStr: string) {
  const u8Array = new Uint8Array(bStr.length);
  for (let i = 0; i < bStr.length; i++) {
    u8Array[i] = bStr.charCodeAt(i);
  }
  return u8Array;
}

/**
 * Sleep for a given number of milliseconds
 * @param {number} ms - Number of milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after the sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
