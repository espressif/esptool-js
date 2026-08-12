import type { Transport } from "../transport.js";

/** esp_loader error codes (esp_loader_error.h). */
export enum EspLoaderError {
  Success = 0,
  Fail = 1,
  Timeout = 2,
  ImageSize = 3,
  InvalidMd5 = 4,
  InvalidParam = 5,
  InvalidTarget = 6,
  UnsupportedChip = 7,
  UnsupportedFunc = 8,
  InvalidResponse = 9,
}

/** Mirrors target_chip_t from esp_loader.h. */
export enum TargetChip {
  Esp8266 = 0,
  Esp32 = 1,
  Esp32S2 = 2,
  Esp32C3 = 3,
  Esp32S3 = 4,
  Esp32C2 = 5,
  Esp32C5 = 6,
  Esp32H2 = 7,
  Esp32C6 = 8,
  Esp32P4 = 9,
  Esp32C61 = 10,
  Unknown = 11,
}

/** Packed size written by flasher_get_security_info. */
export const SECURITY_INFO_SIZE = 20;

/** Mirrors esp_loader_target_security_info_t (decoded from packed buffer). */
export interface SecurityInfo {
  targetChip: TargetChip;
  ecoVersion: number;
  secureBootEnabled: boolean;
  secureBootAggressiveRevokeEnabled: boolean;
  secureDownloadModeEnabled: boolean;
  secureBootRevokedKeys: [boolean, boolean, boolean];
  jtagSoftwareDisabled: boolean;
  jtagHardwareDisabled: boolean;
  usbDisabled: boolean;
  flashEncryptionEnabled: boolean;
  dcacheInUartDownloadDisabled: boolean;
  icacheInUartDownloadDisabled: boolean;
}

const ERROR_NAMES: Record<number, string> = {
  [EspLoaderError.Fail]: "ESP_LOADER_ERROR_FAIL",
  [EspLoaderError.Timeout]: "ESP_LOADER_ERROR_TIMEOUT",
  [EspLoaderError.ImageSize]: "ESP_LOADER_ERROR_IMAGE_SIZE",
  [EspLoaderError.InvalidMd5]: "ESP_LOADER_ERROR_INVALID_MD5",
  [EspLoaderError.InvalidParam]: "ESP_LOADER_ERROR_INVALID_PARAM",
  [EspLoaderError.InvalidTarget]: "ESP_LOADER_ERROR_INVALID_TARGET",
  [EspLoaderError.UnsupportedChip]: "ESP_LOADER_ERROR_UNSUPPORTED_CHIP",
  [EspLoaderError.UnsupportedFunc]: "ESP_LOADER_ERROR_UNSUPPORTED_FUNC",
  [EspLoaderError.InvalidResponse]: "ESP_LOADER_ERROR_INVALID_RESPONSE",
};

export class FlasherError extends Error {
  constructor(public readonly code: number, message?: string) {
    const name = ERROR_NAMES[code] ?? `ESP_LOADER_ERROR_${code}`;
    super(message ? `${name}: ${message}` : name);
    this.name = "FlasherError";
  }
}

export function checkResult(code: number, context?: string): void {
  if (code !== EspLoaderError.Success) {
    throw new FlasherError(code, context);
  }
}

/** Active target protocol mode for a connected session. */
export type EspConnectionMode = "rom" | "stub" | "secure-download";

/** Connected session handle returned by connectEsp(). */
export interface EspDevice {
  transport: Transport;
  module: EspFlasherModule;
  bindings: FlasherBindings;
  connectionMode: EspConnectionMode;
}

export type LogFn = (message: string) => void;

export interface EspFlasherModule {
  cwrap: (
    ident: string,
    returnType: string | null,
    argTypes: string[],
    opts?: { async?: boolean },
  ) => (...args: number[]) => number | Promise<number>;
  getValue: (ptr: number, type: string) => number;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  HEAPU8: Uint8Array;
  serialBuffer: Uint8Array;
  __transport?: Transport;
  __log?: LogFn;
  /** Tail of the serialized call queue (see wrap()). */
  __queue?: Promise<unknown>;
  /** Set when the Emscripten runtime called abort(); the instance is unusable. */
  __aborted?: boolean;
  /** Rejecters of calls waiting on the module, settled by notifyModuleAborted(). */
  __abortWaiters?: Set<(error: Error) => void>;
}

type AsyncFn = (...args: number[]) => Promise<number>;

