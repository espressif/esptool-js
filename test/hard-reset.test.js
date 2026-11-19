import assert from "node:assert/strict";
import { test } from "node:test";
import { ClassicReset, HardReset, Transport } from "../lib/index.js";

/**
 * Build a transport that only records the RTS states it is asked to set.
 * RTS starts released, as it is after the connect reset sequences.
 * @returns {{ transport: object, rts: boolean[] }} Fake transport and recorded RTS states.
 */
function makeRecordingTransport() {
  const rts = [];
  const transport = {
    setRTS: async (state) => {
      rts.push(state);
    },
  };
  return { transport, rts };
}

test("HardReset pulses RTS: EN low, then released", async () => {
  const { transport, rts } = makeRecordingTransport();

  await new HardReset(transport).reset();

  assert.deepEqual(rts, [true, false]);
});

test("HardReset pulses RTS for USB-OTG too", async () => {
  const { transport, rts } = makeRecordingTransport();

  await new HardReset(transport, true).reset();

  assert.deepEqual(rts, [true, false]);
});

/**
 * Build a real Transport on a serial port that only tracks the DTR and RTS
 * levels it is asked to set, and records each combined state.
 * @returns {{ transport: Transport, states: string[] }} Transport and the line states seen on the port.
 */
function makeTransportOnRecordingPort() {
  const line = { dtr: false, rts: false };
  const states = [];
  const device = {
    getInfo: () => ({}),
    setSignals: async (signals) => {
      if (signals.dataTerminalReady !== undefined) line.dtr = signals.dataTerminalReady;
      if (signals.requestToSend !== undefined) line.rts = signals.requestToSend;
      states.push(`DTR=${Number(line.dtr)} RTS=${Number(line.rts)}`);
    },
  };
  return { transport: new Transport(device), states };
}

test("HardReset after ClassicReset holds EN low with IO0 high, then releases both", async () => {
  const { transport, states } = makeTransportOnRecordingPort();
  await new ClassicReset(transport, 1).reset(); // connect sequence, ends with DTR and RTS released
  states.length = 0;

  await new HardReset(transport).reset();

  // RTS alone asserted pulls EN low. DTR must stay released, or EN is released again at once.
  assert.ok(!states.includes("DTR=1 RTS=1"), `DTR was asserted during the reset: ${states.join(", ")}`);
  assert.ok(states.includes("DTR=0 RTS=1"), `EN was never pulled low: ${states.join(", ")}`);
  assert.equal(states.at(-1), "DTR=0 RTS=0");
});
