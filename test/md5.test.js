import assert from "node:assert/strict";
import { test } from "node:test";
import { md5 } from "../lib/md5.js";

/**
 * Format a digest as lowercase hex.
 * @param {Uint8Array} bytes Digest bytes.
 * @returns {string} Hex string.
 */
function hex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

test("md5 matches RFC 1321 vectors", () => {
  const encode = (text) => new TextEncoder().encode(text);
  assert.equal(hex(md5(new Uint8Array(0))), "d41d8cd98f00b204e9800998ecf8427e");
  assert.equal(hex(md5(encode("abc"))), "900150983cd24fb0d6963f7d28e17f72");
  assert.equal(hex(md5(encode("message digest"))), "f96b697d7cb7938d525a2f31aaf161d0");
});

test("md5 hashes raw bytes across multiple blocks", () => {
  const data = new Uint8Array(256);
  for (let i = 0; i < data.length; i++) data[i] = i;
  assert.equal(hex(md5(data)), "e2c865db4162bed963bfaa9ef6ac18f0");
});