export interface FlasherBindings {
  connect: () => Promise<number>;
  connectRom: () => Promise<number>;
  connectSecureDownload: (flashSize: number) => Promise<number>;
  deinit: () => Promise<number>;
  getTarget: () => Promise<number>;
  changeBaudrate: (baud: number) => Promise<number>;
  flashDetectSize: (outPtr: number) => Promise<number>;
  flashStart: (offset: number, imageSize: number, blockSize: number, skipVerify: number) => Promise<number>;
  flashWrite: (payloadPtr: number, size: number) => Promise<number>;
  flashFinish: () => Promise<number>;
  flashDeflateStart: (
    offset: number,
    imageSize: number,
    compressedSize: number,
    blockSize: number,
  ) => Promise<number>;
  flashDeflateWrite: (payloadPtr: number, size: number) => Promise<number>;
  flashDeflateFinish: () => Promise<number>;
  flashErase: () => Promise<number>;
  flashEraseRegion: (offset: number, size: number) => Promise<number>;
  flashRead: (bufPtr: number, address: number, length: number) => Promise<number>;
  flashVerifyKnownMd5: (address: number, size: number, md5Ptr: number) => Promise<number>;
  memStart: (offset: number, size: number, blockSize: number) => Promise<number>;
  memWrite: (payloadPtr: number, size: number) => Promise<number>;
  memFinish: (entrypoint: number) => Promise<number>;
  readMac: (macPtr: number) => Promise<number>;
  writeRegister: (address: number, value: number) => Promise<number>;
  readRegister: (address: number, outPtr: number) => Promise<number>;
  getSecurityInfo: (outPtr: number) => Promise<number>;
  resetTarget: () => Promise<number>;
}

/** How long a single flasher call may run before it is reported as stalled. */
const STALL_REPORT_INTERVAL_MS = 10000;

/**
 * Mark a module as aborted and fail every call waiting on it.
 *
 * An Asyncify abort happens while a call is suspended, so the promise returned
 * by that call never settles. Without this the serialized queue would stay
 * blocked behind it and the caller would hang instead of seeing the error.
 * @param module
 * @param what Abort reason reported by Emscripten.
 */
export function notifyModuleAborted(module: EspFlasherModule, what: unknown): void {
  module.__aborted = true;
  const waiters = module.__abortWaiters;
  module.__abortWaiters = new Set();
  if (waiters) {
    const error = new FlasherError(EspLoaderError.Fail, `WASM module aborted: ${String(what)}`);
    waiters.forEach((reject) => reject(error));
  }
}

/**
 * Wrap an exported flasher function and queue it behind any call already in
 * flight. The WASM module is built with ASYNCIFY, which supports a single
 * suspended call at a time: overlapping calls corrupt the unwind state, abort
 * the runtime and interleave SLIP frames on the wire.
 * @param module
 * @param name
 * @param argTypes
 */
function wrap(module: EspFlasherModule, name: string, argTypes: string[]): AsyncFn {
  const fn = module.cwrap(name, "number", argTypes, { async: true }) as AsyncFn;
  return (...args: number[]) => {
    const run = async () => {
      if (module.__aborted) {
        throw new FlasherError(EspLoaderError.Fail, `${name}: WASM module aborted, reconnect to recreate it`);
      }

      let rejectOnAbort: (error: Error) => void = () => undefined;
      const abortedBeforeDone = new Promise<never>((_resolve, reject) => {
        rejectOnAbort = reject;
      });
      const waiters = module.__abortWaiters ?? new Set<(error: Error) => void>();
      module.__abortWaiters = waiters;
      waiters.add(rejectOnAbort);

      const startedAt = Date.now();
      const stallReporter = setInterval(() => {
        module.__log?.(`[W] ${name} still running after ${Math.round((Date.now() - startedAt) / 1000)}s`);
      }, STALL_REPORT_INTERVAL_MS);

      try {
        return await Promise.race([fn(...args), abortedBeforeDone]);
      } finally {
        clearInterval(stallReporter);
        waiters.delete(rejectOnAbort);
      }
    };
    const queued = (module.__queue ?? Promise.resolve()).then(run, run);
    module.__queue = queued.then(
      () => undefined,
      () => undefined,
    );
    return queued;
  };
}

