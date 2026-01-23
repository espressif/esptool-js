# Javascript implementation of esptool

This repository contains a Javascript implementation of [esptool](https://github.com/espressif/esptool), a serial flasher utility for Espressif chips. `esptool-js` is based on [Web Serial API](https://wicg.github.io/serial/) and works in Google Chrome and Microsoft Edge [version 89 or later](https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility) browsers and Google Chrome on Android [version 61 or later](https://developer.mozilla.org/en-US/docs/Web/API/USB#browser_compatibility) via the [web-serial-polyfill](https://github.com/google/web-serial-polyfill) compatibility layer.

**NOTE:** Unlike the Python-based esptool, `esptool-js` doesn't implement generation of binary images out of ELF files, and doesn't include companion tools similar to [espefuse.py](https://github.com/espressif/esptool/wiki/espefuse) and [espsecure.py](https://github.com/espressif/esptool/wiki/espsecure).

**📚 [API Documentation](https://espressif.github.io/esptool-js/docs/)** - Complete API reference with detailed class and method documentation.

## Installation

**CDN**

`https://unpkg.com/esptool-js/lib/index.js` or `https://unpkg.com/esptool-js/bundle.js` to use the single bundle JavaScript file.

**NPM**

```bash
npm install --save esptool-js
```

**Yarn**

```bash
yarn add --save esptool-js
```

**Nightly builds** for <a href="https://nightly.link/espressif/esptool-js/workflows/ci/main">ESPTOOL-JS</a>

## How to Use

### Basic Setup

First, import the necessary classes and types:

```typescript
import {
  ESPLoader,
  Transport,
  LoaderOptions,
  FlashOptions,
  FlashModeValues,
  FlashFreqValues,
  FlashSizeValues,
  IEspLoaderTerminal,
} from "esptool-js";
```

### 1. Request Serial Port Access

Request access to a serial port using the Web Serial API:

```typescript
// Request port access (user will be prompted to select a device)
const port = await navigator.serial.requestPort();

// Optionally, filter by USB vendor/product IDs
const portFilters = [
  { usbVendorId: 0x10c4, usbProductId: 0xea60 } // Example: Silicon Labs CP210x
];
const port = await navigator.serial.requestPort({ filters: portFilters });
```

### 2. Create Transport and ESPLoader

Create a `Transport` instance and configure the `ESPLoader`:

```typescript
// Create transport instance
const transport = new Transport(port, true);

// Optional: Create a terminal interface for logging
const terminal: IEspLoaderTerminal = {
  clean() {
    console.clear();
  },
  writeLine(data: string) {
    console.log(data);
  },
  write(data: string) {
    console.log(data);
  },
};

// Configure loader options
const loaderOptions: LoaderOptions = {
  transport: transport,
  baudrate: 115200, // Communication baud rate
  terminal: terminal, // Optional terminal for logging
  debugLogging: false, // Optional debug logging
};

// Create ESPLoader instance
const esploader = new ESPLoader(loaderOptions);
```

### 3. Connect to Device

Connect to the ESP device and detect the chip:

```typescript
try {
  // Connect and detect chip (this will reset the device)
  const chipName = await esploader.main();
  console.log(`Connected to: ${chipName}`);
} catch (error) {
  console.error("Failed to connect:", error);
}
```

### 4. Flash Firmware

Flash firmware images to the device:

```typescript
// Read your firmware file (e.g., from a File input or fetch)
const firmwareData = new Uint8Array(/* your firmware binary data */);
const firmwareAddress = 0x1000; // Starting address in flash

// Configure flash options
const flashOptions: FlashOptions = {
  fileArray: [
    { data: firmwareData, address: firmwareAddress }
  ],
  flashMode: "dio" as FlashModeValues, // Flash mode: "qio", "qout", "dio", "dout"
  flashFreq: "40m" as FlashFreqValues, // Flash frequency: "80m", "40m", "26m", "20m", etc.
  flashSize: "4MB" as FlashSizeValues, // Flash size: "256KB", "512KB", "1MB", "2MB", "4MB", etc.
  eraseAll: false, // Set to true to erase entire flash before writing
  compress: true, // Compress data during transfer
  reportProgress: (fileIndex, written, total) => {
    const percent = (written / total) * 100;
    console.log(`Progress: ${percent.toFixed(1)}%`);
  },
  // Optional: MD5 hash calculation for verification
  calculateMD5Hash: (image: Uint8Array) => {
    // Implement your MD5 calculation here
    return "your-md5-hash";
  },
};

// Flash the firmware
await esploader.writeFlash(flashOptions);

// Reset the device after flashing (optional)
await esploader.after("hard_reset");
```

### 5. Read Flash Memory

Read data from flash memory:

```typescript
const startAddress = 0x1000;
const size = 4096; // Read 4KB

const data = await esploader.readFlash(
  startAddress,
  size,
  (packet, progress, totalSize) => {
    // Optional progress callback
    console.log(`Read: ${progress}/${totalSize} bytes`);
  }
);

console.log("Read data:", data);
```

### 6. Erase Flash

Erase flash memory:

```typescript
// Erase entire flash
await esploader.eraseFlash();

// Or erase a specific region (if supported)
// await esploader.eraseRegion(startAddress, size);
```

### 7. Reset Strategies (OPTIONAL and advanced)

**Note:** This is an advanced feature. For most use cases, the default reset strategies provided by `esptool-js` will work correctly. You only need to implement custom reset strategies if:

- You're using custom hardware that requires specific DTR/RTS sequences
- The default reset methods don't work with your particular board or adapter
- You need fine-grained control over the reset timing and sequence
- You're working with non-standard ESP development boards

By default, `ESPLoader` uses built-in reset strategies that work with most ESP32/ESP8266 boards. However, if you need to implement your own reset sequence, you can provide custom reset constructors.

#### Understanding Reset Commands

Reset strategies use a sequence of commands to control the DTR (Data Terminal Ready) and RTS (Request To Send) signals on the serial port:

- **D**: `setDTR` - Set DTR signal (0=False, 1=True)
- **R**: `setRTS` - Set RTS signal (0=False, 1=True)  
- **W**: Wait - Delay in milliseconds (positive integer)

Commands are separated by `|` (pipe). For example, `"D0|R1|W100|D1|R0|W50|D0"` represents:
1. Set DTR to false
2. Set RTS to true
3. Wait 100ms
4. Set DTR to true
5. Set RTS to false
6. Wait 50ms
7. Set DTR to false

#### Implementing Custom Reset Strategies

```typescript
import {
  ClassicReset,
  HardReset,
  UsbJtagSerialReset,
  CustomReset,
  ResetConstructors,
  validateCustomResetStringSequence,
} from "esptool-js";

// Option 1: Use built-in reset strategies with custom parameters
const resetConstructors: ResetConstructors = {
  classicReset: (transport, resetDelay) => new ClassicReset(transport, resetDelay),
  hardReset: (transport, usingUsbOtg) => new HardReset(transport, usingUsbOtg),
  usbJTAGSerialReset: (transport) => new UsbJtagSerialReset(transport),
};

// Option 2: Implement a completely custom reset sequence
const customResetSequence = "D0|R1|W100|D1|R0|W50|D0";

// Validate the sequence before using it
if (validateCustomResetStringSequence(customResetSequence)) {
  resetConstructors.customReset = (transport, sequenceString) => 
    new CustomReset(transport, customResetSequence);
} else {
  console.error("Invalid reset sequence");
}

// Apply custom reset strategies to loader options
const loaderOptions: LoaderOptions = {
  transport: transport,
  baudrate: 115200,
  resetConstructors: resetConstructors,
};

const esploader = new ESPLoader(loaderOptions);

// Use specific reset mode when connecting
await esploader.main("default_reset"); // Uses classicReset
// await esploader.main("hard_reset"); // Uses hardReset
// await esploader.main("no_reset"); // Skips reset
```

#### Example: Custom Reset for Special Hardware

If your board requires a specific reset sequence:

```typescript
// Custom sequence for a board that needs longer reset pulse
const customSequence = "D0|R0|W50|D1|R1|W200|D0|R0|W100";

if (validateCustomResetStringSequence(customSequence)) {
  const resetConstructors: ResetConstructors = {
    customReset: (transport, _) => new CustomReset(transport, customSequence),
  };
  
  const esploader = new ESPLoader({
    transport,
    baudrate: 115200,
    resetConstructors,
  });
  
  await esploader.main("default_reset");
}
```

### 8. Complete Example

Here's a complete example that demonstrates the full workflow:

```typescript
import {
  ESPLoader,
  Transport,
  LoaderOptions,
  FlashOptions,
  FlashModeValues,
  FlashFreqValues,
  FlashSizeValues,
} from "esptool-js";

async function flashFirmware() {
  try {
    // 1. Request serial port
    const port = await navigator.serial.requestPort();
    
    // 2. Create transport and loader
    const transport = new Transport(port, true);
    const esploader = new ESPLoader({
      transport,
      baudrate: 115200,
      terminal: {
        clean: () => console.clear(),
        writeLine: (data) => console.log(data),
        write: (data) => console.log(data),
      },
    });
    
    // 3. Connect to device
    const chipName = await esploader.main();
    console.log(`Connected to: ${chipName}`);
    
    // 4. Load firmware (example: from a file input)
    const fileInput = document.getElementById("firmwareFile") as HTMLInputElement;
    const file = fileInput.files[0];
    const firmwareData = new Uint8Array(await file.arrayBuffer());
    
    // 5. Flash firmware
    const flashOptions: FlashOptions = {
      fileArray: [{ data: firmwareData, address: 0x1000 }],
      flashMode: "dio" as FlashModeValues,
      flashFreq: "40m" as FlashFreqValues,
      flashSize: "4MB" as FlashSizeValues,
      eraseAll: false,
      compress: true,
      reportProgress: (fileIndex, written, total) => {
        console.log(`Progress: ${((written / total) * 100).toFixed(1)}%`);
      },
    };
    
    await esploader.writeFlash(flashOptions);
    console.log("Firmware flashed successfully!");
    
    // 6. Reset device
    await esploader.after("hard_reset");
    
    // 7. Disconnect
    await transport.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Terminal Interface

You can use any JavaScript-compatible terminal by implementing the `IEspLoaderTerminal` interface:

```typescript
import { IEspLoaderTerminal } from "esptool-js";

const terminal: IEspLoaderTerminal = {
  clean() {
    // Clear terminal output
  },
  writeLine(data: string) {
    // Write a line with newline
  },
  write(data: string) {
    // Write data without newline
  },
};
```

Check the [example project](https://github.com/espressif/esptool-js/tree/main/examples/typescript) for a complete working implementation.

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

Then open `http://localhost:1234` in a Chrome browser. The `npm run build` step builds the `lib` used in the example `examples/typescript/index.html`. Update this reference as described in the [Installation](#installation) section.

## Test from Pull Request artifact

If you are testing the main branch or any Pull Request (PR) artifact you can follow these steps:

1. Get the `esptool-js-<version>.tgz` where `<version>` is the current version and download it.
2. Add the following line to your project's package.json dependencies

```json
"dependencies": {
  "esptool-js": "file:../path/to/esptool-js-<version>.tgz"
}
```
3. Use the package like `import "esptool-js/lib/index.js"` when added in package.json as shown before.

## License

The code in this repository is Copyright (c) 2023 Espressif Systems (Shanghai) Co. Ltd. It is licensed under Apache 2.0 license, as described in [LICENSE](https://github.com/espressif/esptool-js/blob/main/LICENSE) file.
