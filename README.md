# Javascript implementation of esptool

This repository contains a Javascript implementation of [esptool](https://github.com/espressif/esptool), a serial flasher utility for Espressif chips. `esptool-js` is based on [Web Serial API](https://wicg.github.io/serial/) and works in Google Chrome and Microsoft Edge [version 89 or later](https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility) browsers.

**NOTE:** Unlike the Python-based esptool, `esptool-js` doesn't implement generation of binary images out of ELF files, and doesn't include companion tools similar to [espefuse.py](https://github.com/espressif/esptool/wiki/espefuse) and [espsecure.py](https://github.com/espressif/esptool/wiki/espsecure).

## Usage

**CDN**

`https://unpkg.com/esptool-js/lib/index.js?module`

**NPM**

`npm install --save esptool-js`

**Yarn**

`yarn add --save esptool-js`

Check an example project [here](./examples/typescript).

## Define port filters for device using WebSerial

```js
const portFilters: { usbVendorId?: number | undefined, usbProductId?: number | undefined }[] = [];
const device = await navigator.serial.requestPort({ filters: portFilters });
```

## Inject a Terminal to use with esptool-js

```js
// You can use any JavaScript compatible terminal by wrapping it in a helper object like this:
let espLoaderTerminal = {
  clean() {
    // Implement the clean function call for your terminal here.
  },
  writeLine(data) {
    // Implement the writeLine function call for your terminal here.
  },
  write(data) {
    // Implement the write function call for your terminal here.
  },
};
```

You can pass this terminal object to `ESPLoader` constructor as shown in the [examples projects](./examples/).

## Live demo

Visit https://espressif.github.io/esptool-js/ to see this tool in action.

## Testing it locally

```sh
npm install
npm run build
cd examples/typescript
npm install
npm run dev # Run local sever with example code
```

Then open `http://localhost:1234` in a Chrome browser. The `npm run build` step builds the `lib` used in the example `examples/typescript/index.html`. Update this reference as described in [Usage](#usage) section.

## License

The code in this repository is Copyright (c) 2023 Espressif Systems (Shanghai) Co. Ltd. It is licensed under Apache 2.0 license, as described in [LICENSE](LICENSE) file.
