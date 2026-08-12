import type { EspDevice } from "../wasm/bindings.js";
import { readRegister } from "../cmds/registers.js";

/**
 * Chip-info ROM helpers (description / features / crystal), ported from the
 * previous esptool-js targets layer and driven via WASM read_register.
 */
export abstract class ROM {
  abstract CHIP_NAME: string;
  abstract UART_CLKDIV_REG: number;
  abstract UART_CLKDIV_MASK: number;
  XTAL_CLK_DIVIDER = 1;

  protected async readReg(esp: EspDevice, address: number): Promise<number> {
    return readRegister(esp, address);
  }

  /**
   * Measure crystal frequency from UART clock divider (esptool algorithm).
   * @param esp
   * @param include48 Normalize to 48 MHz when estimate is high (ESP32-C5).
   */
  protected async measureCrystalFreq(esp: EspDevice, include48 = false): Promise<number> {
    const uartDiv = (await this.readReg(esp, this.UART_CLKDIV_REG)) & this.UART_CLKDIV_MASK;
    const etsXtal = (esp.transport.baudrate * uartDiv) / 1e6 / this.XTAL_CLK_DIVIDER;
    let normXtal: number;
    if (include48 && etsXtal > 45) {
      normXtal = 48;
    } else if (etsXtal > 33) {
      normXtal = 40;
    } else {
      normXtal = 26;
    }
    return normXtal;
  }

  abstract getChipDescription(esp: EspDevice): Promise<string>;
  abstract getChipFeatures(esp: EspDevice): Promise<string[]>;
  abstract getCrystalFreq(esp: EspDevice): Promise<number>;

  /**
   * Optional eFuse MAC read (used when flasher read_mac is unavailable, e.g. ESP8266).
   * @param esp
   */
  readMac?(esp: EspDevice): Promise<Uint8Array>;
}
