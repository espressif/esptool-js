/*
 * SPDX-FileCopyrightText: 2024-2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * WebAssembly port for esp-serial-flasher. Bridges C port ops to JavaScript
 * Web Serial helpers registered on the Emscripten Module (Module.__transport).
 */

#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>
#include <stddef.h>
#include <stdarg.h>
#include <string.h>

#include "esp_loader_io.h"
#include "esp_loader.h"
#include <emscripten.h>

#ifndef SERIAL_FLASHER_RESET_HOLD_TIME_MS
#define SERIAL_FLASHER_RESET_HOLD_TIME_MS 100
#endif

#ifndef SERIAL_FLASHER_BOOT_HOLD_TIME_MS
#define SERIAL_FLASHER_BOOT_HOLD_TIME_MS 50
#endif

typedef struct {
  esp_loader_port_t port; /* must be first */
  uint32_t _baud_rate;
} wasm_port_t;

static wasm_port_t g_port = {
  ._baud_rate = 115200,
};
static esp_loader_t g_loader;
static esp_loader_flash_cfg_t g_flash_cfg;

EM_JS(void, js_init_serial_buffer, (), {
  if (typeof Module.serialBuffer === "undefined") {
    Module.serialBuffer = new Uint8Array(0);
  }
});

EM_ASYNC_JS(int, js_serial_write, (const uint8_t *data, uint16_t size), {
  const transport = Module.__transport;
  if (!transport || typeof transport.write !== "function") {
    console.error("[ERROR] Transport not registered on Module.__transport");
    return -1;
  }
  try {
    const dataArray = new Uint8Array(size);
    dataArray.set(HEAPU8.subarray(data, data + size));
    await transport.write(dataArray);
    return 0;
  } catch (error) {
    console.error("[ERROR] Serial write failed:", error);
    return -1;
  }
});

