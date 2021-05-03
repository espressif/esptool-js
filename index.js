const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");

const terminal = document.getElementById("terminal");

//import { Transport } from './cp210x-webusb.js'
import { Transport } from './webserial.js'
import { ESPLoader } from './ESPLoader.js'

let term = new Terminal({cols:120});
term.open(terminal);

let device;
let chip;
let esploader;

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            console.log("In reader.onload");
            console.log(e);
            esploader.program(e.target.result);
//            var span = document.createElement('span');
//            span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name),'"/>'].join('');
//             document.getElementById('list').insertBefore(span, null);
        };
    })(file);

    reader.readAsBinaryString(file);
}

document.getElementById('selectFile').addEventListener('change', handleFileSelect, false);
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
    esploader = new ESPLoader(transport, term);

    await esploader.main_fn();

    await esploader.flash_id();
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
