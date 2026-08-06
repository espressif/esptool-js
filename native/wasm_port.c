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
    // esptool HardReset: pulse EN/RESET via RTS, leave BOOT (DTR) deasserted
    await transport.setSignals({ dataTerminalReady: false, requestToSend: true });
    await new Promise((resolve) => setTimeout(resolve, reset_hold_ms));
    await transport.setSignals({ dataTerminalReady: false, requestToSend: false });
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

static esp_loader_t g_loader;
static esp_loader_flash_cfg_t g_flash_cfg;
static esp_loader_flash_deflate_cfg_t g_deflate_cfg;
static esp_loader_mem_cfg_t g_mem_cfg;
static bool g_loader_initialized = false;

/**
 * Packed security-info layout written by flasher_get_security_info (little-endian):
 *   u32 target_chip
 *   u32 eco_version
 *   u8  secure_boot_enabled
 *   u8  secure_boot_aggressive_revoke_enabled
 *   u8  secure_download_mode_enabled
 *   u8  secure_boot_revoked_keys[3]
 *   u8  jtag_software_disabled
 *   u8  jtag_hardware_disabled
 *   u8  usb_disabled
 *   u8  flash_encryption_enabled
 *   u8  dcache_in_uart_download_disabled
 *   u8  icache_in_uart_download_disabled
 * Total: 4+4+12 = 20 bytes
 */
#define FLASHER_SECURITY_INFO_SIZE 20

static esp_loader_error_t flasher_prepare_port(void)
{
  if (g_port._baud_rate != 115200) {
    js_change_baud_rate(115200);
  }
  g_port.port.ops = &wasm_ops;
  g_port._baud_rate = 115200;
  if (g_loader_initialized) {
    esp_loader_deinit(&g_loader);
    g_loader_initialized = false;
  }
  esp_loader_error_t err = esp_loader_init_serial(&g_loader, &g_port.port);
  if (err == ESP_LOADER_SUCCESS) {
    g_loader_initialized = true;
  }
  return err;
}

int flasher_connect(void)
{
  esp_loader_error_t err = flasher_prepare_port();
  if (err != ESP_LOADER_SUCCESS) {
    return (int)err;
  }
  esp_loader_connect_args_t connect_args = ESP_LOADER_CONNECT_DEFAULT();
  return (int)esp_loader_connect_with_stub(&g_loader, &connect_args);
}

int flasher_connect_rom(void)
{
  esp_loader_error_t err = flasher_prepare_port();
  if (err != ESP_LOADER_SUCCESS) {
    return (int)err;
  }
  esp_loader_connect_args_t connect_args = ESP_LOADER_CONNECT_DEFAULT();
  return (int)esp_loader_connect(&g_loader, &connect_args);
}

int flasher_connect_secure_download(uint32_t flash_size)
{
  esp_loader_error_t err = flasher_prepare_port();
  if (err != ESP_LOADER_SUCCESS) {
    return (int)err;
  }
  esp_loader_connect_args_t connect_args = ESP_LOADER_CONNECT_DEFAULT();
  return (int)esp_loader_connect_secure_download_mode(&g_loader, &connect_args, flash_size);
}

void flasher_deinit(void)
{
  if (g_loader_initialized) {
    esp_loader_deinit(&g_loader);
    g_loader_initialized = false;
  }
}

int flasher_get_target(void)
{
  return (int)esp_loader_get_target(&g_loader);
}

int flasher_change_baudrate(uint32_t new_baud)
{
  return (int)esp_loader_change_transmission_rate(&g_loader, new_baud);
}

int flasher_flash_detect_size(uint32_t *flash_size)
{
  return (int)esp_loader_flash_detect_size(&g_loader, flash_size);
}

