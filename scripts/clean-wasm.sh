#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rm -rf "${ROOT_DIR}/native/build"
rm -f "${ROOT_DIR}/wasm/esp_flasher.js" "${ROOT_DIR}/wasm/esp_flasher.wasm"
echo "Cleaned native/build and wasm artifacts"
