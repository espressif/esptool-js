cmake_minimum_required(VERSION 3.22)
project(esp_flasher_wasm C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# esp-serial-flasher: user-defined port (implemented in wasm_port.c)
set(PORT USER_DEFINED)

add_subdirectory(esp-serial-flasher)

add_executable(esp_flasher wasm_port.c)

target_include_directories(esp_flasher PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}
  ${CMAKE_CURRENT_SOURCE_DIR}/esp-serial-flasher/include
)

target_link_libraries(esp_flasher PRIVATE flasher)

set(EXPORTED_FUNCTIONS
  ["_flasher_connect","_flasher_connect_rom","_flasher_connect_secure_download","_flasher_deinit","_flasher_get_target","_flasher_change_baudrate","_flasher_flash_detect_size","_flasher_flash_start","_flasher_flash_write","_flasher_flash_finish","_flasher_flash_deflate_start","_flasher_flash_deflate_write","_flasher_flash_deflate_finish","_flasher_flash_erase","_flasher_flash_erase_region","_flasher_flash_read","_flasher_flash_verify_known_md5","_flasher_mem_start","_flasher_mem_write","_flasher_mem_finish","_flasher_read_mac","_flasher_write_register","_flasher_read_register","_flasher_get_security_info","_flasher_reset_target","_malloc","_free"]
)

set(EXPORTED_RUNTIME_METHODS
  ["cwrap","getValue","setValue","HEAP8","HEAPU8","UTF8ToString"]
)

target_link_options(esp_flasher PRIVATE
  "-sWASM=1"
  "-sMODULARIZE=1"
  "-sEXPORT_ES6=1"
  "-sEXPORT_NAME=createEspFlasherModule"
  "-sEXPORTED_FUNCTIONS=${EXPORTED_FUNCTIONS}"
  "-sEXPORTED_RUNTIME_METHODS=${EXPORTED_RUNTIME_METHODS}"
  "-sALLOW_MEMORY_GROWTH=1"
  "-sASYNCIFY"
  "-sENVIRONMENT=web"
)

set_target_properties(esp_flasher PROPERTIES SUFFIX ".js")
