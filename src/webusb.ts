import { BaudRateConfigurablePort, SerialOptions } from "./webserial";
import { sleep } from "./util";

const WCH_VID = 0x1a86;
const CH343_PID = 0x55d3;
const CH341_BAUDBASE_FACTOR = 1532620800;
const CH341_BAUDBASE_DIVMAX = 3;
const CH340_INIT = 0xa1;
const CH340_SET_BAUDRATE = 0x9a;
const CH340_SET_HANDSHAKE = 0xa4;
const VENDOR_CLASS = 0xff;
const MAX_TRANSFER_SIZE = 64;

/**
 * Throw when a USB transfer did not complete successfully.
 * @param {object} result USB transfer result.
 * @param {string} action Description of the operation for the error message.
 */
function assertTransferOk(result: USBOutTransferResult | USBInTransferResult, action: string) {
  if (result.status !== "ok") {
    throw new Error(`CH340 ${action} failed: ${result.status}`);
  }
}

/**
 * SerialPort-compatible WebUSB adapter for WCH CH340/CH341.
 * Implements in-place baud changes with vendor request 0x9A so Transport
 * does not need to close and reopen the port.
 */
export class WebUSBSerialPort {
  public readable: ReadableStream<Uint8Array> | null = null;
  public writable: WritableStream<Uint8Array> | null = null;

  private interfaceNumber: number | null = null;
  private endpointIn: number | null = null;
  private endpointOut: number | null = null;
  private currentDtr = false;
  private currentRts = false;
  private controlQueue: Promise<void> = Promise.resolve();
  private readLoopRunning = false;

  /**
   * Wrap an already-selected USBDevice.
   * @param {object} usbDevice CH340/CH341 USB device.
   */
  constructor(private usbDevice: USBDevice) {}

