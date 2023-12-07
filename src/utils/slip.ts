/**
 * Format data packet using the Serial Line Internet Protocol (SLIP).
 * @param {Uint8Array} data Binary unsigned 8 bit array data to format.
 * @returns {Uint8Array} Formatted unsigned 8 bit data array.
 */
export function slipWriter(data: Uint8Array): Uint8Array {
  const outData = [];
  outData.push(0xc0);
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0xdb) {
      outData.push(0xdb, 0xdd);
    } else if (data[i] === 0xc0) {
      outData.push(0xdb, 0xdc);
    } else {
      outData.push(data[i]);
    }
  }
  outData.push(0xc0);
  return new Uint8Array(outData);
}
