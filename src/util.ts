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

/**
 * get the SHA256 hash of an ArrayBuffer
 * @param {ArrayBufferLike} arrayBuffer ArrayBuffer to hash
 * @returns {string} SHA256 hash of the ArrayBuffer
 */
export async function getSHA256(arrayBuffer: ArrayBufferLike): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
