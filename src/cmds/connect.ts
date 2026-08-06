import { Transport } from "../transport.js";
import { EspDevice, FlasherBindings, createBindings, checkResult, LogFn } from "../wasm/bindings.js";
import { bindTransport, loadWasmModule, LoadWasmOptions } from "../wasm/loader.js";

export interface ConnectEspOptions extends LoadWasmOptions {
  transport: Transport;
  /** Target baud after stub connect (default: keep 115200). */
  baudrate?: number;
  /**
   * Open the transport at 115200 if the port is not already open.
   * Default true.
   */
  openTransport?: boolean;
  log?: LogFn;
}

/**
 * Connect to an ESP device: open serial (if needed), upload stub via WASM,
 * optionally raise baud rate. Mirrors esptool.cmds.connect_esp + run_stub for
 * the phase-1 WASM surface.
 * @param options
 */
export async function connectEsp(options: ConnectEspOptions): Promise<EspDevice> {
  const { transport, baudrate, openTransport = true, log } = options;

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

  checkResult(await bindings.connect(), "connectEsp / flasher_connect");

  const esp: EspDevice = { transport, module, bindings };

  if (baudrate && baudrate !== 115200) {
    checkResult(await bindings.changeBaudrate(baudrate), "connectEsp / flasher_change_baudrate");
  }

  return esp;
}
