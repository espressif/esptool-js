import { ESP32C2ROM } from "../targets/esp32c2";
import { ESP32C3ROM } from "../targets/esp32c3";
import { ESP32C5ROM } from "../targets/esp32c5";
import { ESP32C6ROM } from "../targets/esp32c6";
import { ESP32C61ROM } from "../targets/esp32c61";
import { ESP32H2ROM } from "../targets/esp32h2";
import { ESP32P4ROM } from "../targets/esp32p4";
import { ESP32S2ROM } from "../targets/esp32s2";
import { ESP32S3ROM } from "../targets/esp32s3";
import { ESP32FirmwareImage } from "./esp32";

export class ESP32S2FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32S2ROM;

  constructor(
    rom: ESP32S2ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32S2ROM;
  }
}

export class ESP32S3FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32S3ROM;

  constructor(
    rom: ESP32S3ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32S3ROM;
  }
}

export class ESP32C3FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32C3ROM;

  constructor(
    rom: ESP32C3ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32C3ROM;
  }
}

export class ESP32C2FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32C2ROM;

  constructor(
    rom: ESP32C2ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32C2ROM;
  }

  MMU_PAGE_SIZE_CONF = [16384, 32768, 65536]; // 16KB, 32KB, 64KB
}

export class ESP32C6FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32C6ROM;

  constructor(
    rom: ESP32C6ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32C6ROM;
  }

  MMU_PAGE_SIZE_CONF = [8192, 16384, 32768, 65536];
}

export class ESP32C61FirmwareImage extends ESP32C6FirmwareImage {
  ROM_LOADER: ESP32C61ROM;

  constructor(
    rom: ESP32C61ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32C61ROM;
  }
}

export class ESP32C5FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32C5ROM;

  constructor(
    rom: ESP32C5ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32C5ROM;
  }
}

export class ESP32P4FirmwareImage extends ESP32FirmwareImage {
  ROM_LOADER: ESP32P4ROM;

  constructor(
    rom: ESP32P4ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32P4ROM;
  }
}

export class ESP32H2FirmwareImage extends ESP32C6FirmwareImage {
  ROM_LOADER: ESP32H2ROM;

  constructor(
    rom: ESP32H2ROM,
    loadFile: Uint8Array | string | null = null,
    appendDigest = true,
    ramOnlyHeader = false,
  ) {
    super(rom, loadFile, appendDigest, ramOnlyHeader);
    this.ROM_LOADER = rom as ESP32H2ROM;
  }
}
