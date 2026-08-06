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

import {
  Transport,
  connectEsp,
  writeFlash,
  detectFlashSize,
  eraseFlash,
  readMac,
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
    writeln: (msg: string) => void;
    reset: () => void;
  };
};

const term = new Terminal({ cols: 120, rows: 40 });
term.open(terminal);

const wasmUrl = new URL("../../../wasm/esp_flasher.wasm", import.meta.url).href;

let transport: Transport | undefined;
let esp: EspDevice | undefined;

disconnectButton.style.display = "none";
detectFlashButton.style.display = "none";
readMacButton.style.display = "none";
eraseButton.style.display = "none";
filesDiv.style.display = "none";

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
}

connectButton.onclick = async () => {
  try {
    if (!serialLib) {
      showAlert("Web Serial is not supported in this browser.");
      return;
    }
    const port = await serialLib.requestPort();
    transport = new Transport(port);
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

    const chip = await getTarget(esp);
    logLine(
      `Connected chip=${TargetChip[chip] ?? chip} (stub uploaded${
        baudrate !== 115200 ? `, baud ${baudrate}` : ""
      })`,
    );
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
      transport = undefined;
      esp = undefined;
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
  transport = undefined;
  esp = undefined;
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
