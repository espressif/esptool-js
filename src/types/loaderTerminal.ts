/**
 * A wrapper around your implementation of a terminal by
 * implementing the clean, write and writeLine methods
 * which are called by the ESPLoader class.
 * @interface IEspLoaderTerminal
 */
export interface IEspLoaderTerminal {
  /**
   * Execute a terminal clean command.
   */
  clean: () => void;
  /**
   * Write a string of data that include a line terminator.
   * @param {string} data - The string to write with line terminator.
   */
  writeLine: (data: string) => void;
  /**
   * Write a string of data.
   * @param {string} data - The string to write.
   */
  write: (data: string) => void;
}
