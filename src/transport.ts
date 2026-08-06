/**
 * Serial options for Web Serial open().
 */
export interface SerialOptions {
  baudRate?: number;
  dataBits?: 7 | 8;
  stopBits?: 1 | 2;
  parity?: ParityType;
  bufferSize?: number;
  flowControl?: FlowControlType;
}

export type SerialSignals = {
  dataTerminalReady?: boolean;
  requestToSend?: boolean;
};

/**
 * Web Serial transport adapted for the esp-serial-flasher WASM port.
 * Owns port lifecycle, background RX into Module.serialBuffer, and baud reconfigure.
 */
export class Transport {
  public baudrate = 115200;
  private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  private writer: WritableStreamDefaultWriter<Uint8Array> | undefined;
  private backgroundReading = false;
  private readLoopPromise: Promise<void> | null = null;
  private writeChain: Promise<void> = Promise.resolve();
  private reconfiguring = false;
  private serialBufferOwner: { serialBuffer: Uint8Array } | null = null;
  private onDeviceLostCallback: (() => void) | null = null;
  private disconnectHandler: ((event: Event) => void) | null = null;

  constructor(public device: SerialPort) {}

  /**
   * Request a serial port from the user (Web Serial).
   * @param options
   */
  static async requestPort(options?: SerialPortRequestOptions): Promise<Transport> {
    const device = await navigator.serial.requestPort(options);
    return new Transport(device);
  }

  /**
   * Bind the RX buffer sink used by the WASM port (typically the Emscripten Module).
   * @param owner
   * @param owner.serialBuffer
   */
  setSerialBufferOwner(owner: { serialBuffer: Uint8Array }): void {
    this.serialBufferOwner = owner;
    if (!owner.serialBuffer) {
      owner.serialBuffer = new Uint8Array(0);
    }
  }

  clearSerialBuffer(): void {
    if (this.serialBufferOwner) {
      this.serialBufferOwner.serialBuffer = new Uint8Array(0);
    }
  }

  private appendToSerialBuffer(chunk: Uint8Array): void {
    if (!this.serialBufferOwner) {
      return;
    }
    const oldBuffer = this.serialBufferOwner.serialBuffer || new Uint8Array(0);
    const newBuffer = new Uint8Array(oldBuffer.length + chunk.length);
    newBuffer.set(oldBuffer);
    newBuffer.set(chunk, oldBuffer.length);
    this.serialBufferOwner.serialBuffer = newBuffer;
  }

  setDeviceLostCallback(callback: (() => void) | null): void {
    this.onDeviceLostCallback = callback;
  }

  getInfo(): string {
    const info = this.device.getInfo();
    return info.usbVendorId && info.usbProductId
      ? `WebSerial VendorID 0x${info.usbVendorId.toString(16)} ProductID 0x${info.usbProductId.toString(16)}`
      : "";
  }

  getPid(): number | undefined {
    return this.device.getInfo().usbProductId;
  }

  /**
   * Open the serial port and start the background reader.
   * @param baudRate
   * @param options
   */
  async open(baudRate = 115200, options: SerialOptions = {}): Promise<void> {
    this.baudrate = baudRate;
    await this.device.open({
      baudRate,
      dataBits: options.dataBits ?? 8,
      stopBits: options.stopBits ?? 1,
      parity: options.parity ?? "none",
      bufferSize: options.bufferSize ?? 1024 * 1024,
      flowControl: options.flowControl ?? "none",
    });

    try {
      await this.device.setSignals({ dataTerminalReady: false, requestToSend: false });
    } catch {
      // Some adapters do not support signal control.
    }

    this.disconnectHandler = (event: Event) => {
      if (event.target === this.device) {
        this.onDeviceLostCallback?.();
      }
    };
    navigator.serial.addEventListener("disconnect", this.disconnectHandler);

    this.clearSerialBuffer();
    this.startBackgroundReader();
  }

