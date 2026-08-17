import { Transport } from "../transport.js";
import { EspDevice, FlasherBindings, createBindings, checkResult, LogFn } from "../wasm/bindings.js";
import { bindTransport, loadWasmModule, LoadWasmOptions } from "../wasm/loader.js";
import { getChipInfo } from "./getChipInfo.js";

export interface ConnectEspOptions extends LoadWasmOptions {
  transport: Transport;
  /** Target baud after connect (default: keep 115200). */
  baudrate?: number;
  /**
   * Open the transport at 115200 if the port is not already open.
   * Default true.
   */
  openTransport?: boolean;
  /**
   * Upload and run the flasher stub after connect. Default true.
   * Ignored when secureDownloadMode is set.
   */
  stub?: boolean;
  /**
   * Connect in secure download mode with the given flash size (bytes).
   * Mutually exclusive with stub ROM connect paths.
   */
  secureDownloadMode?: { flashSize: number };
  log?: LogFn;
}

/**
 * Connect to an ESP device over Web Serial via WASM esp-serial-flasher.
 * Mirrors esptool.cmds.connect_esp (+ optional stub / SDM).
 * @param options
 */
export async function connectEsp(options: ConnectEspOptions): Promise<EspDevice> {
  const { transport, baudrate, openTransport = true, stub = true, secureDownloadMode, log } = options;

  const module = await loadWasmModule({
    wasmUrl: options.wasmUrl,
    factory: options.factory,
    log,
  });
  bindTransport(module, transport, log);

  if (openTransport && !transport.device.readable) {
    await transport.open(115200);
    bindTransport(module, transport, log);
  }

  module.serialBuffer = new Uint8Array(0);
  const bindings: FlasherBindings = createBindings(module);
  const esp: EspDevice = {
    transport,
    module,
    bindings,
    connectionMode: secureDownloadMode ? "secure-download" : "rom",
  };

  if (secureDownloadMode) {
    log?.("Connecting in secure download mode...");
    checkResult(
      await bindings.connectSecureDownload(secureDownloadMode.flashSize),
      "connectEsp / flasher_connect_secure_download",
    );
  } else {
    log?.("Connecting in ROM mode...");
    checkResult(await bindings.connectRom(), "connectEsp / flasher_connect_rom");

    if (stub) {
      log?.("Reading chip info in ROM mode...");
      try {
        await getChipInfo(esp);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log?.(`[W] Chip info unavailable before stub upload: ${message}`);
        transport.clearSerialBuffer();
      }

      log?.("Reconnecting and uploading stub...");
      checkResult(await bindings.connect(), "connectEsp / flasher_connect");
      esp.connectionMode = "stub";
    }
  }

  if (baudrate && baudrate !== 115200) {
    log?.(`Changing baud rate to ${baudrate}...`);
    checkResult(await bindings.changeBaudrate(baudrate), "connectEsp / flasher_change_baudrate");
  }

  return esp;
}
