import assert from "node:assert/strict";
import { test } from "node:test";
import { ESPLoader } from "../lib/index.js";

/**
 * Build an ESPLoader whose transport reopens the port and whose chip then
 * stops answering, so changeBaud() takes its reconnect path. The I/O methods
 * are replaced with stubs that only record the call order.
 * @returns {{ loader: ESPLoader, calls: string[] }} Loader and recorded calls.
 */
function makeLoaderThatLosesTheBoard() {
  const calls = [];
  const transport = {
    getInfo: () => "fake",
    changeBaudrate: async () => true, // the port was reopened
    drainInput: async () => {},
    flushInput: () => {},
    disconnect: async () => calls.push("disconnect"),
  };
  const loader = new ESPLoader({ transport, baudrate: 460800 });
  loader.IS_STUB = true;
  loader.chip = { postConnect: async () => calls.push("postConnect") };
  loader.command = async () => [0, new Uint8Array(0)];
  loader.isResponsive = async () => false; // the board reset during the reopen
  loader.connect = async () => calls.push("connect");
  loader.runStub = async () => calls.push("runStub");
  return { loader, calls };
}

test("changeBaud reconnect runs chip.postConnect before reloading the stub", async () => {
  const { loader, calls } = makeLoaderThatLosesTheBoard();

  await loader.changeBaud();

  assert.deepEqual(calls, ["disconnect", "connect", "postConnect", "runStub"]);
  assert.equal(loader.baudrate, loader.romBaudrate);
});

test("changeBaud reconnect works for chips without postConnect", async () => {
  const { loader, calls } = makeLoaderThatLosesTheBoard();
  loader.chip = {};

  await loader.changeBaud();

  assert.deepEqual(calls, ["disconnect", "connect", "runStub"]);
});
