import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  ESPLoader,
  Transport,
  ROM,
  ClassicReset,
  getStubJsonByChipName,
} from "../lib/index.js";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

test("compiled lib loads as native ESM", () => {
  assert.equal(typeof ESPLoader, "function");
  assert.equal(typeof Transport, "function");
  assert.equal(typeof ROM, "function");
  assert.equal(typeof ClassicReset, "function");
  assert.equal(typeof getStubJsonByChipName, "function");
});

test("package.json declares ESM", () => {
  assert.equal(packageJson.type, "module");
});

test("relative specifiers in lib use .js extensions", async () => {
  const { readFile } = await import("node:fs/promises");
  const libDir = join(dirname(fileURLToPath(import.meta.url)), "../lib");
  const sources = [
    "index.js",
    "esploader.js",
    "webusb.js",
    "targets/index.js",
    "stubFlasher.js",
  ];
  for (const file of sources) {
    const text = await readFile(join(libDir, file), "utf8");
    const extensionless = [...text.matchAll(/from\s+["'](\.[^"']+)["']/g)].filter(
      ([, spec]) => !spec.endsWith(".js") && !spec.endsWith(".json"),
    );
    assert.deepEqual(extensionless, [], `${file} has extensionless relative imports`);
  }
});

test("stub JSON imports use import attributes", async () => {
  const { readFile } = await import("node:fs/promises");
  const stubFlasher = await readFile(
    join(dirname(fileURLToPath(import.meta.url)), "../lib/stubFlasher.js"),
    "utf8",
  );
  assert.match(stubFlasher, /with:\s*\{\s*type:\s*["']json["']/);
  assert.match(stubFlasher, /esp-flasher-stub\/esp32\.json/);
  assert.doesNotMatch(stubFlasher, /targets\/stub_flasher/);
  const stub = await getStubJsonByChipName("ESP32");
  assert.ok(stub);
  assert.equal(typeof stub.entry, "number");
  assert.ok(stub.decodedText instanceof Uint8Array);
  assert.ok(stub.decodedText.length > 0);

  const h21 = await getStubJsonByChipName("ESP32-H21");
  assert.ok(h21);
  assert.equal(typeof h21.entry, "number");
  assert.ok(h21.decodedText.length > 0);

  const e22 = await getStubJsonByChipName("ESP32-E22");
  assert.equal(e22, undefined);
});
