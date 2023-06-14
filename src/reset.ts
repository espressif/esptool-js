import { Transport } from "./webserial";

const DEFAULT_RESET_DELAY = 50;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function classicReset(transport: Transport, resetDelay = DEFAULT_RESET_DELAY) {
  await transport.setDTR(false);
  await transport.setRTS(true);
  await sleep(100);
  await transport.setDTR(true);
  await transport.setRTS(false);
  await sleep(resetDelay);
  await transport.setDTR(false);
}

export async function usbJTAGSerialReset(transport: Transport) {
  await transport.setRTS(false);
  await transport.setDTR(false);
  await sleep(100);

  await transport.setDTR(true);
  await transport.setRTS(false);
  await sleep(100);

  await transport.setRTS(true);
  await transport.setDTR(false);
  await transport.setRTS(true);

  await sleep(100);
  await transport.setRTS(false);
  await transport.setDTR(false);
}

export async function hardReset(transport: Transport, usingUsbOtg = false) {
  if (usingUsbOtg) {
    await sleep(200);
    await transport.setRTS(false);
    await sleep(200);
  } else {
    await sleep(100);
    await transport.setRTS(false);
  }
}

type Command = "D" | "R" | "W";

export function validateCustomResetStringSequence(seqStr: string): boolean {
  const commands: Command[] = ["D", "R", "W"];

  const commandsList = seqStr.split("|");

  for (const cmd of commandsList) {
    const code = cmd[0];
    const arg = cmd.slice(1);

    if (!commands.includes(code as Command)) {
      return false; // Invalid command code
    }

    if (code === "D" || code === "R") {
      if (arg !== "0" && arg !== "1") {
        return false; // Invalid argument for D and R commands
      }
    } else if (code === "W") {
      const delay = parseInt(arg);
      if (isNaN(delay) || delay <= 0) {
        return false; // Invalid argument for W command
      }
    }
  }
  return true; // All commands are valid
}

/**
 * Custom reset strategy defined with a string.
 * 
 * The sequenceString input string consists of individual commands divided by "|".
 * 
 * Commands (e.g. R0) are defined by a code (R) and an argument (0).
 * 
 * The commands are:
 * 
 * D: setDTR - 1=True / 0=False
 * 
 * R: setRTS - 1=True / 0=False
 * 
 * W: Wait (time delay) - positive integer number (miliseconds)
 * 
 * "D0|R1|W100|D1|R0|W50|D0" represents the classic reset strategy
 */
export async function customReset(transport: Transport, sequenceString: string) {
  const resetDictionary: { [key: string]: (arg: any) => Promise<void> } = {
    D: async (arg: boolean) => await transport.setDTR(arg),
    R: async (arg: boolean) => await transport.setRTS(arg),
    W: async (delay: number) => await sleep(delay),
  };
  try {
    const isValidSequence = validateCustomResetStringSequence(sequenceString);
    if (!isValidSequence) {
      return;
    }
    const cmds = sequenceString.split("|");
    for (const cmd of cmds) {
      await resetDictionary[cmd[0]](cmd.slice(1));
    }
  } catch (error) {
    throw new Error("Invalid custom reset sequence");
  }
}

export default { classicReset, customReset, hardReset, usbJTAGSerialReset, validateCustomResetStringSequence };
