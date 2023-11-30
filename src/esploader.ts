import { ESPError } from "./error";
import { Data, deflate, Inflate } from "pako";
import { Transport, SerialOptions } from "./webserial";
import { ROM } from "./targets/rom";
import { customReset, usbJTAGSerialReset } from "./reset";

/* global SerialPort */

/**
 * Options for flashing a device with firmware.
 * @interface FlashOptions
 */
export interface FlashOptions {
  /**
   * An array of file objects representing the data to be flashed.
   * @type {Array<{ data: string; address: number }>}
   */
  fileArray: { data: string; address: number }[];

  /**
   * The size of the flash memory to be used.
   * @type {string}
   */
  flashSize: string;

  /**
   * The flash mode to be used (e.g., QIO, QOUT, DIO, DOUT).
   * @type {string}
   */
  flashMode: string;

  /**
   * The flash frequency to be used (e.g., 40MHz, 80MHz).
   * @type {string}
   */
  flashFreq: string;

  /**
   * Flag indicating whether to erase all existing data in the flash memory before flashing.
   * @type {boolean}
   */
  eraseAll: boolean;

  /**
   * Flag indicating whether to compress the data before flashing.
   * @type {boolean}
   */
  compress: boolean;

  /**
   * A function to report the progress of the flashing operation (optional).
   * @type {(fileIndex: number, written: number, total: number) => void}
   */
  reportProgress?: (fileIndex: number, written: number, total: number) => void;

  /**
   * A function to calculate the MD5 hash of the firmware image (optional).
   * @type {(image: string) => string}
   */
  calculateMD5Hash?: (image: string) => string;
}

/**
 * Options to configure ESPLoader.
 * @interface LoaderOptions
 */
export interface LoaderOptions {
  /**
   * The transport mechanism to communicate with the device.
   * @type {Transport}
   */
  transport: Transport;

  /**
   * The port to initialize the transport class.
   * @type {SerialPort}
   */
  port?: SerialPort;

  /**
   * Set of options for SerialPort class.
   * @type {Transport}
   */
  serialOptions?: SerialOptions;

  /**
   * The baud rate to be used for communication with the device.
   * @type {number}
   */
  baudrate: number;

  /**
   * An optional terminal interface to interact with the loader during the process.
   * @type {IEspLoaderTerminal}
   */
  terminal?: IEspLoaderTerminal;

  /**
   * The baud rate to be used during the initial ROM communication with the device.
   * @type {number}
   */
  romBaudrate: number;

  /**
   * Flag indicating whether to enable debug logging for the loader (optional).
   * @type {boolean}
   */
  debugLogging?: boolean;
}

type FlashReadCallback = ((packet: Uint8Array, progress: number, totalSize: number) => void) | null;

/**
 * Return the chip ROM based on the given magic number
 * @param {number} magic - magic hex number to select ROM.
 * @returns {ROM} The chip ROM class related to given magic hex number.
 */
async function magic2Chip(magic: number): Promise<ROM | null> {
  switch (magic) {
    case 0x00f01d83: {
      const { ESP32ROM } = await import("./targets/esp32");
      return new ESP32ROM();
    }
    case 0x6921506f:
    case 0x1b31506f: {
      const { ESP32C3ROM } = await import("./targets/esp32c3");
      return new ESP32C3ROM();
    }
    case 0x2ce0806f: {
      const { ESP32C6ROM } = await import("./targets/esp32c6");
      return new ESP32C6ROM();
    }
    case 0xd7b73e80: {
      const { ESP32H2ROM } = await import("./targets/esp32h2");
      return new ESP32H2ROM();
    }
    case 0x09: {
      const { ESP32S3ROM } = await import("./targets/esp32s3");
      return new ESP32S3ROM();
    }
    case 0x000007c6: {
      const { ESP32S2ROM } = await import("./targets/esp32s2");
      return new ESP32S2ROM();
    }
    case 0xfff0c101: {
      const { ESP8266ROM } = await import("./targets/esp8266");
      return new ESP8266ROM();
    }
    default:
      return null;
  }
}

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

export class ESPLoader {
  ESP_RAM_BLOCK = 0x1800;
  ESP_FLASH_BEGIN = 0x02;
  ESP_FLASH_DATA = 0x03;
  ESP_FLASH_END = 0x04;
  ESP_MEM_BEGIN = 0x05;
  ESP_MEM_END = 0x06;
  ESP_MEM_DATA = 0x07;
  ESP_WRITE_REG = 0x09;
  ESP_READ_REG = 0x0a;

  ESP_SPI_ATTACH = 0x0d;
  ESP_CHANGE_BAUDRATE = 0x0f;
  ESP_FLASH_DEFL_BEGIN = 0x10;
  ESP_FLASH_DEFL_DATA = 0x11;
  ESP_FLASH_DEFL_END = 0x12;
  ESP_SPI_FLASH_MD5 = 0x13;

  // Only Stub supported commands
  ESP_ERASE_FLASH = 0xd0;
  ESP_ERASE_REGION = 0xd1;
  ESP_READ_FLASH = 0xd2;
  ESP_RUN_USER_CODE = 0xd3;

  ESP_IMAGE_MAGIC = 0xe9;
  ESP_CHECKSUM_MAGIC = 0xef;

  // Response code(s) sent by ROM
  ROM_INVALID_RECV_MSG = 0x05; // response if an invalid message is received

  ERASE_REGION_TIMEOUT_PER_MB = 30000;
  ERASE_WRITE_TIMEOUT_PER_MB = 40000;
  MD5_TIMEOUT_PER_MB = 8000;
  CHIP_ERASE_TIMEOUT = 120000;
  FLASH_READ_TIMEOUT = 100000;
  MAX_TIMEOUT = this.CHIP_ERASE_TIMEOUT * 2;

  CHIP_DETECT_MAGIC_REG_ADDR = 0x40001000;

  DETECTED_FLASH_SIZES: { [key: number]: string } = {
    0x12: "256KB",
    0x13: "512KB",
    0x14: "1MB",
    0x15: "2MB",
    0x16: "4MB",
    0x17: "8MB",
    0x18: "16MB",
  };

  DETECTED_FLASH_SIZES_NUM: { [key: number]: number } = {
    0x12: 256,
    0x13: 512,
    0x14: 1024,
    0x15: 2048,
    0x16: 4096,
    0x17: 8192,
    0x18: 16384,
  };

