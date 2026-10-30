import assert from "node:assert/strict";
import { test } from "node:test";
import { parseIntelHex } from "../lib/index.js";

/**
 * Build one Intel HEX record.
 * @param {number} type Record type.
 * @param {number} address 16-bit record offset.
 * @param {number[]} data Payload bytes.
 * @returns {string} Record line without a newline.
 */
function record(type, address, data) {
  const bytes = [data.length, (address >> 8) & 0xff, address & 0xff, type, ...data];
  let sum = 0;
  for (const byte of bytes) sum = (sum + byte) & 0xff;
  bytes.push((0x100 - sum) & 0xff);
  return ":" + bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Join records and append the end-of-file record.
 * @param {string[]} records Record lines.
 * @returns {string} Intel HEX file text.
 */
function hexFile(records) {
  return [...records, record(0x01, 0, [])].join("\n") + "\n";
}

test("splits Intel HEX on a gap at a sector boundary", () => {
  const hex = hexFile([
    record(0x00, 0x1000, [0x11, 0x22, 0x33, 0x44]),
    record(0x00, 0x2000, [0xaa, 0xbb]),
  ]);

  const segments = parseIntelHex(hex);
  assert.equal(segments.length, 2);
  assert.equal(segments[0].address, 0x1000);
  assert.deepEqual(Array.from(segments[0].data), [0x11, 0x22, 0x33, 0x44]);
  assert.equal(segments[1].address, 0x2000);
  assert.deepEqual(Array.from(segments[1].data), [0xaa, 0xbb]);

  const fromBytes = parseIntelHex(new TextEncoder().encode(hex));
  assert.equal(fromBytes.length, 2);
  assert.equal(fromBytes[0].address, segments[0].address);
  assert.deepEqual(fromBytes[0].data, segments[0].data);
  assert.deepEqual(fromBytes[1].data, segments[1].data);
});

test("applies extended linear address records above 64 KiB", () => {
  const segments = parseIntelHex(hexFile([record(0x04, 0, [0x00, 0x01]), record(0x00, 0x0010, [0x01, 0x02, 0x03])]));

  assert.equal(segments.length, 1);
  assert.equal(segments[0].address, 0x10010);
  assert.deepEqual(Array.from(segments[0].data), [0x01, 0x02, 0x03]);
});

test("applies extended segment address records", () => {
  const segments = parseIntelHex(hexFile([record(0x02, 0, [0x10, 0x00]), record(0x00, 0x0020, [0x7e])]));

  assert.equal(segments.length, 1);
  assert.equal(segments[0].address, 0x10020);
  assert.deepEqual(Array.from(segments[0].data), [0x7e]);
});

test("rejects a record with a bad checksum", () => {
  const line = record(0x00, 0x1000, [0x11]);
  const brokenChecksum = ((parseInt(line.slice(-2), 16) + 1) & 0xff).toString(16).padStart(2, "0");
  const hex = line.slice(0, -2) + brokenChecksum + "\n" + record(0x01, 0, []) + "\n";

  assert.throws(() => parseIntelHex(hex), /checksum/i);
});

test("accepts records written out of address order", () => {
  const segments = parseIntelHex(hexFile([record(0x00, 0x2000, [0xaa]), record(0x00, 0x1000, [0x11, 0x22])]));

  assert.equal(segments.length, 2);
  assert.equal(segments[0].address, 0x1000);
  assert.deepEqual(Array.from(segments[0].data), [0x11, 0x22]);
  assert.equal(segments[1].address, 0x2000);
  assert.deepEqual(Array.from(segments[1].data), [0xaa]);
});

test("rejects regions that share a 4 KiB sector", () => {
  const hex = hexFile([record(0x00, 0x1000, [0x11]), record(0x00, 0x1002, [0x22])]);

  assert.throws(() => parseIntelHex(hex), /overlap/i);
});
