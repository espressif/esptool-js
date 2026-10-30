const baudrates = document.getElementById("baudrates") as HTMLSelectElement;
const consoleBaudrates = document.getElementById("consoleBaudrates") as HTMLSelectElement;
const reconnectDelay = document.getElementById("reconnectDelay") as HTMLInputElement;
const maxRetriesInput = document.getElementById("maxRetries") as HTMLInputElement;
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const traceButton = document.getElementById("copyTraceButton") as HTMLButtonElement;
const disconnectButton = document.getElementById("disconnectButton") as HTMLButtonElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const consoleStartButton = document.getElementById("consoleStartButton") as HTMLButtonElement;
const consoleStopButton = document.getElementById("consoleStopButton") as HTMLButtonElement;
const eraseButton = document.getElementById("eraseButton") as HTMLButtonElement;
const addFileButton = document.getElementById("addFile") as HTMLButtonElement;
const addHexFileButton = document.getElementById("addHexFile") as HTMLButtonElement;
const hexFileInput = document.getElementById("hexFileInput") as HTMLInputElement;
const eraseAllCheckbox = document.getElementById("eraseAll") as HTMLInputElement;
const programButton = document.getElementById("programButton");
const filesDiv = document.getElementById("files");
const terminal = document.getElementById("terminal");
const programDiv = document.getElementById("program");
const consoleDiv = document.getElementById("console");
const lblBaudrate = document.getElementById("lblBaudrate");
const lblConsoleBaudrate = document.getElementById("lblConsoleBaudrate");
const lblConsoleFor = document.getElementById("lblConsoleFor");
const lblConnTo = document.getElementById("lblConnTo");
const table = document.getElementById("fileTable") as HTMLTableElement;
const alertDiv = document.getElementById("alertDiv");
const flashMode = document.getElementById("flashMode") as HTMLSelectElement;
const flashFreq = document.getElementById("flashFreq") as HTMLSelectElement;
const flashSize = document.getElementById("flashSize") as HTMLSelectElement;
const lblFlashMode = document.getElementById("lblFlashMode");
const lblFlashFreq = document.getElementById("lblFlashFreq");
const lblFlashSize = document.getElementById("lblFlashSize");

const debugLogging = document.getElementById("debugLogging") as HTMLInputElement;

// This is a frontend example of Esptool-JS using local bundle file
// To optimize use a CDN hosted version like
// https://unpkg.com/esptool-js@0.5.0/bundle.js
import {
  ESPLoader,
  FlashOptions,
  FlashModeValues,
  FlashFreqValues,
  FlashSizeValues,
  LoaderOptions,
  Transport,
  WebUSBSerialPort,
  parseIntelHex,
} from "../../../lib";
import { serial } from "web-serial-polyfill";

const serialLib = !navigator.serial && navigator.usb ? serial : navigator.serial;
const useWebUsb = document.getElementById("useWebUsb") as HTMLInputElement;

declare let Terminal; // Terminal is imported in HTML script
declare let CryptoJS; // CryptoJS is imported in HTML script

const term = new Terminal({ cols: 120, rows: 40 });
term.open(terminal);

let device = null;
let deviceInfo = null;
let usingWebUsb = false;
let transport: Transport;
let chip: string = null;
let esploader: ESPLoader;

disconnectButton.style.display = "none";
traceButton.style.display = "none";
eraseButton.style.display = "none";
consoleStopButton.style.display = "none";
resetButton.style.display = "none";
filesDiv.style.display = "none";
flashMode.style.display = "none";
flashFreq.style.display = "none";
flashSize.style.display = "none";
lblFlashMode.style.display = "none";
lblFlashFreq.style.display = "none";
lblFlashSize.style.display = "none";

/**
 * The built in Event object.
 * @external Event
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
 */

/** File input that stores the selected binary image and its name. */
type SelectedFileInput = HTMLInputElement & { data?: Uint8Array; fileName?: string };

