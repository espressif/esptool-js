/**
 * Represents a Espressif chip error.
 */
class ESPError extends Error {}

/**
 * Represents a Espressif timeout chip error.
 */
class TimeoutError extends ESPError {}

export { ESPError, TimeoutError };
