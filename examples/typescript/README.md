# Using Esptool-JS in a TypeScript environment

Example of flashing Espressif chips from the browser using `esptool-js` (WASM + Web Serial).

The example is also published on GitHub Pages. **View the API Documentation** opens TypeDoc generated from the package source (`npm run genDocs` at the repo root), copied into `dist/docs` so it ships next to the live flasher.

## Prerequisites

Build the parent package first (needs Emscripten for WASM):

```bash
cd ../..
source ~/emsdk/emsdk_env.sh   # if not already sourced
git submodule update --init --recursive
npm install
npm run build:wasm
npm run build:js
```

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` / `npm run build` regenerate TypeDoc into `dist/docs`, then start or bundle the example with Parcel.

Open http://localhost:1234 in Chrome or Edge. Use **View the API Documentation** to open `./docs/index.html`.

## Flow

1. **Connect** — request a serial port, open at 115200, upload stub, optionally raise baud.
2. **Detect Flash Size** / **Read MAC** (optional).
3. **Erase Flash** (optional) — full chip erase.
4. **Add files** — select `.bin` images and flash addresses.
5. **Program** — `writeFlash` writes each image and verifies MD5 via the C library.
6. **Disconnect**, then use **Console** to view firmware serial output.

### Console (serial monitor)

Program and Console are separate modes (monitoring is not active during `writeFlash`).

1. After flashing, **Disconnect** (or skip Connect and open Console directly).
2. Choose console baud (`115200` or `74880`), optional reconnect delay / max retries.
3. **Start** — opens the port, hard-resets the chip into the running app, and streams UART output to the terminal (IDF `I`/`W`/`E` lines are colorized).
4. **Reset** — toggles EN via DTR/RTS while monitoring.
5. **Stop** — closes the port and returns to the Program UI.

If the USB device drops while Console is running, the example retries reconnect using previously authorized ports (matching VID/PID).
