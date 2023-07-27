/* global SerialPort, ParityType, FlowControlType */

/**
 * Options for device serialPort.
 * @interface SerialOptions
 *
 * Note: According to the documentation of the Web Serial API, 'baudRate' is a
 * 'required' field as part of serial options. However, we are currently
 * maintaining 'baudRate' as a separate parameter outside the options
 * dictionary, and it is effectively used in the code. For now, we are
 * keeping it optional in the dictionary to avoid conflicts.
 */
export interface SerialOptions {
  /**
   * A positive, non-zero value indicating the baud rate at which serial communication should be established.
   * @type {number | undefined}
   */
  baudRate?: number | undefined;

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
 *
 * ```
 * const port = await navigator.serial.requestPort();
 * ```
 */
class Transport {
  public slipReaderEnabled = false;
  public leftOver = new Uint8Array(0);
  public baudrate = 0;
  private traceLog = "";
  private lastTraceTime = Date.now();

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
  getPid(): number | undefined {
    return this.device.getInfo().usbProductId;
  }

  /**
   * Format received or sent data (read/write) in Hexadecimal format for tracing output.
   * @param {Uint8Array} buffer Binary unsigned 8 bit array data to format.
   */
  trace(message: Uint8Array) {
    const delta = Date.now() - this.lastTraceTime;
    const prefix = `TRACE ${delta.toFixed(2)}`;
    const traceMessage = `${prefix} ${this.hexConvert(message)}`;
    console.log(traceMessage);
    this.traceLog += traceMessage + "\n";
  }

