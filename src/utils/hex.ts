/**
 * Converts a Uint8Array to a hexadecimal string representation.
 * @param {Uint8Array} s - The Uint8Array to be converted.
 * @returns {string} A hexadecimal string representation of the input Uint8Array.
 * @example
 * const byteArray = new Uint8Array([255, 0, 127]);
 * const hexString = hexify(byteArray); // "ff007f"
 */
export function hexify(s: Uint8Array): string {
  return Array.from(s)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .padEnd(16, " ");
}

/**
 * Converts a Uint8Array to a formatted hexadecimal string representation with ASCII.
 * @param {Uint8Array} uint8Array - The Uint8Array to be converted.
 * @param {boolean} autoSplit - Indicates whether to automatically split the output into lines.
 * @returns {string} A formatted hexadecimal string representation of the input Uint8Array.
 * @example
 * const byteArray = new Uint8Array([ 192, 0, 5, 16, 0, 0, 0, 0, 0, 6, 104, 13, 0, 0, 1, 0 ]);
 * const hexString = hexConvert(byteArray); // "c000051000000000 00680d0000010000 | .........h......"
 */
export function hexConvert(uint8Array: Uint8Array, autoSplit: boolean = true): string {
  if (autoSplit && uint8Array.length > 16) {
    let result = "";
    let s = uint8Array;

    while (s.length > 0) {
      const line = s.slice(0, 16);
      const asciiLine = String.fromCharCode(...line)
        .split("")
        .map((c) => (c === " " || (c >= " " && c <= "~" && c !== "  ") ? c : "."))
        .join("");
      s = s.slice(16);
      result += `\n    ${hexify(line.slice(0, 8))} ${hexify(line.slice(8))} | ${asciiLine}`;
    }

    return result;
  } else {
    return hexify(uint8Array);
  }
}
