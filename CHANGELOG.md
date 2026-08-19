# Changelog

## Unreleased

### Breaking

- `detectFlashSize()` now returns `undefined` when the SPI flash ID cannot be read or mapped, instead of silently defaulting to `"4MB"`. TypeScript callers must handle `undefined`; JavaScript callers no longer always receive a string.

### Fixed

- `writeFlash({ flashSize: "detect" })` resolves the flash size (via `detectFlashSize()`) before the bounds check, so `"detect"` is no longer treated as size `-1` ([#254](https://github.com/espressif/esptool-js/issues/254)). Detection runs for every file in the write, not only a boot image at `BOOTLOADER_FLASH_OFFSET`.
- ESP32-C6, C5, C61, and H2 use `SPI_REG_BASE = 0x60003000`, matching esptool. Flash ID reads on those chips no longer return `0` ([#217](https://github.com/espressif/esptool-js/issues/217)).

## [v0.6.1](https://github.com/espressif/esptool-js/releases/tag/v0.6.1) - 2026-08-06

### Bug Fixes

- [Add retries to FLASH_DATA and FLASH_DEFL_DATA](https://github.com/espressif/esptool-js/pull/245) Thanks @drakosha !
- [Fix uncompressed data in writeFlash](https://github.com/espressif/esptool-js/pull/244) Thanks @drakosha !
- [Avoid TypeError when debug short FlashDeflBLock payload](https://github.com/espressif/esptool-js/pull/247) Thanks @GHL-KL !
- [Improve connection reliability and reader cleanup](https://github.com/espressif/esptool-js/pull/249) Thanks @RushikeshPatange !

## [v0.6.0](https://github.com/espressif/esptool-js/releases/tag/v0.6.0) - 2026-03-26

### Features

- [Update documentation](https://github.com/espressif/esptool-js/pull/235)
- [Update read logic now use read loop instead of generator logic](https://github.com/espressif/esptool-js/pull/228)
- [Use Uint8Array instead of string for write flash](https://github.com/espressif/esptool-js/pull/226) **This break functionality in writeFlash function**
- [Allow custom reset in after function](https://github.com/espressif/esptool-js/pull/211)
- [Add onDeviceLostCallback to recover lost device](https://github.com/espressif/esptool-js/pull/212)
- [SPI flash cmd flash size detection](https://github.com/espressif/esptool-js/pull/191)

### Bug Fixes

- [Update npm publish action](https://github.com/espressif/esptool-js/pull/240)
- [fix example console, update raw read](https://github.com/espressif/esptool-js/pull/237)
- [Update esp32c5 stubs](https://github.com/espressif/esptool-js/pull/232)
- [Avoid tracing in Transport when tracing is false](https://github.com/espressif/esptool-js/pull/221) Thanks @daveallie !
- [Fix being unable to flash certain C5 chips](https://github.com/espressif/esptool-js/pull/223) Thanks @jaylikesbunda !
- [Fix ESP32C5 chip can not use usb](https://github.com/espressif/esptool-js/pull/209) Thanks @AZKKXL !

## [v0.5.7](https://github.com/espressif/esptool-js/releases/tag/v0.5.7) - 2025-08-04

### Bug Fixes

- [Fix esp32c3 chip description](https://github.com/espressif/esptool-js/pull/205)

## [v0.5.6](https://github.com/espressif/esptool-js/releases/tag/v0.5.6) - 2025-06-16

### Bug Fixes

- [Add ESP32H2 missing magic and fix chip description](https://github.com/espressif/esptool-js/pull/203)

## [v0.5.5](https://github.com/espressif/esptool-js/releases/tag/v0.5.5) - 2025-05-28

### Features

- [Add esp32c5 devkit image](https://github.com/espressif/esptool-js/pull/200) Thanks @jaylikesbunda !
- [Make example commands cross platform](https://github.com/espressif/esptool-js/pull/189)
- [Add esp32c2 rev2 magic](https://github.com/espressif/esptool-js/pull/196)

### Bug Fixes

- [Remove wrong baud rate given for connection](https://github.com/espressif/esptool-js/pull/183) Thanks @archef2000 !
- [Fix api doc generation](https://github.com/espressif/esptool-js/pull/187) Thanks @RushikeshPatange
- [Fix detecting flag in connect function](https://github.com/espressif/esptool-js/pull/185) Thanks @adzierzanowski !
- [Fix broken license link](https://github.com/espressif/esptool-js/pull/138) Thanks @HSBL-ko-gyo

## [v0.5.4](https://github.com/espressif/esptool-js/releases/tag/v0.5.4) - 2025-01-14

### Features

- [Add before after reset modes](https://github.com/espressif/esptool-js/pull/146)

### Bug Fixes

- [Fix disconnect buttons being shown in live demo when connection fails](https://github.com/espressif/esptool-js/pull/176)
- [Add esp32 C61 eco 2 magic number](https://github.com/espressif/esptool-js/pull/180)

## [v0.5.3](https://github.com/espressif/esptool-js/releases/tag/v0.5.3) - 2024-12-20

### Bug Fixes

- [Use padTo function](https://github.com/espressif/esptool-js/pull/166)
- [Fix json rollup named exports](https://github.com/espressif/esptool-js/pull/168)

## [v0.5.2](https://github.com/espressif/esptool-js/releases/tag/v0.5.2) - 2024-12-10

### Bug Fixes

- [update web serial read slip](https://github.com/espressif/esptool-js/pull/160)

## [v0.4.7](https://github.com/espressif/esptool-js/releases/tag/v0.4.7) - 2024-10-23

### Bug Fixes

- [Add ESP32 C5 eco1 magic number](https://github.com/espressif/esptool-js/pull/157)

### Features

- [Add ESP32 C61 support](https://github.com/espressif/esptool-js/pull/158)

## [v0.4.6](https://github.com/espressif/esptool-js/releases/tag/v0.4.6) - 2024-10-10

### Features

- [Add chip missing features](https://github.com/espressif/esptool-js/pull/154)
- [Add ESP32-C5 support](https://github.com/espressif/esptool-js/pull/155)

## [v0.4.5](https://github.com/espressif/esptool-js/releases/tag/v0.4.5) - 2024-07-18

### Bug Fixes

- [Remove chip magic log message, fix atob bundle reference](https://github.com/espressif/esptool-js/pull/148)

## [v0.4.4](https://github.com/espressif/esptool-js/releases/tag/v0.4.4) - 2024-07-18

### Features

- [Add ESP32-P4 Stub and flash support](https://github.com/espressif/esptool-js/pull/147)

## [v0.4.3](https://github.com/espressif/esptool-js/releases/tag/v0.4.3) - 2024-06-18

### Bug Fixes

- [Remove type module](https://github.com/espressif/esptool-js/commit/d48fe9ccd1e682e45ffcac5cc8c1e57c7aaf41fa)

## [v0.4.2](https://github.com/espressif/esptool-js/releases/tag/v0.4.2) - 2024-06-17

### Features

- [add esp32c2 baud rate option](https://github.com/espressif/esptool-js/pull/131)
- [Use atob lite npm package instead of buffer window atob](https://github.com/espressif/esptool-js/pull/134)
- [Stub already running detection](https://github.com/espressif/esptool-js/pull/136) Thanks @pkendall64

### Bug Fixes

- [Mark enableTracing as optional](https://github.com/espressif/esptool-js/pull/129) Thanks @balloob
- [Add js extensions use window atob](https://github.com/espressif/esptool-js/pull/132)
- [Example fix import buffer](https://github.com/espressif/esptool-js/pull/133)
- [Support chrome on android web serial polyfill](https://github.com/espressif/esptool-js/pull/144)

## [v0.4.1](https://github.com/espressif/esptool-js/releases/tag/v0.4.1) - 2024-01-31

### Bug Fixes

- Update buffer reference https://github.com/espressif/esptool-js/pull/127
- Add PR comment workflow and test instructions https://github.com/espressif/esptool-js/pull/128

## [v0.4.0](https://github.com/espressif/esptool-js/releases/tag/v0.4.0) - 2024-01-29

### Features

- [Add support for ESP32-C2](https://github.com/espressif/esptool-js/pull/126)
- [Add tracing support](https://github.com/espressif/esptool-js/pull/107)
- [initial JSDoc API Documentation](https://github.com/espressif/esptool-js/pull/108)

### Bug Fixes

- [Fix bootloader data](https://github.com/espressif/esptool-js/pull/121)

## [v0.3.2](https://github.com/espressif/esptool-js/releases/tag/v0.3.2) - 2023-11-02

### Features

- Add serial options for SerialPort class https://github.com/espressif/esptool-js/pull/115

### Bug Fixes

- Fix port as loaderOptions optional parameter. https://github.com/espressif/esptool-js/pull/116

## [v0.3.1](https://github.com/espressif/esptool-js/releases/tag/v0.3.1) - 2023-10-15

### Bug Fixes

- Fix example offset data with https://github.com/espressif/esptool-js/pull/106
- Baud rate fixes and port as loaderOptions https://github.com/espressif/esptool-js/pull/112 Thanks @g3gg0 !

## [v0.3.0](https://github.com/espressif/esptool-js/releases/tag/v0.3.0) - 2023-06-30

### Features

- [Add ESP32 H2 Target](https://github.com/espressif/esptool-js/pull/102)
- [Separate reset function and add reset modes](https://github.com/espressif/esptool-js/pull/100)
- [Refactor Loader and Flasher Options](https://github.com/espressif/esptool-js/pull/101)
- [Refactor example code](https://github.com/espressif/esptool-js/pull/85)

## [v0.2.2](https://github.com/espressif/esptool-js/releases/tag/v0.2.2) - 2023-06-05

### Bug Fixes

- [update stubs from esptool.py v4.6.1](https://github.com/espressif/esptool-js/pull/98)

## [v0.2.1](https://github.com/espressif/esptool-js/releases/tag/v0.2.1) - 2023-02-28

### Features

- [Typescript rewrite](https://github.com/espressif/esptool-js/pull/53) @brianignacio5
- [Deploy GitHub pages workflow](https://github.com/espressif/esptool-js/pull/55)
- [Separate Debug and info console logging](https://github.com/espressif/esptool-js/pull/68)
- [Add dev container](https://github.com/espressif/esptool-js/pull/84) @igrr
- [Only change baud rate if ROM and STUB are different](https://github.com/espressif/esptool-js/pull/81) Thanks @balloob !
- [Enable strict mode](https://github.com/espressif/esptool-js/pull/71)
- [Re enable block timeout calculation](https://github.com/espressif/esptool-js/pull/83)

### Bug Fixes

- [Fix connecting timeout error](https://github.com/espressif/esptool-js/pull/62)
- [Support built-in USB JTAG Serial](https://github.com/espressif/esptool-js/pull/54)
- [[use stub JSON files from esptool.py v4.5.dev1-2-g32e801484](https://github.com/espressif/esptool-js/pull/65)
- [Clean unused imports](https://github.com/espressif/esptool-js/pull/69) Thanks @balloob !
- [Fix rollup script in ci workflow](https://github.com/espressif/esptool-js/pull/72)
- [Remove unused package json dependencies](https://github.com/espressif/esptool-js/pull/74)
- [Terminal is optional](https://github.com/espressif/esptool-js/pull/75) Thanks @balloob !

## [v0.2.0](https://github.com/espressif/esptool-js/releases/tag/v0.2.0) - 2023-01-18

### Features

- [UX Changes](https://github.com/espressif/esptool-js/pull/4)

### Bug Fixes

- [UI fixes](https://github.com/espressif/esptool-js/pull/33) Thanks @balloob
- [Esp32 c3 invalid magic byte](https://github.com/espressif/esptool-js/pull/50) Thanks @LeoYan

Many other bug fixes and features before release tracking before this release.
