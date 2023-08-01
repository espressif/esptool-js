export interface SerialOptions {
  /*
  Note: According to the documentation of the Web Serial API, 'baudRate' is a
  'required' field as part of serial options. However, we are currently
  maintaining 'baudRate' as a separate parameter outside the options
  dictionary, and it is effectively used in the code. For now, we are
  keeping it optional in the dictionary to avoid conflicts.
  */
  baudRate?: number | undefined;
  dataBits?: number | undefined;
  stopBits?: number | undefined;
  parity?: ParityType | undefined;
  bufferSize?: number | undefined;
  flowControl?: FlowControlType | undefined;
}

/**
 * Wrapper class around Webserial API to communicate with the serial device.
 *
 * @param {SerialPort} device - Requested device prompted by the browser.
 *
 * const port = await navigator.serial.requestPort();
 */
class Transport {
  public slip_reader_enabled = false;
  public left_over = new Uint8Array(0);
  public baudrate = 0;

  constructor(public device: SerialPort) {}

  /**
   * Request the serial device vendor ID and Product ID as string.
   * @returns {string} Return the device VendorID and ProductID from SerialPortInfo as formatted string.
   */
  getInfo() {
    const info = this.device.getInfo();
    return info.usbVendorId && info.usbProductId
      ? `WebSerial VendorID 0x${info.usbVendorId.toString(16)} ProductID 0x${info.usbProductId.toString(16)}`
      : "";
  }

  /**
   * Request the serial device product id from SerialPortInfo.
   * @returns {string} Return the product ID.
   */
  getPid() {
    return this.device.getInfo().usbProductId;
  }

  /**
   * Format data packet using the Serial Line Internet Protocol (SLIP).
   * @param {Uint8Array} data Binary unsigned 8 bit array data to format.
   * @returns {Uint8Array} Formatted unsigned 8 bit data array.
   */
  slipWriter(data: Uint8Array) {
    let count_esc = 0;
    let i = 0,
      j = 0;

    for (i = 0; i < data.length; i++) {
      if (data[i] === 0xc0 || data[i] === 0xdb) {
        count_esc++;
      }
    }
    const out_data = new Uint8Array(2 + count_esc + data.length);
    out_data[0] = 0xc0;
    j = 1;
    for (i = 0; i < data.length; i++, j++) {
      if (data[i] === 0xc0) {
        out_data[j++] = 0xdb;
        out_data[j] = 0xdc;
        continue;
      }
      if (data[i] === 0xdb) {
        out_data[j++] = 0xdb;
        out_data[j] = 0xdd;
        continue;
      }

      out_data[j] = data[i];
    }
    out_data[j] = 0xc0;
    return out_data;
  }

  /**
   * Write binary data to device using the WebSerial device writable stream.
   * @param data 8 bit unsigned data array to write to device.
   */
  async write(data: Uint8Array) {
    const out_data = this.slipWriter(data);

    if (this.device.writable) {
      const writer = this.device.writable.getWriter();
      await writer.write(out_data);
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
   * @returns {Uint8Array}
   */
  slipReader(data: Uint8Array) {
    let i = 0;
    let data_start = 0,
      data_end = 0;
    let state = "init";
    while (i < data.length) {
      if (state === "init" && data[i] == 0xc0) {
        data_start = i + 1;
        state = "valid_data";
        i++;
        continue;
      }
      if (state === "valid_data" && data[i] == 0xc0) {
        data_end = i - 1;
        state = "packet_complete";
        break;
      }
      i++;
    }
    if (state !== "packet_complete") {
      this.left_over = data;
      return new Uint8Array(0);
    }

    this.left_over = data.slice(data_end + 2);
    const temp_pkt = new Uint8Array(data_end - data_start + 1);
    let j = 0;
    for (i = data_start; i <= data_end; i++, j++) {
      if (data[i] === 0xdb && data[i + 1] === 0xdc) {
        temp_pkt[j] = 0xc0;
        i++;
        continue;
      }
      if (data[i] === 0xdb && data[i + 1] === 0xdd) {
        temp_pkt[j] = 0xdb;
        i++;
        continue;
      }
      temp_pkt[j] = data[i];
    }
    const packet = temp_pkt.slice(0, j); /* Remove unused bytes due to escape seq */
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
    let packet = this.left_over;
    this.left_over = new Uint8Array(0);
    if (this.slip_reader_enabled) {
      const val_final = this.slipReader(packet);
      if (val_final.length > 0) {
        return val_final;
      }
      packet = this.left_over;
      this.left_over = new Uint8Array(0);
    }
    if (this.device.readable == null) {
      return this.left_over;
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
          this.left_over = packet;
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
    if (this.slip_reader_enabled) {
      return this.slipReader(packet);
    }
    return packet;
  }

  /**
   * Read from serial device without slip formatting.
   * @param timeout Read timeout in milliseconds (ms)
   * @returns {Uint8Array} 8 bit unsigned data array read from device.
   */
  async rawRead(timeout = 0) {
    if (this.left_over.length != 0) {
      const p = this.left_over;
      this.left_over = new Uint8Array(0);
      return p;
    }
    if (!this.device.readable) {
      return this.left_over;
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
    this.left_over = new Uint8Array(0);
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
