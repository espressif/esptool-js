/**
 * Concatenate array 2 to array 1 and return the resulting UInt8Array.
 * @param {Uint8Array} array1 First array to concatenate.
 * @param {Uint8Array} array2 Second array to concatenate.
 * @returns {Uint8Array} Result UInt8Array.
 */
export function appendArray(array1: Uint8Array, array2: Uint8Array): Uint8Array {
  const result = new Uint8Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
}

/**
 * Convert short integer to byte array
 * @param {number} i - Number to convert.
 * @returns {Uint8Array} Byte array.
 */
export function shortToBytearray(i: number): Uint8Array {
  return new Uint8Array([i & 0xff, (i >> 8) & 0xff]);
}

/**
 * Convert an integer to byte array
 * @param {number} i - Number to convert.
 * @returns {Uint8Array} Array of byte from interger
 */
export function intToByteArray(i: number): Uint8Array {
  return new Uint8Array([i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]);
}

/**
 * Convert a byte array to short integer.
 * @param {number} i - Number to convert.
 * @param {number} j - Number to convert.
 * @returns {number} Return a short integer number.
 */
export function byteArrayToShort(i: number, j: number): number {
  return i | (j >> 8);
}

/**
 * Convert a byte array to integer.
 * @param {number} i - Number to convert.
 * @param {number} j - Number to convert.
 * @param {number} k - Number to convert.
 * @param {number} l - Number to convert.
 * @returns {number} Return a integer number.
 */
export function byteArrayToInt(i: number, j: number, k: number, l: number): number {
  return i | (j << 8) | (k << 16) | (l << 24);
}

/**
 * Convert a unsigned 8 bit integer array to byte string.
 * @param {Uint8Array} u8Array - magic hex number to select ROM.
 * @returns {string} Return the equivalent string.
 */
export function ui8ToBstr(u8Array: Uint8Array): string {
  let bStr = "";
  for (let i = 0; i < u8Array.length; i++) {
    bStr += String.fromCharCode(u8Array[i]);
  }
  return bStr;
}

/**
 * Convert a byte string to unsigned 8 bit integer array.
 * @param {string} bStr - binary string input
 * @returns {Uint8Array} Return a 8 bit unsigned integer array.
 */
export function bstrToUi8(bStr: string): Uint8Array {
  const u8Array = new Uint8Array(bStr.length);
  for (let i = 0; i < bStr.length; i++) {
    u8Array[i] = bStr.charCodeAt(i);
  }
  return u8Array;
}
