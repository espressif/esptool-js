/**
 * Options for device connection.
 * @interface ISerialOptions
 */
export interface ISerialOptions {
  /**
   * A positive, non-zero value indicating the baud rate at which serial communication should be established.
   * @type {number}
   */
  baudRate: number;
}

/**
 * Template to define Transport class which can be consumed by the ESPLoader.
 * A Webserial reference implementation is found at src/transport/WebSerialTransport.ts
 */
export abstract class AbstractTransport {
  public abstract tracing: boolean;
  public abstract leftOver: Uint8Array;

  /**
   * Request the serial device information as string.
   * @returns {string} Return the serial device information as formatted string.
   */
  public abstract getInfo(): string;

  /**
   * Request the serial device product id.
   * @returns {number | undefined} Return the product ID.
   */
  public abstract getPID(): number | undefined;

  /**
   * Format received or sent data for tracing output.
   * @param {string} message Message to format as trace line.
   */
  public abstract trace(message: string): void;

  /**
   * Write binary data to device.
   * @param {Uint8Array} data 8 bit unsigned data array to write to device.
   */
  public abstract write(data: Uint8Array): Promise<void>;

  /**
   * Read from serial device without formatting.
   * @param {number} timeout Read timeout in milliseconds (ms)
   * @param {number} minData Minimum packet array length
   * @param {Uint8Array} packet Unsigned 8 bit array from the device read stream.
   * @returns {Promise<Uint8Array>} 8 bit unsigned data array read from device.
   */
  public abstract rawRead(timeout?: number, minData?: number, packet?: Uint8Array): Promise<Uint8Array>;

  /**
   * Send the RequestToSend (RTS) signal to given state
   * # True for EN=LOW, chip in reset and False EN=HIGH, chip out of reset
   * @param {boolean} state Boolean state to set the signal
   */
  public abstract setRTS(state: boolean): Promise<void>;

  /**
   * Send the dataTerminalReady (DTS) signal to given state
   * # True for IO0=LOW, chip in reset and False IO0=HIGH
   * @param {boolean} state Boolean state to set the signal
   */
  public abstract setDTR(state: boolean): Promise<void>;

  /**
   * Connect to serial device using the Webserial open method.
   * @param {ISerialOptions} serialOptions Serial Options for WebUSB SerialPort class.
   */
  public abstract connect(serialOptions: ISerialOptions): Promise<void>;

  /**
   * Disconnect from serial device by running SerialPort.close() after streams unlock.
   */
  public abstract disconnect(): Promise<void>;
}
