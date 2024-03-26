import { ISerialTransport } from "./transport/ISerialTransport.js";

const DEFAULT_RESET_DELAY = 50;

/**
 * Sleep for ms milliseconds
 * @param {number} ms Milliseconds to wait
 * @returns {Promise<void>}
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a classic set of commands that will reset the chip.
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
 * @param {ISerialTransport} transport Transport class to perform serial communication.
 * @param {number} resetDelay Delay in milliseconds for reset.
 */
export async function classicReset(transport: ISerialTransport, resetDelay = DEFAULT_RESET_DELAY) {
  await customReset(transport, `D0|R1|W100|D1|R0|W${resetDelay}|D0`);
}

/**
 * Execute a set of commands for USB JTAG serial reset.
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
 * @param {ISerialTransport} transport Transport class to perform serial communication.
 */
export async function usbJTAGSerialReset(transport: ISerialTransport) {
  await customReset(transport, `R0|D0|W100|D1|R0|W100|R1|D0|R1|W100|R0|D0`);
}

/**
 * Execute a set of commands that will hard reset the chip.
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
 * @param {ISerialTransport} transport Transport class to perform serial communication.
 * @param {boolean} usingUsbOtg is it using USB-OTG ?
 */
export async function hardReset(transport: ISerialTransport, usingUsbOtg = false) {
  const resetSequence = usingUsbOtg ? `R1|W200|R0|W200` : `R1|W100|R0`;
  await customReset(transport, resetSequence);
}

type CmdsArgsTypes = {
  D: boolean;
  R: boolean;
  W: number;
};

/**
 * Validate a sequence string based on the following format:
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
 * @param {string} seqStr Sequence string to validate
 * @returns {boolean} Is the sequence string valid ?
 */
export function validateCustomResetStringSequence(seqStr: string): boolean {
  const commands: (keyof CmdsArgsTypes)[] = ["D", "R", "W"];

  const commandsList = seqStr.split("|");

  for (const cmd of commandsList) {
    const code = cmd[0];
    const arg = cmd.slice(1);

    if (!commands.includes(code as keyof CmdsArgsTypes)) {
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
 * @param {ISerialTransport} transport Transport class to perform serial communication.
 * @param {string} sequenceString Custom string sequence for reset strategy
 */
export async function customReset(transport: ISerialTransport, sequenceString: string) {
  const resetDictionary: { [K in keyof CmdsArgsTypes]: (arg: CmdsArgsTypes[K]) => Promise<void> } = {
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
      const cmdKey = cmd[0];
      const cmdVal = cmd.slice(1);
      if (cmdKey === "W") {
        await resetDictionary["W"](Number(cmdVal));
      } else if (cmdKey === "D" || cmdKey === "R") {
        await resetDictionary[cmdKey as "D" | "R"](cmdVal === "1");
      }
    }
  } catch (error) {
    throw new Error("Invalid custom reset sequence");
  }
}

export default { classicReset, customReset, hardReset, usbJTAGSerialReset, validateCustomResetStringSequence };
