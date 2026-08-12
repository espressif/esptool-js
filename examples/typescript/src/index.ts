const baudrates = document.getElementById("baudrates") as HTMLSelectElement;
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const disconnectButton = document.getElementById("disconnectButton") as HTMLButtonElement;
const detectFlashButton = document.getElementById("detectFlashButton") as HTMLButtonElement;
const readMacButton = document.getElementById("readMacButton") as HTMLButtonElement;
const eraseButton = document.getElementById("eraseButton") as HTMLButtonElement;
const addFileButton = document.getElementById("addFile") as HTMLButtonElement;
const programButton = document.getElementById("programButton") as HTMLButtonElement;
const filesDiv = document.getElementById("files") as HTMLDivElement;
const terminal = document.getElementById("terminal") as HTMLDivElement;
const lblBaudrate = document.getElementById("lblBaudrate") as HTMLLabelElement;
const lblConnTo = document.getElementById("lblConnTo") as HTMLLabelElement;
const table = document.getElementById("fileTable") as HTMLTableElement;
const alertDiv = document.getElementById("alertDiv") as HTMLDivElement;
const programDiv = document.getElementById("program") as HTMLDivElement;
const consoleDiv = document.getElementById("console") as HTMLDivElement;
const consoleBaudrates = document.getElementById("consoleBaudrates") as HTMLSelectElement;
const reconnectDelay = document.getElementById("reconnectDelay") as HTMLInputElement;
const maxRetriesInput = document.getElementById("maxRetries") as HTMLInputElement;
const consoleStartButton = document.getElementById("consoleStartButton") as HTMLButtonElement;
const consoleStopButton = document.getElementById("consoleStopButton") as HTMLButtonElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const lblConsoleBaudrate = document.getElementById("lblConsoleBaudrate") as HTMLLabelElement;
const lblConsoleFor = document.getElementById("lblConsoleFor") as HTMLLabelElement;

import {
  Transport,
  connectEsp,
  writeFlash,
  detectFlashSize,
  eraseFlash,
  readMac,
  getChipInfo,
  formatChipInfo,
  getTarget,
  EspDevice,
  FlasherError,
  TargetChip,
} from "../../../lib";
import createEspFlasherModule from "../../../wasm/esp_flasher.js";
import { serial } from "web-serial-polyfill";

const serialLib = !navigator.serial && navigator.usb ? serial : navigator.serial;

declare let Terminal: {
  new (options?: { cols?: number; rows?: number }): {
    open: (el: HTMLElement) => void;
    write: (msg: string) => void;
    writeln: (msg: string) => void;
    reset: () => void;
  };
};

const term = new Terminal({ cols: 120, rows: 40 });
term.open(terminal);

const wasmUrl = new URL("../../../wasm/esp_flasher.wasm", import.meta.url).href;

let transport: Transport | undefined;
let esp: EspDevice | undefined;
let deviceInfo: SerialPortInfo | null = null;
let isConsoleClosed = true;
let isReconnecting = false;
let consoleLineBuffer = "";
const consoleDecoder = new TextDecoder("utf-8");

disconnectButton.style.display = "none";
detectFlashButton.style.display = "none";
readMacButton.style.display = "none";
eraseButton.style.display = "none";
filesDiv.style.display = "none";
consoleStopButton.style.display = "none";
resetButton.style.display = "none";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function handleFileSelect(evt: Event) {
  const input = evt.target as HTMLInputElement & { data?: Uint8Array };
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    if (ev.target?.result instanceof ArrayBuffer) {
      input.data = new Uint8Array(ev.target.result);
    }
  };
  reader.readAsArrayBuffer(file);
}

function logLine(msg: string) {
  term.writeln(msg);
}

function showAlert(message: string) {
  const alertmsg = document.getElementById("alertmsg");
  if (alertmsg) {
    alertmsg.innerHTML = `<strong>${message}</strong>`;
  }
  alertDiv.style.display = "block";
  term.writeln(`Error: ${message}`);
}

function formatMac(mac: Uint8Array): string {
  return Array.from(mac)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(":");
}

/**
 * Add a row for flash address + file selection.
 */
function addFileRow(offset = 0x10000) {
  const rowCount = table.rows.length;
  const row = table.insertRow(rowCount);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);

  cell1.innerHTML = `<input type="text" value="0x${offset.toString(16)}" style="width: 100px;" />`;
  cell2.innerHTML = '<input type="file" accept=".bin,.img" />';
  cell3.innerHTML =
    '<input type="button" value="Remove" class="btn btn-danger btn-sm" />';

  const fileInput = cell2.childNodes[0] as HTMLInputElement;
  fileInput.addEventListener("change", handleFileSelect, false);
  (cell3.childNodes[0] as HTMLButtonElement).onclick = () => {
    if (table.rows.length > 1) {
      table.deleteRow(row.rowIndex);
    }
  };
}

addFileRow(0x0);
addFileRow(0x8000);
addFileRow(0x10000);

