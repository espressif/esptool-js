import type { EspDevice } from "../wasm/bindings.js";
import { TargetChip } from "../wasm/bindings.js";
import { getTarget } from "./getTarget.js";
import { getSecurityInfo } from "./getSecurityInfo.js";
import { readMac } from "./readMac.js";
import { getRom } from "../targets/index.js";
import type { ROM } from "../targets/rom.js";

export interface ChipInfo {
  chip: TargetChip;
  chipName: string;
  description: string;
  features: string[];
  crystalMhz: number;
  mac: Uint8Array;
  secureDownloadMode?: boolean;
}

/** GET_SECURITY_INFO exists from ESP32-S2 onward. */
const CHIPS_WITHOUT_SECURITY_INFO: readonly TargetChip[] = [TargetChip.Esp8266, TargetChip.Esp32];
const chipInfoCache = new WeakMap<EspDevice, ChipInfo>();

function formatMac(mac: Uint8Array): string {
  return Array.from(mac)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(":");
}

/**
 * Format chip info like esptool.py's connect banner.
 * @param info
 */
export function formatChipInfo(info: ChipInfo): string {
  if (info.secureDownloadMode) {
    const lines = [`Chip is ${info.chipName} in Secure Download Mode`];
    if (info.mac.length === 6) {
      lines.push(`MAC: ${formatMac(info.mac)}`);
    }
    return lines.join("\n");
  }
  const lines = [`Chip is ${info.description}`];
  if (info.features.length > 0) {
    lines.push(`Features: ${info.features.join(", ")}`);
  }
  if (info.crystalMhz > 0) {
    lines.push(`Crystal is ${info.crystalMhz}MHz`);
  }
  if (info.mac.length === 6) {
    lines.push(`MAC: ${formatMac(info.mac)}`);
  }
  return lines.join("\n");
}

function recoverAfterReadFailure(esp: EspDevice, field: string): void {
  esp.transport.clearSerialBuffer();
  esp.module.__log?.(`[W] Unable to read chip ${field}; continuing with partial info`);
}

async function readChipMac(esp: EspDevice, rom: ROM, chip: TargetChip): Promise<Uint8Array> {
  // esp_loader_read_mac() rejects ESP8266, so only that target uses the
  // TypeScript eFuse implementation. Other targets use the native path once:
  // retrying the same READ_REG commands after a protocol error risks desync.
  if (chip === TargetChip.Esp8266) {
    return rom.readMac ? rom.readMac(esp) : new Uint8Array(0);
  }
  return readMac(esp);
}

/**
 * Read esptool-style chip description / features / crystal / MAC via register reads.
 *
 * Every step runs sequentially: the WASM flasher serializes commands over a
 * single serial link, and concurrent reads desync the target.
 * @param esp
 */
export async function getChipInfo(esp: EspDevice): Promise<ChipInfo> {
  const cached = chipInfoCache.get(esp);
  if (cached) {
    return cached;
  }
  if (esp.connectionMode === "stub") {
    throw new Error("Detailed chip info must be read in ROM mode before uploading the stub");
  }

  const chip = await getTarget(esp);
  const rom = getRom(chip);

  let secureDownloadMode = esp.connectionMode === "secure-download";
  if (!CHIPS_WITHOUT_SECURITY_INFO.includes(chip)) {
    try {
      const security = await getSecurityInfo(esp);
      secureDownloadMode = security.secureDownloadModeEnabled;
    } catch {
      // GET_SECURITY_INFO unsupported on some ROM versions.
    }
  }

  if (secureDownloadMode) {
    const info: ChipInfo = {
      chip,
      chipName: rom.CHIP_NAME,
      description: rom.CHIP_NAME,
      features: [],
      crystalMhz: 0,
      mac: new Uint8Array(0),
      secureDownloadMode: true,
    };
    chipInfoCache.set(esp, info);
    return info;
  }

  // Degrade field by field: a single unreadable eFuse should not drop the
  // whole banner (esptool behaves the same way in limited / SDM setups).
  let description = rom.CHIP_NAME;
  try {
    description = await rom.getChipDescription(esp);
  } catch {
    recoverAfterReadFailure(esp, "description");
  }

  let features: string[] = [];
  try {
    features = await rom.getChipFeatures(esp);
  } catch {
    recoverAfterReadFailure(esp, "features");
  }

  let crystalMhz = 0;
  try {
    crystalMhz = await rom.getCrystalFreq(esp);
  } catch {
    recoverAfterReadFailure(esp, "crystal frequency");
  }

  let mac: Uint8Array = new Uint8Array(0);
  try {
    mac = await readChipMac(esp, rom, chip);
  } catch {
    recoverAfterReadFailure(esp, "MAC");
  }

  const info: ChipInfo = {
    chip,
    chipName: rom.CHIP_NAME,
    description,
    features,
    crystalMhz,
    mac,
    secureDownloadMode: false,
  };
  chipInfoCache.set(esp, info);
  return info;
}