export function createBindings(module: EspFlasherModule): FlasherBindings {
  return {
    connect: wrap(module, "flasher_connect", []) as () => Promise<number>,
    connectRom: wrap(module, "flasher_connect_rom", []) as () => Promise<number>,
    connectSecureDownload: wrap(module, "flasher_connect_secure_download", ["number"]) as (
      flashSize: number,
    ) => Promise<number>,
    deinit: wrap(module, "flasher_deinit", []) as () => Promise<number>,
    getTarget: wrap(module, "flasher_get_target", []) as () => Promise<number>,
    changeBaudrate: wrap(module, "flasher_change_baudrate", ["number"]) as (
      baud: number,
    ) => Promise<number>,
    flashDetectSize: wrap(module, "flasher_flash_detect_size", ["number"]) as (
      outPtr: number,
    ) => Promise<number>,
    flashStart: wrap(module, "flasher_flash_start", ["number", "number", "number", "number"]) as (
      offset: number,
      imageSize: number,
      blockSize: number,
      skipVerify: number,
    ) => Promise<number>,
    flashWrite: wrap(module, "flasher_flash_write", ["number", "number"]) as (
      payloadPtr: number,
      size: number,
    ) => Promise<number>,
    flashFinish: wrap(module, "flasher_flash_finish", []) as () => Promise<number>,
    flashDeflateStart: wrap(module, "flasher_flash_deflate_start", [
      "number",
      "number",
      "number",
      "number",
    ]) as (
      offset: number,
      imageSize: number,
      compressedSize: number,
      blockSize: number,
    ) => Promise<number>,
    flashDeflateWrite: wrap(module, "flasher_flash_deflate_write", ["number", "number"]) as (
      payloadPtr: number,
      size: number,
    ) => Promise<number>,
    flashDeflateFinish: wrap(module, "flasher_flash_deflate_finish", []) as () => Promise<number>,
    flashErase: wrap(module, "flasher_flash_erase", []) as () => Promise<number>,
    flashEraseRegion: wrap(module, "flasher_flash_erase_region", ["number", "number"]) as (
      offset: number,
      size: number,
    ) => Promise<number>,
    flashRead: wrap(module, "flasher_flash_read", ["number", "number", "number"]) as (
      bufPtr: number,
      address: number,
      length: number,
    ) => Promise<number>,
    flashVerifyKnownMd5: wrap(module, "flasher_flash_verify_known_md5", [
      "number",
      "number",
      "number",
    ]) as (address: number, size: number, md5Ptr: number) => Promise<number>,
    memStart: wrap(module, "flasher_mem_start", ["number", "number", "number"]) as (
      offset: number,
      size: number,
      blockSize: number,
    ) => Promise<number>,
    memWrite: wrap(module, "flasher_mem_write", ["number", "number"]) as (
      payloadPtr: number,
      size: number,
    ) => Promise<number>,
    memFinish: wrap(module, "flasher_mem_finish", ["number"]) as (entrypoint: number) => Promise<number>,
    readMac: wrap(module, "flasher_read_mac", ["number"]) as (macPtr: number) => Promise<number>,
    writeRegister: wrap(module, "flasher_write_register", ["number", "number"]) as (
      address: number,
      value: number,
    ) => Promise<number>,
    readRegister: wrap(module, "flasher_read_register", ["number", "number"]) as (
      address: number,
      outPtr: number,
    ) => Promise<number>,
    getSecurityInfo: wrap(module, "flasher_get_security_info", ["number"]) as (
      outPtr: number,
    ) => Promise<number>,
    resetTarget: wrap(module, "flasher_reset_target", []) as () => Promise<number>,
  };
}

export function decodeSecurityInfo(buf: Uint8Array): SecurityInfo {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  return {
    targetChip: view.getUint32(0, true) as TargetChip,
    ecoVersion: view.getUint32(4, true),
    secureBootEnabled: buf[8] !== 0,
    secureBootAggressiveRevokeEnabled: buf[9] !== 0,
    secureDownloadModeEnabled: buf[10] !== 0,
    secureBootRevokedKeys: [buf[11] !== 0, buf[12] !== 0, buf[13] !== 0],
    jtagSoftwareDisabled: buf[14] !== 0,
    jtagHardwareDisabled: buf[15] !== 0,
    usbDisabled: buf[16] !== 0,
    flashEncryptionEnabled: buf[17] !== 0,
    dcacheInUartDownloadDisabled: buf[18] !== 0,
    icacheInUartDownloadDisabled: buf[19] !== 0,
  };
}

export async function flasherConnect(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.connect(), "flasher_connect");
}

export async function flasherConnectRom(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.connectRom(), "flasher_connect_rom");
}

export async function flasherConnectSecureDownload(esp: EspDevice, flashSize: number): Promise<void> {
  checkResult(await esp.bindings.connectSecureDownload(flashSize), "flasher_connect_secure_download");
}

export async function flasherDeinit(esp: EspDevice): Promise<void> {
  await esp.bindings.deinit();
}

export async function flasherGetTarget(esp: EspDevice): Promise<TargetChip> {
  return (await esp.bindings.getTarget()) as TargetChip;
}

export async function flasherChangeBaudrate(esp: EspDevice, baud: number): Promise<void> {
  checkResult(await esp.bindings.changeBaudrate(baud), "flasher_change_baudrate");
}