  /**
   * @param baud
   * @param serialOptions
   * @deprecated Use open()
   */
  async connect(baud = 115200, serialOptions: SerialOptions = {}): Promise<void> {
    await this.open(baud, serialOptions);
  }

  private startBackgroundReader(): void {
    if (this.backgroundReading) {
      return;
    }
    this.backgroundReading = true;
    this.readLoopPromise = (async () => {
      try {
        if (!this.device.readable) {
          return;
        }
        this.reader = this.device.readable.getReader();
        while (this.backgroundReading) {
          try {
            const { value, done } = await this.reader.read();
            if (done) {
              break;
            }
            if (value && value.length > 0) {
              this.appendToSerialBuffer(value);
            }
          } catch {
            if (this.backgroundReading) {
              break;
            }
          }
        }
      } finally {
        this.backgroundReading = false;
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch {
            // ignore
          }
          this.reader = undefined;
        }
        this.readLoopPromise = null;
      }
    })();
  }

  private async stopBackgroundReader(): Promise<void> {
    if (!this.backgroundReading && !this.readLoopPromise) {
      return;
    }
    this.backgroundReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch {
        // ignore
      }
    }
    if (this.readLoopPromise) {
      try {
        await this.readLoopPromise;
      } catch {
        // ignore
      }
    }
  }

  private async releaseWriter(closeWriter: boolean): Promise<void> {
    if (!this.writer) {
      return;
    }
    try {
      if (closeWriter) {
        await this.writer.close();
      }
    } catch {
      // ignore
    }
    try {
      this.writer.releaseLock();
    } catch {
      // ignore
    }
    this.writer = undefined;
  }

  /**
   * Write raw bytes to the serial port (used by WASM port ops).
   * @param data
   */
  async write(data: Uint8Array): Promise<void> {
    if (!this.device.writable) {
      throw new Error("Serial port not open or not writable");
    }
    if (this.reconfiguring) {
      throw new Error("Cannot write while serial port is reconfiguring");
    }

    this.writeChain = this.writeChain.then(async () => {
      if (!this.device.writable) {
        throw new Error("Serial port became unavailable during write");
      }
      if (!this.writer) {
        this.writer = this.device.writable.getWriter();
      }
      await this.writer.write(data);
    });

    try {
      await this.writeChain;
    } catch (err) {
      await this.releaseWriter(false);
      this.writeChain = Promise.resolve();
      throw err;
    }
  }

  async setSignals(signals: SerialSignals): Promise<void> {
    await this.device.setSignals(signals);
  }

  /**
   * Change baud rate without toggling DTR/RTS (avoids resetting a running stub).
   * @param newBaud
   */
  async reconfigureBaud(newBaud: number): Promise<void> {
    if (this.baudrate === newBaud) {
      return;
    }
    try {
      await this.writeChain;
    } catch {
      // ignore pending write errors before reconfigure
    }

    this.reconfiguring = true;
    try {
      await this.releaseWriter(false);
      await this.stopBackgroundReader();
      this.clearSerialBuffer();
      await this.device.close();
      await this.device.open({
        baudRate: newBaud,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
        bufferSize: 1024 * 1024,
      });
      this.clearSerialBuffer();
      this.startBackgroundReader();
      this.baudrate = newBaud;
    } finally {
      this.reconfiguring = false;
    }
  }

  async close(): Promise<void> {
    await this.stopBackgroundReader();
    await this.releaseWriter(true);
    this.clearSerialBuffer();

    if (this.disconnectHandler) {
      navigator.serial.removeEventListener("disconnect", this.disconnectHandler);
      this.disconnectHandler = null;
    }

    if (this.device) {
      try {
        let attempts = 0;
        while ((this.device.readable?.locked || this.device.writable?.locked) && attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        await this.device.close();
      } catch {
        // ignore
      }
    }
    this.writeChain = Promise.resolve();
    this.baudrate = 115200;
  }

  /** @deprecated Use close() */
  async disconnect(): Promise<void> {
    await this.close();
  }
}
