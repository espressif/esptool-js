export interface ITrace {
  /**
   * Buffer with all trace messages.
   * @type {string}
   */
  traceBuffer: string;

  /**
   * Send message for tracing output.
   * @param {string} message Message to format as trace line.
   */
  trace(message: string): void;

  /**
   * Method to return content of tracing buffer.
   */
  returnTrace(): Promise<string>;
}
