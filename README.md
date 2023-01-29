# Javascript implementation of esptool

This repository contains a Javascript implementation of [esptool](https://github.com/espressif/esptool), a serial flasher utility for Espressif chips. Unlike the Python-based esptool, `esptool-js` doesn't implement generation of binary images out of ELF files, and doesn't include companion tools similar to [espefuse.py](https://github.com/espressif/esptool/wiki/espefuse) and [espsecure.py](https://github.com/espressif/esptool/wiki/espsecure).

`esptool-js` is based on [Web Serial API](https://wicg.github.io/serial/) and works in Google Chrome and Microsoft Edge, [version 89 or later](https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility).


## Usage

CDN

``

or import as npm package

`npm install --save esptool-js`

`yarn add --save esptool-js`

Example code:

```ts
import { ESPLoader, Transport } from "esptool-js";

const portFilters : { usbVendorId?: number | undefined; usbProductId?: number | undefined;}[] = [];
const device = await navigator.serial.requestPort({ filters: portFilters });
const transport = new Transport(device);

// You can use any JavaScript compatible terminal by wrapping a helper object like this:
let espLoaderTerminal = {
  clean() {
    // Implement the clean function for your terminal here.
  },
  writeLine(data) {
    // Implement the writeLine function for your terminal here.
  },
  write(data) {
    // Implement the write function for your terminal here.
  },
};

const esploader: ESPLoader = new ESPLoader(transport, baudRateInteger, espLoaderTerminal);

chip = await esploader.main_fn(); // Start connection with serial device, return device information string.

const binaryFilesArray: {data: string; address: string;}[] = [
  {data: "file1DataHere", address: "0x1000"}
];
const flash_size = "keep";
const flash_mode = "keep";
const flash_freq = "keep";
const erase_all = false;
const compress = true;

// A function that will be executed on each file progress update
const reportProgress: (fileIndex: number, written: number, total: number) => void;

// A function used to do hash data verification where image is the binaryFilesArray[i].data
const calculateMD5Hash: (image: string) => string;

await esploader.write_flash(
  binaryFilesArray,
  flashSize,
  flashMode,
  flashFreq,
  eraseAll,
  compress,
  reportProgress,
  calculateMD5Hash);

// Use the transport read write method for console logging.
let val = await transport.rawRead();

// Disconnect serial device with
await transport.disconnect();

```

## Live demo

Visit https://espressif.github.io/esptool-js/ to see this tool in action.



## Testing it locally

```
npm install
npm run build
python3 -m http.server 8008
```

Then open http://localhost:8008 in Chrome or Edge. The `npm run build` step builds the `bundle.js` used in the example `index.html`.

## License

The code in this repository is Copyright (c) 2021 Espressif Systems (Shanghai) Co. Ltd. It is licensed under Apache 2.0 license, as described in [LICENSE](LICENSE) file.
