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

const debugLogging = document.getElementById("debugLogging") as HTMLInputElement;

// This is a frontend example of Esptool-JS using local bundle file
// To optimize use a CDN hosted version like
// https://unpkg.com/esptool-js@0.5.0/bundle.js
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "../../../lib";
import { serial } from "web-serial-polyfill";

const serialLib = !navigator.serial && navigator.usb ? serial : navigator.serial;

declare let Terminal; // Terminal is imported in HTML script
declare let CryptoJS; // CryptoJS is imported in HTML script

const term = new Terminal({ cols: 120, rows: 40 });
term.open(terminal);

let device = null;
let deviceInfo = null;
let transport: Transport;
let chip: string = null;
let esploader: ESPLoader;

disconnectButton.style.display = "none";
traceButton.style.display = "none";
eraseButton.style.display = "none";
consoleStopButton.style.display = "none";
resetButton.style.display = "none";
filesDiv.style.display = "none";

/**
 * The built in Event object.
 * @external Event
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
 */

/**
 * File reader handler to read given local file.
 * @param {Event} evt File Select event
 */
function handleFileSelect(evt) {
  const file = evt.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev: ProgressEvent<FileReader>) => {
    if (ev.target.result instanceof ArrayBuffer) {
      evt.target.data = new Uint8Array(ev.target.result);
    } else {
      evt.target.data = ev.target.result;
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

connectButton.onclick = async () => {
  try {
    if (device === null) {
      device = await serialLib.requestPort({});
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
  element2.id = "selectFile" + rowCount;
  element2.name = "selected_File" + rowCount;
  element2.addEventListener("change", handleFileSelect, false);
  cell2.appendChild(element2);

  // Column 3  - Progress
  const cell3 = row.insertCell(2);
  cell3.classList.add("progress-cell");
  cell3.style.display = "none";
  cell3.innerHTML = `<progress value="0" max="100"></progress>`;

  // Column 4  - Remove File
  const cell4 = row.insertCell(3);
  cell4.classList.add("action-cell");
  if (rowCount > 1) {
    const element4 = document.createElement("input");
    element4.type = "button";
    const btnName = "button" + rowCount;
    element4.name = btnName;
    element4.setAttribute("class", "btn");
    element4.setAttribute("value", "Remove"); // or element1.value = "button";
    element4.onclick = function () {
      removeRow(row);
    };
    cell4.appendChild(element4);
  }
};

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
    device = await serialLib.requestPort({});
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

          if (serialLib && serialLib.getPorts) {
            const ports = await serialLib.getPorts();
            if (ports.length > 0) {
              const newDevice = ports.find(
                (port) =>
                  port.getInfo().usbVendorId === deviceInfo.usbVendorId &&
                  port.getInfo().usbProductId === deviceInfo.usbProductId,
              );

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
            }
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
 * Start the console reading loop
 */
async function startConsoleReading() {
  if (isConsoleClosed || !transport) return;

  try {
    const readLoop = transport.rawRead();

    while (true && !isConsoleClosed) {
      const { value, done } = await readLoop.next();

      if (done || !value) {
        break;
      }

      if (value) {
        term.write(value);
      }
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
 * Validate the provided files images and offset to see if they're valid.
 * @returns {string} Program input validation result
 */
function validateProgramInputs() {
  const offsetArr = [];
  const rowCount = table.rows.length;
  let row;
  let offset = 0;
  let fileData = null;

  // check for mandatory fields
  for (let index = 1; index < rowCount; index++) {
    row = table.rows[index];

    //offset fields checks
    const offSetObj = row.cells[0].childNodes[0];
    offset = parseInt(offSetObj.value);

    // Non-numeric or blank offset
    if (Number.isNaN(offset)) return "Offset field in row " + index + " is not a valid address!";
    // Repeated offset used
    else if (offsetArr.includes(offset)) return "Offset field in row " + index + " is already in use!";
    else offsetArr.push(offset);

    const fileObj = row.cells[1].childNodes[0];
    fileData = fileObj.data;
    if (fileData == null) return "No file selected for row " + index + "!";
  }
  return "success";
}

programButton.onclick = async () => {
  const alertMsg = document.getElementById("alertmsg");
  const err = validateProgramInputs();

  if (err != "success") {
    alertMsg.innerHTML = "<strong>" + err + "</strong>";
    alertDiv.style.display = "block";
    return;
  }

  // Hide error message
  alertDiv.style.display = "none";

  const fileArray = [];
  const progressBars = [];

  for (let index = 1; index < table.rows.length; index++) {
    const row = table.rows[index];

    const offSetObj = row.cells[0].childNodes[0] as HTMLInputElement;
    const offset = parseInt(offSetObj.value);

    const fileObj = row.cells[1].childNodes[0] as ChildNode & { data: Uint8Array };
    const progressBar = row.cells[2].childNodes[0];

    progressBar.textContent = "0";
    progressBars.push(progressBar);

    row.cells[2].style.display = "initial";
    row.cells[3].style.display = "none";

    fileArray.push({ data: fileObj.data, address: offset });
  }

  try {
    const flashOptions: FlashOptions = {
      fileArray: fileArray,
      eraseAll: false,
      compress: true,
      flashMode: "keep",
      flashFreq: "keep",
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
    // Hide progress bars and show erase buttons
    for (let index = 1; index < table.rows.length; index++) {
      table.rows[index].cells[2].style.display = "none";
      table.rows[index].cells[3].style.display = "initial";
    }
  }
};

addFileButton.onclick(this);