/** Table row that may hold a parsed HEX region. */
type ImageRow = HTMLTableRowElement & { imageData?: Uint8Array };

/**
 * Show the program alert.
 * @param {string} message Alert text.
 * @returns {void}
 */
function showAlert(message: string) {
  const alertMsg = document.getElementById("alertmsg");
  if (alertMsg) alertMsg.textContent = message;
  if (alertDiv) alertDiv.style.display = "block";
}

/**
 * Hide the program alert.
 * @returns {void}
 */
function hideAlert() {
  if (alertDiv) alertDiv.style.display = "none";
}

/**
 * Format a flash offset for the address field.
 * @param {number} address Flash offset.
 * @returns {string} Hex address text.
 */
function formatAddress(address: number): string {
  return "0x" + address.toString(16);
}

/**
 * True when the row was created from an Intel HEX region.
 * @param {HTMLTableRowElement} row Flash table row.
 * @returns {boolean} Whether the row is a read-only HEX region.
 */
function isHexRow(row: HTMLTableRowElement): boolean {
  return row.dataset.kind === "hex";
}

/**
 * Read the address and image stored on a flash table row.
 * An empty BIN row has no image data.
 * @param {ImageRow} row Flash table row.
 * @returns {{ address: number, data: Uint8Array | undefined }} Address and image bytes.
 */
function imageFromRow(row: ImageRow): { address: number; data: Uint8Array | undefined } {
  const offsetInput = row.cells[0].querySelector("input");
  const address = offsetInput instanceof HTMLInputElement ? parseInt(offsetInput.value) : NaN;
  if (isHexRow(row)) return { address, data: row.imageData };
  const fileInput = row.cells[1].querySelector('input[type="file"]') as SelectedFileInput | null;
  return { address, data: fileInput?.data };
}

/**
 * File reader handler for a .bin row.
 * @param {Event} evt File select event.
 * @returns {void}
 */
function handleFileSelect(evt: Event) {
  const input = evt.target as SelectedFileInput;
  const file = input.files?.[0];

  if (!file) {
    input.data = undefined;
    input.fileName = undefined;
    return;
  }

  if (!file.name.toLowerCase().endsWith(".bin")) {
    input.value = "";
    input.data = undefined;
    input.fileName = undefined;
    showAlert("Add File only accepts .bin files. Use Add HEX File for a .hex file.");
    return;
  }

  input.fileName = file.name;
  const reader = new FileReader();

  reader.onload = (ev: ProgressEvent<FileReader>) => {
    if (ev.target?.result instanceof ArrayBuffer) {
      input.data = new Uint8Array(ev.target.result);
      hideAlert();
    } else {
      input.data = undefined;
    }
  };

  reader.readAsArrayBuffer(file);
}

const espLoaderTerminal = {
  clean() {
    term.clear();
  },
  writeLine(data) {
    term.writeln(data);
  },
  write(data) {
    term.write(data);
  },
};

/**
 * Populate flash size and frequency dropdowns based on chip's supported values
 */