EM_ASYNC_JS(int, js_serial_read, (uint8_t *data, uint16_t size, uint32_t timeout_ms), {
  try {
    if (typeof Module.serialBuffer === "undefined") {
      Module.serialBuffer = new Uint8Array(0);
    }
    const startTime = Date.now();
    while (Module.serialBuffer.length < size) {
      if (Date.now() - startTime >= timeout_ms) {
        return -2;
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    for (let i = 0; i < size; i++) {
      HEAPU8[data + i] = Module.serialBuffer[i];
    }
    Module.serialBuffer = Module.serialBuffer.slice(size);
    return 0;
  } catch (error) {
    console.error("[ERROR] Serial read failed:", error);
    return -1;
  }
});

EM_ASYNC_JS(void, js_serial_enter_bootloader, (), {
  const transport = Module.__transport;
  if (!transport || typeof transport.setSignals !== "function") {
    console.error("[ERROR] Transport not registered on Module.__transport");
    return;
  }
  try {
    // Classic USB-UART wiring: DTR→IO0, RTS→EN
    await transport.setSignals({ dataTerminalReady: false, requestToSend: true });
    await new Promise((resolve) => setTimeout(resolve, 100));
    await transport.setSignals({ dataTerminalReady: true, requestToSend: false });
    await new Promise((resolve) => setTimeout(resolve, 50));
    await transport.setSignals({ dataTerminalReady: false, requestToSend: false });
    await new Promise((resolve) => setTimeout(resolve, 100));
    Module.serialBuffer = new Uint8Array(0);
  } catch (error) {
    console.error("[ERROR] Failed to enter bootloader:", error);
  }
});

EM_ASYNC_JS(void, js_serial_reset_target, (uint32_t reset_hold_ms), {
  const transport = Module.__transport;
  if (!transport || typeof transport.setSignals !== "function") {
    console.error("[ERROR] Transport not registered on Module.__transport");
    return;
  }
  try {
    await transport.setSignals({ dataTerminalReady: true, requestToSend: true });
    await new Promise((resolve) => setTimeout(resolve, reset_hold_ms));
    await transport.setSignals({ dataTerminalReady: true, requestToSend: false });
  } catch (error) {
    console.error("[ERROR] Failed to reset target:", error);
  }
});

EM_ASYNC_JS(void, js_delay_ms, (uint32_t ms), {
  await new Promise((resolve) => setTimeout(resolve, ms));
});

EM_JS(void, js_debug_print, (const char *str), {
  const message = UTF8ToString(str);
  if (typeof Module.__log === "function") {
    Module.__log(message);
  } else {
    console.log(message);
  }
});

EM_ASYNC_JS(int, js_change_baud_rate, (uint32_t new_baud), {
  const transport = Module.__transport;
  if (!transport || typeof transport.reconfigureBaud !== "function") {
    console.error("[ERROR] Transport.reconfigureBaud not available");
    return 1;
  }
  try {
    await transport.reconfigureBaud(new_baud);
    return 0;
  } catch (error) {
    console.error("[ERROR] Baud rate change failed:", error);
    return 1;
  }
});

static esp_loader_error_t wasm_write(esp_loader_port_t *port, const uint8_t *data, uint16_t size,
                                     uint32_t timeout)
{
  (void)port;
  (void)timeout;
  static bool initialized = false;
  if (!initialized) {
    js_init_serial_buffer();
    initialized = true;
  }
  int result = js_serial_write(data, size);
  return result == 0 ? ESP_LOADER_SUCCESS : ESP_LOADER_ERROR_FAIL;
}

static esp_loader_error_t wasm_read(esp_loader_port_t *port, uint8_t *data, uint16_t size,
                                    uint32_t timeout)
{
  (void)port;
  static bool initialized = false;
  if (!initialized) {
    js_init_serial_buffer();
    initialized = true;
  }
  int result = js_serial_read(data, size, timeout);
  if (result == 0) {
    return ESP_LOADER_SUCCESS;
  }
  if (result == -2) {
    return ESP_LOADER_ERROR_TIMEOUT;
  }
  return ESP_LOADER_ERROR_FAIL;
}

static void wasm_enter_bootloader(esp_loader_port_t *port)
{
  (void)port;
  js_serial_enter_bootloader();
}

static void wasm_reset_target(esp_loader_port_t *port)
{
  (void)port;
  js_serial_reset_target(SERIAL_FLASHER_RESET_HOLD_TIME_MS);
}

static void wasm_delay_ms(esp_loader_port_t *port, uint32_t ms)
{
  (void)port;
  js_delay_ms(ms);
}

static void wasm_start_timer(esp_loader_port_t *port, uint32_t ms)
{
  (void)port;
  EM_ASM({ Module._timerEnd = Date.now() + $0; }, ms);
}

static uint32_t wasm_remaining_time(esp_loader_port_t *port)
{
  (void)port;
  int32_t remaining = EM_ASM_INT({
    if (typeof Module._timerEnd === "undefined")
      return 0;
    const r = Module._timerEnd - Date.now();
    return r > 0 ? r : 0;
  });
  return (uint32_t)remaining;
}

static void wasm_log(esp_loader_port_t *port, esp_loader_log_level_t level, const char *fmt,
                     va_list args)
{
  (void)port;
  char buffer[512];
  const char *prefix = "";
  switch (level) {
  case ESP_LOADER_LOG_LEVEL_ERROR:
    prefix = "[E] ";
    break;
  case ESP_LOADER_LOG_LEVEL_WARN:
    prefix = "[W] ";
    break;
  case ESP_LOADER_LOG_LEVEL_INFO:
    prefix = "[I] ";
    break;
  case ESP_LOADER_LOG_LEVEL_DEBUG:
    prefix = "[D] ";
    break;
  default:
    break;
  }
  int offset = snprintf(buffer, sizeof(buffer), "%s", prefix);
  if (offset < 0 || (size_t)offset >= sizeof(buffer)) {
    return;
  }
  vsnprintf(buffer + offset, sizeof(buffer) - (size_t)offset, fmt, args);
  js_debug_print(buffer);
}

static void wasm_log_hex(esp_loader_port_t *port, esp_loader_log_level_t level, const char *label,
                         const uint8_t *data, size_t size)
{
  (void)port;
  (void)level;
  char line[128];
  snprintf(line, sizeof(line), "%s (%zu bytes)", label ? label : "hex", size);
  js_debug_print(line);
  for (size_t i = 0; i < size; i += 16) {
    char hex_line[16 * 3 + 1];
    size_t pos = 0;
    size_t chunk = size - i < 16 ? size - i : 16;
    for (size_t j = 0; j < chunk && pos + 3 < sizeof(hex_line); j++) {
      pos += (size_t)snprintf(hex_line + pos, sizeof(hex_line) - pos, "%02x ", data[i + j]);
    }
    js_debug_print(hex_line);
  }
}

static esp_loader_error_t wasm_change_transmission_rate(esp_loader_port_t *port, uint32_t rate)
{
  wasm_port_t *p = container_of(port, wasm_port_t, port);
  int result = js_change_baud_rate(rate);
  if (result == 0) {
    p->_baud_rate = rate;
    return ESP_LOADER_SUCCESS;
  }
  return ESP_LOADER_ERROR_FAIL;
}

static const esp_loader_port_ops_t wasm_ops = {
  .init = NULL,
  .deinit = NULL,
  .enter_bootloader = wasm_enter_bootloader,
  .reset_target = wasm_reset_target,
  .start_timer = wasm_start_timer,
  .remaining_time = wasm_remaining_time,
  .delay_ms = wasm_delay_ms,
  .log = wasm_log,
  .log_hex = wasm_log_hex,
  .change_transmission_rate = wasm_change_transmission_rate,
  .write = wasm_write,
  .read = wasm_read,
  .spi_set_cs = NULL,
  .sdio_write = NULL,
  .sdio_read = NULL,
  .sdio_card_init = NULL,
};

int flasher_connect(void)
{
  if (g_port._baud_rate != 115200) {
    js_change_baud_rate(115200);
  }
  g_port.port.ops = &wasm_ops;
  g_port._baud_rate = 115200;
  esp_loader_error_t err = esp_loader_init_serial(&g_loader, &g_port.port);
  if (err != ESP_LOADER_SUCCESS) {
    return (int)err;
  }
  esp_loader_connect_args_t connect_args = ESP_LOADER_CONNECT_DEFAULT();
  return (int)esp_loader_connect_with_stub(&g_loader, &connect_args);
}

int flasher_change_baudrate(uint32_t new_baud)
{
  return (int)esp_loader_change_transmission_rate(&g_loader, new_baud);
}

int flasher_flash_detect_size(uint32_t *flash_size)
{
  return (int)esp_loader_flash_detect_size(&g_loader, flash_size);
}

int flasher_flash_start(uint32_t offset, uint32_t image_size, uint32_t block_size)
{
  memset(&g_flash_cfg, 0, sizeof(g_flash_cfg));
  g_flash_cfg.offset = offset;
  g_flash_cfg.image_size = image_size;
  g_flash_cfg.block_size = block_size;
  g_flash_cfg.skip_verify = false;
  return (int)esp_loader_flash_start(&g_loader, &g_flash_cfg);
}

int flasher_flash_write(void *payload, uint32_t size)
{
  return (int)esp_loader_flash_write(&g_loader, &g_flash_cfg, payload, size);
}

int flasher_flash_finish(void)
{
  return (int)esp_loader_flash_finish(&g_loader, &g_flash_cfg);
}
