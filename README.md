# Javascript implementation of esptool

This repository contains a Javascript flasher for Espressif chips, backed by
[`esp-serial-flasher`](https://github.com/espressif/esp-serial-flasher) compiled to WebAssembly
and the [Web Serial API](https://wicg.github.io/serial/). It works in Google Chrome and Microsoft Edge
[version 89 or later](https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility)
(and Chrome on Android via [web-serial-polyfill](https://github.com/google/web-serial-polyfill)).

The public API follows the style of [esptool’s Python module API](https://docs.espressif.com/projects/esptool/en/latest/esp32/esptool/scripting.html)
(`connectEsp`, `writeFlash`, `eraseFlash`, `readFlash`, `loadRam`, …).

The WASM layer exposes the full UART-relevant [`esp_loader_*`](https://github.com/espressif/esp-serial-flasher)
surface (flash erase/read/deflate, RAM download, MAC, registers, security info, reset, connect variants).
Image tooling (`elf2image`, `mergeBin`) remains out of scope for now.

## Installation

**NPM**

```bash
npm install --save esptool-js
```

**Yarn**

```bash
yarn add esptool-js
```

## How to use

```typescript
import { Transport, connectEsp, writeFlash, detectFlashSize } from "esptool-js";

const transport = await Transport.requestPort();
await transport.open(115200);

const esp = await connectEsp({ transport, baudrate: 921600, openTransport: false });
const size = await detectFlashSize(esp);
console.log("Flash size:", size);

await writeFlash(esp, [{ address: 0x10000, data: firmwareBytes }], {
  onProgress: (pct) => console.log(`${pct.toFixed(1)}%`),
});

await transport.close();
```

When bundling, ensure `wasm/esp_flasher.js` and `wasm/esp_flasher.wasm` from the package are
available to the browser (or pass `factory` / `wasmUrl` into `connectEsp`).

## Building from source

### Prerequisites

- Node.js + npm
- [CMake](https://cmake.org/) 3.22+
- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html)

```bash
git clone https://github.com/emscripten-core/emsdk.git ~/emsdk
cd ~/emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

# In the esptool-js repo:
git submodule update --init --recursive
```

### Build

```bash
source ~/emsdk/emsdk_env.sh   # every new shell
npm install
npm run build:wasm            # native/ → wasm/esp_flasher.{js,wasm}
npm run build:js              # tsc + rollup
# or: npm run build           # wasm + js
```

### Test with the example

```bash
source ~/emsdk/emsdk_env.sh
npm run build:wasm
npm run build:js
cd examples/typescript
npm install
npm run parcel:dev
```

Open http://localhost:1234 in Chrome or Edge (Web Serial requires HTTPS or localhost).

### Common failures

| Symptom | Fix |
|---|---|
| `emcmake: command not found` | `source ~/emsdk/emsdk_env.sh` |
| Missing submodule | `git submodule update --init --recursive` |
| Stale WASM in the browser | Rebuild with `npm run build:wasm` and hard-refresh |
| Web Serial denied | Use Chrome/Edge on `localhost` or HTTPS |

## API overview

| Export | Role |
|---|---|
| `Transport` | Web Serial open/close, RX buffer, baud reconfigure |
| `connectEsp` | Connect (stub / ROM / secure download) + optional baud raise |
| `detectFlashSize` | SPI flash size in bytes |
| `writeFlash` | Multi-image flash write (optional `compress` / `skipVerify`) |
| `eraseFlash` / `eraseRegion` | Chip / region erase |
| `readFlash` | Read flash into `Uint8Array` |
| `readMac` / `getTarget` / `getSecurityInfo` | Chip identity |
| `readRegister` / `writeRegister` | Register access |
| `loadRam` | RAM download + jump to entrypoint |
| `resetChip` | Hard reset target |
| `verifyFlash` | Verify region against known MD5 |
| `flasherConnect` / `flasherFlashStart` / … | Thin 1:1 WASM wrappers |

## License

Apache-2.0. See [LICENSE](LICENSE).
