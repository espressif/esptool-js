class Transport {
  public slip_reader_enabled = false;
  public left_over = new Uint8Array(0);
  public baudrate = 0;

  constructor(public device: SerialPort) {}

  get_info() {
    const info = this.device.getInfo();
    return info.usbVendorId && info.usbProductId
      ? `WebSerial VendorID 0x${info.usbVendorId.toString(16)} ProductID 0x${info.usbProductId.toString(16)}`
      : "";
  }

  get_pid() {
    return this.device.getInfo().usbProductId;
  }

  slip_writer(data: Uint8Array) {
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

  async write(data: Uint8Array) {
    const out_data = this.slip_writer(data);

    if (this.device.writable) {
      const writer = this.device.writable.getWriter();
      await writer.write(out_data);
      writer.releaseLock();
    }
  }

  _appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

  /* this function expects complete packet (hence reader reads for atleast 8 bytes. This function is
   * stateless and returns the first wellformed packet only after replacing escape sequence */
  slip_reader(data: Uint8Array) {
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

  async read(timeout = 0, min_data = 12) {
    let t;
    let packet = this.left_over;
    this.left_over = new Uint8Array(0);
    if (this.slip_reader_enabled) {
      const val_final = this.slip_reader(packet);
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
      } while (packet.length < min_data);
    } finally {
      if (timeout > 0) {
        clearTimeout(t);
      }
      reader.releaseLock();
    }
    if (this.slip_reader_enabled) {
      return this.slip_reader(packet);
    }
    return packet;
  }

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
  async setRTS(state: boolean) {
    await this.device.setSignals({ requestToSend: state });
    // # Work-around for adapters on Windows using the usbser.sys driver:
    // # generate a dummy change to DTR so that the set-control-line-state
    // # request is sent with the updated RTS state and the same DTR state
    // Referenced to esptool.py
    await this.setDTR(this._DTR_state);
  }

  async setDTR(state: boolean) {
    this._DTR_state = state;
    await this.device.setSignals({ dataTerminalReady: state });
  }

  async connect(baud = 115200) {
    await this.device.open({ baudRate: baud });
    this.baudrate = baud;
    this.left_over = new Uint8Array(0);
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async waitForUnlock(timeout: number) {
    while (
      (this.device.readable && this.device.readable.locked) ||
      (this.device.writable && this.device.writable.locked)
    ) {
      await this.sleep(timeout);
    }
  }

  async disconnect() {
    await this.waitForUnlock(400);
    await this.device.close();
  }
}

export { Transport };
