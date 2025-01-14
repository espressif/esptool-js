//TODO: move Mac to single access, currently used in readFlashData, but better to have custom file names
// where the placeholders can be used to generate the file name with checkboxes for chip/mac/type/offset/size
// and ideally there would be an alternative format for short chip names, but including revision.
const baudrates = document.getElementById("baudrates") as HTMLSelectElement;
const consoleBaudrates = document.getElementById("consoleBaudrates") as HTMLSelectElement;
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const traceButton = document.getElementById("copyTraceButton") as HTMLButtonElement;
const disconnectButton = document.getElementById("disconnectButton") as HTMLButtonElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const consoleStartButton = document.getElementById("consoleStartButton") as HTMLButtonElement;
const consoleStopButton = document.getElementById("consoleStopButton") as HTMLButtonElement;
const eraseButton = document.getElementById("eraseButton") as HTMLButtonElement;
const addFileButton = document.getElementById("addFile") as HTMLButtonElement;
const programButton = document.getElementById("programButton");
const readFlashOffsetInput = document.getElementById("readFlashOffset") as HTMLInputElement;
const readFlashSizeInput = document.getElementById("readFlashSize") as HTMLInputElement;
const readFlashAllInput = document.getElementById("readFlashAll") as HTMLInputElement;
const readFlashData = document.getElementById("readFlashData") as HTMLButtonElement;
const partitionOffsetInput = document.getElementById("partitionOffset") as HTMLInputElement;
const readPartitionButton = document.getElementById("readPartitionButton") as HTMLButtonElement;
const readPartitionDiv = document.getElementById("readPartitionTable") as HTMLDivElement;
const partitionTableOutput = document.getElementById("partitionTableOutput");
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
import { ESPLoader, FlashOptions, LoaderOptions, Transport,
  Partitions, PartitionDefinition, PARTITION_TYPES, PARTITION_SUBTYPES } from "../../../lib";
import { serial } from "web-serial-polyfill";

const serialLib = !navigator.serial && navigator.usb ? serial : navigator.serial;

declare let Terminal; // Terminal is imported in HTML script
declare let CryptoJS; // CryptoJS is imported in HTML script

const term = new Terminal({ cols: 120, rows: 40 });
term.open(terminal);

let device = null;
let transport: Transport;
let chip: string = null;
let esploader: ESPLoader;

disconnectButton.style.display = "none";
traceButton.style.display = "none";
eraseButton.style.display = "none";
consoleStopButton.style.display = "none";
resetButton.style.display = "none";
filesDiv.style.display = "none";
partitionTableOutput.style.display = "none";
readPartitionDiv.style.display = "none";
readFlashAllInput.onclick = () => {
  readFlashSizeInput.style.textDecoration = readFlashAllInput.checked ? "line-through" : "none";
};

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
    evt.target.data = ev.target.result;
  };

  reader.readAsBinaryString(file);
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
      transport = new Transport(device, true);
    }
    const flashOptions = {
      transport,
      baudrate: parseInt(baudrates.value),
      terminal: espLoaderTerminal,
      debugLogging: debugLogging.checked,
    } as LoaderOptions;
    esploader = new ESPLoader(flashOptions);

    chip = await esploader.main();

    // Temporarily broken
    // await esploader.flashId();
    console.log("Settings done for :" + chip);
    lblBaudrate.style.display = "none";
    lblConnTo.innerHTML = "Connected to device: " + chip;
    lblConnTo.style.display = "block";
    baudrates.style.display = "none";
    connectButton.style.display = "none";
    disconnectButton.style.display = "initial";
    traceButton.style.display = "initial";
    eraseButton.style.display = "initial";
    filesDiv.style.display = "initial";
    partitionTableOutput.style.display = "block";
    readPartitionDiv.style.display = "block";
    consoleDiv.style.display = "none";
  } catch (e) {
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
  transport = null;
  chip = null;
  initializePartitionTable();
}

let lastProgress = -1;
/**
 * Check and show progress of the current operation.
 * @param {number} totalSize Total size of the operation
 * @param {number} currentProgress Current progress of the operation
 * @param {number} period Period/percentage to show progress at (default 10)
 */
