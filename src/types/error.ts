/**
 * Represents a Espressif chip error.
 */
class ESPError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Represents a Espressif timeout chip error.
 */
class TimeoutError extends ESPError {}

/**
 * ROM loader returned an invalid command response (e.g. restricted download mode).
 */
class UnsupportedCommandError extends ESPError {
  constructor(message = "unsupported command error") {
    super(message);
  }
}

/**
 * GET_SECURITY_INFO returned a chip ID that does not match any known target.
 */
class UnexpectedChipIdError extends ESPError {
  constructor(chipId: number) {
    super(`Unexpected chip ID value ${chipId}. Failed to autodetect chip type.`);
  }
}

/**
 * Chip-detect magic register value does not match any known target.
 */
class UnexpectedChipMagicError extends ESPError {
  constructor(chipMagicValue: number) {
    super(`Unexpected CHIP magic value 0x${chipMagicValue.toString(16)}. Failed to autodetect chip type.`);
  }
}

/**
 * GET_SECURITY_INFO succeeded but the payload has no chip ID (ESP32-S2).
 */
class MissingChipIdError extends ESPError {
  constructor(
    message = "Security info command does not contain chip ID. " +
      "This is expected for ESP32-S2 which doesn't support chip ID in security info.",
  ) {
    super(message);
  }
}

export {
  ESPError,
  TimeoutError,
  UnsupportedCommandError,
  UnexpectedChipIdError,
  UnexpectedChipMagicError,
  MissingChipIdError,
};