int flasher_flash_start(uint32_t offset, uint32_t image_size, uint32_t block_size, int skip_verify)
{
  memset(&g_flash_cfg, 0, sizeof(g_flash_cfg));
  g_flash_cfg.offset = offset;
  g_flash_cfg.image_size = image_size;
  g_flash_cfg.block_size = block_size;
  g_flash_cfg.skip_verify = skip_verify != 0;
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

int flasher_flash_deflate_start(uint32_t offset, uint32_t image_size, uint32_t compressed_size,
                                uint32_t block_size)
{
  memset(&g_deflate_cfg, 0, sizeof(g_deflate_cfg));
  g_deflate_cfg.offset = offset;
  g_deflate_cfg.image_size = image_size;
  g_deflate_cfg.compressed_size = compressed_size;
  g_deflate_cfg.block_size = block_size;
  return (int)esp_loader_flash_deflate_start(&g_loader, &g_deflate_cfg);
}

int flasher_flash_deflate_write(void *payload, uint32_t size)
{
  return (int)esp_loader_flash_deflate_write(&g_loader, &g_deflate_cfg, payload, size);
}

int flasher_flash_deflate_finish(void)
{
  return (int)esp_loader_flash_deflate_finish(&g_loader, &g_deflate_cfg);
}

int flasher_flash_erase(void)
{
  return (int)esp_loader_flash_erase(&g_loader);
}

int flasher_flash_erase_region(uint32_t offset, uint32_t size)
{
  return (int)esp_loader_flash_erase_region(&g_loader, offset, size);
}

int flasher_flash_read(uint8_t *buf, uint32_t address, uint32_t length)
{
  return (int)esp_loader_flash_read(&g_loader, buf, address, length);
}

int flasher_flash_verify_known_md5(uint32_t address, uint32_t size, const uint8_t *expected_md5)
{
  return (int)esp_loader_flash_verify_known_md5(&g_loader, address, size, expected_md5);
}

int flasher_mem_start(uint32_t offset, uint32_t size, uint32_t block_size)
{
  memset(&g_mem_cfg, 0, sizeof(g_mem_cfg));
  g_mem_cfg.offset = offset;
  g_mem_cfg.size = size;
  g_mem_cfg.block_size = block_size;
  return (int)esp_loader_mem_start(&g_loader, &g_mem_cfg);
}

int flasher_mem_write(void *payload, uint32_t size)
{
  return (int)esp_loader_mem_write(&g_loader, &g_mem_cfg, payload, size);
}

int flasher_mem_finish(uint32_t entrypoint)
{
  return (int)esp_loader_mem_finish(&g_loader, &g_mem_cfg, entrypoint);
}

int flasher_read_mac(uint8_t *mac)
{
  return (int)esp_loader_read_mac(&g_loader, mac);
}

int flasher_write_register(uint32_t address, uint32_t reg_value)
{
  return (int)esp_loader_write_register(&g_loader, address, reg_value);
}

int flasher_read_register(uint32_t address, uint32_t *reg_value)
{
  return (int)esp_loader_read_register(&g_loader, address, reg_value);
}

int flasher_get_security_info(uint8_t *out)
{
  esp_loader_target_security_info_t info;
  esp_loader_error_t err = esp_loader_get_security_info(&g_loader, &info);
  if (err != ESP_LOADER_SUCCESS) {
    return (int)err;
  }
  memset(out, 0, FLASHER_SECURITY_INFO_SIZE);
  memcpy(out + 0, &info.target_chip, 4);
  memcpy(out + 4, &info.eco_version, 4);
  out[8] = info.secure_boot_enabled ? 1 : 0;
  out[9] = info.secure_boot_aggressive_revoke_enabled ? 1 : 0;
  out[10] = info.secure_download_mode_enabled ? 1 : 0;
  out[11] = info.secure_boot_revoked_keys[0] ? 1 : 0;
  out[12] = info.secure_boot_revoked_keys[1] ? 1 : 0;
  out[13] = info.secure_boot_revoked_keys[2] ? 1 : 0;
  out[14] = info.jtag_software_disabled ? 1 : 0;
  out[15] = info.jtag_hardware_disabled ? 1 : 0;
  out[16] = info.usb_disabled ? 1 : 0;
  out[17] = info.flash_encryption_enabled ? 1 : 0;
  out[18] = info.dcache_in_uart_download_disabled ? 1 : 0;
  out[19] = info.icache_in_uart_download_disabled ? 1 : 0;
  return (int)ESP_LOADER_SUCCESS;
}

void flasher_reset_target(void)
{
  esp_loader_reset_target(&g_loader);
}
