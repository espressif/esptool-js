# Using Esptool-JS in a TypeScript environment

Example of flashing Espressif chips from the browser using `esptool-js` (WASM + Web Serial).

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
npm run parcel:dev
```

Open http://localhost:1234 in Chrome or Edge.

## Flow

1. **Connect** — request a serial port, open at 115200, upload stub, optionally raise baud.
2. **Detect Flash Size** (optional) — call `detectFlashSize`.
3. **Add files** — select `.bin` images and flash addresses.
4. **Program** — `writeFlash` writes each image and verifies MD5 via the C library.