function checkAndShowProgress(totalSize: number, currentProgress: number, period = 10) {
  const percentage = Math.floor((currentProgress / totalSize) * 100);
  const nearestBlock = Math.floor(percentage / period) * period;

  if (nearestBlock > lastProgress) {
    term.write(`${nearestBlock}%`);
    console.log(`Progress: ${nearestBlock}%`);
    lastProgress = nearestBlock;
  } else {
    term.write(".");
  }
}

readFlashData.onclick = async () => {
  let hexOffset = readFlashOffsetInput.value;
  if (hexOffset === "") {
    term.writeln("Please enter a valid offset to read flash from");
    return;
  } else if (hexOffset.startsWith("0x")) {
    term.writeln("Offset starts 0x and already assumed, stripping leading 0x...");
    readFlashOffsetInput.value = hexOffset = hexOffset.slice(2);
  }
  const offset = parseInt(hexOffset, 16);
  const readAll = readFlashAllInput.checked;
  const flashSize = ((await esploader.getFlashSize()) || 0) * 1024;
  const size = readAll ? flashSize - offset : parseInt(readFlashSizeInput.value, 16) || 0;
  if (size <= 0) {
    term.writeln("Invalid size received (" + size + "), impossible to read flash of 0bytes");
    return;
  }
  term.writeln(`Reading flash from 0x${hexOffset} of size ${size} bytes`);
  try {
    console.log("Reading flash from 0x" + hexOffset + " of size " + size + " bytes (and turning off tracing)");
    esploader.transport.tracing = false;
    lastProgress = -1;
    const data = await esploader.readFlash(offset, size, (pkt, progress, total) => {
      checkAndShowProgress(total, progress, 10);
    });
    term.writeln(`\nSuccessfully read flash data from 0x${hexOffset}`);
    const mac = await esploader.chip.readMac(esploader);
    esploader.transport.tracing = true;
    console.log("Done reading, turned tracing back on.");
    const fileName = `flash_${chip}_${mac}_0x${hexOffset}_0x${size.toString(16)}b.bin`;
    initiateFileDownload(data, fileName);
  } catch (e) {
    console.error(e);
    term.writeln(`Failed reading flash from ${hexOffset}\nError: ${e.message}`);
  }
};

readPartitionButton.onclick = async () => {
  initializePartitionTable();
  const hexOffset = partitionOffsetInput.value;
  const offset = parseInt(hexOffset, 16);
  try {
    esploader.transport.tracing = false;
    const data = await esploader.readFlash(offset, 800);
    esploader.transport.tracing = true;
    const decodedData = decodePartitionTable(data);
    const tableData = decodedData.toCSV();
    term.writeln(`Extracted partition table from 0x${hexOffset}`);
    tableData.split("\n").forEach((x) => {
      term.writeln(x.trim());
    });
    console.log(JSON.stringify(decodedData, null, 2));
    // partitionTableOutput.innerHTML = tableData.split("\n").join("<br/>");
    populatePartitionTable(tableData);
  } catch (e) {
    console.error(e);
    const errMsg = `Failed extracting partition table from ${hexOffset}\nError: ${e.message}`;
    partitionTableOutput.innerHTML = errMsg;
    term.writeln(errMsg);
  }
};

/**
 * Decode the partition table data from binary data.
 * @param {Uint8Array} data Partition table data
 * @returns {Partitions} Decoded partition table
 */
function decodePartitionTable(data: Uint8Array) {
  console.log("Partition table data: ", data);
  const p = Partitions.fromBinary(data);
  return p;
}

/**
 * Populate the partition table with the given CSV data.
 * @param {string} partitionTableCSV Partition table CSV data
 */
