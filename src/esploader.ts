import { ESPError } from "./error";
import { Data, deflate, Inflate } from "pako";
import { Transport } from "./webserial";
import { ROM } from "./targets/rom";

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

export interface IEspLoaderTerminal {
  clean: () => void;
  writeLine: (data: string) => void;
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
  ESP_RUN_USER_CODE = 0xd3;

  ESP_IMAGE_MAGIC = 0xe9;
  ESP_CHECKSUM_MAGIC = 0xef;

  // Response code(s) sent by ROM
  ROM_INVALID_RECV_MSG = 0x05; // response if an invalid message is received

  ERASE_REGION_TIMEOUT_PER_MB = 30000;
  ERASE_WRITE_TIMEOUT_PER_MB = 40000;
  MD5_TIMEOUT_PER_MB = 8000;
  CHIP_ERASE_TIMEOUT = 120000;
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

  USB_JTAG_SERIAL_PID = 0x1001;

  chip!: ROM;
  IS_STUB: boolean;
  FLASH_WRITE_SIZE: number;

  constructor(
    public transport: Transport,
    private baudrate: number,
    private terminal?: IEspLoaderTerminal,
    private rom_baudrate = 115200,
    private debugLogging = false,
  ) {
    this.IS_STUB = false;
    this.FLASH_WRITE_SIZE = 0x4000;
    if (this.terminal) {
      this.terminal.clean();
    }

    this.info("esptool.js");
    this.info("Serial port " + this.transport.get_info());
  }

  _sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  error(str: string, withNewline = true) {
    this.write(`Error: ${str}`, withNewline);
  }

  info(str: string, withNewline = true) {
    this.write(str, withNewline);
  }

  debug(str: string, withNewline = true) {
    if (this.debugLogging) {
      this.write(`Debug: ${str}`, withNewline);
    }
  }

  _short_to_bytearray(i: number) {
    return new Uint8Array([i & 0xff, (i >> 8) & 0xff]);
  }

  _int_to_bytearray(i: number): Uint8Array {
    return new Uint8Array([i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]);
  }

  _bytearray_to_short(i: number, j: number) {
    return i | (j >> 8);
  }

  _bytearray_to_int(i: number, j: number, k: number, l: number) {
    return i | (j << 8) | (k << 16) | (l << 24);
  }

  _appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

  _appendArray(arr1: Uint8Array, arr2: Uint8Array) {
    const c = new Uint8Array(arr1.length + arr2.length);
    c.set(arr1, 0);
    c.set(arr2, arr1.length);
    return c;
  }

  ui8ToBstr(u8Array: Uint8Array) {
    let b_str = "";
    for (let i = 0; i < u8Array.length; i++) {
      b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
  }

  bstrToUi8(bStr: string) {
    const u8_array = new Uint8Array(bStr.length);
    for (let i = 0; i < bStr.length; i++) {
      u8_array[i] = bStr.charCodeAt(i);
    }
    return u8_array;
  }

  async flush_input() {
    try {
      await this.transport.rawRead(200);
    } catch (e) {
      this.error((e as Error).message);
    }
  }

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
      pkt[2] = this._short_to_bytearray(data.length)[0];
      pkt[3] = this._short_to_bytearray(data.length)[1];
      pkt[4] = this._int_to_bytearray(chk)[0];
      pkt[5] = this._int_to_bytearray(chk)[1];
      pkt[6] = this._int_to_bytearray(chk)[2];
      pkt[7] = this._int_to_bytearray(chk)[3];

      let i;
      for (i = 0; i < data.length; i++) {
        pkt[8 + i] = data[i];
      }
      await this.transport.write(pkt);
    }

    if (!waitResponse) {
      return [0, new Uint8Array(0)];
    }

