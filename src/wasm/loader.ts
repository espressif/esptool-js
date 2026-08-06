import type { EspFlasherModule, LogFn } from "./bindings.js";
import type { Transport } from "../transport.js";

export type CreateEspFlasherModule = (moduleOverrides?: Record<string, unknown>) => Promise<EspFlasherModule>;

let moduleFactory: CreateEspFlasherModule | null = null;
let moduleInstance: EspFlasherModule | null = null;

/**
 * Default URL for the WASM binary relative to this package's wasm/ folder.
 * Consumers / bundlers can override via loadWasmModule({ wasmUrl }).
 */
export function defaultWasmUrl(): string {
  try {
    // Prefer package-relative resolution when available (Node / modern bundlers).
    return new URL("../../wasm/esp_flasher.wasm", import.meta.url).href;
  } catch {
    return "./wasm/esp_flasher.wasm";
  }
}

export interface LoadWasmOptions {
  /** Override path/URL to esp_flasher.wasm */
  wasmUrl?: string;
  /** Override factory (useful in tests or custom bundling) */
  factory?: CreateEspFlasherModule;
  /** Optional log sink for C-side messages */
  log?: LogFn;
}

declare global {
  interface Window {
    createEspFlasherModule?: CreateEspFlasherModule;
  }
}

/**
 *
 */
async function importModuleFactory(): Promise<CreateEspFlasherModule> {
  if (moduleFactory) {
    return moduleFactory;
  }
  // Dynamic import of the Emscripten glue (MODULARIZE=1).
  // Path is relative to package root when consumed from lib/.
  const mod = await import("../../wasm/esp_flasher.js");
  const factory = (mod.default ?? mod.createEspFlasherModule) as unknown as CreateEspFlasherModule;
  if (typeof factory !== "function") {
    throw new Error("Failed to load createEspFlasherModule from wasm/esp_flasher.js");
  }
  moduleFactory = factory;
  return factory;
}

/**
 * Load (or reuse) the esp-serial-flasher WASM module.
 * @param options
 */
export async function loadWasmModule(options: LoadWasmOptions = {}): Promise<EspFlasherModule> {
  if (moduleInstance) {
    if (options.log) {
      moduleInstance.__log = options.log;
    }
    return moduleInstance;
  }

  const factory = options.factory ?? (await importModuleFactory());
  const wasmUrl = options.wasmUrl ?? defaultWasmUrl();

  const instance = (await factory({
    locateFile: (path: string) => {
      if (path.endsWith(".wasm")) {
        return wasmUrl;
      }
      return path;
    },
    print: (text: string) => (options.log ? options.log(text) : undefined),
    printErr: (text: string) => (options.log ? options.log(text) : undefined),
  })) as EspFlasherModule;

  instance.serialBuffer = new Uint8Array(0);
  if (options.log) {
    instance.__log = options.log;
  }
  moduleInstance = instance;
  return instance;
}

/**
 * Attach a Transport to the WASM module so EM_JS port ops can call it.
 * @param module
 * @param transport
 * @param log
 */
export function bindTransport(module: EspFlasherModule, transport: Transport, log?: LogFn): void {
  module.__transport = transport;
  transport.setSerialBufferOwner(module);
  if (log) {
    module.__log = log;
  }
}

/**
 * Reset the cached module (mainly for tests).
 */
export function resetWasmModuleCache(): void {
  moduleInstance = null;
}