function populatePartitionTable(partitionTableCSV: string) {
  initializePartitionTable();
  const tableBody = document.getElementById("partitionTableBody") as HTMLTableSectionElement;

  // Clear existing rows
  tableBody.innerHTML = "";

  // Split the CSV into rows
  const rows = partitionTableCSV.trim().split("\n").slice(1);

  // Add headers dynamically
  if (rows.length > 0) {
    let headers = rows[0].split(",");
    headers.push("(Encrypted/ReadOnly)");
    // headers[0] = headers[0].replace("# ", "");
    const headerRow = document.createElement("tr");

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header.trim();
      headerRow.appendChild(th);
    });

    // Add an extra header for the "Download" action
    const actionHeader = document.createElement("th");
    actionHeader.textContent = "Action";
    headerRow.appendChild(actionHeader);

    tableBody.appendChild(headerRow);
  }

  // Iterate over each row except for the header
  rows.slice(1).forEach((row) => {
    const columns = row.split(",");
    const rowElement = document.createElement("tr");

    columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = column.trim();
      rowElement.appendChild(td);
    });

    // Add a download button for each row
    const actionCell = document.createElement("td");
    const downloadButton = document.createElement("button");
    downloadButton.className = "btn btn-info btn-sm";
    downloadButton.textContent = "📂";

    downloadButton.title = `Download ${
      // Add subtype if user_fs
      columns[0] == "user_fs" ? columns[0] + " " + columns[1] : columns[0]
    } partition at ${columns[3]} with size ${columns[4]}`;

    downloadButton.addEventListener("click", () => {
      downloadPartitionRow(columns);
    });

    actionCell.appendChild(downloadButton);
    rowElement.appendChild(actionCell);

    tableBody.appendChild(rowElement);
  });
}

/**
 *  Initialize the partition table with headers and empty body.
 */
function initializePartitionTable() {
  partitionTableOutput.innerHTML = `
  <table class="table table-striped" id="partitionTable">
    <thead class="thead-light">
        <tr id="partitionHeader"></tr>
    </thead>
    <tbody id="partitionTableBody">
    </tbody>
  </table>
  `;
}

function logToTerm(str: string) {
  term.writeln(str);
  console.log(str);
}

// Mock function for download action
function downloadPartitionRow(row: string[]) {
  logToTerm(`Downloading partition/row: ${row}`);
  try {
    console.log("Turning off tracing and reading row: ", row);
    esploader.transport.tracing = false;
    lastProgress = -1;
    const newJob = async () => {
      const data = await esploader.readFlash(parseInt(row[3], 16), parseInt(row[4], 16), (pkt, progress, total) => {
        checkAndShowProgress(total, progress);
      });
      logToTerm("\nDone fetching data, generating download...");
      // Create blob and download to browser
      generateDownloadLinkFromTableRow(row, data);
    };
    newJob();
  } catch (e) {
    console.error(e);
    logToTerm("Error fetching data:");
    logToTerm(e);
  } finally {
    esploader.transport.tracing = true;
    console.log("Turned tracing back on.");
  }
}

disconnectButton.onclick = async () => {
  if (transport) await transport.disconnect();

  term.reset();
  lblBaudrate.style.display = "initial";
  baudrates.style.display = "initial";
  consoleBaudrates.style.display = "initial";
  connectButton.style.display = "initial";
  readPartitionDiv.style.display = "none";
  partitionTableOutput.style.display = "none";
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
consoleStartButton.onclick = async () => {
  if (device === null) {
    device = await serialLib.requestPort({});
    transport = new Transport(device, true);
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

  while (true && !isConsoleClosed) {
    const readLoop = transport.rawRead();
    const { value, done } = await readLoop.next();

    if (done || !value) {
      break;
    }
    term.write(value);
  }
  console.log("quitting console");
};

consoleStopButton.onclick = async () => {
  isConsoleClosed = true;
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

function generateDownloadLinkFromTableRow(row: string[], data: Uint8Array<ArrayBufferLike>) {
  const type = row[0] === "user_fs" ? `${row[0]}_${row[2]}` : row[0];
  const fileName = `${chip}_${type}_${row[3]}_${row[4]}b.bin`;
  initiateFileDownload(data, fileName, row);
}

function initiateFileDownload(
  data: Uint8Array<ArrayBufferLike>,
  fileName: string,
  downloadMsgName: string[] | string = "",
) {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  logToTerm(`Download triggered for ${String(downloadMsgName).length > 0 ? downloadMsgName : fileName}`);
}

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

    const fileObj = row.cells[1].childNodes[0] as ChildNode & { data: string };
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
      flashSize: "keep",
      eraseAll: false,
      compress: true,
      reportProgress: (fileIndex, written, total) => {
        progressBars[fileIndex].value = (written / total) * 100;
      },
      calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
    } as FlashOptions;
    await esploader.writeFlash(flashOptions);
    await esploader.after();
  } catch (e) {
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