function setConnectedUi(connected: boolean) {
  connectButton.style.display = connected ? "none" : "initial";
  disconnectButton.style.display = connected ? "initial" : "none";
  detectFlashButton.style.display = connected ? "initial" : "none";
  readMacButton.style.display = connected ? "initial" : "none";
  eraseButton.style.display = connected ? "initial" : "none";
  filesDiv.style.display = connected ? "initial" : "none";
  lblBaudrate.style.display = connected ? "none" : "initial";
  baudrates.style.display = connected ? "none" : "initial";
  lblConnTo.style.display = connected ? "block" : "none";
  consoleDiv.style.display = connected ? "none" : "initial";
}

function cleanUp() {
  transport = undefined;
  esp = undefined;
  deviceInfo = null;
}

const IDF_LOG_LEVEL_REGEX = /^(I|W|E) \([\d.: -]+\)/;
const ANSI = {
  RED: "\x1b[1;31m",
  GREEN: "\x1b[0;32m",
  YELLOW: "\x1b[0;33m",
  NORMAL: "\x1b[0m",
};

function colorizeIdfLine(line: string): string {
  const match = IDF_LOG_LEVEL_REGEX.exec(line);
  if (!match) return line;
  const color = match[1] === "E" ? ANSI.RED : match[1] === "W" ? ANSI.YELLOW : ANSI.GREEN;
  return color + line + ANSI.NORMAL;
}

function onConsoleRx(chunk: Uint8Array) {
  consoleLineBuffer += consoleDecoder.decode(chunk, { stream: true });
  let idx: number;
  while ((idx = consoleLineBuffer.indexOf("\n")) !== -1) {
    const lineWithEol = consoleLineBuffer.slice(0, idx + 1);
    consoleLineBuffer = consoleLineBuffer.slice(idx + 1);
    const lineStripped = lineWithEol.replace(/\r?\n$/, "");
    const eol = lineWithEol.slice(lineStripped.length);
    term.write(colorizeIdfLine(lineStripped) + eol);
  }
}

function attachConsoleListener() {
  if (!transport) return;
  transport.setSerialBufferOwner(null);
  transport.setRxListener(onConsoleRx);
}

async function setupDeviceLostCallback() {
  if (!transport) return;
  transport.setDeviceLostCallback(async () => {
    if (isConsoleClosed || isReconnecting) return;

    term.writeln("\n[DEVICE LOST] Device disconnected. Trying to reconnect...");
    await sleep(parseInt(reconnectDelay.value, 10));
    isReconnecting = true;

    const maxRetries = parseInt(maxRetriesInput.value, 10);
    let retryCount = 0;

    while (retryCount < maxRetries && !isConsoleClosed) {
      retryCount++;
      term.writeln(`\n[RECONNECT] Attempt ${retryCount}/${maxRetries}...`);

      if (serialLib && "getPorts" in serialLib && typeof serialLib.getPorts === "function") {
        const ports = (await serialLib.getPorts()) as SerialPort[];
        if (ports.length > 0 && deviceInfo) {
          const newDevice = ports.find(
            (port: SerialPort) =>
              port.getInfo().usbVendorId === deviceInfo!.usbVendorId &&
              port.getInfo().usbProductId === deviceInfo!.usbProductId,
          );

          if (newDevice && transport) {
            try {
              await transport.close();
            } catch {
              // port may already be gone
            }
            transport.updateDevice(newDevice);
            term.writeln("[RECONNECT] Found previously authorized device, connecting...");
            await transport.open(parseInt(consoleBaudrates.value, 10));
            attachConsoleListener();
            await setupDeviceLostCallback();
            term.writeln("[RECONNECT] Successfully reconnected!");
            consoleStopButton.style.display = "initial";
            resetButton.style.display = "initial";
            isReconnecting = false;
            return;
          }
        }
      }

      if (retryCount < maxRetries) {
        term.writeln(
          `[RECONNECT] Device not found, retrying in ${parseInt(reconnectDelay.value, 10)}ms...`,
        );
        await sleep(parseInt(reconnectDelay.value, 10));
      }
    }

    if (retryCount >= maxRetries) {
      term.writeln("\n[RECONNECT] Failed to reconnect after max attempts. Please manually reconnect.");
      isReconnecting = false;
    }
  });
}