function populateFlashDropdowns() {
  if (!esploader || !esploader.chip) {
    return;
  }

  // Populate Flash Frequency dropdown
  flashFreq.innerHTML = '<option value="keep">keep</option>';
  const flashFreqKeys = Object.keys(esploader.chip.FLASH_FREQUENCY).sort((a, b) => {
    const freqOrder = ["80m", "60m", "48m", "40m", "30m", "26m", "24m", "20m", "16m", "15m", "12m"];
    const indexA = freqOrder.indexOf(a);
    const indexB = freqOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
  flashFreqKeys.forEach((freq) => {
    const option = document.createElement("option");
    option.value = freq;
    option.textContent = freq;
    flashFreq.appendChild(option);
  });
  flashFreq.options[0].selected = true;

  // Populate Flash Size dropdown
  flashSize.innerHTML = '<option value="detect">detect</option><option value="keep">keep</option>';
  const flashSizeKeys = Object.keys(esploader.chip.FLASH_SIZES).sort((a, b) => {
    const sizeOrder = [
      "256KB",
      "512KB",
      "1MB",
      "2MB",
      "2MB-c1",
      "4MB",
      "4MB-c1",
      "8MB",
      "16MB",
      "32MB",
      "64MB",
      "128MB",
    ];
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
  flashSizeKeys.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    flashSize.appendChild(option);
  });
  flashSize.options[1].selected = true;
}

/**
 * Request a serial device via Web Serial or opt-in CH340 WebUSB.
 * @returns {Promise<object>} Selected port.
 */
async function requestDevice() {
  if (useWebUsb.checked) {
    usingWebUsb = true;
    const port = await WebUSBSerialPort.requestPort();
    return port.asSerialPort();
  }
  usingWebUsb = false;
  return serialLib.requestPort({});
}

connectButton.onclick = async () => {
  try {
    if (device === null) {
      device = await requestDevice();
      deviceInfo = device.getInfo();
      transport = new Transport(device, true);
    }
    const flashOptions = {
      transport,
      baudrate: parseInt(baudrates.value),
      terminal: espLoaderTerminal,
      debugLogging: debugLogging.checked,
    } as LoaderOptions;
    esploader = new ESPLoader(flashOptions);

    traceButton.style.display = "initial";
    chip = await esploader.main();

    // Populate flash dropdowns based on chip's supported values
    populateFlashDropdowns();

    // Temporarily broken
    // await esploader.flashId();
    // eslint-disable-next-line no-console
    console.log("Settings done for :" + chip);
    lblBaudrate.style.display = "none";
    lblConnTo.innerHTML = "Connected to device: " + chip;
    lblConnTo.style.display = "block";
    baudrates.style.display = "none";
    connectButton.style.display = "none";
    disconnectButton.style.display = "initial";
    eraseButton.style.display = "initial";
    filesDiv.style.display = "initial";
    flashMode.style.display = "initial";
    flashFreq.style.display = "initial";
    flashSize.style.display = "initial";
    lblFlashMode.style.display = "initial";
    lblFlashFreq.style.display = "initial";
    lblFlashSize.style.display = "initial";
    consoleDiv.style.display = "none";
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    term.writeln(`Error: ${e.message}`);
  }
};

traceButton.onclick = async () => {
  if (transport) {
    transport.returnTrace();
  }
};

resetButton.onclick = async () => {
  if (transport) {
    await transport.setDTR(false);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await transport.setDTR(true);
  }
};

eraseButton.onclick = async () => {
  eraseButton.disabled = true;
  try {
    await esploader.eraseFlash();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    term.writeln(`Error: ${e.message}`);
  } finally {
    eraseButton.disabled = false;
  }
};

/**
 * Add the progress cell used while programming a row.
 * @param {HTMLTableRowElement} row Flash table row.
 * @returns {void}
 */
function addProgressCell(row: HTMLTableRowElement) {
  const cell = row.insertCell(2);
  cell.classList.add("progress-cell");
  cell.style.display = "none";
  cell.innerHTML = `<progress value="0" max="100"></progress>`;
}

/**
 * Add the remove-button cell. The first BIN row has no button.
 * @param {HTMLTableRowElement} row Flash table row.
 * @param {boolean} includeButton Whether to show Remove.
 * @returns {void}
 */
function addRemoveCell(row: HTMLTableRowElement, includeButton: boolean) {
  const cell = row.insertCell(3);
  cell.classList.add("action-cell");
  if (!includeButton) return;
  const button = document.createElement("input");
  button.type = "button";
  button.className = "btn";
  button.value = "Remove";
  button.onclick = function () {
    removeRow(row);
  };
  cell.appendChild(button);
}

addFileButton.onclick = () => {
  const rowCount = table.rows.length;
  const row = table.insertRow(rowCount);

  //Column 1 - Offset
  const cell1 = row.insertCell(0);
  const element1 = document.createElement("input");
  element1.type = "text";
  element1.id = "offset" + rowCount;
  element1.value = "0x1000";
  cell1.appendChild(element1);

  // Column 2 - File selector
  const cell2 = row.insertCell(1);
  const element2 = document.createElement("input");
  element2.type = "file";
  element2.accept = ".bin";
  element2.id = "selectFile" + rowCount;
  element2.name = "selected_File" + rowCount;
  element2.addEventListener("change", handleFileSelect, false);
  cell2.appendChild(element2);

  addProgressCell(row);
  addRemoveCell(row, rowCount > 1);
};

/**
 * Append one read-only row for a contiguous HEX region.
 * @param {string} fileName Source HEX file name.
 * @param {number} address Flash offset from the HEX file.
 * @param {Uint8Array} data Region bytes.
 * @returns {void}
 */
function appendHexRow(fileName: string, address: number, data: Uint8Array) {
  const row = table.insertRow(table.rows.length) as ImageRow;
  row.dataset.kind = "hex";
  row.imageData = data;

  const addressCell = row.insertCell(0);
  const addressInput = document.createElement("input");
  addressInput.type = "text";
  addressInput.readOnly = true;
  addressInput.value = formatAddress(address);
  addressCell.appendChild(addressInput);

  const fileCell = row.insertCell(1);
  fileCell.textContent = fileName + " (" + data.length + " bytes)";

  addProgressCell(row);
  addRemoveCell(row, true);
}

addHexFileButton.onclick = () => {
  hexFileInput.click();
};

hexFileInput.addEventListener("change", (evt: Event) => {
  const input = evt.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".hex")) {
    showAlert("Add HEX File only accepts .hex files.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    if (!(ev.target?.result instanceof ArrayBuffer)) {
      showAlert("Could not read HEX file.");
      return;
    }
    try {
      const segments = parseIntelHex(new Uint8Array(ev.target.result));
      if (segments.length === 0) {
        showAlert("Intel HEX file contains no data.");
        return;
      }
      for (const segment of segments) {
        appendHexRow(file.name, segment.address, segment.data);
      }
      eraseAllCheckbox.checked = false;
      hideAlert();
    } catch (e) {
      showAlert(e instanceof Error ? e.message : String(e));
    }
  };
  reader.readAsArrayBuffer(file);
});