  async returnTrace() {
    try {
      await navigator.clipboard.writeText(this.traceLog);
      console.log("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }

  private hexify(s: string, uppercase = true): string {
    const format_str = uppercase ? "%02X" : "%02x";
    return s
      .split("")
      .map((c) => {
        const charCode = c.charCodeAt(0);
        return format_str.replace(/%02([xX])/g, (_, caseFormat) =>
          caseFormat === "X" ? charCode.toString(16).toUpperCase() : charCode.toString(16),
        );
      })
      .join("");
  }

  hexConvert(buffer: Uint8Array) {
    const bufferStr = String.fromCharCode(...[].slice.call(buffer));
    if (bufferStr.length > 16) {
      let result = "";
      let s = bufferStr;
      while (s.length > 0) {
        const line = s.slice(0, 16);
        const ascii_line = line
          .split("")
          .map((c) => (c === " " || (c >= " " && c <= "~" && c !== "  ") ? c : "."))
          .join("");
        s = s.slice(16);
        result += `\n    ${this.hexify(line.slice(0, 8))} ${this.hexify(line.slice(8))} | ${ascii_line}`;
      }
      return result;
    } else {
      return this.hexify(bufferStr);
    }
  }

  /**
   * Format data packet using the Serial Line Internet Protocol (SLIP).
   * @param {Uint8Array} data Binary unsigned 8 bit array data to format.
   * @returns {Uint8Array} Formatted unsigned 8 bit data array.
   */
  slipWriter(data: Uint8Array) {
    let countEsc = 0;
    let i = 0,
      j = 0;

    for (i = 0; i < data.length; i++) {
      if (data[i] === 0xc0 || data[i] === 0xdb) {
        countEsc++;
      }
    }
    const outData = new Uint8Array(2 + countEsc + data.length);
    outData[0] = 0xc0;
    j = 1;
    for (i = 0; i < data.length; i++, j++) {
      if (data[i] === 0xc0) {
        outData[j++] = 0xdb;
        outData[j] = 0xdc;
        continue;
      }
      if (data[i] === 0xdb) {
        outData[j++] = 0xdb;
        outData[j] = 0xdd;
        continue;
      }

      outData[j] = data[i];
    }
    outData[j] = 0xc0;
    return outData;
  }

  /**
   * Write binary data to device using the WebSerial device writable stream.
   * @param {Uint8Array} data 8 bit unsigned data array to write to device.
   */
  async write(data: Uint8Array) {
    const outData = this.slipWriter(data);

    if (this.device.writable) {
      const writer = this.device.writable.getWriter();
      if (this.tracing) {
        console.log("Write bytes");
        this.trace(outData);
      }
      await writer.write(outData);
      writer.releaseLock();
    }
  }

  /**
   * Concatenate buffer2 to buffer1 and return the resulting ArrayBuffer.
   * @param {ArrayBuffer} buffer1 First buffer to concatenate.
   * @param {ArrayBuffer} buffer2 Second buffer to concatenate.
   * @returns {ArrayBuffer} Result Array buffer.
   */
  _appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

  /**
   * Take a data array and return the first well formed packet after
   * replacing the escape sequence. Reads at least 8 bytes.
   * @param {Uint8Array} data Unsigned 8 bit array from the device read stream.
   * @returns {Uint8Array} Formatted packet using SLIP escape sequences.
   */
  slipReader(data: Uint8Array) {
    let i = 0;
    let dataStart = 0,
      dataEnd = 0;
    let state = "init";
    while (i < data.length) {
      if (state === "init" && data[i] == 0xc0) {
        dataStart = i + 1;
        state = "valid_data";
        i++;
        continue;
      }
      if (state === "valid_data" && data[i] == 0xc0) {
        dataEnd = i - 1;
        state = "packet_complete";
        break;
      }
      i++;
    }
    if (state !== "packet_complete") {
      this.leftOver = data;
      return new Uint8Array(0);
    }

    this.leftOver = data.slice(dataEnd + 2);
    const tempPkt = new Uint8Array(dataEnd - dataStart + 1);
    let j = 0;
    for (i = dataStart; i <= dataEnd; i++, j++) {
      if (data[i] === 0xdb && data[i + 1] === 0xdc) {
        tempPkt[j] = 0xc0;
        i++;
        continue;
      }
      if (data[i] === 0xdb && data[i + 1] === 0xdd) {
        tempPkt[j] = 0xdb;
        i++;
        continue;
      }
      tempPkt[j] = data[i];
    }
    const packet = tempPkt.slice(0, j); /* Remove unused bytes due to escape seq */
    return packet;
  }

  /**
   * Read from serial device using the device ReadableStream.
   * @param {number} timeout Read timeout number
   * @param {number} minData Minimum packet array length
   * @returns {Uint8Array} 8 bit unsigned data array read from device.
   */
  async read(timeout = 0, minData = 12) {
    let t;
    let packet = this.leftOver;
    this.leftOver = new Uint8Array(0);
    if (this.slipReaderEnabled) {
      const valFinal = this.slipReader(packet);
      if (valFinal.length > 0) {
        return valFinal;
      }
      packet = this.leftOver;
      this.leftOver = new Uint8Array(0);
    }
    if (this.device.readable == null) {
      return this.leftOver;
    }

    const reader = this.device.readable.getReader();
    try {
      if (timeout > 0) {
        t = setTimeout(function () {
          reader.cancel();
        }, timeout);
      }
      do {
        const { value, done } = await reader.read();
        if (done) {
          this.leftOver = packet;
          throw new Error("Timeout");
        }
        const p = new Uint8Array(this._appendBuffer(packet.buffer, value.buffer));
        packet = p;
      } while (packet.length < minData);
    } finally {
      if (timeout > 0) {
        clearTimeout(t);
      }
      reader.releaseLock();
    }

    if (this.tracing) {
      console.log("Read bytes");
      this.trace(packet);
    }

    if (this.slipReaderEnabled) {
      const slipReaderResult = this.slipReader(packet);
      if (this.tracing) {
        console.log("Slip reader results");
        this.trace(slipReaderResult);
      }
      return slipReaderResult;
    }
    return packet;
  }

  /**
   * Read from serial device without slip formatting.
   * @param {number} timeout Read timeout in milliseconds (ms)
   * @returns {Uint8Array} 8 bit unsigned data array read from device.
   */
  async rawRead(timeout = 0) {
    if (this.leftOver.length != 0) {
      const p = this.leftOver;
      this.leftOver = new Uint8Array(0);
      return p;
    }
    if (!this.device.readable) {
      return this.leftOver;
    }
    const reader = this.device.readable.getReader();
    let t;
    try {
      if (timeout > 0) {
        t = setTimeout(function () {
          reader.cancel();
        }, timeout);
      }
      const { value, done } = await reader.read();
      if (done) {
        throw new Error("Timeout");
      }
      if (this.tracing) {
        console.log("Raw Read bytes");
        this.trace(value);
      }
      return value;
    } finally {
      if (timeout > 0) {
        clearTimeout(t);
      }
      reader.releaseLock();
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
   * @param {number} baud Number baud rate for serial connection.
   * @param {typeof import("w3c-web-serial").SerialOptions} serialOptions Serial Options for WebUSB SerialPort class.
   */
  async connect(baud = 115200, serialOptions: SerialOptions = {}) {
    await this.device.open({
      baudRate: baud,
      dataBits: serialOptions?.dataBits,
      stopBits: serialOptions?.stopBits,
      bufferSize: serialOptions?.bufferSize,
      parity: serialOptions?.parity,
      flowControl: serialOptions?.flowControl,
    });
    this.baudrate = baud;
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
    await this.waitForUnlock(400);
    await this.device.close();
  }
}

export { Transport };
