/* global SerialPort, ParityType, FlowControlType */

import { ISerialTransport, ISerialOptions } from "./ISerialTransport";
import { hexConvert } from "../utils/hex";
import { appendArray } from "../utils/convert";

/**
 * Options for device serialPort.
 * @interface SerialOptions
 */
export interface SerialOptions extends ISerialOptions {
  /**
   * The number of data bits per frame. Either 7 or 8.
   * @type {number | undefined}
   */
  dataBits?: number | undefined;

  /**
   * The number of stop bits at the end of a frame. Either 1 or 2.
   * @type {number | undefined}
   */
  stopBits?: number | undefined;

  /**
   * The parity mode: none, even or odd
   * @type {ParityType | undefined}
   */
  parity?: ParityType | undefined;

  /**
   * A positive, non-zero value indicating the size of the read and write buffers that should be created.
   * @type {number | undefined}
   */
  bufferSize?: number | undefined;

  /**
   * The flow control mode: none or hardware.
   * @type {FlowControlType | undefined}
   */
  flowControl?: FlowControlType | undefined;
}

/**
 * Wrapper class around Webserial API to communicate with the serial device.
 * @param {typeof import("w3c-web-serial").SerialPort} device - Requested device prompted by the browser.
 * @param {boolean} tracing - Enable communication tracing
 *
 * ```
 * const port = await navigator.serial.requestPort();
 * ```
 */
export class WebSerialTransport implements ISerialTransport {
  public leftOver = new Uint8Array(0);
  private traceLog = "";
  private lastTraceTime = Date.now();
  private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

  constructor(public device: SerialPort, public tracing = false) {}

  /**
   * Request the serial device vendor ID and Product ID as string.
   * @returns {string} Return the device VendorID and ProductID from SerialPortInfo as formatted string.
   */
  getInfo(): string {
    const info = this.device.getInfo();
    return info.usbVendorId && info.usbProductId
      ? `WebSerial VendorID 0x${info.usbVendorId.toString(16)} ProductID 0x${info.usbProductId.toString(16)}`
      : "";
  }

  /**
   * Request the serial device product id from SerialPortInfo.
   * @returns {number | undefined} Return the product ID.
   */
  getPID(): number | undefined {
    return this.device.getInfo().usbProductId;
  }

  /**
   * Format received or sent data for tracing output.
   * @param {string} message Message to format as trace line.
   */
  trace(message: string) {
    const delta = Date.now() - this.lastTraceTime;
    const prefix = `TRACE ${delta.toFixed(3)}`;
    const traceMessage = `${prefix} ${message}`;
    console.log(traceMessage);
    this.traceLog += traceMessage + "\n";
  }

  /**
   * Return the whole trace output to the user clipboard.
   */
  async returnTrace() {
    try {
      await navigator.clipboard.writeText(this.traceLog);
      console.log("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }

  /**
   * Write binary data to device using the WebSerial device writable stream.
   * @param {Uint8Array} outData 8 bit unsigned data array to write to device.
   */
  async write(outData: Uint8Array) {
    if (this.device.writable) {
      const writer = this.device.writable.getWriter();
      if (this.tracing) {
        console.log("Write bytes");
        this.trace(`Write ${outData.length} bytes: ${hexConvert(outData)}`);
      }
      await writer.write(outData);
      writer.releaseLock();
    }
  }

  /**
   * Read from serial device without slip formatting.
   * @param {number} timeout Read timeout in milliseconds (ms)
   * @param {number} minData Minimum packet array length
   * @param {Uint8Array} packet Unsigned 8 bit array from the device read stream.
   * @returns {Promise<Uint8Array>} 8 bit unsigned data array read from device.
   */
  async read(timeout: number = 0, minData: number = 0, packet?: Uint8Array): Promise<Uint8Array> {
    if (this.leftOver.length != 0) {
      const p = this.leftOver;
      this.leftOver = new Uint8Array(0);
      return p;
    }
    if (!this.device.readable) {
      return this.leftOver;
    }
    this.reader = this.device.readable.getReader();
    let t;
    if (!packet) {
      packet = this.leftOver;
    }
    try {
      if (timeout > 0) {
        t = setTimeout(() => {
          if (this.reader) {
            this.reader.cancel();
          }
        }, timeout);
      }

      do {
        const { value, done } = await this.reader.read();
        if (done) {
          this.leftOver = packet;
          throw new Error("Timeout");
        }
        if (this.tracing) {
          console.log("Raw Read bytes");
          this.trace(`Read ${value.length} bytes: ${hexConvert(value)}`);
        }
        const p = appendArray(packet, value);
        packet = p;
      } while (packet.length < minData);
      return packet;
    } finally {
      if (timeout > 0) {
        clearTimeout(t);
      }
      this.reader.releaseLock();
    }
  }

  _DTR_state = false;
  /**
   * Send the RequestToSend (RTS) signal to given state
   * # True for EN=LOW, chip in reset and False EN=HIGH, chip out of reset
   * @param {boolean} state Boolean state to set the signal
   */
  async setRTS(state: boolean) {
    await this.device.setSignals({ requestToSend: state });
    // # Work-around for adapters on Windows using the usbser.sys driver:
    // # generate a dummy change to DTR so that the set-control-line-state
    // # request is sent with the updated RTS state and the same DTR state
    // Referenced to esptool.py
    await this.setDTR(this._DTR_state);
  }

  /**
   * Send the dataTerminalReady (DTS) signal to given state
   * # True for IO0=LOW, chip in reset and False IO0=HIGH
   * @param {boolean} state Boolean state to set the signal
   */
  async setDTR(state: boolean) {
    this._DTR_state = state;
    await this.device.setSignals({ dataTerminalReady: state });
  }

  /**
   * Connect to serial device using the Webserial open method.
   * @param {SerialOptions} serialOptions Serial Options for ESP Loader class.
   */
  async connect(serialOptions: SerialOptions) {
    await this.device.open({
      baudRate: serialOptions.baudRate || 115200,
      dataBits: serialOptions?.dataBits,
      stopBits: serialOptions?.stopBits,
      bufferSize: serialOptions?.bufferSize,
      parity: serialOptions?.parity,
      flowControl: serialOptions?.flowControl,
    });
    this.leftOver = new Uint8Array(0);
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait for a given timeout ms for serial device unlock.
   * @param {number} timeout Timeout time in milliseconds (ms) to sleep
   */
  async waitForUnlock(timeout: number) {
    while (
      (this.device.readable && this.device.readable.locked) ||
      (this.device.writable && this.device.writable.locked)
    ) {
      await this.sleep(timeout);
    }
  }

  /**
   * Disconnect from serial device by running SerialPort.close() after streams unlock.
   */
  async disconnect() {
    if (this.device.readable?.locked) {
      await this.reader?.cancel();
    }
    await this.waitForUnlock(400);
    this.reader = undefined;
    await this.device.close();
  }
}