  USB_JTAG_SERIAL_PID = 0x1001;

  chip!: ROM;
  IS_STUB: boolean;
  FLASH_WRITE_SIZE: number;

  public transport: Transport;
  private baudrate: number;
  private serialOptions?: SerialOptions;
  private terminal?: IEspLoaderTerminal;
  private romBaudrate = 115200;
  private debugLogging = false;

  /**
   * Create a new ESPLoader to perform serial communication
   * such as read/write flash memory and registers using a LoaderOptions object.
   * @param {LoaderOptions} options - LoaderOptions object argument for ESPLoader.
   * ```
   * const myLoader = new ESPLoader({ transport: Transport, baudrate: number, terminal?: IEspLoaderTerminal });
   * ```
   */
  constructor(options: LoaderOptions) {
    this.IS_STUB = false;
    this.FLASH_WRITE_SIZE = 0x4000;

    this.transport = options.transport;
    this.baudrate = options.baudrate;
    if (options.serialOptions) {
      this.serialOptions = options.serialOptions;
    }
    if (options.romBaudrate) {
      this.romBaudrate = options.romBaudrate;
    }
    if (options.terminal) {
      this.terminal = options.terminal;
      this.terminal.clean();
    }
    if (options.debugLogging) {
      this.debugLogging = options.debugLogging;
    }
    if (options.port) {
      this.transport = new Transport(options.port);
    }

    this.info("esptool.js");
    this.info("Serial port " + this.transport.getInfo());
  }