/**
 * The built in HTMLTableRowElement object.
 * @external HTMLTableRowElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement}
 */

/**
 * Remove file row from HTML Table
 * @param {HTMLTableRowElement} row Table row element to remove
 */
function removeRow(row: HTMLTableRowElement) {
  const rowIndex = Array.from(table.rows).indexOf(row);
  table.deleteRow(rowIndex);
}

/**
 * Clean devices variables on chip disconnect. Remove stale references if any.
 */
function cleanUp() {
  device = null;
  deviceInfo = null;
  usingWebUsb = false;
  transport = null;
  chip = null;
}

disconnectButton.onclick = async () => {
  if (transport) await transport.disconnect();

  term.reset();
  lblBaudrate.style.display = "initial";
  baudrates.style.display = "initial";
  consoleBaudrates.style.display = "initial";
  connectButton.style.display = "initial";
  disconnectButton.style.display = "none";
  traceButton.style.display = "none";
  eraseButton.style.display = "none";
  lblConnTo.style.display = "none";
  filesDiv.style.display = "none";
  flashMode.style.display = "none";
  flashFreq.style.display = "none";
  flashSize.style.display = "none";
  lblFlashMode.style.display = "none";
  lblFlashFreq.style.display = "none";
  lblFlashSize.style.display = "none";
  alertDiv.style.display = "none";
  consoleDiv.style.display = "initial";
  cleanUp();
};

let isConsoleClosed = false;
let isReconnecting = false;

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

