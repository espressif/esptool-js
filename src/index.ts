export { Transport, SerialOptions, SerialSignals } from "./transport.js";
export { connectEsp, ConnectEspOptions } from "./cmds/connect.js";
export { detectFlashSize } from "./cmds/detectFlashSize.js";
export { writeFlash, WriteFlashOptions, FlashImage, FLASH_BLOCK_SIZE } from "./cmds/writeFlash.js";
export { eraseFlash, eraseRegion } from "./cmds/eraseFlash.js";
export { readFlash, ReadFlashOptions } from "./cmds/readFlash.js";
export { readMac } from "./cmds/readMac.js";
export { getTarget } from "./cmds/getTarget.js";
export { getSecurityInfo } from "./cmds/getSecurityInfo.js";
export { readRegister, writeRegister } from "./cmds/registers.js";
export { loadRam, LoadRamOptions } from "./cmds/loadRam.js";
export { resetChip } from "./cmds/resetChip.js";
export { verifyFlash } from "./cmds/verifyFlash.js";
export {
  EspDevice,
  EspFlasherModule,
  FlasherBindings,
  FlasherError,
  EspLoaderError,
  TargetChip,
  SecurityInfo,
  SECURITY_INFO_SIZE,
  createBindings,
  checkResult,
  decodeSecurityInfo,
  flasherConnect,
  flasherConnectRom,
  flasherConnectSecureDownload,
  flasherDeinit,
  flasherGetTarget,
  flasherChangeBaudrate,
  flasherFlashDetectSize,
  flasherFlashStart,
  flasherFlashWrite,
  flasherFlashFinish,
  flasherFlashDeflateStart,
  flasherFlashDeflateWrite,
  flasherFlashDeflateFinish,
  flasherFlashErase,
  flasherFlashEraseRegion,
  flasherFlashRead,
  flasherFlashVerifyKnownMd5,
  flasherMemStart,
  flasherMemWrite,
  flasherMemFinish,
  flasherReadMac,
  flasherWriteRegister,
  flasherReadRegister,
  flasherGetSecurityInfo,
  flasherResetTarget,
  LogFn,
} from "./wasm/bindings.js";
export {
  loadWasmModule,
  bindTransport,
  defaultWasmUrl,
  LoadWasmOptions,
  CreateEspFlasherModule,
  resetWasmModuleCache,
} from "./wasm/loader.js";