  _sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Write to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  write(str: string, withNewline = true) {
    if (this.terminal) {
      if (withNewline) {
        this.terminal.writeLine(str);
      } else {
        this.terminal.write(str);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(str);
    }
  }

  /**
   * Write error message to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  error(str: string, withNewline = true) {
    this.write(`Error: ${str}`, withNewline);
  }

  /**
   * Write information message to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  info(str: string, withNewline = true) {
    this.write(str, withNewline);
  }

  /**
   * Write debug message to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  debug(str: string, withNewline = true) {
    if (this.debugLogging) {
      this.write(`Debug: ${str}`, withNewline);
    }
  }

  /**
   * Convert short integer to byte array
   * @param {number} i - Number to convert.
   * @returns {Uint8Array} Byte array.
   */
  _shortToBytearray(i: number) {
    return new Uint8Array([i & 0xff, (i >> 8) & 0xff]);
  }

  /**
   * Convert an integer to byte array
   * @param {number} i - Number to convert.
   * @returns {ROM} The chip ROM class related to given magic hex number.
   */
  _intToByteArray(i: number): Uint8Array {
    return new Uint8Array([i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]);
  }

  /**
   * Convert a byte array to short integer.
   * @param {number} i - Number to convert.
   * @param {number} j - Number to convert.
   * @returns {number} Return a short integer number.
   */
  _byteArrayToShort(i: number, j: number) {
    return i | (j >> 8);
  }

  /**
   * Convert a byte array to integer.
   * @param {number} i - Number to convert.
   * @param {number} j - Number to convert.
   * @param {number} k - Number to convert.
   * @param {number} l - Number to convert.
   * @returns {number} Return a integer number.
   */
  _byteArrayToInt(i: number, j: number, k: number, l: number) {
    return i | (j << 8) | (k << 16) | (l << 24);
  }

  /**
   * Append a buffer array after another buffer array
   * @param {ArrayBuffer} buffer1 - First array buffer.
   * @param {ArrayBuffer} buffer2 - magic hex number to select ROM.
   * @returns {ArrayBufferLike} Return an array buffer.
   */
  _appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

  /**
   * Append a buffer array after another buffer array
   * @param {Uint8Array} arr1 - First array buffer.
   * @param {Uint8Array} arr2 - magic hex number to select ROM.
   * @returns {Uint8Array} Return a 8 bit unsigned array.
   */
  _appendArray(arr1: Uint8Array, arr2: Uint8Array) {
    const c = new Uint8Array(arr1.length + arr2.length);
    c.set(arr1, 0);
    c.set(arr2, arr1.length);
    return c;
  }

  /**
   * Convert a unsigned 8 bit integer array to byte string.
   * @param {Uint8Array} u8Array - magic hex number to select ROM.
   * @returns {string} Return the equivalent string.
   */
  ui8ToBstr(u8Array: Uint8Array) {
    let bStr = "";
    for (let i = 0; i < u8Array.length; i++) {
      bStr += String.fromCharCode(u8Array[i]);
    }
    return bStr;
  }

  /**
   * Convert a byte string to unsigned 8 bit integer array.
   * @param {string} bStr - binary string input
   * @returns {Uint8Array} Return a 8 bit unsigned integer array.
   */
  bstrToUi8(bStr: string) {
    const u8Array = new Uint8Array(bStr.length);
    for (let i = 0; i < bStr.length; i++) {
      u8Array[i] = bStr.charCodeAt(i);
    }
    return u8Array;
  }

  /**
   * Flush the serial input by raw read with 200 ms timeout.
   */
  async flushInput() {
    try {
      await this.transport.rawRead(200);
    } catch (e) {
      this.error((e as Error).message);
    }
  }

  /**
   * Use the device serial port read function with given timeout to create a valid packet.
   * @param {number} op Operation number
   * @param {number} timeout timeout number in milliseconds
   * @returns {[number, Uint8Array]} valid response packet.
   */
  async readPacket(op: number | null = null, timeout = 3000): Promise<[number, Uint8Array]> {
    // Check up-to next 100 packets for valid response packet
    for (let i = 0; i < 100; i++) {
      const p = await this.transport.read(timeout);
      const resp = p[0];
      const opRet = p[1];
      const val = this._byteArrayToInt(p[4], p[5], p[6], p[7]);
      const data = p.slice(8);
      if (resp == 1) {
        if (op == null || opRet == op) {
          return [val, data];
        } else if (data[0] != 0 && data[1] == this.ROM_INVALID_RECV_MSG) {
          await this.flushInput();
          throw new ESPError("unsupported command error");
        }
      }
    }
    throw new ESPError("invalid response");
  }

  /**
   * Write a serial command to the chip
   * @param {number} op - Operation number
   * @param {Uint8Array} data - Unsigned 8 bit array
   * @param {number} chk - channel number
   * @param {boolean} waitResponse - wait for response ?
   * @param {number} timeout - timeout number in milliseconds
   * @returns {Promise<[number, Uint8Array]>} Return a number and a 8 bit unsigned integer array.
   */
  async command(
    op: number | null = null,
    data: Uint8Array = new Uint8Array(0),
    chk = 0,
    waitResponse = true,
    timeout = 3000,
  ): Promise<[number, Uint8Array]> {
    if (op != null) {
      const pkt = new Uint8Array(8 + data.length);
      pkt[0] = 0x00;
      pkt[1] = op;
      pkt[2] = this._shortToBytearray(data.length)[0];
      pkt[3] = this._shortToBytearray(data.length)[1];
      pkt[4] = this._intToByteArray(chk)[0];
      pkt[5] = this._intToByteArray(chk)[1];
      pkt[6] = this._intToByteArray(chk)[2];
      pkt[7] = this._intToByteArray(chk)[3];

      let i;
      for (i = 0; i < data.length; i++) {
        pkt[8 + i] = data[i];
      }
      await this.transport.write(pkt);
    }

    if (!waitResponse) {
      return [0, new Uint8Array(0)];
    }

    return this.readPacket(op, timeout);
  }

  /**
   * Read a register from chip.
   * @param {number} addr - Register address number
   * @param {number} timeout - Timeout in milliseconds (Default: 3000ms)
   * @returns {number} - Command number value
   */
  async readReg(addr: number, timeout = 3000) {
    const pkt = this._intToByteArray(addr);
    const val = await this.command(this.ESP_READ_REG, pkt, undefined, undefined, timeout);
    return val[0];
  }

  /**
   * Write a number value to register address in chip.
   * @param {number} addr - Register address number
   * @param {number} value - Number value to write in register
   * @param {number} mask - Hex number for mask
   * @param {number} delayUs Delay number
   * @param {number} delayAfterUs Delay after previous delay
   */
  async writeReg(addr: number, value: number, mask = 0xffffffff, delayUs = 0, delayAfterUs = 0) {
    let pkt = this._appendArray(this._intToByteArray(addr), this._intToByteArray(value));
    pkt = this._appendArray(pkt, this._intToByteArray(mask));
    pkt = this._appendArray(pkt, this._intToByteArray(delayUs));

    if (delayAfterUs > 0) {
      pkt = this._appendArray(pkt, this._intToByteArray(this.chip.UART_DATE_REG_ADDR));
      pkt = this._appendArray(pkt, this._intToByteArray(0));
      pkt = this._appendArray(pkt, this._intToByteArray(0));
      pkt = this._appendArray(pkt, this._intToByteArray(delayAfterUs));
    }

    await this.checkCommand("write target memory", this.ESP_WRITE_REG, pkt);
  }

  /**
   * Sync chip by sending sync command.
   * @returns {[number, Uint8Array]} Command result
   */
  async sync() {
    this.debug("Sync");
    const cmd = new Uint8Array(36);
    let i;
    cmd[0] = 0x07;
    cmd[1] = 0x07;
    cmd[2] = 0x12;
    cmd[3] = 0x20;
    for (i = 0; i < 32; i++) {
      cmd[4 + i] = 0x55;
    }

    try {
      const resp = await this.command(0x08, cmd, undefined, undefined, 100);
      return resp;
    } catch (e) {
      this.debug("Sync err " + e);
      throw e;
    }
  }

  /**
   * Attempt to connect to the chip by sending a reset sequence and later a sync command.
   * @param {string} mode - Reset mode to use
   * @param {boolean} esp32r0Delay - Enable delay for ESP32 R0
   * @returns {string} - Returns 'success' or 'error' message.
   */
  async _connectAttempt(mode = "default_reset", esp32r0Delay = false) {
    this.debug("_connect_attempt " + mode + " " + esp32r0Delay);
    if (mode !== "no_reset") {
      if (this.transport.getPid() === this.USB_JTAG_SERIAL_PID) {
        // Custom reset sequence, which is required when the device
        // is connecting via its USB-JTAG-Serial peripheral
        await usbJTAGSerialReset(this.transport);
      } else {
        const strSequence = esp32r0Delay ? "D0|R1|W100|W2000|D1|R0|W50|D0" : "D0|R1|W100|D1|R0|W50|D0";
        await customReset(this.transport, strSequence);
      }
    }
    let i = 0;
    let keepReading = true;
    while (keepReading) {
      try {
        const res = await this.transport.read(1000);
        i += res.length;
      } catch (e) {
        this.debug((e as Error).message);
        if (e instanceof Error) {
          keepReading = false;
          break;
        }
      }
      await this._sleep(50);
    }
    this.transport.slipReaderEnabled = true;
    i = 7;
    while (i--) {
      try {
        const resp = await this.sync();
        this.debug(resp[0].toString());
        return "success";
      } catch (error) {
        if (error instanceof Error) {
          if (esp32r0Delay) {
            this.info("_", false);
          } else {
            this.info(".", false);
          }
        }
      }
      await this._sleep(50);
    }
    return "error";
  }

  /**
   * Perform a connection to chip.
   * @param {string} mode - Reset mode to use. Example: 'default_reset' | 'no_reset'
   * @param {number} attempts - Number of connection attempts
   * @param {boolean} detecting - Detect the connected chip
   */
  async connect(mode = "default_reset", attempts = 7, detecting = false) {
    let i;
    let resp;
    this.info("Connecting...", false);
    await this.transport.connect(this.romBaudrate, this.serialOptions);
    for (i = 0; i < attempts; i++) {
      resp = await this._connectAttempt(mode, false);
      if (resp === "success") {
        break;
      }
      resp = await this._connectAttempt(mode, true);
      if (resp === "success") {
        break;
      }
    }
    if (resp !== "success") {
      throw new ESPError("Failed to connect with the device");
    }
    this.info("\n\r", false);

    if (!detecting) {
      const chipMagicValue = (await this.readReg(0x40001000)) >>> 0;
      this.debug("Chip Magic " + chipMagicValue.toString(16));
      const chip = await magic2Chip(chipMagicValue);
      if (this.chip === null) {
        throw new ESPError(`Unexpected CHIP magic value ${chipMagicValue}. Failed to autodetect chip type.`);
      } else {
        this.chip = chip as ROM;
      }
    }
  }

  /**
   * Connect and detect the existing chip.
   * @param {string} mode Reset mode to use for connection.
   */
  async detectChip(mode = "default_reset") {
    await this.connect(mode);
    this.info("Detecting chip type... ", false);
    if (this.chip != null) {
      this.info(this.chip.CHIP_NAME);
    } else {
      this.info("unknown!");
    }
  }

  /**
   * Execute the command and check the command response.
   * @param {string} opDescription Command operation description.
   * @param {number} op Command operation number
   * @param {Uint8Array} data Command value
   * @param {number} chk Checksum to use
   * @param {number} timeout TImeout number in milliseconds (ms)
   * @returns {number} Command result
   */
  async checkCommand(
    opDescription = "",
    op: number | null = null,
    data: Uint8Array = new Uint8Array(0),
    chk = 0,
    timeout = 3000,
  ) {
    this.debug("check_command " + opDescription);
    const resp = await this.command(op, data, chk, undefined, timeout);
    if (resp[1].length > 4) {
      return resp[1];
    } else {
      return resp[0];
    }
  }

  /**
   * Start downloading an application image to RAM
   * @param {number} size Image size number
   * @param {number} blocks Number of data blocks
   * @param {number} blocksize Size of each data block
   * @param {number} offset Image offset number
   */
  async memBegin(size: number, blocks: number, blocksize: number, offset: number) {
    /* XXX: Add check to ensure that STUB is not getting overwritten */
    this.debug("mem_begin " + size + " " + blocks + " " + blocksize + " " + offset.toString(16));
    let pkt = this._appendArray(this._intToByteArray(size), this._intToByteArray(blocks));
    pkt = this._appendArray(pkt, this._intToByteArray(blocksize));
    pkt = this._appendArray(pkt, this._intToByteArray(offset));
    await this.checkCommand("enter RAM download mode", this.ESP_MEM_BEGIN, pkt);
  }

  /**
   * Get the checksum for given unsigned 8-bit array
   * @param {Uint8Array} data Unsigned 8-bit integer array
   * @returns {number} - Array checksum
   */
  checksum = function (data: Uint8Array) {
    let i;
    let chk = 0xef;

    for (i = 0; i < data.length; i++) {
      chk ^= data[i];
    }
    return chk;
  };

  /**
   * Send a block of image to RAM
   * @param {Uint8Array} buffer Unsigned 8-bit array
   * @param {number} seq Sequence number
   */
  async memBlock(buffer: Uint8Array, seq: number) {
    let pkt = this._appendArray(this._intToByteArray(buffer.length), this._intToByteArray(seq));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, buffer);
    const checksum = this.checksum(buffer);
    await this.checkCommand("write to target RAM", this.ESP_MEM_DATA, pkt, checksum);
  }