consoleStartButton.onclick = async () => {
  if (device === null) {
    device = await requestDevice();
    transport = new Transport(device, true);
    deviceInfo = device.getInfo();

    // Set up device lost callback
    transport.setDeviceLostCallback(async () => {
      if (!isConsoleClosed && !isReconnecting) {
        term.writeln("\n[DEVICE LOST] Device disconnected. Trying to reconnect...");
        await sleep(parseInt(reconnectDelay.value));
        isReconnecting = true;

        const maxRetries = parseInt(maxRetriesInput.value);
        let retryCount = 0;

        while (retryCount < maxRetries && !isConsoleClosed) {
          retryCount++;
          term.writeln(`\n[RECONNECT] Attempt ${retryCount}/${maxRetries}...`);

          let newDevice = null;
          if (usingWebUsb && navigator.usb) {
            const usbDevices = await navigator.usb.getDevices();
            const match = usbDevices.find(
              (usbDevice) =>
                usbDevice.vendorId === deviceInfo.usbVendorId && usbDevice.productId === deviceInfo.usbProductId,
            );
            if (match) {
              newDevice = new WebUSBSerialPort(match).asSerialPort();
            }
          } else if (serialLib && serialLib.getPorts) {
            const ports = await serialLib.getPorts();
            newDevice = ports.find(
              (port) =>
                port.getInfo().usbVendorId === deviceInfo.usbVendorId &&
                port.getInfo().usbProductId === deviceInfo.usbProductId,
            );
          }

          if (newDevice) {
            device = newDevice;
            transport.updateDevice(device);
            term.writeln("[RECONNECT] Found previously authorized device, connecting...");
            await transport.connect(parseInt(consoleBaudrates.value));
            term.writeln("[RECONNECT] Successfully reconnected!");
            consoleStopButton.style.display = "initial";
            resetButton.style.display = "initial";
            isReconnecting = false;

            startConsoleReading();
            return;
          }

          if (retryCount < maxRetries) {
            term.writeln(`[RECONNECT] Device not found, retrying in ${parseInt(reconnectDelay.value)}ms...`);
            await sleep(parseInt(reconnectDelay.value));
          }
        }

        if (retryCount >= maxRetries) {
          term.writeln("\n[RECONNECT] Failed to reconnect after 5 attempts. Please manually reconnect.");
          isReconnecting = false;
        }
      }
    });
  }

  lblConsoleFor.style.display = "block";
  lblConsoleBaudrate.style.display = "none";
  consoleBaudrates.style.display = "none";
  consoleStartButton.style.display = "none";
  consoleStopButton.style.display = "initial";
  resetButton.style.display = "initial";
  programDiv.style.display = "none";

  await transport.connect(parseInt(consoleBaudrates.value));
  isConsoleClosed = false;
  isReconnecting = false;

  startConsoleReading();
};

/**
 * IDF Monitor–style auto-coloring: inject ANSI codes by log level (E/W/I) so colors
 * work without CONFIG_LOG_COLORS on the device. Same regex as esp-idf-monitor.
 */
const IDF_LOG_LEVEL_REGEX = /^(I|W|E) \([\d.: -]+\)/;
const ANSI = {
  RED: "\x1b[1;31m",
  GREEN: "\x1b[0;32m",
  YELLOW: "\x1b[0;33m",
  NORMAL: "\x1b[0m",
};

/**
 * Use IDF Monitor style log level prefixes to inject ANSI color codes for better readability. Lines that don't match the pattern are returned unmodified.
 * @param {string} line Console line to colorize
 * @returns {string} Colorized console line
 */
function colorizeIdfLine(line: string): string {
  const match = IDF_LOG_LEVEL_REGEX.exec(line);
  if (!match) return line;
  const color = match[1] === "E" ? ANSI.RED : match[1] === "W" ? ANSI.YELLOW : ANSI.GREEN;
  return color + line + ANSI.NORMAL;
}

/**
 * Continuously read from the console until it's closed, applying colorization to IDF log lines. If the connection is lost, it will wait for reconnection and resume reading. Errors are caught and displayed in the terminal without breaking the reading loop.
 */
