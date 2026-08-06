# Native WASM build (esp-serial-flasher)

This directory builds [`esp-serial-flasher`](https://github.com/espressif/esp-serial-flasher)
to WebAssembly via Emscripten.

```bash
# From repo root, with emsdk on PATH:
npm run build:wasm
```

Outputs land in `../wasm/esp_flasher.js` and `../wasm/esp_flasher.wasm`.

- `esp-serial-flasher/` — git submodule
- `wasm_port.c` — Web Serial bridge (`Module.__transport`) + `flasher_*` exports
- `CMakeLists.txt` — Emscripten target (`createEspFlasherModule`)
