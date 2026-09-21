/** ROM security-info flag bits (same mapping across targets). */
export const SECURITY_INFO_FLAG_MAP = {
  SECURE_BOOT_EN: 1 << 0,
  SECURE_BOOT_AGGRESSIVE_REVOKE: 1 << 1,
  SECURE_DOWNLOAD_ENABLE: 1 << 2,
  SECURE_BOOT_KEY_REVOKE0: 1 << 3,
  SECURE_BOOT_KEY_REVOKE1: 1 << 4,
  SECURE_BOOT_KEY_REVOKE2: 1 << 5,
  SOFT_DIS_JTAG: 1 << 6,
  HARD_DIS_JTAG: 1 << 7,
  DIS_USB: 1 << 8,
  DIS_DOWNLOAD_DCACHE: 1 << 9,
  DIS_DOWNLOAD_ICACHE: 1 << 10,
} as const;

export type SecurityInfoFlagName = keyof typeof SECURITY_INFO_FLAG_MAP;

export type ParsedSecurityFlags = Record<SecurityInfoFlagName, boolean>;

/**
 * Parsed GET_SECURITY_INFO (0x14) response.
 * ESP32-S2 omits chipId and apiVersion (12-byte payload).
 */
export interface SecurityInfo {
  flags: number;
  flashCryptCnt: number;
  keyPurposes: number[];
  chipId: number | null;
  apiVersion: number | null;
  parsedFlags: ParsedSecurityFlags;
}

/**
 * Parse GET_SECURITY_INFO flag bits into named booleans.
 * @param {number} flagsValue Raw flags word from the ROM response
 * @returns {ParsedSecurityFlags} Individual flag status
 */
export function parseSecurityFlags(flagsValue: number): ParsedSecurityFlags {
  const parsedFlags = {} as ParsedSecurityFlags;
  for (const flagName of Object.keys(SECURITY_INFO_FLAG_MAP) as SecurityInfoFlagName[]) {
    parsedFlags[flagName] = (flagsValue & SECURITY_INFO_FLAG_MAP[flagName]) !== 0;
  }
  return parsedFlags;
}