export async function flasherFlashDetectSize(esp: EspDevice): Promise<number> {
  const ptr = esp.module._malloc(4);
  try {
    checkResult(await esp.bindings.flashDetectSize(ptr), "flasher_flash_detect_size");
    return esp.module.getValue(ptr, "i32") >>> 0;
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherFlashStart(
  esp: EspDevice,
  offset: number,
  imageSize: number,
  blockSize: number,
  skipVerify = false,
): Promise<void> {
  checkResult(
    await esp.bindings.flashStart(offset, imageSize, blockSize, skipVerify ? 1 : 0),
    "flasher_flash_start",
  );
}

export async function flasherFlashWrite(esp: EspDevice, data: Uint8Array): Promise<void> {
  const ptr = esp.module._malloc(data.length);
  try {
    esp.module.HEAPU8.set(data, ptr);
    checkResult(await esp.bindings.flashWrite(ptr, data.length), "flasher_flash_write");
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherFlashFinish(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.flashFinish(), "flasher_flash_finish");
}

export async function flasherFlashDeflateStart(
  esp: EspDevice,
  offset: number,
  imageSize: number,
  compressedSize: number,
  blockSize: number,
): Promise<void> {
  checkResult(
    await esp.bindings.flashDeflateStart(offset, imageSize, compressedSize, blockSize),
    "flasher_flash_deflate_start",
  );
}

export async function flasherFlashDeflateWrite(esp: EspDevice, data: Uint8Array): Promise<void> {
  const ptr = esp.module._malloc(data.length);
  try {
    esp.module.HEAPU8.set(data, ptr);
    checkResult(await esp.bindings.flashDeflateWrite(ptr, data.length), "flasher_flash_deflate_write");
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherFlashDeflateFinish(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.flashDeflateFinish(), "flasher_flash_deflate_finish");
}

export async function flasherFlashErase(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.flashErase(), "flasher_flash_erase");
}

export async function flasherFlashEraseRegion(
  esp: EspDevice,
  offset: number,
  size: number,
): Promise<void> {
  checkResult(await esp.bindings.flashEraseRegion(offset, size), "flasher_flash_erase_region");
}

export async function flasherFlashRead(
  esp: EspDevice,
  address: number,
  length: number,
): Promise<Uint8Array> {
  const ptr = esp.module._malloc(length);
  try {
    checkResult(await esp.bindings.flashRead(ptr, address, length), "flasher_flash_read");
    return esp.module.HEAPU8.slice(ptr, ptr + length);
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherFlashVerifyKnownMd5(
  esp: EspDevice,
  address: number,
  size: number,
  md5: Uint8Array,
): Promise<void> {
  if (md5.length !== 16) {
    throw new FlasherError(EspLoaderError.InvalidParam, "MD5 must be 16 bytes");
  }
  const ptr = esp.module._malloc(16);
  try {
    esp.module.HEAPU8.set(md5, ptr);
    checkResult(await esp.bindings.flashVerifyKnownMd5(address, size, ptr), "flasher_flash_verify_known_md5");
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherMemStart(
  esp: EspDevice,
  offset: number,
  size: number,
  blockSize: number,
): Promise<void> {
  checkResult(await esp.bindings.memStart(offset, size, blockSize), "flasher_mem_start");
}

export async function flasherMemWrite(esp: EspDevice, data: Uint8Array): Promise<void> {
  const ptr = esp.module._malloc(data.length);
  try {
    esp.module.HEAPU8.set(data, ptr);
    checkResult(await esp.bindings.memWrite(ptr, data.length), "flasher_mem_write");
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherMemFinish(esp: EspDevice, entrypoint: number): Promise<void> {
  checkResult(await esp.bindings.memFinish(entrypoint), "flasher_mem_finish");
}

export async function flasherReadMac(esp: EspDevice): Promise<Uint8Array> {
  const ptr = esp.module._malloc(6);
  try {
    checkResult(await esp.bindings.readMac(ptr), "flasher_read_mac");
    return esp.module.HEAPU8.slice(ptr, ptr + 6);
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherWriteRegister(
  esp: EspDevice,
  address: number,
  value: number,
): Promise<void> {
  checkResult(await esp.bindings.writeRegister(address, value), "flasher_write_register");
}

export async function flasherReadRegister(esp: EspDevice, address: number): Promise<number> {
  const ptr = esp.module._malloc(4);
  try {
    checkResult(await esp.bindings.readRegister(address, ptr), "flasher_read_register");
    return esp.module.getValue(ptr, "i32") >>> 0;
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherGetSecurityInfo(esp: EspDevice): Promise<SecurityInfo> {
  const ptr = esp.module._malloc(SECURITY_INFO_SIZE);
  try {
    checkResult(await esp.bindings.getSecurityInfo(ptr), "flasher_get_security_info");
    return decodeSecurityInfo(esp.module.HEAPU8.slice(ptr, ptr + SECURITY_INFO_SIZE));
  } finally {
    esp.module._free(ptr);
  }
}

export async function flasherResetTarget(esp: EspDevice): Promise<void> {
  await esp.bindings.resetTarget();
}
