const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");
const resetButton = document.getElementById("resetButton");
const consoleStartButton = document.getElementById("consoleStartButton");
const consoleStopButton = document.getElementById("consoleStopButton");
const eraseButton = document.getElementById("eraseButton");
const programButton = document.getElementById("programButton");
const filesDiv = document.getElementById("files");
const terminal = document.getElementById("terminal");
const programDiv = document.getElementById("program");
const consoleDiv = document.getElementById("console");


//import { Transport } from './cp210x-webusb.js'
import { Transport } from './webserial.js'
import { ESPLoader } from './ESPLoader.js'

let term = new Terminal({cols:120, rows:40});
term.open(terminal);

let device = null;
let transport;
let chip;
let esploader;
let file1 = null, file2 = null, file3 = null;
let connected = false;

disconnectButton.style.display = "none";
consoleStopButton.style.display = "none";
filesDiv.style.display = "none";


function convertUint8ArrayToBinaryString(u8Array) {
	var i, len = u8Array.length, b_str = "";
	for (i=0; i<len; i++) {
		b_str += String.fromCharCode(u8Array[i]);
	}
	return b_str;
}

function convertBinaryStringToUint8Array(bStr) {
	var i, len = bStr.length, u8_array = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		u8_array[i] = bStr.charCodeAt(i);
	}
	return u8_array;
}

function handleFileSelect1(evt) {
    var file = evt.target.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            file1 = e.target.result;

        };
    })(file);

    reader.readAsBinaryString(file);
}

function handleFileSelect2(evt) {
    var file = evt.target.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            file2 = e.target.result;
        };
    })(file);

    reader.readAsBinaryString(file);
}

function handleFileSelect3(evt) {
    var file = evt.target.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            file3 = e.target.result;
        };
    })(file);

    reader.readAsBinaryString(file);
}

document.getElementById('selectFile1').addEventListener('change', handleFileSelect1, false);
document.getElementById('selectFile2').addEventListener('change', handleFileSelect2, false);
document.getElementById('selectFile3').addEventListener('change', handleFileSelect3, false);
function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

connectButton.onclick = async () => {
//    device = await navigator.usb.requestDevice({
//        filters: [{ vendorId: 0x10c4 }]
//    });

    if (device === null) {
        device = await navigator.serial.requestPort({
            filters: [{ usbVendorId: 0x10c4 }]
        });
        transport = new Transport(device);
    }

    try {
    esploader = new ESPLoader(transport, term);
    connected = true;

    await esploader.main_fn();

    console.log("Flash ID 1");
    await esploader.flash_id();
    } catch(e) {
        console.log(e);
    }

    console.log("Settings done");
    connectButton.style.display = "none";
    disconnectButton.style.display = "initial";
    filesDiv.style.display = "initial";
    consoleDiv.style.display = "none";
}

resetButton.onclick = async () => {
    if (device === null) {
        device = await navigator.serial.requestPort({
            filters: [{ usbVendorId: 0x10c4 }]
        });
        transport = new Transport(device);
    }

    await transport.setDTR(false);
    await new Promise(resolve => setTimeout(resolve, 100));
    await transport.setDTR(true);
}

eraseButton.onclick = async () => {
    eraseButton.disabled = true;
    console.log("Erase Flash");
    await esploader.erase_flash();
    eraseButton.disabled = false;
}

disconnectButton.onclick = async () => {
    await transport.disconnect();
    term.clear();
    connected = false;
    connectButton.style.display = "initial";
    disconnectButton.style.display = "none";
    filesDiv.style.display = "none";
    consoleDiv.style.display = "initial";
};

consoleStartButton.onclick = async () => {
    if (device === null) {
        device = await navigator.serial.requestPort({
            filters: [{ usbVendorId: 0x10c4 }]
        });
        transport = new Transport(device);
    }

    consoleStartButton.style.display = "none";
    consoleStopButton.style.display = "initial";
    programDiv.style.display = "none";

    await transport.connect();

    while (true) {
        let val = await transport.rawRead();
        if (typeof val !== 'undefined') {
            term.write(val);
        } else {
            break;
        }
    }
    console.log("quitting console");
}

consoleStopButton.onclick = async () => {
    await transport.disconnect();
    term.clear();
    consoleStartButton.style.display = "initial";
    consoleStopButton.style.display = "none";
    programDiv.style.display = "initial";
}

programButton.onclick = async () => {
    let fileArr = [];
    if (file1 != null) {
        let offset1 = parseInt(document.getElementById("offset1").value);
        fileArr.push({data:file1, address:offset1});
    }
    if (file2 != null) {
        let offset2 = parseInt(document.getElementById("offset2").value);
        fileArr.push({data:file2, address:offset2});
    }
    if (file3 != null) {
        let offset3 = parseInt(document.getElementById("offset3").value);
        fileArr.push({data:file3, address:offset3});
    }
    await esploader.write_flash({fileArray: fileArr, flash_size: 'keep'});
}