async function startConsoleReading() {
  if (isConsoleClosed || !transport) return;

  const decoder = new TextDecoder("utf-8");
  let lineBuffer = "";
  try {
    await transport.rawRead(
      (value) => {
        lineBuffer += decoder.decode(value);
        let idx: number;
        while ((idx = lineBuffer.indexOf("\n")) !== -1) {
          const lineWithEol = lineBuffer.slice(0, idx + 1);
          lineBuffer = lineBuffer.slice(idx + 1);
          const lineStripped = lineWithEol.replace(/\r?\n$/, "");
          const eol = lineWithEol.slice(lineStripped.length);
          term.write(colorizeIdfLine(lineStripped) + eol);
        }
      },
      () => isConsoleClosed,
    );
    if (lineBuffer.length > 0) {
      term.write(colorizeIdfLine(lineBuffer));
    }
  } catch (error) {
    if (!isConsoleClosed) {
      term.writeln(`\n[CONSOLE ERROR] ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (!isConsoleClosed) {
    term.writeln("\n[CONSOLE] Connection lost, waiting for reconnection...");
  }
}

consoleStopButton.onclick = async () => {
  isConsoleClosed = true;
  isReconnecting = false;
  if (transport) {
    await transport.disconnect();
    await transport.waitForUnlock(1500);
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

/**
 * Rows that will be flashed. An empty BIN row is the placeholder added at startup
 * and is skipped so a HEX-only program can run.
 * @returns {{ row: ImageRow, address: number, data: Uint8Array }[] | string} Images, or an error message.
 */
function imagesToFlash(): { row: ImageRow; address: number; data: Uint8Array }[] | string {
  const images: { row: ImageRow; address: number; data: Uint8Array }[] = [];
  const offsetArr: number[] = [];

  for (let index = 1; index < table.rows.length; index++) {
    const row = table.rows[index] as ImageRow;
    const image = imageFromRow(row);
    if (!isHexRow(row) && image.data == null) {
      const addedByUser = row.cells[3].querySelector("input") != null;
      if (addedByUser) return "No file selected for row " + index + "!";
      continue;
    }
    if (image.data == null) return "No file selected for row " + index + "!";
    if (Number.isNaN(image.address)) return "Offset field in row " + index + " is not a valid address!";
    if (offsetArr.includes(image.address)) return "Offset field in row " + index + " is already in use!";
    offsetArr.push(image.address);
    images.push({ row, address: image.address, data: image.data });
  }

  if (images.length === 0) return "No file selected!";
  return images;
}

programButton.onclick = async () => {
  const images = imagesToFlash();

  if (typeof images === "string") {
    showAlert(images);
    return;
  }

  hideAlert();

  const fileArray = [];
  const progressBars = [];

  for (const image of images) {
    const progressBar = image.row.cells[2].childNodes[0] as HTMLProgressElement;
    progressBar.textContent = "0";
    image.row.cells[2].style.display = "initial";
    image.row.cells[3].style.display = "none";
    fileArray.push({ data: image.data, address: image.address });
    progressBars.push(progressBar);
  }

  try {
    const flashOptions: FlashOptions = {
      fileArray: fileArray,
      eraseAll: eraseAllCheckbox.checked,
      compress: true,
      flashMode: flashMode.value as FlashModeValues,
      flashFreq: flashFreq.value as FlashFreqValues,
      flashSize: flashSize.value as FlashSizeValues,
      reportProgress: (fileIndex, written, total) => {
        progressBars[fileIndex].value = (written / total) * 100;
      },
      calculateMD5Hash: (image: Uint8Array) => {
        const latin1String = Array.from(image, (byte) => String.fromCharCode(byte)).join("");
        return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(latin1String)).toString();
      },
    };
    await esploader.writeFlash(flashOptions);
    await esploader.after();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    term.writeln(`Error: ${e.message}`);
  } finally {
    // Hide progress bars and show remove buttons
    for (const image of images) {
      image.row.cells[2].style.display = "none";
      image.row.cells[3].style.display = "initial";
    }
  }
};

addFileButton.onclick(this);