  /**
   * Prompt for a WCH USB-serial device (VID 0x1a86). CH343 (PID 0x55d3) is rejected.
   * @returns {Promise<WebUSBSerialPort>} Adapter for the selected device.
   */
  static async requestPort(): Promise<WebUSBSerialPort> {
    if (!navigator.usb) {
      throw new Error("WebUSB is not available in this browser");
    }
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: WCH_VID }],
    });
    if (device.productId === CH343_PID) {
      throw new Error("CH343 is a CDC device; use the Web Serial API instead of WebUSBSerialPort");
    }
    return new WebUSBSerialPort(device);
  }

  /**
   * USB vendor and product identifiers.
   * @returns {object} Vendor and product IDs.
   */
  getInfo(): SerialPortInfo {
    return {
      usbVendorId: this.usbDevice.vendorId,
      usbProductId: this.usbDevice.productId,
    };
  }

  /**
   * Open the device, claim the vendor bulk interface, and initialize CH340 UART.
   * @param {SerialOptions} options Serial options. Only baudRate is applied on CH340.
   */
  async open(options: SerialOptions = {}) {
    const baudRate = options.baudRate ?? 115200;
    if (this.usbDevice.opened) {
      await this.close();
    }

    await this.usbDevice.open();
    if (!this.usbDevice.configuration || this.usbDevice.configuration.configurationValue !== 1) {
      await this.usbDevice.selectConfiguration(1);
    }

    this.claimBulkInterface();
    if (this.interfaceNumber === null || this.endpointIn === null || this.endpointOut === null) {
      throw new Error("No CH340 vendor bulk IN/OUT interface found");
    }

    try {
      await this.usbDevice.claimInterface(this.interfaceNumber);
    } catch (error) {
      throw new Error(
        `Unable to claim the CH340 USB interface. On desktop OS the kernel driver often owns the device. ${error}`,
      );
    }

    await this.vendorOut(CH340_INIT, 0, 0);
    await this.setBaudRate(baudRate);
    await this.setSignals({ dataTerminalReady: false, requestToSend: false });
    this.createStreams();
  }

  /**
   * Change baud rate in place using CH340 vendor request 0x9A.
   * @param {number} baudRate New baud rate.
   */
  async setBaudRate(baudRate: number) {
    let factor = Math.floor(CH341_BAUDBASE_FACTOR / baudRate);
    let divisor = CH341_BAUDBASE_DIVMAX;
    while (factor > 0xfff0 && divisor > 0) {
      factor >>= 3;
      divisor--;
    }
    if (factor > 0xfff0) {
      throw new Error(`Baudrate ${baudRate} is not supported by CH340`);
    }

    factor = 0x10000 - factor;
    const a = (factor & 0xff00) | divisor;
    const b = factor & 0xff;
    await this.vendorOut(CH340_SET_BAUDRATE, 0x1312, a);
    await this.vendorOut(CH340_SET_BAUDRATE, 0x0f2c, b);
    await sleep(50);
  }

  /**
   * Set DTR/RTS via CH340 handshake request 0xA4.
   * @param {object} signals Control-line values.
   * @param {boolean} [signals.dataTerminalReady] DTR line.
   * @param {boolean} [signals.requestToSend] RTS line.
   */
  async setSignals(signals: { dataTerminalReady?: boolean; requestToSend?: boolean }) {
    if (signals.dataTerminalReady !== undefined) {
      this.currentDtr = signals.dataTerminalReady;
    }
    if (signals.requestToSend !== undefined) {
      this.currentRts = signals.requestToSend;
    }
    const value = ~((this.currentDtr ? 1 << 5 : 0) | (this.currentRts ? 1 << 6 : 0)) & 0xffff;
    await this.vendorOut(CH340_SET_HANDSHAKE, value, 0);
  }

  /**
   * Release the USB interface and close the device.
   */
  async close() {
    this.readLoopRunning = false;
    this.readable = null;
    this.writable = null;
    if (this.usbDevice.opened) {
      if (this.interfaceNumber !== null) {
        try {
          await this.usbDevice.releaseInterface(this.interfaceNumber);
        } catch {
          // Interface may already be released after a disconnect.
        }
      }
      await this.usbDevice.close();
    }
    this.interfaceNumber = null;
    this.endpointIn = null;
    this.endpointOut = null;
  }

  /**
   * Use with Transport, which is typed against the Web Serial SerialPort.
   * @returns {BaudRateConfigurablePort} This adapter as a SerialPort-like object.
   */
  asSerialPort(): BaudRateConfigurablePort {
    return this as unknown as BaudRateConfigurablePort;
  }

  /**
   * Locate the vendor class 0xFF bulk IN/OUT interface.
   */
  private claimBulkInterface() {
    const config = this.usbDevice.configuration;
    if (!config) {
      throw new Error("USB device has no configuration");
    }

    for (const iface of config.interfaces) {
      for (const alternate of iface.alternates) {
        if (alternate.interfaceClass !== VENDOR_CLASS) {
          continue;
        }
        let inEndpoint: number | null = null;
        let outEndpoint: number | null = null;
        for (const endpoint of alternate.endpoints) {
          if (endpoint.type === "bulk" && endpoint.direction === "in") {
            inEndpoint = endpoint.endpointNumber;
          } else if (endpoint.type === "bulk" && endpoint.direction === "out") {
            outEndpoint = endpoint.endpointNumber;
          }
        }
        if (inEndpoint !== null && outEndpoint !== null) {
          this.interfaceNumber = iface.interfaceNumber;
          this.endpointIn = inEndpoint;
          this.endpointOut = outEndpoint;
          return;
        }
      }
    }
  }

  /**
   * Serialize vendor control transfers.
   * @param {number} request bRequest.
   * @param {number} value wValue.
   * @param {number} index wIndex.
   */
  private async vendorOut(request: number, value: number, index: number) {
    const run = this.controlQueue.then(async () => {
      if (!this.usbDevice.opened) {
        throw new Error("CH340 device is not open");
      }
      const result = await this.usbDevice.controlTransferOut({
        requestType: "vendor",
        recipient: "device",
        request,
        value,
        index,
      });
      assertTransferOk(result, `control request 0x${request.toString(16)}`);
    });
    this.controlQueue = run.then(
      () => undefined,
      () => undefined,
    );
    await run;
  }

  /**
   * Create ReadableStream / WritableStream over bulk endpoints.
   */
  private createStreams() {
    const endpointIn = this.endpointIn;
    const endpointOut = this.endpointOut;
    if (endpointIn === null || endpointOut === null) {
      throw new Error("CH340 bulk endpoints are not configured");
    }

    this.readLoopRunning = true;
    this.readable = new ReadableStream<Uint8Array>({
      pull: async (controller) => {
        while (this.readLoopRunning && this.usbDevice.opened) {
          try {
            const result = await this.usbDevice.transferIn(endpointIn, MAX_TRANSFER_SIZE);
            if (result.status === "stall") {
              await this.usbDevice.clearHalt("in", endpointIn);
              continue;
            }
            if (result.status === "ok" && result.data && result.data.byteLength > 0) {
              controller.enqueue(new Uint8Array(result.data.buffer, result.data.byteOffset, result.data.byteLength));
              return;
            }
          } catch (error) {
            if (!this.readLoopRunning || !this.usbDevice.opened) {
              return;
            }
            throw error;
          }
        }
      },
      cancel: () => {
        this.readLoopRunning = false;
      },
    });

    this.writable = new WritableStream<Uint8Array>({
      write: async (chunk) => {
        if (!this.usbDevice.opened) {
          throw new Error("CH340 device is not open");
        }
        const result = await this.usbDevice.transferOut(endpointOut, chunk);
        assertTransferOk(result, "bulk OUT");
      },
    });
  }
}
