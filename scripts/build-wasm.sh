#!/usr/bin/env bash
# Build esp-serial-flasher WASM artifacts into wasm/
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -n "${EMSDK:-}" ] && [ -f "${EMSDK}/emsdk_env.sh" ]; then
  # shellcheck disable=SC1091
  source "${EMSDK}/emsdk_env.sh"
elif [ -f "${HOME}/emsdk/emsdk_env.sh" ]; then
  # shellcheck disable=SC1091
  source "${HOME}/emsdk/emsdk_env.sh"
fi

if ! command -v emcmake >/dev/null 2>&1; then
  echo "Emscripten not found. Install emsdk and run: source emsdk_env.sh" >&2
  echo "See README.md for setup instructions." >&2
  exit 1
fi

if [ ! -f native/esp-serial-flasher/CMakeLists.txt ]; then
  echo "esp-serial-flasher submodule missing. Run:" >&2
  echo "  git submodule update --init --recursive" >&2
  exit 1
fi

JOBS="$(getconf _NPROCESSORS_ONLN 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"

mkdir -p native/build
cd native/build
emcmake cmake ..
emmake make -j"${JOBS}"

mkdir -p "${ROOT_DIR}/wasm"
cp -f esp_flasher.js esp_flasher.wasm "${ROOT_DIR}/wasm/"
echo "WASM artifacts written to wasm/esp_flasher.js and wasm/esp_flasher.wasm"
