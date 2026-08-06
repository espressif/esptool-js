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

/**
 *
 * @param code
 * @param context
 */
export function checkResult(code: number, context?: string): void {
  if (code !== EspLoaderError.Success) {
    throw new FlasherError(code, context);
  }
}

/** Connected session handle returned by connectEsp(). */
export interface EspDevice {
  transport: Transport;
  module: EspFlasherModule;
  bindings: FlasherBindings;
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
}

export interface FlasherBindings {
  connect: () => Promise<number>;
  changeBaudrate: (baud: number) => Promise<number>;
  flashDetectSize: (outPtr: number) => Promise<number>;
  flashStart: (offset: number, imageSize: number, blockSize: number) => Promise<number>;
  flashWrite: (payloadPtr: number, size: number) => Promise<number>;
  flashFinish: () => Promise<number>;
}

/**
 *
 * @param module
 */
export function createBindings(module: EspFlasherModule): FlasherBindings {
  return {
    connect: module.cwrap("flasher_connect", "number", [], { async: true }) as () => Promise<number>,
    changeBaudrate: module.cwrap("flasher_change_baudrate", "number", ["number"], {
      async: true,
    }) as (baud: number) => Promise<number>,
    flashDetectSize: module.cwrap("flasher_flash_detect_size", "number", ["number"], {
      async: true,
    }) as (outPtr: number) => Promise<number>,
    flashStart: module.cwrap("flasher_flash_start", "number", ["number", "number", "number"], {
      async: true,
    }) as (offset: number, imageSize: number, blockSize: number) => Promise<number>,
    flashWrite: module.cwrap("flasher_flash_write", "number", ["number", "number"], {
      async: true,
    }) as (payloadPtr: number, size: number) => Promise<number>,
    flashFinish: module.cwrap("flasher_flash_finish", "number", [], {
      async: true,
    }) as () => Promise<number>,
  };
}

/**
 * Thin wrappers matching Module.cwrap names.
 * @param esp
 */
export async function flasherConnect(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.connect(), "flasher_connect");
}

/**
 *
 * @param esp
 * @param baud
 */
export async function flasherChangeBaudrate(esp: EspDevice, baud: number): Promise<void> {
  checkResult(await esp.bindings.changeBaudrate(baud), "flasher_change_baudrate");
}

/**
 *
 * @param esp
 */
export async function flasherFlashDetectSize(esp: EspDevice): Promise<number> {
  const ptr = esp.module._malloc(4);
  try {
    checkResult(await esp.bindings.flashDetectSize(ptr), "flasher_flash_detect_size");
    return esp.module.getValue(ptr, "i32") >>> 0;
  } finally {
    esp.module._free(ptr);
  }
}

/**
 *
 * @param esp
 * @param offset
 * @param imageSize
 * @param blockSize
 */
export async function flasherFlashStart(
  esp: EspDevice,
  offset: number,
  imageSize: number,
  blockSize: number,
): Promise<void> {
  checkResult(await esp.bindings.flashStart(offset, imageSize, blockSize), "flasher_flash_start");
}

/**
 *
 * @param esp
 * @param data
 */
export async function flasherFlashWrite(esp: EspDevice, data: Uint8Array): Promise<void> {
  const ptr = esp.module._malloc(data.length);
  try {
    esp.module.HEAPU8.set(data, ptr);
    checkResult(await esp.bindings.flashWrite(ptr, data.length), "flasher_flash_write");
  } finally {
    esp.module._free(ptr);
  }
}

/**
 *
 * @param esp
 */
export async function flasherFlashFinish(esp: EspDevice): Promise<void> {
  checkResult(await esp.bindings.flashFinish(), "flasher_flash_finish");
}
