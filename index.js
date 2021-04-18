const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");

const terminal = document.getElementById("terminal");

//import { Transport } from './cp210x-webusb.js'
import { Transport } from './webserial.js'
import { ESPLoader } from './ESPLoader.js'

let term = new Terminal();
term.open(terminal);

let device;
let chip;

function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

connectButton.onclick = async () => {
//    device = await navigator.usb.requestDevice({
//        filters: [{ vendorId: 0x10c4 }]
//    });

    device = await navigator.serial.requestPort({
        filters: [{ usbVendorId: 0x10c4 }]
    });

    var transport = new Transport(device);
    var esploader = new ESPLoader(transport, term);

    await esploader.main_fn();

   console.log("Settings done");
    connectButton.style.display = "none";
    disconnectButton.style.display = "initial";
};

disconnectButton.onclick = async () => {
    await device.close();
    term.clear();
    connectButton.style.display = "initial";
    disconnectButton.style.display = "none";
};