  /**
   * Leave RAM download mode and run application
   * @param {number} entrypoint - Entrypoint number
   */
  async memFinish(entrypoint: number) {
    const isEntry = entrypoint === 0 ? 1 : 0;
    const pkt = this._appendArray(this._intToByteArray(isEntry), this._intToByteArray(entrypoint));
    await this.checkCommand("leave RAM download mode", this.ESP_MEM_END, pkt, undefined, 50); // XXX: handle non-stub with diff timeout
  }

  /**
   * Configure SPI flash pins
   * @param {number} hspiArg -  Argument for SPI attachment
   */
  async flashSpiAttach(hspiArg: number) {
    const pkt = this._intToByteArray(hspiArg);
    await this.checkCommand("configure SPI flash pins", this.ESP_SPI_ATTACH, pkt);
  }

  /**
   * Scale timeouts which are size-specific.
   * @param {number} secondsPerMb Seconds per megabytes as number
   * @param {number} sizeBytes Size bytes number
   * @returns {number} - Scaled timeout for specified size.
   */
  timeoutPerMb = function (secondsPerMb: number, sizeBytes: number) {
    const result = secondsPerMb * (sizeBytes / 1000000);
    if (result < 3000) {
      return 3000;
    } else {
      return result;
    }
  };

  /**
   * Start downloading to Flash (performs an erase)
   * @param {number} size Size to erase
   * @param {number} offset Offset to erase
   * @returns {number} Number of blocks (of size self.FLASH_WRITE_SIZE) to write.
   */
  async flashBegin(size: number, offset: number) {
    const numBlocks = Math.floor((size + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
    const eraseSize = this.chip.getEraseSize(offset, size);

    const d = new Date();
    const t1 = d.getTime();

    let timeout = 3000;
    if (this.IS_STUB == false) {
      timeout = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, size);
    }

    this.debug("flash begin " + eraseSize + " " + numBlocks + " " + this.FLASH_WRITE_SIZE + " " + offset + " " + size);
    let pkt = this._appendArray(this._intToByteArray(eraseSize), this._intToByteArray(numBlocks));
    pkt = this._appendArray(pkt, this._intToByteArray(this.FLASH_WRITE_SIZE));
    pkt = this._appendArray(pkt, this._intToByteArray(offset));
    if (this.IS_STUB == false) {
      pkt = this._appendArray(pkt, this._intToByteArray(0)); // XXX: Support encrypted
    }

    await this.checkCommand("enter Flash download mode", this.ESP_FLASH_BEGIN, pkt, undefined, timeout);

    const t2 = d.getTime();
    if (size != 0 && this.IS_STUB == false) {
      this.info("Took " + (t2 - t1) / 1000 + "." + ((t2 - t1) % 1000) + "s to erase flash block");
    }
    return numBlocks;
  }

  /**
   * Start downloading compressed data to Flash (performs an erase)
   * @param {number} size Write size
   * @param {number} compsize Compressed size
   * @param {number} offset Offset for write
   * @returns {number} Returns number of blocks (size self.FLASH_WRITE_SIZE) to write.
   */
  async flashDeflBegin(size: number, compsize: number, offset: number) {
    const numBlocks = Math.floor((compsize + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
    const eraseBlocks = Math.floor((size + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);

    const d = new Date();
    const t1 = d.getTime();

    let writeSize, timeout;
    if (this.IS_STUB) {
      writeSize = size;
      timeout = 3000;
    } else {
      writeSize = eraseBlocks * this.FLASH_WRITE_SIZE;
      timeout = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, writeSize);
    }
    this.info("Compressed " + size + " bytes to " + compsize + "...");

    let pkt = this._appendArray(this._intToByteArray(writeSize), this._intToByteArray(numBlocks));
    pkt = this._appendArray(pkt, this._intToByteArray(this.FLASH_WRITE_SIZE));
    pkt = this._appendArray(pkt, this._intToByteArray(offset));

    if (
      (this.chip.CHIP_NAME === "ESP32-S2" ||
        this.chip.CHIP_NAME === "ESP32-S3" ||
        this.chip.CHIP_NAME === "ESP32-C3") &&
      this.IS_STUB === false
    ) {
      pkt = this._appendArray(pkt, this._intToByteArray(0));
    }
    await this.checkCommand("enter compressed flash mode", this.ESP_FLASH_DEFL_BEGIN, pkt, undefined, timeout);
    const t2 = d.getTime();
    if (size != 0 && this.IS_STUB === false) {
      this.info("Took " + (t2 - t1) / 1000 + "." + ((t2 - t1) % 1000) + "s to erase flash block");
    }
    return numBlocks;
  }

  /**
   * Write block to flash, retry if fail
   * @param {Uint8Array} data Unsigned 8-bit array data.
   * @param {number} seq Sequence number
   * @param {number} timeout Timeout in milliseconds (ms)
   */
  async flashBlock(data: Uint8Array, seq: number, timeout: number) {
    let pkt = this._appendArray(this._intToByteArray(data.length), this._intToByteArray(seq));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, data);

    const checksum = this.checksum(data);

    await this.checkCommand("write to target Flash after seq " + seq, this.ESP_FLASH_DATA, pkt, checksum, timeout);
  }

  /**
   * Write block to flash, send compressed, retry if fail
   * @param {Uint8Array} data Unsigned int 8-bit array data to write
   * @param {number} seq Sequence number
   * @param {number} timeout Timeout in milliseconds (ms)
   */
  async flashDeflBlock(data: Uint8Array, seq: number, timeout: number) {
    let pkt = this._appendArray(this._intToByteArray(data.length), this._intToByteArray(seq));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, data);

    const checksum = this.checksum(data);
    this.debug("flash_defl_block " + data[0].toString(16) + " " + data[1].toString(16));

    await this.checkCommand(
      "write compressed data to flash after seq " + seq,
      this.ESP_FLASH_DEFL_DATA,
      pkt,
      checksum,
      timeout,
    );
  }

  /**
   * Leave flash mode and run/reboot
   * @param {boolean} reboot Reboot after leaving flash mode ?
   */
  async flashFinish(reboot = false) {
    const val = reboot ? 0 : 1;
    const pkt = this._intToByteArray(val);

    await this.checkCommand("leave Flash mode", this.ESP_FLASH_END, pkt);
  }

  /**
   * Leave compressed flash mode and run/reboot
   * @param {boolean} reboot Reboot after leaving flash mode ?
   */
  async flashDeflFinish(reboot = false) {
    const val = reboot ? 0 : 1;
    const pkt = this._intToByteArray(val);

    await this.checkCommand("leave compressed flash mode", this.ESP_FLASH_DEFL_END, pkt);
  }

  /**
   * Run an arbitrary SPI flash command.
   *
   * This function uses the "USR_COMMAND" functionality in the ESP
   * SPI hardware, rather than the precanned commands supported by
   * hardware. So the value of spiflashCommand is an actual command
   * byte, sent over the wire.
   *
   * After writing command byte, writes 'data' to MOSI and then
   * reads back 'readBits' of reply on MISO. Result is a number.
   * @param {number} spiflashCommand Command to execute in SPI
   * @param {Uint8Array} data Data to send
   * @param {number} readBits Number of bits to read
   * @returns {number} Register SPI_W0_REG value
   */
  async runSpiflashCommand(spiflashCommand: number, data: Uint8Array, readBits: number) {
    // SPI_USR register flags
    const SPI_USR_COMMAND = 1 << 31;
    const SPI_USR_MISO = 1 << 28;
    const SPI_USR_MOSI = 1 << 27;

    // SPI registers, base address differs ESP32* vs 8266
    const base = this.chip.SPI_REG_BASE;
    const SPI_CMD_REG = base + 0x00;
    const SPI_USR_REG = base + this.chip.SPI_USR_OFFS;
    const SPI_USR1_REG = base + this.chip.SPI_USR1_OFFS;
    const SPI_USR2_REG = base + this.chip.SPI_USR2_OFFS;
    const SPI_W0_REG = base + this.chip.SPI_W0_OFFS;

    let setDataLengths;
    if (this.chip.SPI_MOSI_DLEN_OFFS != null) {
      setDataLengths = async (mosiBits: number, misoBits: number) => {
        const SPI_MOSI_DLEN_REG = base + this.chip.SPI_MOSI_DLEN_OFFS;
        const SPI_MISO_DLEN_REG = base + this.chip.SPI_MISO_DLEN_OFFS;
        if (mosiBits > 0) {
          await this.writeReg(SPI_MOSI_DLEN_REG, mosiBits - 1);
        }
        if (misoBits > 0) {
          await this.writeReg(SPI_MISO_DLEN_REG, misoBits - 1);
        }
      };
    } else {
      setDataLengths = async (mosiBits: number, misoBits: number) => {
        const SPI_DATA_LEN_REG = SPI_USR1_REG;
        const SPI_MOSI_BITLEN_S = 17;
        const SPI_MISO_BITLEN_S = 8;
        const mosiMask = mosiBits === 0 ? 0 : mosiBits - 1;
        const misoMask = misoBits === 0 ? 0 : misoBits - 1;
        const val = (misoMask << SPI_MISO_BITLEN_S) | (mosiMask << SPI_MOSI_BITLEN_S);
        await this.writeReg(SPI_DATA_LEN_REG, val);
      };
    }

    const SPI_CMD_USR = 1 << 18;
    const SPI_USR2_COMMAND_LEN_SHIFT = 28;
    if (readBits > 32) {
      throw new ESPError("Reading more than 32 bits back from a SPI flash operation is unsupported");
    }
    if (data.length > 64) {
      throw new ESPError("Writing more than 64 bytes of data with one SPI command is unsupported");
    }

    const dataBits = data.length * 8;
    const oldSpiUsr = await this.readReg(SPI_USR_REG);
    const oldSpiUsr2 = await this.readReg(SPI_USR2_REG);
    let flags = SPI_USR_COMMAND;
    let i;
    if (readBits > 0) {
      flags |= SPI_USR_MISO;
    }
    if (dataBits > 0) {
      flags |= SPI_USR_MOSI;
    }
    await setDataLengths(dataBits, readBits);
    await this.writeReg(SPI_USR_REG, flags);
    let val = (7 << SPI_USR2_COMMAND_LEN_SHIFT) | spiflashCommand;
    await this.writeReg(SPI_USR2_REG, val);
    if (dataBits == 0) {
      await this.writeReg(SPI_W0_REG, 0);
    } else {
      if (data.length % 4 != 0) {
        const padding = new Uint8Array(data.length % 4);
        data = this._appendArray(data, padding);
      }
      let nextReg = SPI_W0_REG;
      for (i = 0; i < data.length - 4; i += 4) {
        val = this._byteArrayToInt(data[i], data[i + 1], data[i + 2], data[i + 3]);
        await this.writeReg(nextReg, val);
        nextReg += 4;
      }
    }
    await this.writeReg(SPI_CMD_REG, SPI_CMD_USR);
    for (i = 0; i < 10; i++) {
      val = (await this.readReg(SPI_CMD_REG)) & SPI_CMD_USR;
      if (val == 0) {
        break;
      }
    }
    if (i === 10) {
      throw new ESPError("SPI command did not complete in time");
    }
    const stat = await this.readReg(SPI_W0_REG);
    await this.writeReg(SPI_USR_REG, oldSpiUsr);
    await this.writeReg(SPI_USR2_REG, oldSpiUsr2);
    return stat;
  }

  /**
   * Read flash id by executing the SPIFLASH_RDID flash command.
   * @returns {Promise<number>} Register SPI_W0_REG value
   */
  async readFlashId() {
    const SPIFLASH_RDID = 0x9f;
    const pkt = new Uint8Array(0);
    return await this.runSpiflashCommand(SPIFLASH_RDID, pkt, 24);
  }

  /**
   * Execute the erase flash command
   * @returns {Promise<number | Uint8Array>} Erase flash command result
   */
  async eraseFlash(): Promise<number | Uint8Array> {
    this.info("Erasing flash (this may take a while)...");
    let d = new Date();
    const t1 = d.getTime();
    const ret = await this.checkCommand(
      "erase flash",
      this.ESP_ERASE_FLASH,
      undefined,
      undefined,
      this.CHIP_ERASE_TIMEOUT,
    );
    d = new Date();
    const t2 = d.getTime();
    this.info("Chip erase completed successfully in " + (t2 - t1) / 1000 + "s");
    return ret;
  }

  /**
   * Convert a number or unsigned 8-bit array to hex string
   * @param {number | Uint8Array } buffer Data to convert to hex string.
   * @returns {string} A hex string
   */
  toHex(buffer: number | Uint8Array): string {
    return Array.prototype.map.call(buffer, (x) => ("00" + x.toString(16)).slice(-2)).join("");
  }

  /**
   * Calculate the MD5 Checksum command
   * @param {number} addr Address number
   * @param {number} size Package size
   * @returns {string} MD5 Checksum string
   */
  async flashMd5sum(addr: number, size: number): Promise<string> {
    const timeout = this.timeoutPerMb(this.MD5_TIMEOUT_PER_MB, size);
    let pkt = this._appendArray(this._intToByteArray(addr), this._intToByteArray(size));
    pkt = this._appendArray(pkt, this._intToByteArray(0));
    pkt = this._appendArray(pkt, this._intToByteArray(0));

    let res = await this.checkCommand("calculate md5sum", this.ESP_SPI_FLASH_MD5, pkt, undefined, timeout);
    if (res instanceof Uint8Array && res.length > 16) {
      res = res.slice(0, 16);
    }
    const strmd5 = this.toHex(res);
    return strmd5;
  }

  async readFlash(addr: number, size: number, onPacketReceived: FlashReadCallback = null) {
    let pkt = this._appendArray(this._intToByteArray(addr), this._intToByteArray(size));
    pkt = this._appendArray(pkt, this._intToByteArray(0x1000));
    pkt = this._appendArray(pkt, this._intToByteArray(1024));

    const res = await this.checkCommand("read flash", this.ESP_READ_FLASH, pkt);

    if (res != 0) {
      throw new ESPError("Failed to read memory: " + res);
    }

    let resp = new Uint8Array(0);
    while (resp.length < size) {
      const packet = await this.transport.read(this.FLASH_READ_TIMEOUT);

      if (packet instanceof Uint8Array) {
        if (packet.length > 0) {
          resp = this._appendArray(resp, packet);
          await this.transport.write(this._intToByteArray(resp.length));

          if (onPacketReceived) {
            onPacketReceived(packet, resp.length, size);
          }
        }
      } else {
        throw new ESPError("Failed to read memory: " + packet);
      }
    }

    return resp;
  }

  /**
   * Upload the flasher ROM bootloader (flasher stub) to the chip.
   * @returns {ROM} The Chip ROM
   */
  async runStub() {
    this.info("Uploading stub...");

    let decoded = Buffer.from(this.chip.ROM_TEXT, "base64").toString("binary");
    let chardata = decoded.split("").map(function (x) {
      return x.charCodeAt(0);
    });
    const text = new Uint8Array(chardata);

    decoded = Buffer.from(this.chip.ROM_DATA, "base64").toString("binary");
    chardata = decoded.split("").map(function (x) {
      return x.charCodeAt(0);
    });
    const data = new Uint8Array(chardata);

    let blocks = Math.floor((text.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
    let i;

    await this.memBegin(text.length, blocks, this.ESP_RAM_BLOCK, this.chip.TEXT_START);
    for (i = 0; i < blocks; i++) {
      const fromOffs = i * this.ESP_RAM_BLOCK;
      const toOffs = fromOffs + this.ESP_RAM_BLOCK;
      await this.memBlock(text.slice(fromOffs, toOffs), i);
    }

    blocks = Math.floor((data.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
    await this.memBegin(data.length, blocks, this.ESP_RAM_BLOCK, this.chip.DATA_START);
    for (i = 0; i < blocks; i++) {
      const fromOffs = i * this.ESP_RAM_BLOCK;
      const toOffs = fromOffs + this.ESP_RAM_BLOCK;
      await this.memBlock(data.slice(fromOffs, toOffs), i);
    }

    this.info("Running stub...");
    await this.memFinish(this.chip.ENTRY);

    // Check up-to next 100 packets to see if stub is running
    for (let i = 0; i < 100; i++) {
      const res = await this.transport.read(1000, 6);
      if (res[0] === 79 && res[1] === 72 && res[2] === 65 && res[3] === 73) {
        this.info("Stub running...");
        this.IS_STUB = true;
        this.FLASH_WRITE_SIZE = 0x4000;
        return this.chip;
      }
    }
    throw new ESPError("Failed to start stub. Unexpected response");
  }

  /**
   * Change the chip baudrate.
   */
  async changeBaud() {
    this.info("Changing baudrate to " + this.baudrate);
    const secondArg = this.IS_STUB ? this.transport.baudrate : 0;
    const pkt = this._appendArray(this._intToByteArray(this.baudrate), this._intToByteArray(secondArg));
    const resp = await this.command(this.ESP_CHANGE_BAUDRATE, pkt);
    this.debug(resp[0].toString());
    this.info("Changed");
    await this.transport.disconnect();
    await this._sleep(50);
    await this.transport.connect(this.baudrate, this.serialOptions);

    /* original code seemed absolutely unreliable. use retries and less sleep */
    try {
      let i = 64;
      while (i--) {
        try {
          await this.sync();
          break;
        } catch (error) {
          this.debug((error as Error).message);
        }
        await this._sleep(10);
      }
    } catch (e) {
      this.debug((e as Error).message);
    }
  }

  /**
   * Execute the main function of ESPLoader.
   * @param {string} mode Reset mode to use
   * @returns {ROM} chip ROM
   */
  async main(mode = "default_reset") {
    await this.detectChip(mode);

    const chip = await this.chip.getChipDescription(this);
    this.info("Chip is " + chip);
    this.info("Features: " + (await this.chip.getChipFeatures(this)));
    this.info("Crystal is " + (await this.chip.getCrystalFreq(this)) + "MHz");
    this.info("MAC: " + (await this.chip.readMac(this)));
    await this.chip.readMac(this);

    if (typeof this.chip.postConnect != "undefined") {
      await this.chip.postConnect(this);
    }

    await this.runStub();

    if (this.romBaudrate !== this.baudrate) {
      await this.changeBaud();
    }
    return chip;
  }

  /**
   * Get flash size bytes from flash size string.
   * @param {string} flashSize Flash Size string
   * @returns {number} Flash size bytes
   */
  flashSizeBytes = function (flashSize: string) {
    let flashSizeB = -1;
    if (flashSize.indexOf("KB") !== -1) {
      flashSizeB = parseInt(flashSize.slice(0, flashSize.indexOf("KB"))) * 1024;
    } else if (flashSize.indexOf("MB") !== -1) {
      flashSizeB = parseInt(flashSize.slice(0, flashSize.indexOf("MB"))) * 1024 * 1024;
    }
    return flashSizeB;
  };

  /**
   * Parse a given flash size string to a number
   * @param {string} flsz Flash size to request
   * @returns {number} Flash size number
   */
  parseFlashSizeArg(flsz: string) {
    if (typeof this.chip.FLASH_SIZES[flsz] === "undefined") {
      throw new ESPError(
        "Flash size " + flsz + " is not supported by this chip type. Supported sizes: " + this.chip.FLASH_SIZES,
      );
    }
    return this.chip.FLASH_SIZES[flsz];
  }

  /**
   * Update the image flash parameters with given arguments.
   * @param {string} image binary image as string
   * @param {number} address flash address number
   * @param {string} flashSize Flash size string
   * @param {string} flashMode Flash mode string
   * @param {string} flashFreq Flash frequency string
   * @returns {string} modified image string
   */
  _updateImageFlashParams(image: string, address: number, flashSize: string, flashMode: string, flashFreq: string) {
    this.debug("_update_image_flash_params " + flashSize + " " + flashMode + " " + flashFreq);
    if (image.length < 8) {
      return image;
    }
    if (address != this.chip.BOOTLOADER_FLASH_OFFSET) {
      return image;
    }
    if (flashSize === "keep" && flashMode === "keep" && flashFreq === "keep") {
      this.info("Not changing the image");
      return image;
    }

    const magic = parseInt(image[0]);
    let aFlashMode = parseInt(image[2]);
    const flashSizeFreq = parseInt(image[3]);
    if (magic !== this.ESP_IMAGE_MAGIC) {
      this.info(
        "Warning: Image file at 0x" +
          address.toString(16) +
          " doesn't look like an image file, so not changing any flash settings.",
      );
      return image;
    }

    /* XXX: Yet to implement actual image verification */

    if (flashMode !== "keep") {
      const flashModes: { [key: string]: number } = { qio: 0, qout: 1, dio: 2, dout: 3 };
      aFlashMode = flashModes[flashMode];
    }
    let aFlashFreq = flashSizeFreq & 0x0f;
    if (flashFreq !== "keep") {
      const flashFreqs: { [key: string]: number } = { "40m": 0, "26m": 1, "20m": 2, "80m": 0xf };
      aFlashFreq = flashFreqs[flashFreq];
    }
    let aFlashSize = flashSizeFreq & 0xf0;
    if (flashSize !== "keep") {
      aFlashSize = this.parseFlashSizeArg(flashSize);
    }

    const flashParams = (aFlashMode << 8) | (aFlashFreq + aFlashSize);
    this.info("Flash params set to " + flashParams.toString(16));
    if (parseInt(image[2]) !== aFlashMode << 8) {
      image = image.substring(0, 2) + (aFlashMode << 8).toString() + image.substring(2 + 1);
    }
    if (parseInt(image[3]) !== aFlashFreq + aFlashSize) {
      image = image.substring(0, 3) + (aFlashFreq + aFlashSize).toString() + image.substring(3 + 1);
    }
    return image;
  }

  /**
   * Write set of file images into given address based on given FlashOptions object.
   * @param {FlashOptions} options FlashOptions to configure how and what to write into flash.
   */
  async writeFlash(options: FlashOptions) {
    this.debug("EspLoader program");
    if (options.flashSize !== "keep") {
      const flashEnd = this.flashSizeBytes(options.flashSize);
      for (let i = 0; i < options.fileArray.length; i++) {
        if (options.fileArray[i].data.length + options.fileArray[i].address > flashEnd) {
          throw new ESPError(`File ${i + 1} doesn't fit in the available flash`);
        }
      }
    }

    if (this.IS_STUB === true && options.eraseAll === true) {
      await this.eraseFlash();
    }
    let image: string, address: number;
    for (let i = 0; i < options.fileArray.length; i++) {
      this.debug("Data Length " + options.fileArray[i].data.length);
      image = options.fileArray[i].data;
      const reminder = options.fileArray[i].data.length % 4;
      if (reminder > 0) image += "\xff\xff\xff\xff".substring(4 - reminder);
      address = options.fileArray[i].address;
      this.debug("Image Length " + image.length);
      if (image.length === 0) {
        this.debug("Warning: File is empty");
        continue;
      }
      image = this._updateImageFlashParams(image, address, options.flashSize, options.flashMode, options.flashFreq);
      let calcmd5: string | null = null;
      if (options.calculateMD5Hash) {
        calcmd5 = options.calculateMD5Hash(image);
        this.debug("Image MD5 " + calcmd5);
      }
      const uncsize = image.length;
      let blocks: number;
      if (options.compress) {
        const uncimage = this.bstrToUi8(image);
        image = this.ui8ToBstr(deflate(uncimage, { level: 9 }));
        blocks = await this.flashDeflBegin(uncsize, image.length, address);
      } else {
        blocks = await this.flashBegin(uncsize, address);
      }
      let seq = 0;
      let bytesSent = 0;
      const totalBytes = image.length;
      if (options.reportProgress) options.reportProgress(i, 0, totalBytes);

      let d = new Date();
      const t1 = d.getTime();

      let timeout = 5000;
      // Create a decompressor to keep track of the size of uncompressed data
      // to be written in each chunk.
      const inflate = new Inflate({ chunkSize: 1 });
      let totalLenUncompressed = 0;
      inflate.onData = function (chunk: Data): void {
        totalLenUncompressed += chunk.byteLength;
      };
      while (image.length > 0) {
        this.debug("Write loop " + address + " " + seq + " " + blocks);
        this.info(
          "Writing at 0x" +
            (address + totalLenUncompressed).toString(16) +
            "... (" +
            Math.floor((100 * (seq + 1)) / blocks) +
            "%)",
        );
        const block = this.bstrToUi8(image.slice(0, this.FLASH_WRITE_SIZE));

        if (options.compress) {
          const lenUncompressedPrevious = totalLenUncompressed;
          inflate.push(block, false);
          const blockUncompressed = totalLenUncompressed - lenUncompressedPrevious;
          let blockTimeout = 3000;
          if (this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, blockUncompressed) > 3000) {
            blockTimeout = this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, blockUncompressed);
          }
          if (this.IS_STUB === false) {
            // ROM code writes block to flash before ACKing
            timeout = blockTimeout;
          }
          await this.flashDeflBlock(block, seq, timeout);
          if (this.IS_STUB) {
            // Stub ACKs when block is received, then writes to flash while receiving the block after it
            timeout = blockTimeout;
          }
        } else {
          throw new ESPError("Yet to handle Non Compressed writes");
        }
        bytesSent += block.length;
        image = image.slice(this.FLASH_WRITE_SIZE, image.length);
        seq++;
        if (options.reportProgress) options.reportProgress(i, bytesSent, totalBytes);
      }
      if (this.IS_STUB) {
        await this.readReg(this.CHIP_DETECT_MAGIC_REG_ADDR, timeout);
      }
      d = new Date();
      const t = d.getTime() - t1;
      if (options.compress) {
        this.info(
          "Wrote " +
            uncsize +
            " bytes (" +
            bytesSent +
            " compressed) at 0x" +
            address.toString(16) +
            " in " +
            t / 1000 +
            " seconds.",
        );
      }
      if (calcmd5) {
        const res = await this.flashMd5sum(address, uncsize);
        if (new String(res).valueOf() != new String(calcmd5).valueOf()) {
          this.info("File  md5: " + calcmd5);
          this.info("Flash md5: " + res);
          throw new ESPError("MD5 of file does not match data in flash!");
        } else {
          this.info("Hash of data verified.");
        }
      }
    }
    this.info("Leaving...");

    if (this.IS_STUB) {
      await this.flashBegin(0, 0);
      if (options.compress) {
        await this.flashDeflFinish();
      } else {
        await this.flashFinish();
      }
    }
  }

  /**
   * Read SPI flash manufacturer and device id.
   */
  async flashId() {
    this.debug("flash_id");
    const flashid = await this.readFlashId();
    this.info("Manufacturer: " + (flashid & 0xff).toString(16));
    const flidLowbyte = (flashid >> 16) & 0xff;
    this.info("Device: " + ((flashid >> 8) & 0xff).toString(16) + flidLowbyte.toString(16));
    this.info("Detected flash size: " + this.DETECTED_FLASH_SIZES[flidLowbyte]);
  }

  async getFlashSize() {
    this.debug("flash_id");
    const flashid = await this.readFlashId();
    const flidLowbyte = (flashid >> 16) & 0xff;
    return this.DETECTED_FLASH_SIZES_NUM[flidLowbyte];
  }

  /**
   * Perform a chip hard reset by setting RTS to LOW and then HIGH.
   */
  async hardReset() {
    await this.transport.setRTS(true); // EN->LOW
    await this._sleep(100);
    await this.transport.setRTS(false);
  }

  /**
   * Soft reset the device chip. Soft reset with run user code is the closest.
   */
  async softReset() {
    if (!this.IS_STUB) {
      // "run user code" is as close to a soft reset as we can do
      await this.flashBegin(0, 0);
      await this.flashFinish(false);
    } else if (this.chip.CHIP_NAME != "ESP8266") {
      throw new ESPError("Soft resetting is currently only supported on ESP8266");
    } else {
      // running user code from stub loader requires some hacks
      // in the stub loader
      await this.command(this.ESP_RUN_USER_CODE, undefined, undefined, false);
    }
  }
}