    // Check up-to next 100 packets for valid response packet
    for (let i = 0; i < 100; i++) {
      const p = await this.transport.read(timeout);
      const resp = p[0];
      const op_ret = p[1];
      const val = this._bytearray_to_int(p[4], p[5], p[6], p[7]);
      const data = p.slice(8);
      if (resp == 1) {
        if (op == null || op_ret == op) {
          return [val, data];
        } else if (data[0] != 0 && data[1] == this.ROM_INVALID_RECV_MSG) {
          await this.flush_input();
          throw new ESPError("unsupported command error");
        }
      }
    }
    throw new ESPError("invalid response");
  }

  async read_reg(addr: number, timeout = 3000) {
    const pkt = this._int_to_bytearray(addr);
    const val = await this.command(this.ESP_READ_REG, pkt, undefined, undefined, timeout);
    return val[0];
  }

  async write_reg(addr: number, value: number, mask = 0xffffffff, delay_us = 0, delay_after_us = 0) {
    let pkt = this._appendArray(this._int_to_bytearray(addr), this._int_to_bytearray(value));
    pkt = this._appendArray(pkt, this._int_to_bytearray(mask));
    pkt = this._appendArray(pkt, this._int_to_bytearray(delay_us));

    if (delay_after_us > 0) {
      pkt = this._appendArray(pkt, this._int_to_bytearray(this.chip.UART_DATE_REG_ADDR));
      pkt = this._appendArray(pkt, this._int_to_bytearray(0));
      pkt = this._appendArray(pkt, this._int_to_bytearray(0));
      pkt = this._appendArray(pkt, this._int_to_bytearray(delay_after_us));
    }

    await this.check_command("write target memory", this.ESP_WRITE_REG, pkt);
  }

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

  async _connect_attempt(mode = "default_reset", esp32r0_delay = false) {
    this.debug("_connect_attempt " + mode + " " + esp32r0_delay);
    if (mode !== "no_reset") {
      if (this.transport.get_pid() === this.USB_JTAG_SERIAL_PID) {
        // Custom reset sequence, which is required when the device
        // is connecting via its USB-JTAG-Serial peripheral
        await this.transport.setRTS(false);
        await this.transport.setDTR(false);
        await this._sleep(100);

        await this.transport.setDTR(true);
        await this.transport.setRTS(false);
        await this._sleep(100);

        await this.transport.setRTS(true);
        await this.transport.setDTR(false);
        await this.transport.setRTS(true);

        await this._sleep(100);
        await this.transport.setRTS(false);
        await this.transport.setDTR(false);
      } else {
        await this.transport.setDTR(false);
        await this.transport.setRTS(true);
        await this._sleep(100);
        if (esp32r0_delay) {
          //await this._sleep(1200);
          await this._sleep(2000);
        }
        await this.transport.setDTR(true);
        await this.transport.setRTS(false);
        if (esp32r0_delay) {
          //await this._sleep(400);
        }
        await this._sleep(50);
        await this.transport.setDTR(false);
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
    this.transport.slip_reader_enabled = true;
    i = 7;
    while (i--) {
      try {
        const resp = await this.sync();
        this.debug(resp[0].toString());
        return "success";
      } catch (error) {
        if (error instanceof Error) {
          if (esp32r0_delay) {
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

  async connect(mode = "default_reset", attempts = 7, detecting = false) {
    let i;
    let resp;
    this.info("Connecting...", false);
    await this.transport.connect(this.rom_baudrate);
    for (i = 0; i < attempts; i++) {
      resp = await this._connect_attempt(mode, false);
      if (resp === "success") {
        break;
      }
      resp = await this._connect_attempt(mode, true);
      if (resp === "success") {
        break;
      }
    }
    if (resp !== "success") {
      throw new ESPError("Failed to connect with the device");
    }
    this.info("\n\r", false);

    if (!detecting) {
      const chip_magic_value = (await this.read_reg(0x40001000)) >>> 0;
      this.debug("Chip Magic " + chip_magic_value.toString(16));
      const chip = await magic2Chip(chip_magic_value);
      if (this.chip === null) {
        throw new ESPError(`Unexpected CHIP magic value ${chip_magic_value}. Failed to autodetect chip type.`);
      } else {
        this.chip = chip as ROM;
      }
    }
  }

  async detect_chip(mode = "default_reset") {
    await this.connect(mode);
    this.info("Detecting chip type... ", false);
    if (this.chip != null) {
      this.info(this.chip.CHIP_NAME);
    } else {
      this.info("unknown!");
    }
  }

  async check_command(
    op_description = "",
    op: number | null = null,
    data: Uint8Array = new Uint8Array(0),
    chk = 0,
    timeout = 3000,
  ) {
    this.debug("check_command " + op_description);
    const resp = await this.command(op, data, chk, undefined, timeout);
    if (resp[1].length > 4) {
      return resp[1];
    } else {
      return resp[0];
    }
  }

  async mem_begin(size: number, blocks: number, blocksize: number, offset: number) {
    /* XXX: Add check to ensure that STUB is not getting overwritten */
    this.debug("mem_begin " + size + " " + blocks + " " + blocksize + " " + offset.toString(16));
    let pkt = this._appendArray(this._int_to_bytearray(size), this._int_to_bytearray(blocks));
    pkt = this._appendArray(pkt, this._int_to_bytearray(blocksize));
    pkt = this._appendArray(pkt, this._int_to_bytearray(offset));
    await this.check_command("enter RAM download mode", this.ESP_MEM_BEGIN, pkt);
  }

  checksum = function (data: Uint8Array) {
    let i;
    let chk = 0xef;

    for (i = 0; i < data.length; i++) {
      chk ^= data[i];
    }
    return chk;
  };

  async mem_block(buffer: Uint8Array, seq: number) {
    let pkt = this._appendArray(this._int_to_bytearray(buffer.length), this._int_to_bytearray(seq));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, buffer);
    const checksum = this.checksum(buffer);
    await this.check_command("write to target RAM", this.ESP_MEM_DATA, pkt, checksum);
  }

  async mem_finish(entrypoint: number) {
    const is_entry = entrypoint === 0 ? 1 : 0;
    const pkt = this._appendArray(this._int_to_bytearray(is_entry), this._int_to_bytearray(entrypoint));
    await this.check_command("leave RAM download mode", this.ESP_MEM_END, pkt, undefined, 50); // XXX: handle non-stub with diff timeout
  }

  async flash_spi_attach(hspi_arg: number) {
    const pkt = this._int_to_bytearray(hspi_arg);
    await this.check_command("configure SPI flash pins", this.ESP_SPI_ATTACH, pkt);
  }

  timeout_per_mb = function (seconds_per_mb: number, size_bytes: number) {
    const result = seconds_per_mb * (size_bytes / 1000000);
    if (result < 3000) {
      return 3000;
    } else {
      return result;
    }
  };

  async flash_begin(size: number, offset: number) {
    const num_blocks = Math.floor((size + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
    const erase_size = this.chip.get_erase_size(offset, size);

    const d = new Date();
    const t1 = d.getTime();

    let timeout = 3000;
    if (this.IS_STUB == false) {
      timeout = this.timeout_per_mb(this.ERASE_REGION_TIMEOUT_PER_MB, size);
    }

    this.debug(
      "flash begin " + erase_size + " " + num_blocks + " " + this.FLASH_WRITE_SIZE + " " + offset + " " + size,
    );
    let pkt = this._appendArray(this._int_to_bytearray(erase_size), this._int_to_bytearray(num_blocks));
    pkt = this._appendArray(pkt, this._int_to_bytearray(this.FLASH_WRITE_SIZE));
    pkt = this._appendArray(pkt, this._int_to_bytearray(offset));
    if (this.IS_STUB == false) {
      pkt = this._appendArray(pkt, this._int_to_bytearray(0)); // XXX: Support encrypted
    }

    await this.check_command("enter Flash download mode", this.ESP_FLASH_BEGIN, pkt, undefined, timeout);

    const t2 = d.getTime();
    if (size != 0 && this.IS_STUB == false) {
      this.info("Took " + (t2 - t1) / 1000 + "." + ((t2 - t1) % 1000) + "s to erase flash block");
    }
    return num_blocks;
  }

  async flash_defl_begin(size: number, compsize: number, offset: number) {
    const num_blocks = Math.floor((compsize + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
    const erase_blocks = Math.floor((size + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);

    const d = new Date();
    const t1 = d.getTime();

    let write_size, timeout;
    if (this.IS_STUB) {
      write_size = size;
      timeout = 3000;
    } else {
      write_size = erase_blocks * this.FLASH_WRITE_SIZE;
      timeout = this.timeout_per_mb(this.ERASE_REGION_TIMEOUT_PER_MB, write_size);
    }
    this.info("Compressed " + size + " bytes to " + compsize + "...");

    let pkt = this._appendArray(this._int_to_bytearray(write_size), this._int_to_bytearray(num_blocks));
    pkt = this._appendArray(pkt, this._int_to_bytearray(this.FLASH_WRITE_SIZE));
    pkt = this._appendArray(pkt, this._int_to_bytearray(offset));

    if (
      (this.chip.CHIP_NAME === "ESP32-S2" ||
        this.chip.CHIP_NAME === "ESP32-S3" ||
        this.chip.CHIP_NAME === "ESP32-C3") &&
      this.IS_STUB === false
    ) {
      pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    }
    await this.check_command("enter compressed flash mode", this.ESP_FLASH_DEFL_BEGIN, pkt, undefined, timeout);
    const t2 = d.getTime();
    if (size != 0 && this.IS_STUB === false) {
      this.info("Took " + (t2 - t1) / 1000 + "." + ((t2 - t1) % 1000) + "s to erase flash block");
    }
    return num_blocks;
  }

  async flash_block(data: Uint8Array, seq: number, timeout: number) {
    let pkt = this._appendArray(this._int_to_bytearray(data.length), this._int_to_bytearray(seq));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, data);

    const checksum = this.checksum(data);

    await this.check_command("write to target Flash after seq " + seq, this.ESP_FLASH_DATA, pkt, checksum, timeout);
  }

  async flash_defl_block(data: Uint8Array, seq: number, timeout: number) {
    let pkt = this._appendArray(this._int_to_bytearray(data.length), this._int_to_bytearray(seq));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, data);

    const checksum = this.checksum(data);
    this.debug("flash_defl_block " + data[0].toString(16) + " " + data[1].toString(16));

    await this.check_command(
      "write compressed data to flash after seq " + seq,
      this.ESP_FLASH_DEFL_DATA,
      pkt,
      checksum,
      timeout,
    );
  }

  async flash_finish(reboot = false) {
    const val = reboot ? 0 : 1;
    const pkt = this._int_to_bytearray(val);

    await this.check_command("leave Flash mode", this.ESP_FLASH_END, pkt);
  }

  async flash_defl_finish(reboot = false) {
    const val = reboot ? 0 : 1;
    const pkt = this._int_to_bytearray(val);

    await this.check_command("leave compressed flash mode", this.ESP_FLASH_DEFL_END, pkt);
  }

  async run_spiflash_command(spiflash_command: number, data: Uint8Array, read_bits: number) {
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

    let set_data_lengths;
    if (this.chip.SPI_MOSI_DLEN_OFFS != null) {
      set_data_lengths = async (mosi_bits: number, miso_bits: number) => {
        const SPI_MOSI_DLEN_REG = base + this.chip.SPI_MOSI_DLEN_OFFS;
        const SPI_MISO_DLEN_REG = base + this.chip.SPI_MISO_DLEN_OFFS;
        if (mosi_bits > 0) {
          await this.write_reg(SPI_MOSI_DLEN_REG, mosi_bits - 1);
        }
        if (miso_bits > 0) {
          await this.write_reg(SPI_MISO_DLEN_REG, miso_bits - 1);
        }
      };
    } else {
      set_data_lengths = async (mosi_bits: number, miso_bits: number) => {
        const SPI_DATA_LEN_REG = SPI_USR1_REG;
        const SPI_MOSI_BITLEN_S = 17;
        const SPI_MISO_BITLEN_S = 8;
        const mosi_mask = mosi_bits === 0 ? 0 : mosi_bits - 1;
        const miso_mask = miso_bits === 0 ? 0 : miso_bits - 1;
        const val = (miso_mask << SPI_MISO_BITLEN_S) | (mosi_mask << SPI_MOSI_BITLEN_S);
        await this.write_reg(SPI_DATA_LEN_REG, val);
      };
    }

    const SPI_CMD_USR = 1 << 18;
    const SPI_USR2_COMMAND_LEN_SHIFT = 28;
    if (read_bits > 32) {
      throw new ESPError("Reading more than 32 bits back from a SPI flash operation is unsupported");
    }
    if (data.length > 64) {
      throw new ESPError("Writing more than 64 bytes of data with one SPI command is unsupported");
    }

    const data_bits = data.length * 8;
    const old_spi_usr = await this.read_reg(SPI_USR_REG);
    const old_spi_usr2 = await this.read_reg(SPI_USR2_REG);
    let flags = SPI_USR_COMMAND;
    let i;
    if (read_bits > 0) {
      flags |= SPI_USR_MISO;
    }
    if (data_bits > 0) {
      flags |= SPI_USR_MOSI;
    }
    await set_data_lengths(data_bits, read_bits);
    await this.write_reg(SPI_USR_REG, flags);
    let val = (7 << SPI_USR2_COMMAND_LEN_SHIFT) | spiflash_command;
    await this.write_reg(SPI_USR2_REG, val);
    if (data_bits == 0) {
      await this.write_reg(SPI_W0_REG, 0);
    } else {
      if (data.length % 4 != 0) {
        const padding = new Uint8Array(data.length % 4);
        data = this._appendArray(data, padding);
      }
      let next_reg = SPI_W0_REG;
      for (i = 0; i < data.length - 4; i += 4) {
        val = this._bytearray_to_int(data[i], data[i + 1], data[i + 2], data[i + 3]);
        await this.write_reg(next_reg, val);
        next_reg += 4;
      }
    }
    await this.write_reg(SPI_CMD_REG, SPI_CMD_USR);
    for (i = 0; i < 10; i++) {
      val = (await this.read_reg(SPI_CMD_REG)) & SPI_CMD_USR;
      if (val == 0) {
        break;
      }
    }
    if (i === 10) {
      throw new ESPError("SPI command did not complete in time");
    }
    const stat = await this.read_reg(SPI_W0_REG);
    await this.write_reg(SPI_USR_REG, old_spi_usr);
    await this.write_reg(SPI_USR2_REG, old_spi_usr2);
    return stat;
  }

  async read_flash_id() {
    const SPIFLASH_RDID = 0x9f;
    const pkt = new Uint8Array(0);
    return await this.run_spiflash_command(SPIFLASH_RDID, pkt, 24);
  }

  async erase_flash() {
    this.info("Erasing flash (this may take a while)...");
    let d = new Date();
    const t1 = d.getTime();
    const ret = await this.check_command(
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

  toHex(buffer: number | Uint8Array) {
    return Array.prototype.map.call(buffer, (x) => ("00" + x.toString(16)).slice(-2)).join("");
  }

  async flash_md5sum(addr: number, size: number) {
    const timeout = this.timeout_per_mb(this.MD5_TIMEOUT_PER_MB, size);
    let pkt = this._appendArray(this._int_to_bytearray(addr), this._int_to_bytearray(size));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));
    pkt = this._appendArray(pkt, this._int_to_bytearray(0));

    let res = await this.check_command("calculate md5sum", this.ESP_SPI_FLASH_MD5, pkt, undefined, timeout);
    if (res instanceof Uint8Array && res.length > 16) {
      res = res.slice(0, 16);
    }
    const strmd5 = this.toHex(res);
    return strmd5;
  }

  async run_stub() {
    this.info("Uploading stub...");

    let decoded = atob(this.chip.ROM_TEXT);
    let chardata = decoded.split("").map(function (x) {
      return x.charCodeAt(0);
    });
    const text = new Uint8Array(chardata);

    decoded = atob(this.chip.ROM_DATA);
    chardata = decoded.split("").map(function (x) {
      return x.charCodeAt(0);
    });
    const data = new Uint8Array(chardata);

    let blocks = Math.floor((text.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
    let i;

    await this.mem_begin(text.length, blocks, this.ESP_RAM_BLOCK, this.chip.TEXT_START);
    for (i = 0; i < blocks; i++) {
      const from_offs = i * this.ESP_RAM_BLOCK;
      const to_offs = from_offs + this.ESP_RAM_BLOCK;
      await this.mem_block(text.slice(from_offs, to_offs), i);
    }

    blocks = Math.floor((data.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
    await this.mem_begin(data.length, blocks, this.ESP_RAM_BLOCK, this.chip.DATA_START);
    for (i = 0; i < blocks; i++) {
      const from_offs = i * this.ESP_RAM_BLOCK;
      const to_offs = from_offs + this.ESP_RAM_BLOCK;
      await this.mem_block(data.slice(from_offs, to_offs), i);
    }

    this.info("Running stub...");
    await this.mem_finish(this.chip.ENTRY);

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

  async change_baud() {
    this.info("Changing baudrate to " + this.baudrate);
    const second_arg = this.IS_STUB ? this.transport.baudrate : 0;
    const pkt = this._appendArray(this._int_to_bytearray(this.baudrate), this._int_to_bytearray(second_arg));
    const resp = await this.command(this.ESP_CHANGE_BAUDRATE, pkt);
    this.debug(resp[0].toString());
    this.info("Changed");
    await this.transport.disconnect();
    await this._sleep(50);
    await this.transport.connect(this.baudrate);
    try {
      await this.transport.rawRead(500);
    } catch (e) {
      this.debug((e as Error).message);
    }
  }

  async main_fn(mode = "default_reset") {
    await this.detect_chip(mode);

    const chip = await this.chip.get_chip_description(this);
    this.info("Chip is " + chip);
    this.info("Features: " + (await this.chip.get_chip_features(this)));
    this.info("Crystal is " + (await this.chip.get_crystal_freq(this)) + "MHz");
    this.info("MAC: " + (await this.chip.read_mac(this)));
    await this.chip.read_mac(this);

    if (typeof this.chip._post_connect != "undefined") {
      await this.chip._post_connect(this);
    }

    await this.run_stub();

    if (this.rom_baudrate !== this.baudrate) {
      await this.change_baud();
    }
    return chip;
  }

  flash_size_bytes = function (flash_size: string) {
    let flash_size_b = -1;
    if (flash_size.indexOf("KB") !== -1) {
      flash_size_b = parseInt(flash_size.slice(0, flash_size.indexOf("KB"))) * 1024;
    } else if (flash_size.indexOf("MB") !== -1) {
      flash_size_b = parseInt(flash_size.slice(0, flash_size.indexOf("MB"))) * 1024 * 1024;
    }
    return flash_size_b;
  };

  parse_flash_size_arg(flsz: string) {
    if (typeof this.chip.FLASH_SIZES[flsz] === "undefined") {
      throw new ESPError(
        "Flash size " + flsz + " is not supported by this chip type. Supported sizes: " + this.chip.FLASH_SIZES,
      );
    }
    return this.chip.FLASH_SIZES[flsz];
  }

  _update_image_flash_params(
    image: string,
    address: number,
    flash_size: string,
    flash_mode: string,
    flash_freq: string,
  ) {
    this.debug("_update_image_flash_params " + flash_size + " " + flash_mode + " " + flash_freq);
    if (image.length < 8) {
      return image;
    }
    if (address != this.chip.BOOTLOADER_FLASH_OFFSET) {
      return image;
    }
    if (flash_size === "keep" && flash_mode === "keep" && flash_freq === "keep") {
      this.info("Not changing the image");
      return image;
    }

    const magic = parseInt(image[0]);
    let a_flash_mode = parseInt(image[2]);
    const flash_size_freq = parseInt(image[3]);
    if (magic !== this.ESP_IMAGE_MAGIC) {
      this.info(
        "Warning: Image file at 0x" +
          address.toString(16) +
          " doesn't look like an image file, so not changing any flash settings.",
      );
      return image;
    }

    /* XXX: Yet to implement actual image verification */

    if (flash_mode !== "keep") {
      const flash_modes: { [key: string]: number } = { qio: 0, qout: 1, dio: 2, dout: 3 };
      a_flash_mode = flash_modes[flash_mode];
    }
    let a_flash_freq = flash_size_freq & 0x0f;
    if (flash_freq !== "keep") {
      const flash_freqs: { [key: string]: number } = { "40m": 0, "26m": 1, "20m": 2, "80m": 0xf };
      a_flash_freq = flash_freqs[flash_freq];
    }
    let a_flash_size = flash_size_freq & 0xf0;
    if (flash_size !== "keep") {
      a_flash_size = this.parse_flash_size_arg(flash_size);
    }

    const flash_params = (a_flash_mode << 8) | (a_flash_freq + a_flash_size);
    this.info("Flash params set to " + flash_params.toString(16));
    if (parseInt(image[2]) !== a_flash_mode << 8) {
      image = image.substring(0, 2) + (a_flash_mode << 8).toString() + image.substring(2 + 1);
    }
    if (parseInt(image[3]) !== a_flash_freq + a_flash_size) {
      image = image.substring(0, 3) + (a_flash_freq + a_flash_size).toString() + image.substring(3 + 1);
    }
    return image;
  }

  async write_flash(
    fileArray: {
      data: string;
      address: number;
    }[],
    flash_size = "keep",
    flash_mode = "keep",
    flash_freq = "keep",
    erase_all = false,
    compress = true,
    /* function(fileIndex, written, total) */
    reportProgress?: (fileIndex: number, written: number, total: number) => void,
    /* function(image: string) => string */
    calculateMD5Hash?: (image: string) => string,
  ) {
    this.debug("EspLoader program");
    if (flash_size !== "keep") {
      const flash_end = this.flash_size_bytes(flash_size);
      for (let i = 0; i < fileArray.length; i++) {
        if (fileArray[i].data.length + fileArray[i].address > flash_end) {
          throw new ESPError(`File ${i + 1} doesn't fit in the available flash`);
        }
      }
    }

    if (this.IS_STUB === true && erase_all === true) {
      await this.erase_flash();
    }
    let image: string, address: number;
    for (let i = 0; i < fileArray.length; i++) {
      this.debug("Data Length " + fileArray[i].data.length);
      image = fileArray[i].data;
      const reminder = fileArray[i].data.length % 4;
      if (reminder > 0) image += "\xff\xff\xff\xff".substring(4 - reminder);
      address = fileArray[i].address;
      this.debug("Image Length " + image.length);
      if (image.length === 0) {
        this.debug("Warning: File is empty");
        continue;
      }
      image = this._update_image_flash_params(image, address, flash_size, flash_mode, flash_freq);
      let calcmd5: string | null = null;
      if (calculateMD5Hash) {
        calcmd5 = calculateMD5Hash(image);
        this.debug("Image MD5 " + calcmd5);
      }
      const uncsize = image.length;
      let blocks: number;
      if (compress) {
        const uncimage = this.bstrToUi8(image);
        image = this.ui8ToBstr(deflate(uncimage, { level: 9 }));
        blocks = await this.flash_defl_begin(uncsize, image.length, address);
      } else {
        blocks = await this.flash_begin(uncsize, address);
      }
      let seq = 0;
      let bytes_sent = 0;
      const totalBytes = image.length;
      if (reportProgress) reportProgress(i, 0, totalBytes);

      let d = new Date();
      const t1 = d.getTime();

      let timeout = 5000;
      // Create a decompressor to keep track of the size of uncompressed data
      // to be written in each chunk.
      const inflate = new Inflate({ chunkSize: 1 });
      let total_len_uncompressed = 0;
      inflate.onData = function (chunk: Data): void {
        total_len_uncompressed += chunk.byteLength;
      };
      while (image.length > 0) {
        this.debug("Write loop " + address + " " + seq + " " + blocks);
        this.info(
          "Writing at 0x" +
            (address + total_len_uncompressed).toString(16) +
            "... (" +
            Math.floor((100 * (seq + 1)) / blocks) +
            "%)",
        );
        const block = this.bstrToUi8(image.slice(0, this.FLASH_WRITE_SIZE));

        if (compress) {
          const len_uncompressed_previous = total_len_uncompressed;
          inflate.push(block, false);
          const block_uncompressed = total_len_uncompressed - len_uncompressed_previous;
          let block_timeout = 3000;
          if (this.timeout_per_mb(this.ERASE_WRITE_TIMEOUT_PER_MB, block_uncompressed) > 3000) {
            block_timeout = this.timeout_per_mb(this.ERASE_WRITE_TIMEOUT_PER_MB, block_uncompressed);
          }
          if (this.IS_STUB === false) {
            // ROM code writes block to flash before ACKing
            timeout = block_timeout;
          }
          await this.flash_defl_block(block, seq, timeout);
          if (this.IS_STUB) {
            // Stub ACKs when block is received, then writes to flash while receiving the block after it
            timeout = block_timeout;
          }
        } else {
          throw new ESPError("Yet to handle Non Compressed writes");
        }
        bytes_sent += block.length;
        image = image.slice(this.FLASH_WRITE_SIZE, image.length);
        seq++;
        if (reportProgress) reportProgress(i, bytes_sent, totalBytes);
      }
      if (this.IS_STUB) {
        await this.read_reg(this.CHIP_DETECT_MAGIC_REG_ADDR, timeout);
      }
      d = new Date();
      const t = d.getTime() - t1;
      if (compress) {
        this.info(
          "Wrote " +
            uncsize +
            " bytes (" +
            bytes_sent +
            " compressed) at 0x" +
            address.toString(16) +
            " in " +
            t / 1000 +
            " seconds.",
        );
      }
      if (calcmd5) {
        const res = await this.flash_md5sum(address, uncsize);
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
      await this.flash_begin(0, 0);
      if (compress) {
        await this.flash_defl_finish();
      } else {
        await this.flash_finish();
      }
    }
  }

  async flash_id() {
    this.debug("flash_id");
    const flashid = await this.read_flash_id();
    this.info("Manufacturer: " + (flashid & 0xff).toString(16));
    const flid_lowbyte = (flashid >> 16) & 0xff;
    this.info("Device: " + ((flashid >> 8) & 0xff).toString(16) + flid_lowbyte.toString(16));
    this.info("Detected flash size: " + this.DETECTED_FLASH_SIZES[flid_lowbyte]);
  }

  async hard_reset() {
    await this.transport.setRTS(true); // EN->LOW
    await this._sleep(100);
    await this.transport.setRTS(false);
  }

  async soft_reset() {
    if (!this.IS_STUB) {
      // "run user code" is as close to a soft reset as we can do
      await this.flash_begin(0, 0);
      await this.flash_finish(false);
    } else if (this.chip.CHIP_NAME != "ESP8266") {
      throw new ESPError("Soft resetting is currently only supported on ESP8266");
    } else {
      // running user code from stub loader requires some hacks
      // in the stub loader
      await this.command(this.ESP_RUN_USER_CODE, undefined, undefined, false);
    }
  }
}