connectButton.onclick = async () => {
  try {
    if (!serialLib) {
      showAlert("Web Serial is not supported in this browser.");
      return;
    }
    const port = (await serialLib.requestPort()) as SerialPort;
    transport = new Transport(port);
    deviceInfo = port.getInfo();
    logLine("Opening serial port at 115200...");
    await transport.open(115200);

    const baudrate = parseInt(baudrates.value, 10);
    esp = await connectEsp({
      transport,
      baudrate,
      openTransport: false,
      factory: createEspFlasherModule as never,
      wasmUrl,
      log: logLine,
    });

    try {
      const info = await getChipInfo(esp);
      for (const line of formatChipInfo(info).split("\n")) {
        logLine(line);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      logLine(`Chip info unavailable (${msg})`);
      const chip = await getTarget(esp);
      logLine(`Chip is ${TargetChip[chip] ?? chip}`);
    }
    if (baudrate !== 115200) {
      logLine(`Stub uploaded, baud ${baudrate}`);
    } else {
      logLine("Stub uploaded");
    }
    lblConnTo.innerHTML = `Connected to device: ${transport.getInfo() || "serial port"}`;
    setConnectedUi(true);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    showAlert(msg);
    if (transport) {
      try {
        await transport.close();
      } catch {
        // ignore
      }
      cleanUp();
    }
  }
};

detectFlashButton.onclick = async () => {
  if (!esp) return;
  try {
    const size = await detectFlashSize(esp);
    logLine(`Flash size: ${size} bytes (${(size / (1024 * 1024)).toFixed(2)} MB)`);
  } catch (e) {
    const msg = e instanceof FlasherError ? e.message : e instanceof Error ? e.message : String(e);
    showAlert(msg);
  }
};

readMacButton.onclick = async () => {
  if (!esp) return;
  try {
    const mac = await readMac(esp);
    logLine(`MAC: ${formatMac(mac)}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    showAlert(msg);
  }
};

eraseButton.onclick = async () => {
  if (!esp) return;
  if (!confirm("Erase the entire flash chip?")) {
    return;
  }
  try {
    eraseButton.disabled = true;
    logLine("Erasing flash...");
    await eraseFlash(esp);
    logLine("Erase complete.");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    showAlert(msg);
  } finally {
    eraseButton.disabled = false;
  }
};

disconnectButton.onclick = async () => {
  if (transport) {
    await transport.close();
  }
  cleanUp();
  term.reset();
  setConnectedUi(false);
};

addFileButton.onclick = () => addFileRow();

programButton.onclick = async () => {
  if (!esp) {
    showAlert("Connect to a device first.");
    return;
  }

  const fileArray: { address: number; data: Uint8Array }[] = [];
  for (let index = 1; index < table.rows.length; index++) {
    const row = table.rows[index];
    const addrInput = row.cells[0].childNodes[0] as HTMLInputElement;
    const fileInput = row.cells[1].childNodes[0] as HTMLInputElement & { data?: Uint8Array };
    if (!fileInput.data) {
      continue;
    }
    const offset = parseInt(addrInput.value, 16);
    fileArray.push({ address: offset, data: fileInput.data });
  }

  if (fileArray.length === 0) {
    showAlert("No files selected.");
    return;
  }

  try {
    programButton.disabled = true;
    await writeFlash(esp, fileArray, {
      onProgress: (percent, written, total) => {
        logLine(`Progress: ${percent.toFixed(1)}% (${written}/${total})`);
      },
    });
    logLine("Done flashing.");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    showAlert(msg);
  } finally {
    programButton.disabled = false;
  }
};

consoleStartButton.onclick = async () => {
  try {
    if (!serialLib) {
      showAlert("Web Serial is not supported in this browser.");
      return;
    }

    // End any flasher session before monitoring.
    esp = undefined;
    if (transport) {
      transport.setRxListener(null);
      transport.setSerialBufferOwner(null);
      try {
        await transport.close();
      } catch {
        // ignore
      }
    } else {
      const port = (await serialLib.requestPort()) as SerialPort;
      transport = new Transport(port);
      deviceInfo = port.getInfo();
    }

    await setupDeviceLostCallback();

    lblConsoleFor.style.display = "block";
    lblConsoleFor.innerHTML = `Connected to device: ${transport!.getInfo() || "serial port"}`;
    lblConsoleBaudrate.style.display = "none";
    consoleBaudrates.style.display = "none";
    consoleStartButton.style.display = "none";
    consoleStopButton.style.display = "initial";
    resetButton.style.display = "initial";
    programDiv.style.display = "none";

    const baud = parseInt(consoleBaudrates.value, 10);
    await transport!.open(baud);
    isConsoleClosed = false;
    isReconnecting = false;
    consoleLineBuffer = "";
    attachConsoleListener();
    await transport!.hardReset();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    showAlert(msg);
    isConsoleClosed = true;
    programDiv.style.display = "initial";
    consoleStartButton.style.display = "initial";
    consoleStopButton.style.display = "none";
    resetButton.style.display = "none";
    lblConsoleBaudrate.style.display = "initial";
    consoleBaudrates.style.display = "initial";
    lblConsoleFor.style.display = "none";
  }
};

consoleStopButton.onclick = async () => {
  isConsoleClosed = true;
  isReconnecting = false;
  if (transport) {
    transport.setRxListener(null);
    await transport.close();
  }
  if (consoleLineBuffer.length > 0) {
    term.write(colorizeIdfLine(consoleLineBuffer));
    consoleLineBuffer = "";
  }
  term.reset();
  lblConsoleBaudrate.style.display = "initial";
  consoleBaudrates.style.display = "initial";
  consoleStartButton.style.display = "initial";
  consoleStopButton.style.display = "none";
  resetButton.style.display = "none";
  lblConsoleFor.style.display = "none";
  programDiv.style.display = "initial";
  cleanUp();
};

resetButton.onclick = async () => {
  if (!transport || isConsoleClosed) return;
  try {
    await transport.hardReset();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    term.writeln(`\n[RESET ERROR] ${msg}`);
  }
};
