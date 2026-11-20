
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire477f"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire477f"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("3yBgx", function(module, exports) {
module.exports = import("28MH8").then(()=>parcelRequire('lLtNJ'));

});

parcelRegister("1G7Bv", function(module, exports) {
module.exports = import("1tunb").then(()=>parcelRequire('3vOXC'));

});

parcelRegister("1PmWo", function(module, exports) {
module.exports = import("5WZO1").then(()=>parcelRequire('dr18w'));

});

parcelRegister("gtAlv", function(module, exports) {
module.exports = import("5YTAN").then(()=>parcelRequire('797Lz'));

});

parcelRegister("bdgYL", function(module, exports) {
module.exports = import("9C8bG").then(()=>parcelRequire('gnJWm'));

});

parcelRegister("1MmTl", function(module, exports) {
module.exports = import("9EvmU").then(()=>parcelRequire('1cSiP'));

});

parcelRegister("lYxc5", function(module, exports) {
module.exports = import("7gQrl").then(()=>parcelRequire('5mU0N'));

});

parcelRegister("1XdOD", function(module, exports) {
module.exports = import("kLVoC").then(()=>parcelRequire('4Fwwq'));

});

parcelRegister("cTg0S", function(module, exports) {
module.exports = import("UDKwo").then(()=>parcelRequire('5QJKF'));

});

parcelRegister("d52g0", function(module, exports) {
module.exports = import("dX0nK").then(()=>parcelRequire('fcvYh'));

});

parcelRegister("6lRzd", function(module, exports) {
module.exports = import("1lHcO").then(()=>parcelRequire('53ydt'));

});

parcelRegister("cteFO", function(module, exports) {
module.exports = import("gj5uo").then(()=>parcelRequire('fcPSl'));

});

parcelRegister("4kuQ6", function(module, exports) {
module.exports = import("TNSXY").then(()=>parcelRequire('7fbjk'));

});

parcelRegister("frscf", function(module, exports) {
module.exports = import("jsDcX").then(()=>parcelRequire('5ry10'));

});

parcelRegister("6fpwM", function(module, exports) {

$parcel$export(module.exports, "ESP8266ROM", () => $48c7f21169d49005$export$b7173f2d596cb720);

var $3KHBw = parcelRequire("3KHBw");
class $48c7f21169d49005$export$b7173f2d596cb720 extends (0, $3KHBw.ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP8266";
        this.USES_MAGIC_VALUE = true;
        this.CHIP_DETECT_MAGIC_VALUE = [
            0xfff0c101
        ];
        this.EFUSE_RD_REG_BASE = 0x3ff00050;
        this.UART_CLKDIV_REG = 0x60000014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.XTAL_CLK_DIVIDER = 2;
        this.FLASH_WRITE_SIZE = 0x4000;
        // NOT IMPLEMENTED, SETTING EMPTY VALUE
        this.BOOTLOADER_FLASH_OFFSET = 0;
        this.UART_DATE_REG_ADDR = 0;
        this.FLASH_SIZES = {
            "512KB": 0x00,
            "256KB": 0x10,
            "1MB": 0x20,
            "2MB": 0x30,
            "4MB": 0x40,
            "2MB-c1": 0x50,
            "4MB-c1": 0x60,
            "8MB": 0x80,
            "16MB": 0x90
        };
        this.FLASH_FREQUENCY = {
            "80m": 0xf,
            "40m": 0x0,
            "26m": 0x1,
            "20m": 0x2
        };
        this.MEMORY_MAP = [
            [
                0x3ff00000,
                0x3ff00010,
                "DPORT"
            ],
            [
                0x3ffe8000,
                0x40000000,
                "DRAM"
            ],
            [
                0x40100000,
                0x40108000,
                "IRAM"
            ],
            [
                0x40201010,
                0x402e1010,
                "IROM"
            ]
        ];
        this.SPI_REG_BASE = 0x60000200;
        this.SPI_USR_OFFS = 0x1c;
        this.SPI_USR1_OFFS = 0x20;
        this.SPI_USR2_OFFS = 0x24;
        this.SPI_MOSI_DLEN_OFFS = 0; // not in esp8266
        this.SPI_MISO_DLEN_OFFS = 0; // not in esp8266
        this.SPI_W0_OFFS = 0x40;
        this.getChipFeatures = async (loader)=>{
            const features = [
                "WiFi"
            ];
            if (await this.getChipDescription(loader) == "ESP8285") features.push("Embedded Flash");
            return features;
        };
    }
    async readEfuse(loader, offset) {
        const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
        loader.debug("Read efuse " + addr);
        return await loader.readReg(addr);
    }
    async getChipDescription(loader) {
        const efuse3 = await this.readEfuse(loader, 2);
        const efuse0 = await this.readEfuse(loader, 0);
        const is8285 = (efuse0 & 16 | efuse3 & 65536) != 0; // One or the other efuse bit is set for ESP8285
        return is8285 ? "ESP8285" : "ESP8266EX";
    }
    async getCrystalFreq(loader) {
        const uartDiv = await loader.readReg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK;
        const etsXtal = loader.transport.baudrate * uartDiv / 1000000 / this.XTAL_CLK_DIVIDER;
        let normXtal;
        if (etsXtal > 33) normXtal = 40;
        else normXtal = 26;
        if (Math.abs(normXtal - etsXtal) > 1) loader.info("WARNING: Detected crystal freq " + etsXtal + "MHz is quite different to normalized freq " + normXtal + "MHz. Unsupported crystal in use?");
        return normXtal;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await this.readEfuse(loader, 0);
        mac0 = mac0 >>> 0;
        let mac1 = await this.readEfuse(loader, 1);
        mac1 = mac1 >>> 0;
        let mac3 = await this.readEfuse(loader, 3);
        mac3 = mac3 >>> 0;
        const mac = new Uint8Array(6);
        if (mac3 != 0) {
            mac[0] = mac3 >> 16 & 0xff;
            mac[1] = mac3 >> 8 & 0xff;
            mac[2] = mac3 & 0xff;
        } else if ((mac1 >> 16 & 0xff) == 0) {
            mac[0] = 0x18;
            mac[1] = 0xfe;
            mac[2] = 0x34;
        } else if ((mac1 >> 16 & 0xff) == 1) {
            mac[0] = 0xac;
            mac[1] = 0xd0;
            mac[2] = 0x74;
        } else loader.error("Unknown OUI");
        mac[3] = mac1 >> 8 & 0xff;
        mac[4] = mac1 & 0xff;
        mac[5] = mac0 >> 24 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}
$48c7f21169d49005$export$b7173f2d596cb720.IROM_MAP_START = 0x40200000;
$48c7f21169d49005$export$b7173f2d596cb720.IROM_MAP_END = 0x40300000;

});
parcelRegister("3KHBw", function(module, exports) {

$parcel$export(module.exports, "ROM", () => $2bb77dda76009c14$export$c643cc54d6326a6f);
/**
 * Represents a chip ROM with basic registers field and abstract functions.
 */ class $2bb77dda76009c14$export$c643cc54d6326a6f {
    constructor(){
        this.FLASH_SIZES = {
            "1MB": 0x00,
            "2MB": 0x10,
            "4MB": 0x20,
            "8MB": 0x30,
            "16MB": 0x40,
            "32MB": 0x50,
            "64MB": 0x60,
            "128MB": 0x70
        };
        this.FLASH_FREQUENCY = {
            "80m": 0xf,
            "40m": 0x0,
            "26m": 0x1,
            "20m": 0x2
        };
        /**
         * True when chip type is identified from the magic register, not GET_SECURITY_INFO chip-id.
         * ESP8266/ESP32 do not support the command; ESP32-S2 supports it but omits chip-id.
         */ this.USES_MAGIC_VALUE = false;
    }
    /**
     * Get the chip erase size.
     * @param {number} offset - Offset to start erase.
     * @param {number} size - Size to erase.
     * @returns {number} The erase size of the chip as number.
     */ getEraseSize(offset, size) {
        return size;
    }
}

});


parcelRegister("jDde6", function(module, exports) {

$parcel$export(module.exports, "ESP32ROM", () => $e4abeb5bcdcc88f9$export$e09e2fba47679cf2);

var $3KHBw = parcelRequire("3KHBw");
class $e4abeb5bcdcc88f9$export$e09e2fba47679cf2 extends (0, $3KHBw.ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32";
        this.IMAGE_CHIP_ID = 0;
        this.USES_MAGIC_VALUE = true;
        this.EFUSE_RD_REG_BASE = 0x3ff5a000;
        this.DR_REG_SYSCON_BASE = 0x3ff66000;
        this.UART_CLKDIV_REG = 0x3ff40014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x60000078;
        this.XTAL_CLK_DIVIDER = 1;
        this.IROM_MAP_START = 0x400d0000;
        this.IROM_MAP_END = 0x40400000;
        this.DROM_MAP_START = 0x3f400000;
        this.DROM_MAP_END = 0x3f800000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3f400000,
                0x3f800000,
                "DROM"
            ],
            [
                0x3f800000,
                0x3fc00000,
                "EXTRAM_DATA"
            ],
            [
                0x3ff80000,
                0x3ff82000,
                "RTC_DRAM"
            ],
            [
                0x3ff90000,
                0x40000000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x3ffae000,
                0x40000000,
                "DRAM"
            ],
            [
                0x3ffe0000,
                0x3ffffffc,
                "DIRAM_DRAM"
            ],
            [
                0x40000000,
                0x40070000,
                "IROM"
            ],
            [
                0x40070000,
                0x40078000,
                "CACHE_PRO"
            ],
            [
                0x40078000,
                0x40080000,
                "CACHE_APP"
            ],
            [
                0x40080000,
                0x400a0000,
                "IRAM"
            ],
            [
                0x400a0000,
                0x400bfffc,
                "DIRAM_IRAM"
            ],
            [
                0x400c0000,
                0x400c2000,
                "RTC_IRAM"
            ],
            [
                0x400d0000,
                0x40400000,
                "IROM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_DATA"
            ]
        ];
        this.FLASH_SIZES = {
            "1MB": 0x00,
            "2MB": 0x10,
            "4MB": 0x20,
            "8MB": 0x30,
            "16MB": 0x40,
            "32MB": 0x50,
            "64MB": 0x60,
            "128MB": 0x70
        };
        this.FLASH_FREQUENCY = {
            "80m": 0xf,
            "40m": 0x0,
            "26m": 0x1,
            "20m": 0x2
        };
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0x1000;
        this.SPI_REG_BASE = 0x3ff42000;
        this.SPI_USR_OFFS = 0x1c;
        this.SPI_USR1_OFFS = 0x20;
        this.SPI_USR2_OFFS = 0x24;
        this.SPI_W0_OFFS = 0x80;
        this.SPI_MOSI_DLEN_OFFS = 0x28;
        this.SPI_MISO_DLEN_OFFS = 0x2c;
    }
    async readEfuse(loader, offset) {
        const addr = this.EFUSE_RD_REG_BASE + 4 * offset;
        loader.debug("Read efuse " + addr);
        return await loader.readReg(addr);
    }
    async getPkgVersion(loader) {
        const word3 = await this.readEfuse(loader, 3);
        let pkgVersion = word3 >> 9 & 0x07;
        pkgVersion += (word3 >> 2 & 0x1) << 3;
        return pkgVersion;
    }
    async getChipRevision(loader) {
        const word3 = await this.readEfuse(loader, 3);
        const word5 = await this.readEfuse(loader, 5);
        const apbCtlDate = await loader.readReg(this.DR_REG_SYSCON_BASE + 0x7c);
        const revBit0 = word3 >> 15 & 0x1;
        const revBit1 = word5 >> 20 & 0x1;
        const revBit2 = apbCtlDate >> 31 & 0x1;
        if (revBit0 != 0) {
            if (revBit1 != 0) {
                if (revBit2 != 0) return 3;
                else return 2;
            } else return 1;
        }
        return 0;
    }
    async getChipDescription(loader) {
        const chipDesc = [
            "ESP32-D0WDQ6",
            "ESP32-D0WD",
            "ESP32-D2WD",
            "",
            "ESP32-U4WDH",
            "ESP32-PICO-D4",
            "ESP32-PICO-V3-02"
        ];
        let chipName = "";
        const pkgVersion = await this.getPkgVersion(loader);
        const chipRevision = await this.getChipRevision(loader);
        const rev3 = chipRevision == 3;
        const single_core = await this.readEfuse(loader, 3) & 1;
        if (single_core != 0) {
            chipDesc[0] = "ESP32-S0WDQ6";
            chipDesc[1] = "ESP32-S0WD";
        }
        if (rev3) chipDesc[5] = "ESP32-PICO-V3";
        if (pkgVersion >= 0 && pkgVersion <= 6) chipName = chipDesc[pkgVersion];
        else chipName = "Unknown ESP32";
        if (rev3 && (pkgVersion === 0 || pkgVersion === 1)) chipName += "-V3";
        return chipName + " (revision " + chipRevision + ")";
    }
    async getChipFeatures(loader) {
        const features = [
            "Wi-Fi"
        ];
        const word3 = await this.readEfuse(loader, 3);
        const chipVerDisBt = word3 & 2;
        if (chipVerDisBt === 0) features.push(" BT");
        const chipVerDisAppCpu = word3 & 1;
        if (chipVerDisAppCpu !== 0) features.push(" Single Core");
        else features.push(" Dual Core");
        const chipCpuFreqRated = word3 & 8192;
        if (chipCpuFreqRated !== 0) {
            const chipCpuFreqLow = word3 & 4096;
            if (chipCpuFreqLow !== 0) features.push(" 160MHz");
            else features.push(" 240MHz");
        }
        const pkgVersion = await this.getPkgVersion(loader);
        if ([
            2,
            4,
            5,
            6
        ].indexOf(pkgVersion) !== -1) features.push(" Embedded Flash");
        if (pkgVersion === 6) features.push(" Embedded PSRAM");
        const word4 = await this.readEfuse(loader, 4);
        const adcVref = word4 >> 8 & 0x1f;
        if (adcVref !== 0) features.push(" VRef calibration in efuse");
        const blk3PartRes = word3 >> 14 & 0x1;
        if (blk3PartRes !== 0) features.push(" BLK3 partially reserved");
        const word6 = await this.readEfuse(loader, 6);
        const codingScheme = word6 & 0x3;
        const codingSchemeArr = [
            "None",
            "3/4",
            "Repeat (UNSUPPORTED)",
            "Invalid"
        ];
        features.push(" Coding Scheme " + codingSchemeArr[codingScheme]);
        return features;
    }
    async getCrystalFreq(loader) {
        const uartDiv = await loader.readReg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK;
        const etsXtal = loader.transport.baudrate * uartDiv / 1000000 / this.XTAL_CLK_DIVIDER;
        let normXtal;
        if (etsXtal > 33) normXtal = 40;
        else normXtal = 26;
        if (Math.abs(normXtal - etsXtal) > 1) loader.info("WARNING: Unsupported crystal in use");
        return normXtal;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await this.readEfuse(loader, 1);
        mac0 = mac0 >>> 0;
        let mac1 = await this.readEfuse(loader, 2);
        mac1 = mac1 >>> 0;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
}

});

parcelRegister("7WxGE", function(module, exports) {

$parcel$export(module.exports, "ESP32C2ROM", () => $5c8814b0874d28a0$export$8ad31a2aa21b3abf);

var $5CcEa = parcelRequire("5CcEa");
class $5c8814b0874d28a0$export$8ad31a2aa21b3abf extends (0, $5CcEa.ESP32C3ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C2";
        this.IMAGE_CHIP_ID = 12;
        this.EFUSE_BASE = 0x60008800;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x040;
        this.UART_CLKDIV_REG = 0x60000014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x6000007c;
        this.XTAL_CLK_DIVIDER = 1;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0;
        this.SPI_REG_BASE = 0x60002000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42400000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3c000000,
                0x3c400000,
                "DROM"
            ],
            [
                0x3fca0000,
                0x3fce0000,
                "DRAM"
            ],
            [
                0x3fc88000,
                0x3fd00000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x3ff00000,
                0x3ff50000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x40090000,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x42400000,
                "IROM"
            ],
            [
                0x4037c000,
                0x403c0000,
                "IRAM"
            ]
        ];
    }
    async getPkgVersion(loader) {
        const numWord = 1;
        const block1Addr = this.EFUSE_BASE + 0x040;
        const addr = block1Addr + 4 * numWord;
        const word3 = await loader.readReg(addr);
        const pkgVersion = word3 >> 22 & 0x07;
        return pkgVersion;
    }
    async getChipRevision(loader) {
        const block1Addr = this.EFUSE_BASE + 0x040;
        const numWord = 1;
        const pos = 20;
        const addr = block1Addr + 4 * numWord;
        const ret = (await loader.readReg(addr) & 0x03 << pos) >> pos;
        return ret;
    }
    async getChipDescription(loader) {
        let desc;
        const pkgVer = await this.getPkgVersion(loader);
        if (pkgVer === 0 || pkgVer === 1) desc = "ESP32-C2";
        else desc = "unknown ESP32-C2";
        const chip_rev = await this.getChipRevision(loader);
        desc += " (revision " + chip_rev + ")";
        return desc;
    }
    async getChipFeatures(loader) {
        return [
            "Wi-Fi",
            "BLE"
        ];
    }
    async getCrystalFreq(loader) {
        const uartDiv = await loader.readReg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK;
        const etsXtal = loader.transport.baudrate * uartDiv / 1000000 / this.XTAL_CLK_DIVIDER;
        let normXtal;
        if (etsXtal > 33) normXtal = 40;
        else normXtal = 26;
        if (Math.abs(normXtal - etsXtal) > 1) loader.info("WARNING: Unsupported crystal in use");
        return normXtal;
    }
    async changeBaudRate(loader) {
        const rom_with_26M_XTAL = await this.getCrystalFreq(loader);
        if (rom_with_26M_XTAL === 26) loader.changeBaud();
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}

});
parcelRegister("5CcEa", function(module, exports) {

$parcel$export(module.exports, "ESP32C3ROM", () => $416a4fc550af044e$export$d17dfcbab3a5ba52);

var $jDde6 = parcelRequire("jDde6");
class $416a4fc550af044e$export$d17dfcbab3a5ba52 extends (0, $jDde6.ESP32ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C3";
        this.IMAGE_CHIP_ID = 5;
        this.USES_MAGIC_VALUE = false;
        this.EFUSE_BASE = 0x60008800;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.UART_CLKDIV_REG = 0x3ff40014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x6000007c;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0;
        this.SPI_REG_BASE = 0x60002000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42800000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3c000000,
                0x3c800000,
                "DROM"
            ],
            [
                0x3fc80000,
                0x3fce0000,
                "DRAM"
            ],
            [
                0x3fc88000,
                0x3fd00000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x3ff00000,
                0x3ff20000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x40060000,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x42800000,
                "IROM"
            ],
            [
                0x4037c000,
                0x403e0000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
    }
    async getPkgVersion(loader) {
        const numWord = 3;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const word3 = await loader.readReg(addr);
        const pkgVersion = word3 >> 21 & 0x07;
        return pkgVersion;
    }
    async getChipRevision(loader) {
        const block1Addr = this.EFUSE_BASE + 0x044;
        const numWord = 3;
        const pos = 18;
        const addr = block1Addr + 4 * numWord;
        const ret = (await loader.readReg(addr) & 0x7 << pos) >> pos;
        return ret;
    }
    async getMinorChipVersion(loader) {
        const hiNumWord = 5;
        const hiAddr = this.EFUSE_BASE + 0x044 + 4 * hiNumWord;
        const hi = await loader.readReg(hiAddr) >> 23 & 0x01;
        const lowNumWord = 3;
        const lowAddr = this.EFUSE_BASE + 0x044 + 4 * lowNumWord;
        const low = await loader.readReg(lowAddr) >> 18 & 0x07;
        return (hi << 3) + low;
    }
    async getMajorChipVersion(loader) {
        const numWord = 5;
        const addr = this.EFUSE_BASE + 0x044 + 4 * numWord;
        return await loader.readReg(addr) >> 24 & 0x03;
    }
    async getChipDescription(loader) {
        const chipDesc = {
            0: "ESP32-C3 (QFN32)",
            1: "ESP8685 (QFN28)",
            2: "ESP32-C3 AZ (QFN32)",
            3: "ESP8686 (QFN24)"
        };
        const chipIndex = await this.getPkgVersion(loader);
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${chipDesc[chipIndex] || "Unknown ESP32-C3"} (revision v${majorRev}.${minorRev})`;
    }
    async getFlashCap(loader) {
        const numWord = 3;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const flashCap = registerValue >> 27 & 0x07;
        return flashCap;
    }
    async getFlashVendor(loader) {
        const numWord = 4;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const vendorId = registerValue >> 0 & 0x07;
        const vendorMap = {
            1: "XMC",
            2: "GD",
            3: "FM",
            4: "TT",
            5: "ZBIT"
        };
        return vendorMap[vendorId] || "";
    }
    async getChipFeatures(loader) {
        const features = [
            "Wi-Fi",
            "BLE"
        ];
        const flashMap = {
            0: null,
            1: "Embedded Flash 4MB",
            2: "Embedded Flash 2MB",
            3: "Embedded Flash 1MB",
            4: "Embedded Flash 8MB"
        };
        const flashCap = await this.getFlashCap(loader);
        const flashVendor = await this.getFlashVendor(loader);
        const flash = flashMap[flashCap];
        const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
        if (flash !== null) features.push(`${flashDescription} (${flashVendor})`);
        return features;
    }
    async getCrystalFreq(loader) {
        return 40;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}

});


parcelRegister("gVK7e", function(module, exports) {

$parcel$export(module.exports, "ESP32C5ROM", () => $c535bdcd0d37cd31$export$d31876c33eaae20b);

var $4ALwD = parcelRequire("4ALwD");
class $c535bdcd0d37cd31$export$d31876c33eaae20b extends (0, $4ALwD.ESP32C6ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C5";
        this.IMAGE_CHIP_ID = 23;
        this.BOOTLOADER_FLASH_OFFSET = 0x2000;
        this.EFUSE_BASE = 0x600b4800;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.UART_CLKDIV_REG = 0x60000014;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 10;
        this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 22;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 27;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 5;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 10;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 15;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1048576;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 458752;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_SECURE_BOOT_EN_MASK = 33554432;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x44000000;
        this.DROM_MAP_START = 0x42000000;
        this.DROM_MAP_END = 0x44000000;
        this.PCR_SYSCLK_CONF_REG = 0x60096110;
        this.PCR_SYSCLK_XTAL_FREQ_V = 2130706432;
        this.PCR_SYSCLK_XTAL_FREQ_S = 24;
        this.XTAL_CLK_DIVIDER = 1;
        this.UARTDEV_BUF_NO = 0x4085f514; // Variable in ROM .bss which indicates the port in use
        // Magic value for ESP32C5
        this.CHIP_DETECT_MAGIC_VALUE = [
            0x1101406f,
            0x63e1406f,
            0x5fd1406f,
            0x30e1706f
        ];
        this.FLASH_FREQUENCY = {
            "80m": 0xf,
            "40m": 0x0,
            "20m": 0x2
        };
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x42000000,
                0x44000000,
                "DROM"
            ],
            [
                0x40800000,
                0x40860000,
                "DRAM"
            ],
            [
                0x40800000,
                0x40860000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x4003a000,
                0x40040000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x4003a000,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x44000000,
                "IROM"
            ],
            [
                0x40800000,
                0x40860000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
        this.UF2_FAMILY_ID = 0xf71c0343;
        this.EFUSE_MAX_KEY = 5;
        this.PURPOSE_VAL_XTS_AES128_KEY = 4;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2",
            12: "KM_INIT_KEY",
            15: "XTS_AES_128_PSRAM_KEY",
            16: "ECDSA_KEY_P192",
            17: "ECDSA_KEY_P384_L",
            18: "ECDSA_KEY_P384_H"
        };
    }
    async getPkgVersion(loader) {
        const numWord = 2;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 26 & 0x07;
    }
    async getMinorChipVersion(loader) {
        const numWord = 2;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 0 & 0x0f;
    }
    async getMajorChipVersion(loader) {
        const numWord = 2;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 4 & 0x03;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        let desc;
        if (pkgVer === 0) desc = "ESP32-C5";
        else desc = "unknown ESP32-C5";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "Wi-Fi 6 (dual-band)",
            "BT 5 (LE)",
            "IEEE802.15.4",
            "Single Core + LP Core",
            "240MHz"
        ];
    }
    async getCrystalFreq(loader) {
        // The crystal detection algorithm of ESP32/ESP8266
        // works for ESP32-C5 as well.
        const uartDiv = await loader.readReg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK;
        const etsXtal = loader.transport.baudrate * uartDiv / 1000000 / this.XTAL_CLK_DIVIDER;
        let normXtal;
        if (etsXtal > 45) normXtal = 48;
        else if (etsXtal > 33) normXtal = 40;
        else normXtal = 26;
        if (Math.abs(normXtal - etsXtal) > 1) loader.info("WARNING: Unsupported crystal in use");
        return normXtal;
    }
    async getCrystalFreqRomExpect(loader) {
        return (await loader.readReg(this.PCR_SYSCLK_CONF_REG) & this.PCR_SYSCLK_XTAL_FREQ_V) >> this.PCR_SYSCLK_XTAL_FREQ_S;
    }
    async getKeyBlockPurpose(loader, keyBlock) {
        if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) throw new Error(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
        const regShiftDictionary = [
            [
                this.EFUSE_PURPOSE_KEY0_REG,
                this.EFUSE_PURPOSE_KEY0_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY1_REG,
                this.EFUSE_PURPOSE_KEY1_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY2_REG,
                this.EFUSE_PURPOSE_KEY2_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY3_REG,
                this.EFUSE_PURPOSE_KEY3_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY4_REG,
                this.EFUSE_PURPOSE_KEY4_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY5_REG,
                this.EFUSE_PURPOSE_KEY5_SHIFT
            ]
        ];
        const [reg, shift] = regShiftDictionary[keyBlock];
        const registerValue = await loader.readReg(reg);
        return registerValue >> shift & 0x1f;
    }
    async isFlashEncryptionKeyValid(loader) {
        // Need to see an AES-128 key
        const purposes = [];
        for(let i = 0; i <= this.EFUSE_MAX_KEY; i++){
            const purpose = await this.getKeyBlockPurpose(loader, i);
            purposes.push(purpose);
        }
        if (purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES128_KEY)) return true;
        const registerValue = await loader.readReg(this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG);
        return (registerValue >> this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT & this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY) !== 0;
    }
    checkSpiConnection(loader, spiConnection) {
        if (!spiConnection.every((pin)=>pin >= 0 && pin <= 28)) throw new Error("SPI Pin numbers must be in the range 0-28.");
        if (spiConnection.some((pin)=>pin === 13 || pin === 14)) loader.info("GPIO pins 13 and 14 are used by USB-Serial/JTAG, consider using other pins for SPI flash connection.");
    }
    async usesUsbJtagSerial(loader) {
        const uartBufNoAddr = this.UARTDEV_BUF_NO;
        const uartNo = await loader.readReg(uartBufNoAddr) & 0xff;
        // ESP32-C5 uses value 3 for USB-JTAG/Serial (similar to ESP32-S3/H2)
        return uartNo === 3;
    }
    async watchdogReset(loader) {
        // Watchdog reset disabled in parent (ESP32-C6) ROM, re-enable it
        // This should call the ESP32C3ROM.watchdogReset method
        // Note: This is a placeholder - the actual implementation would need
        // the watchdog registers from ESP32C3ROM
        loader.info("Hard resetting with a watchdog...");
        // TODO: Implement watchdog reset using ESP32C3ROM registers
        throw new Error("watchdogReset not yet implemented for ESP32-C5");
    }
    async changeBaud(loader) {
        if (loader.secureDownloadMode) {
            loader.info("Baud rate change is not supported in secure download mode. Keeping 115200 baud.");
            return;
        }
        if (!loader.IS_STUB) {
            const crystalFreqRomExpect = await this.getCrystalFreqRomExpect(loader);
            const crystalFreqDetect = await this.getCrystalFreq(loader);
            loader.info(`ROM expects crystal freq: ${crystalFreqRomExpect} MHz, ` + `detected ${crystalFreqDetect} MHz.`);
            // If detect the XTAL is 48MHz, but the ROM code expects it to be 40MHz
            if (crystalFreqDetect === 48 && crystalFreqRomExpect === 40) loader.info("Crystal frequency mismatch detected. Baud rate adjustment may be needed but is not fully implemented in this version.");
            else if (crystalFreqDetect === 40 && crystalFreqRomExpect === 48) loader.info("Crystal frequency mismatch detected. Baud rate adjustment may be needed but is not fully implemented in this version.");
        }
        // Call the standard changeBaud method
        await loader.changeBaud();
    }
}

});
parcelRegister("4ALwD", function(module, exports) {

$parcel$export(module.exports, "ESP32C6ROM", () => $357f63c077465dd4$export$652353697ef98b38);

var $5CcEa = parcelRequire("5CcEa");
class $357f63c077465dd4$export$652353697ef98b38 extends (0, $5CcEa.ESP32C3ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C6";
        this.IMAGE_CHIP_ID = 13;
        this.EFUSE_BASE = 0x600b0800;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.UART_CLKDIV_REG = 0x3ff40014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x6000007c;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0;
        this.SPI_REG_BASE = 0x60003000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42800000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x42000000,
                0x43000000,
                "DROM"
            ],
            [
                0x40800000,
                0x40880000,
                "DRAM"
            ],
            [
                0x40800000,
                0x40880000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x4004ac00,
                0x40050000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x4004ac00,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x43000000,
                "IROM"
            ],
            [
                0x40800000,
                0x40880000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
    }
    async getPkgVersion(loader) {
        const numWord = 3;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const word3 = await loader.readReg(addr);
        const pkgVersion = word3 >> 21 & 0x07;
        return pkgVersion;
    }
    async getChipRevision(loader) {
        const block1Addr = this.EFUSE_BASE + 0x044;
        const numWord = 3;
        const pos = 18;
        const addr = block1Addr + 4 * numWord;
        const ret = (await loader.readReg(addr) & 0x7 << pos) >> pos;
        return ret;
    }
    async getChipDescription(loader) {
        let desc;
        const pkgVer = await this.getPkgVersion(loader);
        if (pkgVer === 0) desc = "ESP32-C6";
        else desc = "unknown ESP32-C6";
        const chipRev = await this.getChipRevision(loader);
        desc += " (revision " + chipRev + ")";
        return desc;
    }
    async getChipFeatures(loader) {
        return [
            "Wi-Fi 6",
            "BT 5",
            "IEEE802.15.4"
        ];
    }
    async getCrystalFreq(loader) {
        return 40;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}

});


parcelRegister("kUD0R", function(module, exports) {

$parcel$export(module.exports, "ESP32C61ROM", () => $f3974cbf99f73134$export$65e940a5fe8ab28d);

var $4ALwD = parcelRequire("4ALwD");
class $f3974cbf99f73134$export$65e940a5fe8ab28d extends (0, $4ALwD.ESP32C6ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-C61";
        this.IMAGE_CHIP_ID = 20;
        this.CHIP_DETECT_MAGIC_VALUE = [
            0x33f0206f,
            0x2421606f
        ];
        this.UART_DATE_REG_ADDR = 1610612860;
        this.EFUSE_BASE = 0x600b4800;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 4;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 8;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 12;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 16;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 20;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 16384;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x030;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 58720256;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_SECURE_BOOT_EN_MASK = 67108864;
        this.FLASH_FREQUENCY = {
            "80m": 0xf,
            "40m": 0x0,
            "20m": 0x2
        };
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42800000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x41800000,
                0x42000000,
                "DROM"
            ],
            [
                0x40800000,
                0x40860000,
                "DRAM"
            ],
            [
                0x40800000,
                0x40860000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x4004ac00,
                0x40050000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x4004ac00,
                "IROM_MASK"
            ],
            [
                0x41000000,
                0x41800000,
                "IROM"
            ],
            [
                0x40800000,
                0x40860000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
        this.UF2_FAMILY_ID = 0x77d850c4;
        this.EFUSE_MAX_KEY = 5;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            2: "XTS_AES_256_KEY_1",
            3: "XTS_AES_256_KEY_2",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2",
            12: "KM_INIT_KEY",
            13: "XTS_AES_256_KEY_1_PSRAM",
            14: "XTS_AES_256_KEY_2_PSRAM",
            15: "XTS_AES_128_KEY_PSRAM"
        };
    }
    async getPkgVersion(loader) {
        const numWord = 2;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 26 & 0x07;
    }
    async getMinorChipVersion(loader) {
        const numWord = 2;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 0 & 0x0f;
    }
    async getMajorChipVersion(loader) {
        const numWord = 2;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 4 & 0x03;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        let desc;
        if (pkgVer === 0) desc = "ESP32-C61";
        else desc = "unknown ESP32-C61";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "WiFi 6",
            "BT 5"
        ];
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
}

});

parcelRegister("H1kyH", function(module, exports) {

$parcel$export(module.exports, "ESP32H2ROM", () => $08150c7eafcc09b3$export$2184cd7dbcdab15a);

var $4ALwD = parcelRequire("4ALwD");
class $08150c7eafcc09b3$export$2184cd7dbcdab15a extends (0, $4ALwD.ESP32C6ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-H2";
        this.IMAGE_CHIP_ID = 16;
        this.EFUSE_BASE = 0x600b0800;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.UART_CLKDIV_REG = 0x3ff40014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x6000007c;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0x0;
        this.SPI_REG_BASE = 0x60003000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.USB_RAM_BLOCK = 0x800;
        this.UARTDEV_BUF_NO_USB = 3;
        this.UARTDEV_BUF_NO = 0x3fcef14c;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42800000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x42000000,
                0x43000000,
                "DROM"
            ],
            [
                0x40800000,
                0x40880000,
                "DRAM"
            ],
            [
                0x40800000,
                0x40880000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x4004ac00,
                0x40050000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x4004ac00,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x43000000,
                "IROM"
            ],
            [
                0x40800000,
                0x40880000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
    }
    async getPkgVersion(loader) {
        const numWord = 4;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 0 & 0x07;
    }
    async getMinorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 18 & 0x07;
    }
    async getMajorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 21 & 0x03;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        let desc;
        if (pkgVer === 0) desc = "ESP32-H2";
        else desc = "unknown ESP32-H2";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "BT 5 (LE)",
            "IEEE802.15.4",
            "Single Core",
            "96MHz"
        ];
    }
    async getCrystalFreq(loader) {
        // ESP32H2 XTAL is fixed to 32MHz
        return 32;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async postConnect(loader) {
        const bufNo = await loader.readReg(this.UARTDEV_BUF_NO) & 0xff;
        loader.debug("In _post_connect " + bufNo);
        if (bufNo == this.UARTDEV_BUF_NO_USB) loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
    async usesUsbJtagSerial(loader) {
        const bufNo = await loader.readReg(this.UARTDEV_BUF_NO) & 0xff;
        return bufNo === this.UARTDEV_BUF_NO_USB;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}

});

parcelRegister("41MQS", function(module, exports) {

$parcel$export(module.exports, "ESP32P4ROM", () => $2eed265d9a6a1b04$export$80700ef855e8973d);

var $jDde6 = parcelRequire("jDde6");
class $2eed265d9a6a1b04$export$80700ef855e8973d extends (0, $jDde6.ESP32ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-P4";
        this.IMAGE_CHIP_ID = 18;
        this.IROM_MAP_START = 0x40000000;
        this.IROM_MAP_END = 0x4c000000;
        this.DROM_MAP_START = 0x40000000;
        this.DROM_MAP_END = 0x4c000000;
        this.BOOTLOADER_FLASH_OFFSET = 0x2000; // First 2 sectors are reserved for FE purposes
        this.CHIP_DETECT_MAGIC_VALUE = [
            0x0,
            0x0addbad0
        ];
        this.UART_DATE_REG_ADDR = 1343004812;
        this.EFUSE_BASE = 0x5012d000;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.SPI_REG_BASE = 0x5008d000; // SPIMEM1
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.SPI_ADDR_REG_MSB = false;
        this.USES_MAGIC_VALUE = false;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 9;
        this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 24;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 28;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 4;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 8;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 12;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1048576;
        this.EFUSE_RD_REPEAT_DATA1_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_RD_REPEAT_DATA1_REG;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 1835008;
        this.EFUSE_DOWNLOAD_MODE_XPD_ON_MASK = 65536;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_SECURE_BOOT_EN_MASK = 1048576;
        this.PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
        this.PURPOSE_VAL_XTS_AES128_KEY = 4;
        this.SUPPORTS_ENCRYPTED_FLASH = true;
        this.FLASH_ENCRYPTED_WRITE_ALIGN = 16;
        this.USB_RAM_BLOCK = 0x800; // Max block size USB-OTG is used
        this.GPIO_STRAP_REG = 0x500e0038;
        this.GPIO_STRAP_SPI_BOOT_MASK = 0x8; // Not download mode
        this.RTC_CNTL_OPTION1_REG = 0x50110008;
        this.RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK = 0x4; // Is download mode forced over USB?
        // Flash power-on related registers and bits needed for ECO6
        this.DR_REG_LPAON_BASE = 0x50110000;
        this.DR_REG_PMU_BASE = this.DR_REG_LPAON_BASE + 0x5000;
        this.DR_REG_LP_SYS_BASE = this.DR_REG_LPAON_BASE + 0x0;
        this.LP_SYSTEM_REG_ANA_XPD_PAD_GROUP_REG = this.DR_REG_LP_SYS_BASE + 0x10c;
        this.PMU_EXT_LDO_P0_0P1A_ANA_REG = this.DR_REG_PMU_BASE + 0x1bc;
        this.PMU_ANA_0P1A_EN_CUR_LIM_0 = 134217728;
        this.PMU_EXT_LDO_P0_0P1A_REG = this.DR_REG_PMU_BASE + 0x1b8;
        this.PMU_0P1A_TARGET0_0 = 2139095040;
        this.PMU_0P1A_FORCE_TIEH_SEL_0 = 128;
        this.PMU_DATE_REG = this.DR_REG_PMU_BASE + 0x3fc;
        // Flash "force on" (XPD) control bits inside PMU_DATE_REG
        this.PMU_DATE_FLASH_FORCE_ON = 0x3;
        // The value from UARTDEV_BUF_NO when USB-OTG is used
        this.UARTDEV_BUF_NO_USB_OTG = 5;
        // The value from UARTDEV_BUF_NO when USB-JTAG/Serial is used
        this.UARTDEV_BUF_NO_USB_JTAG_SERIAL = 6;
        // Watchdog related registers
        this.DR_REG_LP_WDT_BASE = 0x50116000;
        this.RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0; // LP_WDT_CONFIG0_REG
        this.RTC_CNTL_WDTCONFIG1_REG = this.DR_REG_LP_WDT_BASE + 0x0004; // LP_WDT_CONFIG1_REG
        this.RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0018; // LP_WDT_WPROTECT_REG
        this.RTC_CNTL_WDT_WKEY = 0x50d83aa1;
        this.RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x001c; // RTC_WDT_SWD_CONFIG_REG
        this.RTC_CNTL_SWD_AUTO_FEED_EN = 262144;
        this.RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0020; // RTC_WDT_SWD_WPROTECT_REG
        this.RTC_CNTL_SWD_WKEY = 0x50d83aa1; // RTC_WDT_SWD_WKEY, same as WDT key in this case
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x40000000,
                0x4c000000,
                "DROM"
            ],
            [
                0x4ff00000,
                0x4ffa0000,
                "DRAM"
            ],
            [
                0x4ff00000,
                0x4ffa0000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x4fc00000,
                0x4fc20000,
                "DROM_MASK"
            ],
            [
                0x4fc00000,
                0x4fc20000,
                "IROM_MASK"
            ],
            [
                0x40000000,
                0x4c000000,
                "IROM"
            ],
            [
                0x4ff00000,
                0x4ffa0000,
                "IRAM"
            ],
            [
                0x50108000,
                0x50110000,
                "RTC_IRAM"
            ],
            [
                0x50108000,
                0x50110000,
                "RTC_DRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
        this.UF2_FAMILY_ID = 0x3d308e94;
        this.EFUSE_MAX_KEY = 5;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            2: "XTS_AES_256_KEY_1",
            3: "XTS_AES_256_KEY_2",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2",
            12: "KM_INIT_KEY"
        };
    }
    async getPkgVersion(loader) {
        const numWord = 2;
        const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        return registerValue >> 20 & 0x07;
    }
    async getMinorChipVersion(loader) {
        const numWord = 2;
        const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        return registerValue >> 0 & 0x0f;
    }
    async getMajorChipVersion(loader) {
        const numWord = 2;
        const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        return (registerValue >> 23 & 1) << 2 | registerValue >> 4 & 0x03;
    }
    async getChipRevision(loader) {
        // ESP32-P4 uses major and minor version, but getChipRevision returns a combined value
        // For compatibility, we'll return major version * 100 + minor version
        const major = await this.getMajorChipVersion(loader);
        const minor = await this.getMinorChipVersion(loader);
        return major * 100 + minor;
    }
    async getStubJsonPath(loader) {
        const chipRevision = await this.getChipRevision(loader);
        if (chipRevision < 300) return "./targets/stub_flasher/esp32p4-rev1.json";
        else return "./targets/stub_flasher/esp32p4.json";
    }
    async getChipDescription(loader) {
        const pkgVersion = await this.getPkgVersion(loader);
        const chipNameMap = {
            0: "ESP32-P4"
        };
        const chipName = chipNameMap[pkgVersion] || "Unknown ESP32-P4";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${chipName} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "High-Performance MCU"
        ];
    }
    async getCrystalFreq(loader) {
        return 40; // ESP32P4 XTAL is fixed to 40MHz
    }
    async getFlashVoltage(loader) {
        return;
    }
    async overrideVddsdio(loader) {
        loader.debug("VDD_SDIO overrides are not supported for ESP32-P4");
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    async getFlashCryptConfig(loader) {
        return; // doesn't exist on ESP32-P4
    }
    async getSecureBootEnabled(loader) {
        const registerValue = await loader.readReg(this.EFUSE_SECURE_BOOT_EN_REG);
        return (registerValue & this.EFUSE_SECURE_BOOT_EN_MASK) !== 0;
    }
    /**
     * Get the UARTDEV_BUF_NO address based on chip revision
     * Variable .bss.UartDev.buff_uart_no in ROM .bss which indicates the port in use.
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     * @returns {number} The UARTDEV_BUF_NO address.
     */ async getUartdevBufNo(loader) {
        const BUF_UART_NO_OFFSET = 24;
        const chipRev = await this.getChipRevision(loader);
        const BSS_UART_DEV_ADDR = chipRev < 300 ? 0x4ff3feb0 : 0x4ffbfeb0;
        return BSS_UART_DEV_ADDR + BUF_UART_NO_OFFSET;
    }
    /**
     * Check the UARTDEV_BUF_NO register to see if USB-OTG console is being used
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     * @returns {boolean} True if USB-OTG console is being used, false otherwise.
     */ async usesUsbOtg(loader) {
        const uartBufNoAddr = await this.getUartdevBufNo(loader);
        const uartNo = await loader.readReg(uartBufNoAddr) & 0xff;
        return uartNo === this.UARTDEV_BUF_NO_USB_OTG;
    }
    /**
     * Check the UARTDEV_BUF_NO register to see if USB-JTAG/Serial is being used
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     * @returns {boolean} True if USB-JTAG/Serial is being used, false otherwise.
     */ async usesUsbJtagSerial(loader) {
        if (loader.secureDownloadMode) return false;
        const uartBufNoAddr = await this.getUartdevBufNo(loader);
        const uartNo = await loader.readReg(uartBufNoAddr) & 0xff;
        return uartNo === this.UARTDEV_BUF_NO_USB_JTAG_SERIAL;
    }
    async getKeyBlockPurpose(loader, keyBlock) {
        if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) {
            loader.debug(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
            return;
        }
        const regShiftDictionary = [
            [
                this.EFUSE_PURPOSE_KEY0_REG,
                this.EFUSE_PURPOSE_KEY0_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY1_REG,
                this.EFUSE_PURPOSE_KEY1_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY2_REG,
                this.EFUSE_PURPOSE_KEY2_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY3_REG,
                this.EFUSE_PURPOSE_KEY3_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY4_REG,
                this.EFUSE_PURPOSE_KEY4_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY5_REG,
                this.EFUSE_PURPOSE_KEY5_SHIFT
            ]
        ];
        const [reg, shift] = regShiftDictionary[keyBlock];
        const registerValue = await loader.readReg(reg);
        return registerValue >> shift & 0xf;
    }
    async isFlashEncryptionKeyValid(loader) {
        // Need to see either an AES-128 key or two AES-256 keys
        const purposes = [];
        for(let i = 0; i <= this.EFUSE_MAX_KEY; i++){
            const purpose = await this.getKeyBlockPurpose(loader, i);
            purposes.push(purpose);
        }
        if (purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES128_KEY)) return true;
        if (purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES256_KEY_1) && purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES256_KEY_2)) return true;
        // Check if force use key manager key is set
        const registerValue = await loader.readReg(this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG);
        return (registerValue >> this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT & this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY) !== 0;
    }
    /**
     * Function to be executed after chip connection
     * Sets ESP_RAM_BLOCK if USB OTG is used and disables watchdogs if needed
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     */ async postConnect(loader) {
        if (await loader.usesUsbOtg()) loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
        // Disable watchdogs if not in stub mode (stub manages its own watchdogs)
        // Note: syncStubDetected is private in ESPLoader, but postConnect is called
        // before runStub(), so we're in ROM mode at this point
        if (!loader.IS_STUB) await this.disableWatchdogs(loader);
        if (!loader.secureDownloadMode) await this.powerOnFlash(loader); // Needs to be powered on before the flash is attached
    }
    /**
     * Disable watchdogs when USB-JTAG/Serial is used
     * The RTC WDT and SWD watchdog are not reset and can reset the board during flashing
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     */ async disableWatchdogs(loader) {
        if (await this.usesUsbJtagSerial(loader)) {
            // Disable RTC WDT
            await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY);
            await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, 0);
            await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0);
            // Automatically feed SWD
            await loader.writeReg(this.RTC_CNTL_SWD_WPROTECT_REG, this.RTC_CNTL_SWD_WKEY);
            const swdConfReg = await loader.readReg(this.RTC_CNTL_SWD_CONF_REG);
            await loader.writeReg(this.RTC_CNTL_SWD_CONF_REG, swdConfReg | this.RTC_CNTL_SWD_AUTO_FEED_EN);
            await loader.writeReg(this.RTC_CNTL_SWD_WPROTECT_REG, 0);
        }
    }
    /**
     * Check SPI connection pin numbers
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     * @param {number[]} spiConnection - The SPI connection pin numbers.
     */ checkSpiConnection(loader, spiConnection) {
        if (!spiConnection.every((pin)=>pin >= 0 && pin <= 54)) throw new Error("SPI Pin numbers must be in the range 0-54.");
        if (spiConnection.some((pin)=>pin === 24 || pin === 25)) loader.debug("GPIO pins 24 and 25 are used by USB-Serial/JTAG, consider using other pins for SPI flash connection.");
    }
    /**
     * Reset the chip using watchdog
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     */ async watchdogReset(loader) {
        loader.info("Hard resetting with a watchdog...");
        await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, this.RTC_CNTL_WDT_WKEY); // unlock
        await loader.writeReg(this.RTC_CNTL_WDTCONFIG1_REG, 2000); // set WDT timeout
        await loader.writeReg(this.RTC_CNTL_WDTCONFIG0_REG, -805306110); // enable WDT
        await loader.writeReg(this.RTC_CNTL_WDTWPROTECT_REG, 0); // lock
        await new Promise((resolve)=>setTimeout(resolve, 500)); // wait for reset to take effect
    }
    /**
     * Power on the flash chip by setting the appropriate registers
     * Required for ECO6+ when default flash voltage changed from 1.8V to 3.3V
     * @param {ESPLoader} loader - Loader class to communicate with chip.
     */ async powerOnFlash(loader) {
        if (loader.secureDownloadMode) throw new Error("Powering on flash in secure download mode is not allowed.");
        const chipRev = await this.getChipRevision(loader);
        // Flash defaults off on ECO6/ECO7 after the 1.8V -> 3.3V default change, to prevent
        // damage to 1.8V flash chips. Board designers must set the appropriate voltage level
        // in eFuse. Other silicon revisions do not need this sequence.
        if (chipRev !== 301 && chipRev !== 302) return;
        if (chipRev === 302) {
            const efuseRepeatData1 = await loader.readReg(this.EFUSE_RD_REPEAT_DATA1_REG);
            if (efuseRepeatData1 & this.EFUSE_DOWNLOAD_MODE_XPD_ON_MASK) {
                // ECO7 ROM bug: on a cold power-on, ROM can assert flash XPD (force the flash
                // supply/pads on) and the first download session works. A subsequent entry into
                // ROM download mode over USB-UART reset leaves the flash already powered, but ROM
                // still runs the same "turn flash XPD on" path. That path is not safe to run twice
                // while flash is already on, so the second attach/download can fail.
                //
                // Release the force-on state before the loader attaches the SPI flash, leaving the
                // rest of the register intact.
                const date = await loader.readReg(this.PMU_DATE_REG);
                if ((date & this.PMU_DATE_FLASH_FORCE_ON) === this.PMU_DATE_FLASH_FORCE_ON) await loader.writeReg(this.PMU_DATE_REG, date & ~this.PMU_DATE_FLASH_FORCE_ON);
                return;
            }
        }
        // Power up pad group
        await loader.writeReg(this.LP_SYSTEM_REG_ANA_XPD_PAD_GROUP_REG, 1);
        await new Promise((resolve)=>setTimeout(resolve, 10));
        // Flash power up sequence
        let regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG);
        await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG, regValue | this.PMU_ANA_0P1A_EN_CUR_LIM_0);
        regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
        await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue | this.PMU_0P1A_FORCE_TIEH_SEL_0);
        regValue = await loader.readReg(this.PMU_DATE_REG);
        await loader.writeReg(this.PMU_DATE_REG, regValue | this.PMU_DATE_FLASH_FORCE_ON);
        await new Promise((resolve)=>setTimeout(resolve, 1)); // esptool waits 50us, 1ms is the shortest timer here
        regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG);
        await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_ANA_REG, regValue & ~this.PMU_ANA_0P1A_EN_CUR_LIM_0);
        regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
        await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue & ~this.PMU_0P1A_TARGET0_0);
        // Update eFuse voltage to PMU
        regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
        await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue | 0x80);
        regValue = await loader.readReg(this.PMU_EXT_LDO_P0_0P1A_REG);
        await loader.writeReg(this.PMU_EXT_LDO_P0_0P1A_REG, regValue & ~this.PMU_0P1A_FORCE_TIEH_SEL_0);
        await new Promise((resolve)=>setTimeout(resolve, 2)); // 1.8ms for the supply to settle
    }
}

});

parcelRegister("dTziU", function(module, exports) {

$parcel$export(module.exports, "ESP32S2ROM", () => $a1dbcc0cc5ee5458$export$4fb717d12681de23);

var $jDde6 = parcelRequire("jDde6");
class $a1dbcc0cc5ee5458$export$4fb717d12681de23 extends (0, $jDde6.ESP32ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-S2";
        this.IMAGE_CHIP_ID = 2;
        this.IROM_MAP_START = 0x40080000;
        this.IROM_MAP_END = 0x40b80000;
        this.DROM_MAP_START = 0x3f000000;
        this.DROM_MAP_END = 0x3f3f0000;
        this.CHIP_DETECT_MAGIC_VALUE = [
            0x000007c6
        ];
        this.SPI_REG_BASE = 0x3f402000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.SPI_ADDR_REG_MSB = false;
        this.MAC_EFUSE_REG = 0x3f41a044; // ESP32-S2 has special block for MAC efuses
        this.UART_CLKDIV_REG = 0x3f400014;
        this.SUPPORTS_ENCRYPTED_FLASH = true;
        this.FLASH_ENCRYPTED_WRITE_ALIGN = 16;
        // todo: use espefuse APIs to get this info
        this.EFUSE_BASE = 0x3f41a000;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030; // BLOCK0 read base address
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.EFUSE_BLOCK2_ADDR = this.EFUSE_BASE + 0x05c;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 24;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 28;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 4;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 8;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 12;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 524288;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 1835008;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_SECURE_BOOT_EN_MASK = 1048576;
        this.EFUSE_RD_REPEAT_DATA3_REG = this.EFUSE_BASE + 0x3c;
        this.EFUSE_RD_REPEAT_DATA3_REG_FLASH_TYPE_MASK = 512;
        this.PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
        this.PURPOSE_VAL_XTS_AES128_KEY = 4;
        this.UARTDEV_BUF_NO = 0x3ffffd14; // Variable in ROM .bss which indicates the port in use
        this.UARTDEV_BUF_NO_USB_OTG = 2; // Value of the above indicating that USB-OTG is in use
        this.USB_RAM_BLOCK = 0x800; // Max block size USB-OTG is used
        this.GPIO_STRAP_REG = 0x3f404038;
        this.GPIO_STRAP_SPI_BOOT_MASK = 8; // Not download mode
        this.GPIO_STRAP_VDDSPI_MASK = 16;
        this.RTC_CNTL_OPTION1_REG = 0x3f408128;
        this.RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK = 0x1; // Is download mode forced over USB?
        this.RTCCNTL_BASE_REG = 0x3f408000;
        this.RTC_CNTL_WDTCONFIG0_REG = this.RTCCNTL_BASE_REG + 0x0094;
        this.RTC_CNTL_WDTCONFIG1_REG = this.RTCCNTL_BASE_REG + 0x0098;
        this.RTC_CNTL_WDTWPROTECT_REG = this.RTCCNTL_BASE_REG + 0x00ac;
        this.RTC_CNTL_WDT_WKEY = 0x50d83aa1;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3f000000,
                0x3ff80000,
                "DROM"
            ],
            [
                0x3f500000,
                0x3ff80000,
                "EXTRAM_DATA"
            ],
            [
                0x3ff9e000,
                0x3ffa0000,
                "RTC_DRAM"
            ],
            [
                0x3ff9e000,
                0x40000000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x3ff9e000,
                0x40072000,
                "MEM_INTERNAL"
            ],
            [
                0x3ffb0000,
                0x40000000,
                "DRAM"
            ],
            [
                0x40000000,
                0x4001a100,
                "IROM_MASK"
            ],
            [
                0x40020000,
                0x40070000,
                "IRAM"
            ],
            [
                0x40070000,
                0x40072000,
                "RTC_IRAM"
            ],
            [
                0x40080000,
                0x40800000,
                "IROM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_DATA"
            ]
        ];
        this.EFUSE_VDD_SPI_REG = this.EFUSE_BASE + 0x34;
        this.VDD_SPI_XPD = 16;
        this.VDD_SPI_TIEH = 32;
        this.VDD_SPI_FORCE = 64;
        this.UF2_FAMILY_ID = 0xbfdd4eee;
        this.EFUSE_MAX_KEY = 5;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "RESERVED",
            2: "XTS_AES_256_KEY_1",
            3: "XTS_AES_256_KEY_2",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2"
        };
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x60000078;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0x1000;
    }
    async getPkgVersion(loader) {
        const numWord = 4;
        const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
        const word = await loader.readReg(addr);
        const pkgVersion = word >> 0 & 0x0f;
        return pkgVersion;
    }
    async getMinorChipVersion(loader) {
        const hiNumWord = 3;
        const hi = await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * hiNumWord) >> 20 & 0x01;
        const lowNumWord = 4;
        const low = await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * lowNumWord) >> 4 & 0x07;
        return (hi << 3) + low;
    }
    async getMajorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 18 & 0x03;
    }
    async getFlashVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 21 & 0x0f;
    }
    async getChipDescription(loader) {
        const chipDesc = {
            0: "ESP32-S2",
            1: "ESP32-S2FH2",
            2: "ESP32-S2FH4",
            102: "ESP32-S2FNR2",
            100: "ESP32-S2R2"
        };
        const chipIndex = await this.getFlashCap(loader) + await this.getPsramCap(loader) * 100;
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${chipDesc[chipIndex] || "unknown ESP32-S2"} (revision v${majorRev}.${minorRev})`;
    }
    async getFlashCap(loader) {
        return await this.getFlashVersion(loader);
    }
    async getPsramVersion(loader) {
        const numWord = 3;
        const addr = this.EFUSE_BLOCK1_ADDR + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const psramCap = registerValue >> 28 & 0x0f;
        return psramCap;
    }
    async getPsramCap(loader) {
        return await this.getPsramVersion(loader);
    }
    async getBlock2Version(loader) {
        const numWord = 4;
        const addr = this.EFUSE_BLOCK2_ADDR + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const block2Ver = registerValue >> 4 & 0x07;
        return block2Ver;
    }
    async getChipFeatures(loader) {
        const features = [
            "Wi-Fi"
        ];
        const flashMap = {
            0: "No Embedded Flash",
            1: "Embedded Flash 2MB",
            2: "Embedded Flash 4MB"
        };
        const flashCap = await this.getFlashCap(loader);
        const flashDescription = flashMap[flashCap] || "Unknown Embedded Flash";
        features.push(flashDescription);
        const psramMap = {
            0: "No Embedded Flash",
            1: "Embedded PSRAM 2MB",
            2: "Embedded PSRAM 4MB"
        };
        const psramCap = await this.getPsramCap(loader);
        const psramDescription = psramMap[psramCap] || "Unknown Embedded PSRAM";
        features.push(psramDescription);
        const block2VersionMap = {
            0: "No calibration in BLK2 of efuse",
            1: "ADC and temperature sensor calibration in BLK2 of efuse V1",
            2: "ADC and temperature sensor calibration in BLK2 of efuse V2"
        };
        const block2Ver = await this.getBlock2Version(loader);
        const block2VersionDescription = block2VersionMap[block2Ver] || "Unknown Calibration in BLK2";
        features.push(block2VersionDescription);
        return features;
    }
    async getCrystalFreq(loader) {
        return 40;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
    async usingUsbOtg(loader) {
        const uartNo = await loader.readReg(this.UARTDEV_BUF_NO) & 0xff;
        return uartNo === this.UARTDEV_BUF_NO_USB_OTG;
    }
    async postConnect(loader) {
        if (await loader.usesUsbOtg()) loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
}

});

parcelRegister("jI9O3", function(module, exports) {

$parcel$export(module.exports, "ESP32S3ROM", () => $e599bbb994ae198b$export$e18277a04821a5e);

var $jDde6 = parcelRequire("jDde6");
class $e599bbb994ae198b$export$e18277a04821a5e extends (0, $jDde6.ESP32ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-S3";
        this.IMAGE_CHIP_ID = 9;
        this.USES_MAGIC_VALUE = false;
        this.EFUSE_BASE = 0x60007000;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x44;
        this.EFUSE_BLOCK2_ADDR = this.EFUSE_BASE + 0x5c;
        this.UART_CLKDIV_REG = 0x60000014;
        this.UART_CLKDIV_MASK = 0xfffff;
        this.UART_DATE_REG_ADDR = 0x60000080;
        this.FLASH_WRITE_SIZE = 0x400;
        this.BOOTLOADER_FLASH_OFFSET = 0x0;
        this.SPI_REG_BASE = 0x60002000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.USB_RAM_BLOCK = 0x800;
        this.UARTDEV_BUF_NO_USB = 3;
        this.UARTDEV_BUF_NO = 0x3fcef14c;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x44000000;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3c000000,
                0x3d000000,
                "DROM"
            ],
            [
                0x3d000000,
                0x3e000000,
                "EXTRAM_DATA"
            ],
            [
                0x600fe000,
                0x60100000,
                "RTC_DRAM"
            ],
            [
                0x3fc88000,
                0x3fd00000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x3fc88000,
                0x403e2000,
                "MEM_INTERNAL"
            ],
            [
                0x3fc88000,
                0x3fd00000,
                "DRAM"
            ],
            [
                0x40000000,
                0x4001a100,
                "IROM_MASK"
            ],
            [
                0x40370000,
                0x403e0000,
                "IRAM"
            ],
            [
                0x600fe000,
                0x60100000,
                "RTC_IRAM"
            ],
            [
                0x42000000,
                0x42800000,
                "IROM"
            ],
            [
                0x50000000,
                0x50002000,
                "RTC_DATA"
            ]
        ];
    }
    async getChipDescription(loader) {
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        const pkgVersion = await this.getPkgVersion(loader);
        const chipName = {
            0: "ESP32-S3 (QFN56)",
            1: "ESP32-S3-PICO-1 (LGA56)"
        };
        return `${chipName[pkgVersion] || "unknown ESP32-S3"} (revision v${majorRev}.${minorRev})`;
    }
    async getPkgVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 21 & 0x07;
    }
    async getRawMinorChipVersion(loader) {
        const hiNumWord = 5;
        const hi = await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * hiNumWord) >> 23 & 0x01;
        const lowNumWord = 3;
        const low = await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * lowNumWord) >> 18 & 0x07;
        return (hi << 3) + low;
    }
    async getMinorChipVersion(loader) {
        const minorRaw = await this.getRawMinorChipVersion(loader);
        if (await this.isEco0(loader, minorRaw)) return 0;
        return this.getRawMinorChipVersion(loader);
    }
    async getRawMajorChipVersion(loader) {
        const numWord = 5;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 24 & 0x03;
    }
    async getMajorChipVersion(loader) {
        const minorRaw = await this.getRawMinorChipVersion(loader);
        if (await this.isEco0(loader, minorRaw)) return 0;
        return this.getRawMajorChipVersion(loader);
    }
    async getBlkVersionMajor(loader) {
        const numWord = 4;
        return await loader.readReg(this.EFUSE_BLOCK2_ADDR + 4 * numWord) >> 0 & 0x03;
    }
    async getBlkVersionMinor(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 24 & 0x07;
    }
    async isEco0(loader, minorRaw) {
        // Workaround: The major version field was allocated to other purposes
        // when block version is v1.1.
        // Luckily only chip v0.0 have this kind of block version and efuse usage.
        return (minorRaw & 0x7) === 0 && await this.getBlkVersionMajor(loader) === 1 && await this.getBlkVersionMinor(loader) === 1;
    }
    async getFlashCap(loader) {
        const numWord = 3;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const flashCap = registerValue >> 27 & 0x07;
        return flashCap;
    }
    async getFlashVendor(loader) {
        const numWord = 4;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const vendorId = registerValue >> 0 & 0x07;
        const vendorMap = {
            1: "XMC",
            2: "GD",
            3: "FM",
            4: "TT",
            5: "BY"
        };
        return vendorMap[vendorId] || "";
    }
    async getPsramCap(loader) {
        const numWord = 4;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const psramCap = registerValue >> 3 & 0x03;
        return psramCap;
    }
    async getPsramVendor(loader) {
        const numWord = 4;
        const block1Addr = this.EFUSE_BASE + 0x044;
        const addr = block1Addr + 4 * numWord;
        const registerValue = await loader.readReg(addr);
        const vendorId = registerValue >> 7 & 0x03;
        const vendorMap = {
            1: "AP_3v3",
            2: "AP_1v8"
        };
        return vendorMap[vendorId] || "";
    }
    async getChipFeatures(loader) {
        const features = [
            "Wi-Fi",
            "BLE"
        ];
        const flashMap = {
            0: null,
            1: "Embedded Flash 8MB",
            2: "Embedded Flash 4MB"
        };
        const flashCap = await this.getFlashCap(loader);
        const flashVendor = await this.getFlashVendor(loader);
        const flash = flashMap[flashCap];
        const flashDescription = flash !== undefined ? flash : "Unknown Embedded Flash";
        if (flash !== null) features.push(`${flashDescription} (${flashVendor})`);
        const psramMap = {
            0: null,
            1: "Embedded PSRAM 8MB",
            2: "Embedded PSRAM 2MB"
        };
        const psramCap = await this.getPsramCap(loader);
        const psramVendor = await this.getPsramVendor(loader);
        const psram = psramMap[psramCap];
        const psramDescription = psram !== undefined ? psram : "Unknown Embedded PSRAM";
        if (psram !== null) features.push(`${psramDescription} (${psramVendor})`);
        return features;
    }
    async getCrystalFreq(loader) {
        return 40;
    }
    _d2h(d) {
        const h = (+d).toString(16);
        return h.length === 1 ? "0" + h : h;
    }
    async postConnect(loader) {
        if (await loader.usesUsbOtg()) loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
    async usesUsbJtagSerial(loader) {
        const bufNo = await loader.readReg(this.UARTDEV_BUF_NO) & 0xff;
        return bufNo === this.UARTDEV_BUF_NO_USB;
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    getEraseSize(offset, size) {
        return size;
    }
}

});

/**
 * Represents a Espressif chip error.
 */ class $f1887d9f177795ef$export$5b519f82636185ec extends Error {
    constructor(message){
        super(message);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
/**
 * Represents a Espressif timeout chip error.
 */ class $f1887d9f177795ef$export$66d311bf29d5c89c extends $f1887d9f177795ef$export$5b519f82636185ec {
}
/**
 * ROM loader returned an invalid command response (e.g. restricted download mode).
 */ class $f1887d9f177795ef$export$4bb69fbdc6ba8341 extends $f1887d9f177795ef$export$5b519f82636185ec {
    constructor(message = "unsupported command error"){
        super(message);
    }
}
/**
 * GET_SECURITY_INFO returned a chip ID that does not match any known target.
 */ class $f1887d9f177795ef$export$5a2942f5d00ec522 extends $f1887d9f177795ef$export$5b519f82636185ec {
    constructor(chipId){
        super(`Unexpected chip ID value ${chipId}. Failed to autodetect chip type.`);
    }
}
/**
 * Chip-detect magic register value does not match any known target.
 */ class $f1887d9f177795ef$export$edcc68853e16235f extends $f1887d9f177795ef$export$5b519f82636185ec {
    constructor(chipMagicValue){
        super(`Unexpected CHIP magic value 0x${chipMagicValue.toString(16)}. Failed to autodetect chip type.`);
    }
}
/**
 * GET_SECURITY_INFO succeeded but the payload has no chip ID (ESP32-S2).
 */ class $f1887d9f177795ef$export$70ed0266d0662de6 extends $f1887d9f177795ef$export$5b519f82636185ec {
    constructor(message = "Security info command does not contain chip ID. This is expected for ESP32-S2 which doesn't support chip ID in security info."){
        super(message);
    }
}


/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */ // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
/* eslint-disable space-unary-ops */ /* Public constants ==========================================================*/ /* ===========================================================================*/ //const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const $2438585bd7e1d91e$var$Z_FIXED$1 = 4;
//const Z_DEFAULT_STRATEGY  = 0;
/* Possible values of the data_type field (though see inflate()) */ const $2438585bd7e1d91e$var$Z_BINARY = 0;
const $2438585bd7e1d91e$var$Z_TEXT = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const $2438585bd7e1d91e$var$Z_UNKNOWN$1 = 2;
/*============================================================================*/ function $2438585bd7e1d91e$var$zero$1(buf) {
    let len = buf.length;
    while(--len >= 0)buf[len] = 0;
}
// From zutil.h
const $2438585bd7e1d91e$var$STORED_BLOCK = 0;
const $2438585bd7e1d91e$var$STATIC_TREES = 1;
const $2438585bd7e1d91e$var$DYN_TREES = 2;
/* The three kinds of block type */ const $2438585bd7e1d91e$var$MIN_MATCH$1 = 3;
const $2438585bd7e1d91e$var$MAX_MATCH$1 = 258;
/* The minimum and maximum match lengths */ // From deflate.h
/* ===========================================================================
 * Internal compression state.
 */ const $2438585bd7e1d91e$var$LENGTH_CODES$1 = 29;
/* number of length codes, not counting the special END_BLOCK code */ const $2438585bd7e1d91e$var$LITERALS$1 = 256;
/* number of literal bytes 0..255 */ const $2438585bd7e1d91e$var$L_CODES$1 = $2438585bd7e1d91e$var$LITERALS$1 + 1 + $2438585bd7e1d91e$var$LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */ const $2438585bd7e1d91e$var$D_CODES$1 = 30;
/* number of distance codes */ const $2438585bd7e1d91e$var$BL_CODES$1 = 19;
/* number of codes used to transfer the bit lengths */ const $2438585bd7e1d91e$var$HEAP_SIZE$1 = 2 * $2438585bd7e1d91e$var$L_CODES$1 + 1;
/* maximum heap size */ const $2438585bd7e1d91e$var$MAX_BITS$1 = 15;
/* All codes must not exceed MAX_BITS bits */ const $2438585bd7e1d91e$var$Buf_size = 16;
/* size of bit buffer in bi_buf */ /* ===========================================================================
 * Constants
 */ const $2438585bd7e1d91e$var$MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */ const $2438585bd7e1d91e$var$END_BLOCK = 256;
/* end of block literal code */ const $2438585bd7e1d91e$var$REP_3_6 = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */ const $2438585bd7e1d91e$var$REPZ_3_10 = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */ const $2438585bd7e1d91e$var$REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */ /* eslint-disable comma-spacing,array-bracket-spacing */ const $2438585bd7e1d91e$var$extra_lbits = /* extra bits for each length code */ new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0
]);
const $2438585bd7e1d91e$var$extra_dbits = /* extra bits for each distance code */ new Uint8Array([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13
]);
const $2438585bd7e1d91e$var$extra_blbits = /* extra bits for each bit length code */ new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2,
    3,
    7
]);
const $2438585bd7e1d91e$var$bl_order = new Uint8Array([
    16,
    17,
    18,
    0,
    8,
    7,
    9,
    6,
    10,
    5,
    11,
    4,
    12,
    3,
    13,
    2,
    14,
    1,
    15
]);
/* eslint-enable comma-spacing,array-bracket-spacing */ /* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */ /* ===========================================================================
 * Local data. These are initialized only once.
 */ // We pre-fill arrays with 0 to avoid uninitialized gaps
const $2438585bd7e1d91e$var$DIST_CODE_LEN = 512; /* see definition of array dist_code below */ 
// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const $2438585bd7e1d91e$var$static_ltree = new Array(($2438585bd7e1d91e$var$L_CODES$1 + 2) * 2);
$2438585bd7e1d91e$var$zero$1($2438585bd7e1d91e$var$static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */ const $2438585bd7e1d91e$var$static_dtree = new Array($2438585bd7e1d91e$var$D_CODES$1 * 2);
$2438585bd7e1d91e$var$zero$1($2438585bd7e1d91e$var$static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */ const $2438585bd7e1d91e$var$_dist_code = new Array($2438585bd7e1d91e$var$DIST_CODE_LEN);
$2438585bd7e1d91e$var$zero$1($2438585bd7e1d91e$var$_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */ const $2438585bd7e1d91e$var$_length_code = new Array($2438585bd7e1d91e$var$MAX_MATCH$1 - $2438585bd7e1d91e$var$MIN_MATCH$1 + 1);
$2438585bd7e1d91e$var$zero$1($2438585bd7e1d91e$var$_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */ const $2438585bd7e1d91e$var$base_length = new Array($2438585bd7e1d91e$var$LENGTH_CODES$1);
$2438585bd7e1d91e$var$zero$1($2438585bd7e1d91e$var$base_length);
/* First normalized length for each code (0 = MIN_MATCH) */ const $2438585bd7e1d91e$var$base_dist = new Array($2438585bd7e1d91e$var$D_CODES$1);
$2438585bd7e1d91e$var$zero$1($2438585bd7e1d91e$var$base_dist);
/* First normalized distance for each code (0 = distance of 1) */ function $2438585bd7e1d91e$var$StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree; /* static tree or NULL */ 
    this.extra_bits = extra_bits; /* extra bits for each code or NULL */ 
    this.extra_base = extra_base; /* base index for extra_bits */ 
    this.elems = elems; /* max number of elements in the tree */ 
    this.max_length = max_length; /* max bit length for the codes */ 
    // show if `static_tree` has data or dummy - needed for monomorphic objects
    this.has_stree = static_tree && static_tree.length;
}
let $2438585bd7e1d91e$var$static_l_desc;
let $2438585bd7e1d91e$var$static_d_desc;
let $2438585bd7e1d91e$var$static_bl_desc;
function $2438585bd7e1d91e$var$TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree; /* the dynamic tree */ 
    this.max_code = 0; /* largest code with non zero frequency */ 
    this.stat_desc = stat_desc; /* the corresponding static tree */ 
}
const $2438585bd7e1d91e$var$d_code = (dist)=>{
    return dist < 256 ? $2438585bd7e1d91e$var$_dist_code[dist] : $2438585bd7e1d91e$var$_dist_code[256 + (dist >>> 7)];
};
/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */ const $2438585bd7e1d91e$var$put_short = (s, w)=>{
    //    put_byte(s, (uch)((w) & 0xff));
    //    put_byte(s, (uch)((ush)(w) >> 8));
    s.pending_buf[s.pending++] = w & 0xff;
    s.pending_buf[s.pending++] = w >>> 8 & 0xff;
};
/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */ const $2438585bd7e1d91e$var$send_bits = (s, value, length)=>{
    if (s.bi_valid > $2438585bd7e1d91e$var$Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 0xffff;
        $2438585bd7e1d91e$var$put_short(s, s.bi_buf);
        s.bi_buf = value >> $2438585bd7e1d91e$var$Buf_size - s.bi_valid;
        s.bi_valid += length - $2438585bd7e1d91e$var$Buf_size;
    } else {
        s.bi_buf |= value << s.bi_valid & 0xffff;
        s.bi_valid += length;
    }
};
const $2438585bd7e1d91e$var$send_code = (s, c, tree)=>{
    $2438585bd7e1d91e$var$send_bits(s, tree[c * 2], tree[c * 2 + 1]);
};
/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */ const $2438585bd7e1d91e$var$bi_reverse = (code, len)=>{
    let res = 0;
    do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
    }while (--len > 0);
    return res >>> 1;
};
/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */ const $2438585bd7e1d91e$var$bi_flush = (s)=>{
    if (s.bi_valid === 16) {
        $2438585bd7e1d91e$var$put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 0xff;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
    }
};
/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */ const $2438585bd7e1d91e$var$gen_bitlen = (s, desc)=>{
    //    deflate_state *s;
    //    tree_desc *desc;    /* the tree descriptor */
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h; /* heap index */ 
    let n, m; /* iterate over the tree elements */ 
    let bits; /* bit length */ 
    let xbits; /* extra bits */ 
    let f; /* frequency */ 
    let overflow = 0; /* number of elements with bit length too large */ 
    for(bits = 0; bits <= $2438585bd7e1d91e$var$MAX_BITS$1; bits++)s.bl_count[bits] = 0;
    /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */ tree[s.heap[s.heap_max] * 2 + 1] = 0; /* root of the heap */ 
    for(h = s.heap_max + 1; h < $2438585bd7e1d91e$var$HEAP_SIZE$1; h++){
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
            bits = max_length;
            overflow++;
        }
        tree[n * 2 + 1] = bits;
        /* We overwrite tree[n].Dad which is no longer needed */ if (n > max_code) continue;
         /* not a leaf node */ 
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) xbits = extra[n - base];
        f = tree[n * 2] /*.Freq*/ ;
        s.opt_len += f * (bits + xbits);
        if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
    }
    if (overflow === 0) return;
    // Tracev((stderr,"\nbit length overflow\n"));
    /* This happens for example on obj2 and pic of the Calgary corpus */ /* Find the first bit length which could increase: */ do {
        bits = max_length - 1;
        while(s.bl_count[bits] === 0)bits--;
        s.bl_count[bits]--; /* move one leaf down the tree */ 
        s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */ 
        s.bl_count[max_length]--;
        /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */ overflow -= 2;
    }while (overflow > 0);
    /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */ for(bits = max_length; bits !== 0; bits--){
        n = s.bl_count[bits];
        while(n !== 0){
            m = s.heap[--h];
            if (m > max_code) continue;
            if (tree[m * 2 + 1] !== bits) {
                // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
                s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2] /*.Freq*/ ;
                tree[m * 2 + 1] = bits;
            }
            n--;
        }
    }
};
/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */ const $2438585bd7e1d91e$var$gen_codes = (tree, max_code, bl_count)=>{
    //    ct_data *tree;             /* the tree to decorate */
    //    int max_code;              /* largest code with non zero frequency */
    //    ushf *bl_count;            /* number of codes at each bit length */
    const next_code = new Array($2438585bd7e1d91e$var$MAX_BITS$1 + 1); /* next code value for each bit length */ 
    let code = 0; /* running code value */ 
    let bits; /* bit index */ 
    let n; /* code index */ 
    /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */ for(bits = 1; bits <= $2438585bd7e1d91e$var$MAX_BITS$1; bits++){
        code = code + bl_count[bits - 1] << 1;
        next_code[bits] = code;
    }
    /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */ //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
    //        "inconsistent bit counts");
    //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));
    for(n = 0; n <= max_code; n++){
        let len = tree[n * 2 + 1] /*.Len*/ ;
        if (len === 0) continue;
        /* Now reverse the bits */ tree[n * 2] = $2438585bd7e1d91e$var$bi_reverse(next_code[len]++, len);
    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
    }
};
/* ===========================================================================
 * Initialize the various 'constant' tables.
 */ const $2438585bd7e1d91e$var$tr_static_init = ()=>{
    let n; /* iterates over tree elements */ 
    let bits; /* bit counter */ 
    let length; /* length value */ 
    let code; /* code value */ 
    let dist; /* distance index */ 
    const bl_count = new Array($2438585bd7e1d91e$var$MAX_BITS$1 + 1);
    /* number of codes at each bit length for an optimal tree */ // do check in _tr_init()
    //if (static_init_done) return;
    /* For some embedded targets, global variables are not initialized: */ /*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/ /* Initialize the mapping length (0..255) -> length code (0..28) */ length = 0;
    for(code = 0; code < $2438585bd7e1d91e$var$LENGTH_CODES$1 - 1; code++){
        $2438585bd7e1d91e$var$base_length[code] = length;
        for(n = 0; n < 1 << $2438585bd7e1d91e$var$extra_lbits[code]; n++)$2438585bd7e1d91e$var$_length_code[length++] = code;
    }
    //Assert (length == 256, "tr_static_init: length != 256");
    /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */ $2438585bd7e1d91e$var$_length_code[length - 1] = code;
    /* Initialize the mapping dist (0..32K) -> dist code (0..29) */ dist = 0;
    for(code = 0; code < 16; code++){
        $2438585bd7e1d91e$var$base_dist[code] = dist;
        for(n = 0; n < 1 << $2438585bd7e1d91e$var$extra_dbits[code]; n++)$2438585bd7e1d91e$var$_dist_code[dist++] = code;
    }
    //Assert (dist == 256, "tr_static_init: dist != 256");
    dist >>= 7; /* from now on, all distances are divided by 128 */ 
    for(; code < $2438585bd7e1d91e$var$D_CODES$1; code++){
        $2438585bd7e1d91e$var$base_dist[code] = dist << 7;
        for(n = 0; n < 1 << $2438585bd7e1d91e$var$extra_dbits[code] - 7; n++)$2438585bd7e1d91e$var$_dist_code[256 + dist++] = code;
    }
    //Assert (dist == 256, "tr_static_init: 256+dist != 512");
    /* Construct the codes of the static literal tree */ for(bits = 0; bits <= $2438585bd7e1d91e$var$MAX_BITS$1; bits++)bl_count[bits] = 0;
    n = 0;
    while(n <= 143){
        $2438585bd7e1d91e$var$static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
    }
    while(n <= 255){
        $2438585bd7e1d91e$var$static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
    }
    while(n <= 279){
        $2438585bd7e1d91e$var$static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
    }
    while(n <= 287){
        $2438585bd7e1d91e$var$static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
    }
    /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */ $2438585bd7e1d91e$var$gen_codes($2438585bd7e1d91e$var$static_ltree, $2438585bd7e1d91e$var$L_CODES$1 + 1, bl_count);
    /* The static distance tree is trivial: */ for(n = 0; n < $2438585bd7e1d91e$var$D_CODES$1; n++){
        $2438585bd7e1d91e$var$static_dtree[n * 2 + 1] = 5;
        $2438585bd7e1d91e$var$static_dtree[n * 2] = $2438585bd7e1d91e$var$bi_reverse(n, 5);
    }
    // Now data ready and we can init static trees
    $2438585bd7e1d91e$var$static_l_desc = new $2438585bd7e1d91e$var$StaticTreeDesc($2438585bd7e1d91e$var$static_ltree, $2438585bd7e1d91e$var$extra_lbits, $2438585bd7e1d91e$var$LITERALS$1 + 1, $2438585bd7e1d91e$var$L_CODES$1, $2438585bd7e1d91e$var$MAX_BITS$1);
    $2438585bd7e1d91e$var$static_d_desc = new $2438585bd7e1d91e$var$StaticTreeDesc($2438585bd7e1d91e$var$static_dtree, $2438585bd7e1d91e$var$extra_dbits, 0, $2438585bd7e1d91e$var$D_CODES$1, $2438585bd7e1d91e$var$MAX_BITS$1);
    $2438585bd7e1d91e$var$static_bl_desc = new $2438585bd7e1d91e$var$StaticTreeDesc(new Array(0), $2438585bd7e1d91e$var$extra_blbits, 0, $2438585bd7e1d91e$var$BL_CODES$1, $2438585bd7e1d91e$var$MAX_BL_BITS);
//static_init_done = true;
};
/* ===========================================================================
 * Initialize a new block.
 */ const $2438585bd7e1d91e$var$init_block = (s)=>{
    let n; /* iterates over tree elements */ 
    /* Initialize the trees. */ for(n = 0; n < $2438585bd7e1d91e$var$L_CODES$1; n++)s.dyn_ltree[n * 2] = 0;
    for(n = 0; n < $2438585bd7e1d91e$var$D_CODES$1; n++)s.dyn_dtree[n * 2] = 0;
    for(n = 0; n < $2438585bd7e1d91e$var$BL_CODES$1; n++)s.bl_tree[n * 2] = 0;
    s.dyn_ltree[$2438585bd7e1d91e$var$END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
};
/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */ const $2438585bd7e1d91e$var$bi_windup = (s)=>{
    if (s.bi_valid > 8) $2438585bd7e1d91e$var$put_short(s, s.bi_buf);
    else if (s.bi_valid > 0) //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
    s.bi_buf = 0;
    s.bi_valid = 0;
};
/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */ const $2438585bd7e1d91e$var$smaller = (tree, n, m, depth)=>{
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
};
/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */ const $2438585bd7e1d91e$var$pqdownheap = (s, tree, k)=>{
    //    deflate_state *s;
    //    ct_data *tree;  /* the tree to restore */
    //    int k;               /* node to move down */
    const v = s.heap[k];
    let j = k << 1; /* left son of k */ 
    while(j <= s.heap_len){
        /* Set j to the smallest of the two sons: */ if (j < s.heap_len && $2438585bd7e1d91e$var$smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
        /* Exit if v is smaller than both sons */ if ($2438585bd7e1d91e$var$smaller(tree, v, s.heap[j], s.depth)) break;
        /* Exchange v with the smallest son */ s.heap[k] = s.heap[j];
        k = j;
        /* And continue down the tree, setting j to the left son of k */ j <<= 1;
    }
    s.heap[k] = v;
};
// inlined manually
// const SMALLEST = 1;
/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */ const $2438585bd7e1d91e$var$compress_block = (s, ltree, dtree)=>{
    //    deflate_state *s;
    //    const ct_data *ltree; /* literal tree */
    //    const ct_data *dtree; /* distance tree */
    let dist; /* distance of matched string */ 
    let lc; /* match length or unmatched char (if dist == 0) */ 
    let sx = 0; /* running index in sym_buf */ 
    let code; /* the code to send */ 
    let extra; /* number of extra bits to send */ 
    if (s.sym_next !== 0) do {
        dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
        dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) $2438585bd7e1d91e$var$send_code(s, lc, ltree); /* send a literal byte */ 
        else {
            /* Here, lc is the match length - MIN_MATCH */ code = $2438585bd7e1d91e$var$_length_code[lc];
            $2438585bd7e1d91e$var$send_code(s, code + $2438585bd7e1d91e$var$LITERALS$1 + 1, ltree); /* send the length code */ 
            extra = $2438585bd7e1d91e$var$extra_lbits[code];
            if (extra !== 0) {
                lc -= $2438585bd7e1d91e$var$base_length[code];
                $2438585bd7e1d91e$var$send_bits(s, lc, extra); /* send the extra length bits */ 
            }
            dist--; /* dist is now the match distance - 1 */ 
            code = $2438585bd7e1d91e$var$d_code(dist);
            //Assert (code < D_CODES, "bad d_code");
            $2438585bd7e1d91e$var$send_code(s, code, dtree); /* send the distance code */ 
            extra = $2438585bd7e1d91e$var$extra_dbits[code];
            if (extra !== 0) {
                dist -= $2438585bd7e1d91e$var$base_dist[code];
                $2438585bd7e1d91e$var$send_bits(s, dist, extra); /* send the extra distance bits */ 
            }
        } /* literal or match pair ? */ 
    /* Check that the overlay between pending_buf and sym_buf is ok: */ //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");
    }while (sx < s.sym_next);
    $2438585bd7e1d91e$var$send_code(s, $2438585bd7e1d91e$var$END_BLOCK, ltree);
};
/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */ const $2438585bd7e1d91e$var$build_tree = (s, desc)=>{
    //    deflate_state *s;
    //    tree_desc *desc; /* the tree descriptor */
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m; /* iterate over heap elements */ 
    let max_code = -1; /* largest code with non zero frequency */ 
    let node; /* new node being created */ 
    /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */ s.heap_len = 0;
    s.heap_max = $2438585bd7e1d91e$var$HEAP_SIZE$1;
    for(n = 0; n < elems; n++)if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
    } else tree[n * 2 + 1] = 0;
    /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */ while(s.heap_len < 2){
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) s.static_len -= stree[node * 2 + 1] /*.Len*/ ;
    /* node is 0 or 1 so it does not have extra bits */ }
    desc.max_code = max_code;
    /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */ for(n = s.heap_len >> 1 /*int /2*/ ; n >= 1; n--)$2438585bd7e1d91e$var$pqdownheap(s, tree, n);
    /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */ node = elems; /* next internal node of the tree */ 
    do {
        //pqremove(s, tree, n);  /* n = node of least frequency */
        /*** pqremove ***/ n = s.heap[1 /*SMALLEST*/ ];
        s.heap[1 /*SMALLEST*/ ] = s.heap[s.heap_len--];
        $2438585bd7e1d91e$var$pqdownheap(s, tree, 1 /*SMALLEST*/ );
        /***/ m = s.heap[1 /*SMALLEST*/ ]; /* m = node of next least frequency */ 
        s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */ 
        s.heap[--s.heap_max] = m;
        /* Create a new node father of n and m */ tree[node * 2] = tree[n * 2] + tree[m * 2] /*.Freq*/ ;
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        /* and insert the new node in the heap */ s.heap[1 /*SMALLEST*/ ] = node++;
        $2438585bd7e1d91e$var$pqdownheap(s, tree, 1 /*SMALLEST*/ );
    }while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1 /*SMALLEST*/ ];
    /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */ $2438585bd7e1d91e$var$gen_bitlen(s, desc);
    /* The field len is now set, we can generate the bit codes */ $2438585bd7e1d91e$var$gen_codes(tree, max_code, s.bl_count);
};
/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */ const $2438585bd7e1d91e$var$scan_tree = (s, tree, max_code)=>{
    //    deflate_state *s;
    //    ct_data *tree;   /* the tree to be scanned */
    //    int max_code;    /* and its largest code of non zero frequency */
    let n; /* iterates over all tree elements */ 
    let prevlen = -1; /* last emitted length */ 
    let curlen; /* length of current code */ 
    let nextlen = tree[1] /*.Len*/ ; /* length of next code */ 
    let count = 0; /* repeat count of the current code */ 
    let max_count = 7; /* max repeat count */ 
    let min_count = 4; /* min repeat count */ 
    if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 0xffff; /* guard */ 
    for(n = 0; n <= max_code; n++){
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1] /*.Len*/ ;
        if (++count < max_count && curlen === nextlen) continue;
        else if (count < min_count) s.bl_tree[curlen * 2] += count;
        else if (curlen !== 0) {
            if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
            s.bl_tree[$2438585bd7e1d91e$var$REP_3_6 * 2]++;
        } else if (count <= 10) s.bl_tree[$2438585bd7e1d91e$var$REPZ_3_10 * 2]++;
        else s.bl_tree[$2438585bd7e1d91e$var$REPZ_11_138 * 2]++;
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
        } else {
            max_count = 7;
            min_count = 4;
        }
    }
};
/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */ const $2438585bd7e1d91e$var$send_tree = (s, tree, max_code)=>{
    //    deflate_state *s;
    //    ct_data *tree; /* the tree to be scanned */
    //    int max_code;       /* and its largest code of non zero frequency */
    let n; /* iterates over all tree elements */ 
    let prevlen = -1; /* last emitted length */ 
    let curlen; /* length of current code */ 
    let nextlen = tree[1] /*.Len*/ ; /* length of next code */ 
    let count = 0; /* repeat count of the current code */ 
    let max_count = 7; /* max repeat count */ 
    let min_count = 4; /* min repeat count */ 
    /* tree[max_code+1].Len = -1; */ /* guard already set */ if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
    }
    for(n = 0; n <= max_code; n++){
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1] /*.Len*/ ;
        if (++count < max_count && curlen === nextlen) continue;
        else if (count < min_count) do $2438585bd7e1d91e$var$send_code(s, curlen, s.bl_tree);
        while (--count !== 0);
        else if (curlen !== 0) {
            if (curlen !== prevlen) {
                $2438585bd7e1d91e$var$send_code(s, curlen, s.bl_tree);
                count--;
            }
            //Assert(count >= 3 && count <= 6, " 3_6?");
            $2438585bd7e1d91e$var$send_code(s, $2438585bd7e1d91e$var$REP_3_6, s.bl_tree);
            $2438585bd7e1d91e$var$send_bits(s, count - 3, 2);
        } else if (count <= 10) {
            $2438585bd7e1d91e$var$send_code(s, $2438585bd7e1d91e$var$REPZ_3_10, s.bl_tree);
            $2438585bd7e1d91e$var$send_bits(s, count - 3, 3);
        } else {
            $2438585bd7e1d91e$var$send_code(s, $2438585bd7e1d91e$var$REPZ_11_138, s.bl_tree);
            $2438585bd7e1d91e$var$send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
        } else {
            max_count = 7;
            min_count = 4;
        }
    }
};
/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */ const $2438585bd7e1d91e$var$build_bl_tree = (s)=>{
    let max_blindex; /* index of last bit length code of non zero freq */ 
    /* Determine the bit length frequencies for literal and distance trees */ $2438585bd7e1d91e$var$scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    $2438585bd7e1d91e$var$scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    /* Build the bit length tree: */ $2438585bd7e1d91e$var$build_tree(s, s.bl_desc);
    /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */ /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */ for(max_blindex = $2438585bd7e1d91e$var$BL_CODES$1 - 1; max_blindex >= 3; max_blindex--){
        if (s.bl_tree[$2438585bd7e1d91e$var$bl_order[max_blindex] * 2 + 1] !== 0) break;
    }
    /* Update opt_len to include the bit length tree and counts */ s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
    //        s->opt_len, s->static_len));
    return max_blindex;
};
/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */ const $2438585bd7e1d91e$var$send_all_trees = (s, lcodes, dcodes, blcodes)=>{
    //    deflate_state *s;
    //    int lcodes, dcodes, blcodes; /* number of codes for each tree */
    let rank; /* index in bl_order */ 
    //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
    //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
    //        "too many codes");
    //Tracev((stderr, "\nbl counts: "));
    $2438585bd7e1d91e$var$send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */ 
    $2438585bd7e1d91e$var$send_bits(s, dcodes - 1, 5);
    $2438585bd7e1d91e$var$send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */ 
    for(rank = 0; rank < blcodes; rank++)//Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    $2438585bd7e1d91e$var$send_bits(s, s.bl_tree[$2438585bd7e1d91e$var$bl_order[rank] * 2 + 1], 3);
    //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));
    $2438585bd7e1d91e$var$send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */ 
    //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));
    $2438585bd7e1d91e$var$send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */ 
//Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};
/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */ const $2438585bd7e1d91e$var$detect_data_type = (s)=>{
    /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */ let block_mask = 0xf3ffc07f;
    let n;
    /* Check for non-textual ("block-listed") bytes. */ for(n = 0; n <= 31; n++, block_mask >>>= 1){
        if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) return $2438585bd7e1d91e$var$Z_BINARY;
    }
    /* Check for textual ("allow-listed") bytes. */ if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return $2438585bd7e1d91e$var$Z_TEXT;
    for(n = 32; n < $2438585bd7e1d91e$var$LITERALS$1; n++){
        if (s.dyn_ltree[n * 2] !== 0) return $2438585bd7e1d91e$var$Z_TEXT;
    }
    /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */ return $2438585bd7e1d91e$var$Z_BINARY;
};
let $2438585bd7e1d91e$var$static_init_done = false;
/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */ const $2438585bd7e1d91e$var$_tr_init$1 = (s)=>{
    if (!$2438585bd7e1d91e$var$static_init_done) {
        $2438585bd7e1d91e$var$tr_static_init();
        $2438585bd7e1d91e$var$static_init_done = true;
    }
    s.l_desc = new $2438585bd7e1d91e$var$TreeDesc(s.dyn_ltree, $2438585bd7e1d91e$var$static_l_desc);
    s.d_desc = new $2438585bd7e1d91e$var$TreeDesc(s.dyn_dtree, $2438585bd7e1d91e$var$static_d_desc);
    s.bl_desc = new $2438585bd7e1d91e$var$TreeDesc(s.bl_tree, $2438585bd7e1d91e$var$static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    /* Initialize the first block of the first file: */ $2438585bd7e1d91e$var$init_block(s);
};
/* ===========================================================================
 * Send a stored block
 */ const $2438585bd7e1d91e$var$_tr_stored_block$1 = (s, buf, stored_len, last)=>{
    //DeflateState *s;
    //charf *buf;       /* input block */
    //ulg stored_len;   /* length of input block */
    //int last;         /* one if this is the last block for a file */
    $2438585bd7e1d91e$var$send_bits(s, ($2438585bd7e1d91e$var$STORED_BLOCK << 1) + (last ? 1 : 0), 3); /* send block type */ 
    $2438585bd7e1d91e$var$bi_windup(s); /* align on byte boundary */ 
    $2438585bd7e1d91e$var$put_short(s, stored_len);
    $2438585bd7e1d91e$var$put_short(s, ~stored_len);
    if (stored_len) s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    s.pending += stored_len;
};
/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */ const $2438585bd7e1d91e$var$_tr_align$1 = (s)=>{
    $2438585bd7e1d91e$var$send_bits(s, $2438585bd7e1d91e$var$STATIC_TREES << 1, 3);
    $2438585bd7e1d91e$var$send_code(s, $2438585bd7e1d91e$var$END_BLOCK, $2438585bd7e1d91e$var$static_ltree);
    $2438585bd7e1d91e$var$bi_flush(s);
};
/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */ const $2438585bd7e1d91e$var$_tr_flush_block$1 = (s, buf, stored_len, last)=>{
    //DeflateState *s;
    //charf *buf;       /* input block, or NULL if too old */
    //ulg stored_len;   /* length of input block */
    //int last;         /* one if this is the last block for a file */
    let opt_lenb, static_lenb; /* opt_len and static_len in bytes */ 
    let max_blindex = 0; /* index of last bit length code of non zero freq */ 
    /* Build the Huffman trees unless a stored block is forced */ if (s.level > 0) {
        /* Check if the file is binary or text */ if (s.strm.data_type === $2438585bd7e1d91e$var$Z_UNKNOWN$1) s.strm.data_type = $2438585bd7e1d91e$var$detect_data_type(s);
        /* Construct the literal and distance trees */ $2438585bd7e1d91e$var$build_tree(s, s.l_desc);
        // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
        //        s->static_len));
        $2438585bd7e1d91e$var$build_tree(s, s.d_desc);
        // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
        //        s->static_len));
        /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */ /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */ max_blindex = $2438585bd7e1d91e$var$build_bl_tree(s);
        /* Determine the best encoding. Compute the block lengths in bytes. */ opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
        //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
        //        s->sym_next / 3));
        if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
    } else // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */ 
    if (stored_len + 4 <= opt_lenb && buf !== -1) /* 4: two words for the lengths */ /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */ $2438585bd7e1d91e$var$_tr_stored_block$1(s, buf, stored_len, last);
    else if (s.strategy === $2438585bd7e1d91e$var$Z_FIXED$1 || static_lenb === opt_lenb) {
        $2438585bd7e1d91e$var$send_bits(s, ($2438585bd7e1d91e$var$STATIC_TREES << 1) + (last ? 1 : 0), 3);
        $2438585bd7e1d91e$var$compress_block(s, $2438585bd7e1d91e$var$static_ltree, $2438585bd7e1d91e$var$static_dtree);
    } else {
        $2438585bd7e1d91e$var$send_bits(s, ($2438585bd7e1d91e$var$DYN_TREES << 1) + (last ? 1 : 0), 3);
        $2438585bd7e1d91e$var$send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        $2438585bd7e1d91e$var$compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
    /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */ $2438585bd7e1d91e$var$init_block(s);
    if (last) $2438585bd7e1d91e$var$bi_windup(s);
// Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
//       s->compressed_len-7*last));
};
/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */ const $2438585bd7e1d91e$var$_tr_tally$1 = (s, dist, lc)=>{
    //    deflate_state *s;
    //    unsigned dist;  /* distance of matched string */
    //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) /* lc is the unmatched char */ s.dyn_ltree[lc * 2]++;
    else {
        s.matches++;
        /* Here, lc is the match length - MIN_MATCH */ dist--; /* dist = match distance - 1 */ 
        //Assert((ush)dist < (ush)MAX_DIST(s) &&
        //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
        //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");
        s.dyn_ltree[($2438585bd7e1d91e$var$_length_code[lc] + $2438585bd7e1d91e$var$LITERALS$1 + 1) * 2]++;
        s.dyn_dtree[$2438585bd7e1d91e$var$d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
};
var $2438585bd7e1d91e$var$_tr_init_1 = $2438585bd7e1d91e$var$_tr_init$1;
var $2438585bd7e1d91e$var$_tr_stored_block_1 = $2438585bd7e1d91e$var$_tr_stored_block$1;
var $2438585bd7e1d91e$var$_tr_flush_block_1 = $2438585bd7e1d91e$var$_tr_flush_block$1;
var $2438585bd7e1d91e$var$_tr_tally_1 = $2438585bd7e1d91e$var$_tr_tally$1;
var $2438585bd7e1d91e$var$_tr_align_1 = $2438585bd7e1d91e$var$_tr_align$1;
var $2438585bd7e1d91e$var$trees = {
    _tr_init: $2438585bd7e1d91e$var$_tr_init_1,
    _tr_stored_block: $2438585bd7e1d91e$var$_tr_stored_block_1,
    _tr_flush_block: $2438585bd7e1d91e$var$_tr_flush_block_1,
    _tr_tally: $2438585bd7e1d91e$var$_tr_tally_1,
    _tr_align: $2438585bd7e1d91e$var$_tr_align_1
};
// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
const $2438585bd7e1d91e$var$adler32 = (adler, buf, len, pos)=>{
    let s1 = adler & 0xffff | 0, s2 = adler >>> 16 & 0xffff | 0, n = 0;
    while(len !== 0){
        // Set limit ~ twice less than 5552, to keep
        // s2 in 31-bits, because we force signed ints.
        // in other case %= will fail.
        n = len > 2000 ? 2000 : len;
        len -= n;
        do {
            s1 = s1 + buf[pos++] | 0;
            s2 = s2 + s1 | 0;
        }while (--n);
        s1 %= 65521;
        s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
};
var $2438585bd7e1d91e$var$adler32_1 = $2438585bd7e1d91e$var$adler32;
// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
// Use ordinary array, since untyped makes no boost here
const $2438585bd7e1d91e$var$makeTable = ()=>{
    let c, table = [];
    for(var n = 0; n < 256; n++){
        c = n;
        for(var k = 0; k < 8; k++)c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
        table[n] = c;
    }
    return table;
};
// Create table on load. Just 255 signed longs. Not a problem.
const $2438585bd7e1d91e$var$crcTable = new Uint32Array($2438585bd7e1d91e$var$makeTable());
const $2438585bd7e1d91e$var$crc32 = (crc, buf, len, pos)=>{
    const t = $2438585bd7e1d91e$var$crcTable;
    const end = pos + len;
    crc ^= -1;
    for(let i = pos; i < end; i++)crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];
    return crc ^ -1; // >>> 0;
};
var $2438585bd7e1d91e$var$crc32_1 = $2438585bd7e1d91e$var$crc32;
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
var $2438585bd7e1d91e$var$messages = {
    2: 'need dictionary',
    /* Z_NEED_DICT       2  */ 1: 'stream end',
    /* Z_STREAM_END      1  */ 0: '',
    /* Z_OK              0  */ '-1': 'file error',
    /* Z_ERRNO         (-1) */ '-2': 'stream error',
    /* Z_STREAM_ERROR  (-2) */ '-3': 'data error',
    /* Z_DATA_ERROR    (-3) */ '-4': 'insufficient memory',
    /* Z_MEM_ERROR     (-4) */ '-5': 'buffer error',
    /* Z_BUF_ERROR     (-5) */ '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */ 
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
var $2438585bd7e1d91e$var$constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */ Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */ Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */ Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */ Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */ Z_DEFLATED: 8
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
const { _tr_init: $2438585bd7e1d91e$var$_tr_init, _tr_stored_block: $2438585bd7e1d91e$var$_tr_stored_block, _tr_flush_block: $2438585bd7e1d91e$var$_tr_flush_block, _tr_tally: $2438585bd7e1d91e$var$_tr_tally, _tr_align: $2438585bd7e1d91e$var$_tr_align } = $2438585bd7e1d91e$var$trees;
/* Public constants ==========================================================*/ /* ===========================================================================*/ const { Z_NO_FLUSH: $2438585bd7e1d91e$var$Z_NO_FLUSH$2, Z_PARTIAL_FLUSH: $2438585bd7e1d91e$var$Z_PARTIAL_FLUSH, Z_FULL_FLUSH: $2438585bd7e1d91e$var$Z_FULL_FLUSH$1, Z_FINISH: $2438585bd7e1d91e$var$Z_FINISH$3, Z_BLOCK: $2438585bd7e1d91e$var$Z_BLOCK$1, Z_OK: $2438585bd7e1d91e$var$Z_OK$3, Z_STREAM_END: $2438585bd7e1d91e$var$Z_STREAM_END$3, Z_STREAM_ERROR: $2438585bd7e1d91e$var$Z_STREAM_ERROR$2, Z_DATA_ERROR: $2438585bd7e1d91e$var$Z_DATA_ERROR$2, Z_BUF_ERROR: $2438585bd7e1d91e$var$Z_BUF_ERROR$1, Z_DEFAULT_COMPRESSION: $2438585bd7e1d91e$var$Z_DEFAULT_COMPRESSION$1, Z_FILTERED: $2438585bd7e1d91e$var$Z_FILTERED, Z_HUFFMAN_ONLY: $2438585bd7e1d91e$var$Z_HUFFMAN_ONLY, Z_RLE: $2438585bd7e1d91e$var$Z_RLE, Z_FIXED: $2438585bd7e1d91e$var$Z_FIXED, Z_DEFAULT_STRATEGY: $2438585bd7e1d91e$var$Z_DEFAULT_STRATEGY$1, Z_UNKNOWN: $2438585bd7e1d91e$var$Z_UNKNOWN, Z_DEFLATED: $2438585bd7e1d91e$var$Z_DEFLATED$2 } = $2438585bd7e1d91e$var$constants$2;
/*============================================================================*/ const $2438585bd7e1d91e$var$MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */ const $2438585bd7e1d91e$var$MAX_WBITS$1 = 15;
/* 32K LZ77 window */ const $2438585bd7e1d91e$var$DEF_MEM_LEVEL = 8;
const $2438585bd7e1d91e$var$LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */ const $2438585bd7e1d91e$var$LITERALS = 256;
/* number of literal bytes 0..255 */ const $2438585bd7e1d91e$var$L_CODES = $2438585bd7e1d91e$var$LITERALS + 1 + $2438585bd7e1d91e$var$LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */ const $2438585bd7e1d91e$var$D_CODES = 30;
/* number of distance codes */ const $2438585bd7e1d91e$var$BL_CODES = 19;
/* number of codes used to transfer the bit lengths */ const $2438585bd7e1d91e$var$HEAP_SIZE = 2 * $2438585bd7e1d91e$var$L_CODES + 1;
/* maximum heap size */ const $2438585bd7e1d91e$var$MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */ const $2438585bd7e1d91e$var$MIN_MATCH = 3;
const $2438585bd7e1d91e$var$MAX_MATCH = 258;
const $2438585bd7e1d91e$var$MIN_LOOKAHEAD = $2438585bd7e1d91e$var$MAX_MATCH + $2438585bd7e1d91e$var$MIN_MATCH + 1;
const $2438585bd7e1d91e$var$PRESET_DICT = 0x20;
const $2438585bd7e1d91e$var$INIT_STATE = 42; /* zlib header -> BUSY_STATE */ 
//#ifdef GZIP
const $2438585bd7e1d91e$var$GZIP_STATE = 57; /* gzip header -> BUSY_STATE | EXTRA_STATE */ 
//#endif
const $2438585bd7e1d91e$var$EXTRA_STATE = 69; /* gzip extra block -> NAME_STATE */ 
const $2438585bd7e1d91e$var$NAME_STATE = 73; /* gzip file name -> COMMENT_STATE */ 
const $2438585bd7e1d91e$var$COMMENT_STATE = 91; /* gzip comment -> HCRC_STATE */ 
const $2438585bd7e1d91e$var$HCRC_STATE = 103; /* gzip header CRC -> BUSY_STATE */ 
const $2438585bd7e1d91e$var$BUSY_STATE = 113; /* deflate -> FINISH_STATE */ 
const $2438585bd7e1d91e$var$FINISH_STATE = 666; /* stream complete */ 
const $2438585bd7e1d91e$var$BS_NEED_MORE = 1; /* block not completed, need more input or more output */ 
const $2438585bd7e1d91e$var$BS_BLOCK_DONE = 2; /* block flush performed */ 
const $2438585bd7e1d91e$var$BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */ 
const $2438585bd7e1d91e$var$BS_FINISH_DONE = 4; /* finish done, accept no more input or output */ 
const $2438585bd7e1d91e$var$OS_CODE = 0x03; // Unix :) . Don't detect, use this default.
const $2438585bd7e1d91e$var$err = (strm, errorCode)=>{
    strm.msg = $2438585bd7e1d91e$var$messages[errorCode];
    return errorCode;
};
const $2438585bd7e1d91e$var$rank = (f)=>{
    return f * 2 - (f > 4 ? 9 : 0);
};
const $2438585bd7e1d91e$var$zero = (buf)=>{
    let len = buf.length;
    while(--len >= 0)buf[len] = 0;
};
/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */ const $2438585bd7e1d91e$var$slide_hash = (s)=>{
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
        m = s.head[--p];
        s.head[p] = m >= wsize ? m - wsize : 0;
    }while (--n);
    n = wsize;
    //#ifndef FASTEST
    p = n;
    do {
        m = s.prev[--p];
        s.prev[p] = m >= wsize ? m - wsize : 0;
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */ }while (--n);
//#endif
};
/* eslint-disable new-cap */ let $2438585bd7e1d91e$var$HASH_ZLIB = (s, prev, data)=>(prev << s.hash_shift ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let $2438585bd7e1d91e$var$HASH = $2438585bd7e1d91e$var$HASH_ZLIB;
/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */ const $2438585bd7e1d91e$var$flush_pending = (strm)=>{
    const s = strm.state;
    //_tr_flush_bits(s);
    let len = s.pending;
    if (len > strm.avail_out) len = strm.avail_out;
    if (len === 0) return;
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) s.pending_out = 0;
};
const $2438585bd7e1d91e$var$flush_block_only = (s, last)=>{
    $2438585bd7e1d91e$var$_tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    $2438585bd7e1d91e$var$flush_pending(s.strm);
};
const $2438585bd7e1d91e$var$put_byte = (s, b)=>{
    s.pending_buf[s.pending++] = b;
};
/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */ const $2438585bd7e1d91e$var$putShortMSB = (s, b)=>{
    //  put_byte(s, (Byte)(b >> 8));
    //  put_byte(s, (Byte)(b & 0xff));
    s.pending_buf[s.pending++] = b >>> 8 & 0xff;
    s.pending_buf[s.pending++] = b & 0xff;
};
/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */ const $2438585bd7e1d91e$var$read_buf = (strm, buf, start, size)=>{
    let len = strm.avail_in;
    if (len > size) len = size;
    if (len === 0) return 0;
    strm.avail_in -= len;
    // zmemcpy(buf, strm->next_in, len);
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) strm.adler = $2438585bd7e1d91e$var$adler32_1(strm.adler, buf, len, start);
    else if (strm.state.wrap === 2) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, buf, len, start);
    strm.next_in += len;
    strm.total_in += len;
    return len;
};
/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */ const $2438585bd7e1d91e$var$longest_match = (s, cur_match)=>{
    let chain_length = s.max_chain_length; /* max hash chain length */ 
    let scan = s.strstart; /* current string */ 
    let match; /* matched string */ 
    let len; /* length of current match */ 
    let best_len = s.prev_length; /* best match length so far */ 
    let nice_match = s.nice_match; /* stop if match long enough */ 
    const limit = s.strstart > s.w_size - $2438585bd7e1d91e$var$MIN_LOOKAHEAD ? s.strstart - (s.w_size - $2438585bd7e1d91e$var$MIN_LOOKAHEAD) : 0 /*NIL*/ ;
    const _win = s.window; // shortcut
    const wmask = s.w_mask;
    const prev = s.prev;
    /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */ const strend = s.strstart + $2438585bd7e1d91e$var$MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */ // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");
    /* Do not waste too much time if we already have a good match: */ if (s.prev_length >= s.good_match) chain_length >>= 2;
    /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */ if (nice_match > s.lookahead) nice_match = s.lookahead;
    // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");
    do {
        // Assert(cur_match < s->strstart, "no future");
        match = cur_match;
        /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */ if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
        /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */ scan += 2;
        match++;
        // Assert(*scan == *match, "match[2]?");
        /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */ do ;
        while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");
        len = $2438585bd7e1d91e$var$MAX_MATCH - (strend - scan);
        scan = strend - $2438585bd7e1d91e$var$MAX_MATCH;
        if (len > best_len) {
            s.match_start = cur_match;
            best_len = len;
            if (len >= nice_match) break;
            scan_end1 = _win[scan + best_len - 1];
            scan_end = _win[scan + best_len];
        }
    }while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) return best_len;
    return s.lookahead;
};
/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */ const $2438585bd7e1d91e$var$fill_window = (s)=>{
    const _w_size = s.w_size;
    let n, more, str;
    //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");
    do {
        more = s.window_size - s.lookahead - s.strstart;
        // JS ints have 32 bit, block below not needed
        /* Deal with !@#$% 64K limit: */ //if (sizeof(int) <= 2) {
        //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
        //        more = wsize;
        //
        //  } else if (more == (unsigned)(-1)) {
        //        /* Very unlikely, but possible on 16 bit machine if
        //         * strstart == 0 && lookahead == 1 (input done a byte at time)
        //         */
        //        more--;
        //    }
        //}
        /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */ if (s.strstart >= _w_size + (_w_size - $2438585bd7e1d91e$var$MIN_LOOKAHEAD)) {
            s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
            s.match_start -= _w_size;
            s.strstart -= _w_size;
            /* we now have strstart >= MAX_DIST */ s.block_start -= _w_size;
            if (s.insert > s.strstart) s.insert = s.strstart;
            $2438585bd7e1d91e$var$slide_hash(s);
            more += _w_size;
        }
        if (s.strm.avail_in === 0) break;
        /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */ //Assert(more >= 2, "more < 2");
        n = $2438585bd7e1d91e$var$read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        /* Initialize the hash value now that we have some input: */ if (s.lookahead + s.insert >= $2438585bd7e1d91e$var$MIN_MATCH) {
            str = s.strstart - s.insert;
            s.ins_h = s.window[str];
            /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[str + 1]);
            //#if MIN_MATCH != 3
            //        Call update_hash() MIN_MATCH-3 more times
            //#endif
            while(s.insert){
                /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[str + $2438585bd7e1d91e$var$MIN_MATCH - 1]);
                s.prev[str & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = str;
                str++;
                s.insert--;
                if (s.lookahead + s.insert < $2438585bd7e1d91e$var$MIN_MATCH) break;
            }
        }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */ }while (s.lookahead < $2438585bd7e1d91e$var$MIN_LOOKAHEAD && s.strm.avail_in !== 0);
/* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */ //  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};
/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */ const $2438585bd7e1d91e$var$deflate_stored = (s, flush)=>{
    /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */ let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */ let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
        /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */ len = 65535 /* MAX_STORED */ ; /* maximum deflate stored block length */ 
        have = s.bi_valid + 42 >> 3; /* number of header bytes */ 
        if (s.strm.avail_out < have) break;
        /* maximum stored block length that will fit in avail_out: */ have = s.strm.avail_out - have;
        left = s.strstart - s.block_start; /* bytes left in window */ 
        if (len > left + s.strm.avail_in) len = left + s.strm.avail_in; /* limit len to the input */ 
        if (len > have) len = have; /* limit len to the output */ 
        /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */ if (len < min_block && (len === 0 && flush !== $2438585bd7e1d91e$var$Z_FINISH$3 || flush === $2438585bd7e1d91e$var$Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) break;
        /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */ last = flush === $2438585bd7e1d91e$var$Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
        $2438585bd7e1d91e$var$_tr_stored_block(s, 0, 0, last);
        /* Replace the lengths in the dummy stored block with len. */ s.pending_buf[s.pending - 4] = len;
        s.pending_buf[s.pending - 3] = len >> 8;
        s.pending_buf[s.pending - 2] = ~len;
        s.pending_buf[s.pending - 1] = ~len >> 8;
        /* Write the stored block header bytes. */ $2438585bd7e1d91e$var$flush_pending(s.strm);
        //#ifdef ZLIB_DEBUG
        //    /* Update debugging counts for the data about to be copied. */
        //    s->compressed_len += len << 3;
        //    s->bits_sent += len << 3;
        //#endif
        /* Copy uncompressed bytes from the window to next_out. */ if (left) {
            if (left > len) left = len;
            //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
            s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
            s.strm.next_out += left;
            s.strm.avail_out -= left;
            s.strm.total_out += left;
            s.block_start += left;
            len -= left;
        }
        /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */ if (len) {
            $2438585bd7e1d91e$var$read_buf(s.strm, s.strm.output, s.strm.next_out, len);
            s.strm.next_out += len;
            s.strm.avail_out -= len;
            s.strm.total_out += len;
        }
    }while (last === 0);
    /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */ used -= s.strm.avail_in; /* number of input bytes directly copied */ 
    if (used) {
        /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */ if (used >= s.w_size) {
            s.matches = 2; /* clear hash */ 
            //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
            s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
            s.strstart = s.w_size;
            s.insert = s.strstart;
        } else {
            if (s.window_size - s.strstart <= used) {
                /* Slide the window down. */ s.strstart -= s.w_size;
                //zmemcpy(s->window, s->window + s->w_size, s->strstart);
                s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
                if (s.matches < 2) s.matches++; /* add a pending slide_hash() */ 
                if (s.insert > s.strstart) s.insert = s.strstart;
            }
            //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
            s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
            s.strstart += used;
            s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
        }
        s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) s.high_water = s.strstart;
    /* If the last block was written to next_out, then done. */ if (last) return $2438585bd7e1d91e$var$BS_FINISH_DONE;
    /* If flushing and all input has been consumed, then done. */ if (flush !== $2438585bd7e1d91e$var$Z_NO_FLUSH$2 && flush !== $2438585bd7e1d91e$var$Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) return $2438585bd7e1d91e$var$BS_BLOCK_DONE;
    /* Fill the window with any remaining input. */ have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
        /* Slide the window down. */ s.block_start -= s.w_size;
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) s.matches++; /* add a pending slide_hash() */ 
        have += s.w_size; /* more space now */ 
        if (s.insert > s.strstart) s.insert = s.strstart;
    }
    if (have > s.strm.avail_in) have = s.strm.avail_in;
    if (have) {
        $2438585bd7e1d91e$var$read_buf(s.strm, s.window, s.strstart, have);
        s.strstart += have;
        s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) s.high_water = s.strstart;
    /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */ have = s.bi_valid + 42 >> 3; /* number of header bytes */ 
    /* maximum stored block length that will fit in pending: */ have = s.pending_buf_size - have > 65535 /* MAX_STORED */  ? 65535 /* MAX_STORED */  : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === $2438585bd7e1d91e$var$Z_FINISH$3) && flush !== $2438585bd7e1d91e$var$Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
        len = left > have ? have : left;
        last = flush === $2438585bd7e1d91e$var$Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
        $2438585bd7e1d91e$var$_tr_stored_block(s, s.block_start, len, last);
        s.block_start += len;
        $2438585bd7e1d91e$var$flush_pending(s.strm);
    }
    /* We've done all we can with the available input and output. */ return last ? $2438585bd7e1d91e$var$BS_FINISH_STARTED : $2438585bd7e1d91e$var$BS_NEED_MORE;
};
/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */ const $2438585bd7e1d91e$var$deflate_fast = (s, flush)=>{
    let hash_head; /* head of the hash chain */ 
    let bflush; /* set if current block must be flushed */ 
    for(;;){
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */ if (s.lookahead < $2438585bd7e1d91e$var$MIN_LOOKAHEAD) {
            $2438585bd7e1d91e$var$fill_window(s);
            if (s.lookahead < $2438585bd7e1d91e$var$MIN_LOOKAHEAD && flush === $2438585bd7e1d91e$var$Z_NO_FLUSH$2) return $2438585bd7e1d91e$var$BS_NEED_MORE;
            if (s.lookahead === 0) break; /* flush the current block */ 
        }
        /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */ hash_head = 0 /*NIL*/ ;
        if (s.lookahead >= $2438585bd7e1d91e$var$MIN_MATCH) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[s.strstart + $2438585bd7e1d91e$var$MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
        /***/ }
        /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */ if (hash_head !== 0 /*NIL*/  && s.strstart - hash_head <= s.w_size - $2438585bd7e1d91e$var$MIN_LOOKAHEAD) /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */ s.match_length = $2438585bd7e1d91e$var$longest_match(s, hash_head);
        if (s.match_length >= $2438585bd7e1d91e$var$MIN_MATCH) {
            // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only
            /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, s.strstart - s.match_start, s.match_length - $2438585bd7e1d91e$var$MIN_MATCH);
            s.lookahead -= s.match_length;
            /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */ if (s.match_length <= s.max_lazy_match /*max_insert_length*/  && s.lookahead >= $2438585bd7e1d91e$var$MIN_MATCH) {
                s.match_length--; /* string at strstart already in table */ 
                do {
                    s.strstart++;
                    /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[s.strstart + $2438585bd7e1d91e$var$MIN_MATCH - 1]);
                    hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                    s.head[s.ins_h] = s.strstart;
                /***/ /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */ }while (--s.match_length !== 0);
                s.strstart++;
            } else {
                s.strstart += s.match_length;
                s.match_length = 0;
                s.ins_h = s.window[s.strstart];
                /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[s.strstart + 1]);
            //#if MIN_MATCH != 3
            //                Call UPDATE_HASH() MIN_MATCH-3 more times
            //#endif
            /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */ }
        } else {
            /* No match, output a literal byte */ //Tracevv((stderr,"%c", s.window[s.strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
        }
        if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = s.strstart < $2438585bd7e1d91e$var$MIN_MATCH - 1 ? s.strstart : $2438585bd7e1d91e$var$MIN_MATCH - 1;
    if (flush === $2438585bd7e1d91e$var$Z_FINISH$3) {
        /*** FLUSH_BLOCK(s, 1); ***/ $2438585bd7e1d91e$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_FINISH_STARTED;
        /***/ return $2438585bd7e1d91e$var$BS_FINISH_DONE;
    }
    if (s.sym_next) {
        /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
    /***/ }
    return $2438585bd7e1d91e$var$BS_BLOCK_DONE;
};
/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */ const $2438585bd7e1d91e$var$deflate_slow = (s, flush)=>{
    let hash_head; /* head of hash chain */ 
    let bflush; /* set if current block must be flushed */ 
    let max_insert;
    /* Process the input block. */ for(;;){
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */ if (s.lookahead < $2438585bd7e1d91e$var$MIN_LOOKAHEAD) {
            $2438585bd7e1d91e$var$fill_window(s);
            if (s.lookahead < $2438585bd7e1d91e$var$MIN_LOOKAHEAD && flush === $2438585bd7e1d91e$var$Z_NO_FLUSH$2) return $2438585bd7e1d91e$var$BS_NEED_MORE;
            if (s.lookahead === 0) break;
             /* flush the current block */ 
        }
        /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */ hash_head = 0 /*NIL*/ ;
        if (s.lookahead >= $2438585bd7e1d91e$var$MIN_MATCH) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[s.strstart + $2438585bd7e1d91e$var$MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
        /***/ }
        /* Find the longest match, discarding those <= prev_length.
     */ s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = $2438585bd7e1d91e$var$MIN_MATCH - 1;
        if (hash_head !== 0 /*NIL*/  && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - $2438585bd7e1d91e$var$MIN_LOOKAHEAD) {
            /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */ s.match_length = $2438585bd7e1d91e$var$longest_match(s, hash_head);
            /* longest_match() sets match_start */ if (s.match_length <= 5 && (s.strategy === $2438585bd7e1d91e$var$Z_FILTERED || s.match_length === $2438585bd7e1d91e$var$MIN_MATCH && s.strstart - s.match_start > 4096 /*TOO_FAR*/ )) /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */ s.match_length = $2438585bd7e1d91e$var$MIN_MATCH - 1;
        }
        /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */ if (s.prev_length >= $2438585bd7e1d91e$var$MIN_MATCH && s.match_length <= s.prev_length) {
            max_insert = s.strstart + s.lookahead - $2438585bd7e1d91e$var$MIN_MATCH;
            /* Do not insert strings in hash table beyond this. */ //check_match(s, s.strstart-1, s.prev_match, s.prev_length);
            /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - $2438585bd7e1d91e$var$MIN_MATCH);
            /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */ s.lookahead -= s.prev_length - 1;
            s.prev_length -= 2;
            do if (++s.strstart <= max_insert) {
                /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[s.strstart + $2438585bd7e1d91e$var$MIN_MATCH - 1]);
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
            /***/ }
            while (--s.prev_length !== 0);
            s.match_available = 0;
            s.match_length = $2438585bd7e1d91e$var$MIN_MATCH - 1;
            s.strstart++;
            if (bflush) {
                /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
                if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
            /***/ }
        } else if (s.match_available) {
            /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */ //Tracevv((stderr,"%c", s->window[s->strstart-1]));
            /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, 0, s.window[s.strstart - 1]);
            if (bflush) /*** FLUSH_BLOCK_ONLY(s, 0) ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
            s.strstart++;
            s.lookahead--;
            if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
        } else {
            /* There is no previous match to compare with, wait for
       * the next step to decide.
       */ s.match_available = 1;
            s.strstart++;
            s.lookahead--;
        }
    }
    //Assert (flush != Z_NO_FLUSH, "no flush?");
    if (s.match_available) {
        //Tracevv((stderr,"%c", s->window[s->strstart-1]));
        /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
    }
    s.insert = s.strstart < $2438585bd7e1d91e$var$MIN_MATCH - 1 ? s.strstart : $2438585bd7e1d91e$var$MIN_MATCH - 1;
    if (flush === $2438585bd7e1d91e$var$Z_FINISH$3) {
        /*** FLUSH_BLOCK(s, 1); ***/ $2438585bd7e1d91e$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_FINISH_STARTED;
        /***/ return $2438585bd7e1d91e$var$BS_FINISH_DONE;
    }
    if (s.sym_next) {
        /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
    /***/ }
    return $2438585bd7e1d91e$var$BS_BLOCK_DONE;
};
/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */ const $2438585bd7e1d91e$var$deflate_rle = (s, flush)=>{
    let bflush; /* set if current block must be flushed */ 
    let prev; /* byte at distance one to match */ 
    let scan, strend; /* scan goes up to strend for length of run */ 
    const _win = s.window;
    for(;;){
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */ if (s.lookahead <= $2438585bd7e1d91e$var$MAX_MATCH) {
            $2438585bd7e1d91e$var$fill_window(s);
            if (s.lookahead <= $2438585bd7e1d91e$var$MAX_MATCH && flush === $2438585bd7e1d91e$var$Z_NO_FLUSH$2) return $2438585bd7e1d91e$var$BS_NEED_MORE;
            if (s.lookahead === 0) break;
             /* flush the current block */ 
        }
        /* See how many times the previous byte repeats */ s.match_length = 0;
        if (s.lookahead >= $2438585bd7e1d91e$var$MIN_MATCH && s.strstart > 0) {
            scan = s.strstart - 1;
            prev = _win[scan];
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                strend = s.strstart + $2438585bd7e1d91e$var$MAX_MATCH;
                do ;
                while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
                s.match_length = $2438585bd7e1d91e$var$MAX_MATCH - (strend - scan);
                if (s.match_length > s.lookahead) s.match_length = s.lookahead;
            }
        //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
        }
        /* Emit match if have run of MIN_MATCH or longer, else emit literal */ if (s.match_length >= $2438585bd7e1d91e$var$MIN_MATCH) {
            //check_match(s, s.strstart, s.strstart - 1, s.match_length);
            /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, 1, s.match_length - $2438585bd7e1d91e$var$MIN_MATCH);
            s.lookahead -= s.match_length;
            s.strstart += s.match_length;
            s.match_length = 0;
        } else {
            /* No match, output a literal byte */ //Tracevv((stderr,"%c", s->window[s->strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
        }
        if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = 0;
    if (flush === $2438585bd7e1d91e$var$Z_FINISH$3) {
        /*** FLUSH_BLOCK(s, 1); ***/ $2438585bd7e1d91e$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_FINISH_STARTED;
        /***/ return $2438585bd7e1d91e$var$BS_FINISH_DONE;
    }
    if (s.sym_next) {
        /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
    /***/ }
    return $2438585bd7e1d91e$var$BS_BLOCK_DONE;
};
/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */ const $2438585bd7e1d91e$var$deflate_huff = (s, flush)=>{
    let bflush; /* set if current block must be flushed */ 
    for(;;){
        /* Make sure that we have a literal to write. */ if (s.lookahead === 0) {
            $2438585bd7e1d91e$var$fill_window(s);
            if (s.lookahead === 0) {
                if (flush === $2438585bd7e1d91e$var$Z_NO_FLUSH$2) return $2438585bd7e1d91e$var$BS_NEED_MORE;
                break; /* flush the current block */ 
            }
        }
        /* Output a literal byte */ s.match_length = 0;
        //Tracevv((stderr,"%c", s->window[s->strstart]));
        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/ bflush = $2438585bd7e1d91e$var$_tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = 0;
    if (flush === $2438585bd7e1d91e$var$Z_FINISH$3) {
        /*** FLUSH_BLOCK(s, 1); ***/ $2438585bd7e1d91e$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_FINISH_STARTED;
        /***/ return $2438585bd7e1d91e$var$BS_FINISH_DONE;
    }
    if (s.sym_next) {
        /*** FLUSH_BLOCK(s, 0); ***/ $2438585bd7e1d91e$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $2438585bd7e1d91e$var$BS_NEED_MORE;
    /***/ }
    return $2438585bd7e1d91e$var$BS_BLOCK_DONE;
};
/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */ function $2438585bd7e1d91e$var$Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
}
const $2438585bd7e1d91e$var$configuration_table = [
    /*      good lazy nice chain */ new $2438585bd7e1d91e$var$Config(0, 0, 0, 0, $2438585bd7e1d91e$var$deflate_stored),
    /* 0 store only */ new $2438585bd7e1d91e$var$Config(4, 4, 8, 4, $2438585bd7e1d91e$var$deflate_fast),
    /* 1 max speed, no lazy matches */ new $2438585bd7e1d91e$var$Config(4, 5, 16, 8, $2438585bd7e1d91e$var$deflate_fast),
    /* 2 */ new $2438585bd7e1d91e$var$Config(4, 6, 32, 32, $2438585bd7e1d91e$var$deflate_fast),
    /* 3 */ new $2438585bd7e1d91e$var$Config(4, 4, 16, 16, $2438585bd7e1d91e$var$deflate_slow),
    /* 4 lazy matches */ new $2438585bd7e1d91e$var$Config(8, 16, 32, 32, $2438585bd7e1d91e$var$deflate_slow),
    /* 5 */ new $2438585bd7e1d91e$var$Config(8, 16, 128, 128, $2438585bd7e1d91e$var$deflate_slow),
    /* 6 */ new $2438585bd7e1d91e$var$Config(8, 32, 128, 256, $2438585bd7e1d91e$var$deflate_slow),
    /* 7 */ new $2438585bd7e1d91e$var$Config(32, 128, 258, 1024, $2438585bd7e1d91e$var$deflate_slow),
    /* 8 */ new $2438585bd7e1d91e$var$Config(32, 258, 258, 4096, $2438585bd7e1d91e$var$deflate_slow)
];
/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */ const $2438585bd7e1d91e$var$lm_init = (s)=>{
    s.window_size = 2 * s.w_size;
    /*** CLEAR_HASH(s); ***/ $2438585bd7e1d91e$var$zero(s.head); // Fill with NIL (= 0);
    /* Set the default configuration parameters:
   */ s.max_lazy_match = $2438585bd7e1d91e$var$configuration_table[s.level].max_lazy;
    s.good_match = $2438585bd7e1d91e$var$configuration_table[s.level].good_length;
    s.nice_match = $2438585bd7e1d91e$var$configuration_table[s.level].nice_length;
    s.max_chain_length = $2438585bd7e1d91e$var$configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = $2438585bd7e1d91e$var$MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
};
function $2438585bd7e1d91e$var$DeflateState() {
    this.strm = null; /* pointer back to this zlib stream */ 
    this.status = 0; /* as the name implies */ 
    this.pending_buf = null; /* output still pending */ 
    this.pending_buf_size = 0; /* size of pending_buf */ 
    this.pending_out = 0; /* next pending byte to output to the stream */ 
    this.pending = 0; /* nb of bytes in the pending buffer */ 
    this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */ 
    this.gzhead = null; /* gzip header information to write */ 
    this.gzindex = 0; /* where in extra, name, or comment */ 
    this.method = $2438585bd7e1d91e$var$Z_DEFLATED$2; /* can only be DEFLATED */ 
    this.last_flush = -1; /* value of flush param for previous deflate call */ 
    this.w_size = 0; /* LZ77 window size (32K by default) */ 
    this.w_bits = 0; /* log2(w_size)  (8..16) */ 
    this.w_mask = 0; /* w_size - 1 */ 
    this.window = null;
    /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */ this.window_size = 0;
    /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */ this.prev = null;
    /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */ this.head = null; /* Heads of the hash chains or NIL. */ 
    this.ins_h = 0; /* hash index of string to be inserted */ 
    this.hash_size = 0; /* number of elements in hash table */ 
    this.hash_bits = 0; /* log2(hash_size) */ 
    this.hash_mask = 0; /* hash_size-1 */ 
    this.hash_shift = 0;
    /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */ this.block_start = 0;
    /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */ this.match_length = 0; /* length of best match */ 
    this.prev_match = 0; /* previous match */ 
    this.match_available = 0; /* set if previous match exists */ 
    this.strstart = 0; /* start of string to insert */ 
    this.match_start = 0; /* start of matching string */ 
    this.lookahead = 0; /* number of valid bytes ahead in window */ 
    this.prev_length = 0;
    /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */ this.max_chain_length = 0;
    /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */ this.max_lazy_match = 0;
    /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */ // That's alias to max_lazy_match, don't use directly
    //this.max_insert_length = 0;
    /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */ this.level = 0; /* compression level (1..9) */ 
    this.strategy = 0; /* favor or force Huffman coding*/ 
    this.good_match = 0;
    /* Use a faster search when the previous match is longer than this */ this.nice_match = 0; /* Stop searching when current match exceeds this */ 
    /* used by trees.c: */ /* Didn't use ct_data typedef below to suppress compiler warning */ // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
    // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
    // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
    // Use flat array of DOUBLE size, with interleaved fata,
    // because JS does not support effective
    this.dyn_ltree = new Uint16Array($2438585bd7e1d91e$var$HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * $2438585bd7e1d91e$var$D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * $2438585bd7e1d91e$var$BL_CODES + 1) * 2);
    $2438585bd7e1d91e$var$zero(this.dyn_ltree);
    $2438585bd7e1d91e$var$zero(this.dyn_dtree);
    $2438585bd7e1d91e$var$zero(this.bl_tree);
    this.l_desc = null; /* desc. for literal tree */ 
    this.d_desc = null; /* desc. for distance tree */ 
    this.bl_desc = null; /* desc. for bit length tree */ 
    //ush bl_count[MAX_BITS+1];
    this.bl_count = new Uint16Array($2438585bd7e1d91e$var$MAX_BITS + 1);
    /* number of codes at each bit length for an optimal tree */ //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
    this.heap = new Uint16Array(2 * $2438585bd7e1d91e$var$L_CODES + 1); /* heap used to build the Huffman trees */ 
    $2438585bd7e1d91e$var$zero(this.heap);
    this.heap_len = 0; /* number of elements in the heap */ 
    this.heap_max = 0; /* element of largest frequency */ 
    /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */ this.depth = new Uint16Array(2 * $2438585bd7e1d91e$var$L_CODES + 1); //uch depth[2*L_CODES+1];
    $2438585bd7e1d91e$var$zero(this.depth);
    /* Depth of each subtree used as tie breaker for trees of equal frequency
   */ this.sym_buf = 0; /* buffer for distances and literals/lengths */ 
    this.lit_bufsize = 0;
    /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */ this.sym_next = 0; /* running index in sym_buf */ 
    this.sym_end = 0; /* symbol table full when sym_next reaches this */ 
    this.opt_len = 0; /* bit length of current block with optimal trees */ 
    this.static_len = 0; /* bit length of current block with static trees */ 
    this.matches = 0; /* number of string matches in current block */ 
    this.insert = 0; /* bytes at end of window left to insert */ 
    this.bi_buf = 0;
    /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */ this.bi_valid = 0;
/* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */ // Used for window memory init. We safely ignore it for JS. That makes
// sense only for pointers and memory check tools.
//this.high_water = 0;
/* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */ }
/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */ const $2438585bd7e1d91e$var$deflateStateCheck = (strm)=>{
    if (!strm) return 1;
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== $2438585bd7e1d91e$var$INIT_STATE && //#ifdef GZIP
    s.status !== $2438585bd7e1d91e$var$GZIP_STATE && //#endif
    s.status !== $2438585bd7e1d91e$var$EXTRA_STATE && s.status !== $2438585bd7e1d91e$var$NAME_STATE && s.status !== $2438585bd7e1d91e$var$COMMENT_STATE && s.status !== $2438585bd7e1d91e$var$HCRC_STATE && s.status !== $2438585bd7e1d91e$var$BUSY_STATE && s.status !== $2438585bd7e1d91e$var$FINISH_STATE) return 1;
    return 0;
};
const $2438585bd7e1d91e$var$deflateResetKeep = (strm)=>{
    if ($2438585bd7e1d91e$var$deflateStateCheck(strm)) return $2438585bd7e1d91e$var$err(strm, $2438585bd7e1d91e$var$Z_STREAM_ERROR$2);
    strm.total_in = strm.total_out = 0;
    strm.data_type = $2438585bd7e1d91e$var$Z_UNKNOWN;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) s.wrap = -s.wrap;
    s.status = //#ifdef GZIP
    s.wrap === 2 ? $2438585bd7e1d91e$var$GZIP_STATE : //#endif
    s.wrap ? $2438585bd7e1d91e$var$INIT_STATE : $2438585bd7e1d91e$var$BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 // crc32(0, Z_NULL, 0)
     : 1; // adler32(0, Z_NULL, 0)
    s.last_flush = -2;
    $2438585bd7e1d91e$var$_tr_init(s);
    return $2438585bd7e1d91e$var$Z_OK$3;
};
const $2438585bd7e1d91e$var$deflateReset = (strm)=>{
    const ret = $2438585bd7e1d91e$var$deflateResetKeep(strm);
    if (ret === $2438585bd7e1d91e$var$Z_OK$3) $2438585bd7e1d91e$var$lm_init(strm.state);
    return ret;
};
const $2438585bd7e1d91e$var$deflateSetHeader = (strm, head)=>{
    if ($2438585bd7e1d91e$var$deflateStateCheck(strm) || strm.state.wrap !== 2) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$2;
    strm.state.gzhead = head;
    return $2438585bd7e1d91e$var$Z_OK$3;
};
const $2438585bd7e1d91e$var$deflateInit2 = (strm, level, method, windowBits, memLevel, strategy)=>{
    if (!strm) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$2;
    let wrap = 1;
    if (level === $2438585bd7e1d91e$var$Z_DEFAULT_COMPRESSION$1) level = 6;
    if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
    } else if (windowBits > 15) {
        wrap = 2; /* write gzip wrapper instead */ 
        windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > $2438585bd7e1d91e$var$MAX_MEM_LEVEL || method !== $2438585bd7e1d91e$var$Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > $2438585bd7e1d91e$var$Z_FIXED || windowBits === 8 && wrap !== 1) return $2438585bd7e1d91e$var$err(strm, $2438585bd7e1d91e$var$Z_STREAM_ERROR$2);
    if (windowBits === 8) windowBits = 9;
    /* until 256-byte window bug fixed */ const s = new $2438585bd7e1d91e$var$DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = $2438585bd7e1d91e$var$INIT_STATE; /* to pass state test in deflateReset() */ 
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + $2438585bd7e1d91e$var$MIN_MATCH - 1) / $2438585bd7e1d91e$var$MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    // Don't need mem init magic for JS.
    //s.high_water = 0;  /* nothing written to s->window yet */
    s.lit_bufsize = 1 << memLevel + 6; /* 16K elements by default */ 
    /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */ s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
    //s->sym_buf = s->pending_buf + s->lit_bufsize;
    s.sym_buf = s.lit_bufsize;
    //s->sym_end = (s->lit_bufsize - 1) * 3;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */ s.level = level;
    s.strategy = strategy;
    s.method = method;
    return $2438585bd7e1d91e$var$deflateReset(strm);
};
const $2438585bd7e1d91e$var$deflateInit = (strm, level)=>{
    return $2438585bd7e1d91e$var$deflateInit2(strm, level, $2438585bd7e1d91e$var$Z_DEFLATED$2, $2438585bd7e1d91e$var$MAX_WBITS$1, $2438585bd7e1d91e$var$DEF_MEM_LEVEL, $2438585bd7e1d91e$var$Z_DEFAULT_STRATEGY$1);
};
/* ========================================================================= */ const $2438585bd7e1d91e$var$deflate$2 = (strm, flush)=>{
    if ($2438585bd7e1d91e$var$deflateStateCheck(strm) || flush > $2438585bd7e1d91e$var$Z_BLOCK$1 || flush < 0) return strm ? $2438585bd7e1d91e$var$err(strm, $2438585bd7e1d91e$var$Z_STREAM_ERROR$2) : $2438585bd7e1d91e$var$Z_STREAM_ERROR$2;
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === $2438585bd7e1d91e$var$FINISH_STATE && flush !== $2438585bd7e1d91e$var$Z_FINISH$3) return $2438585bd7e1d91e$var$err(strm, strm.avail_out === 0 ? $2438585bd7e1d91e$var$Z_BUF_ERROR$1 : $2438585bd7e1d91e$var$Z_STREAM_ERROR$2);
    const old_flush = s.last_flush;
    s.last_flush = flush;
    /* Flush as much pending output as possible */ if (s.pending !== 0) {
        $2438585bd7e1d91e$var$flush_pending(strm);
        if (strm.avail_out === 0) {
            /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */ s.last_flush = -1;
            return $2438585bd7e1d91e$var$Z_OK$3;
        }
    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */ } else if (strm.avail_in === 0 && $2438585bd7e1d91e$var$rank(flush) <= $2438585bd7e1d91e$var$rank(old_flush) && flush !== $2438585bd7e1d91e$var$Z_FINISH$3) return $2438585bd7e1d91e$var$err(strm, $2438585bd7e1d91e$var$Z_BUF_ERROR$1);
    /* User must not provide more input after the first FINISH: */ if (s.status === $2438585bd7e1d91e$var$FINISH_STATE && strm.avail_in !== 0) return $2438585bd7e1d91e$var$err(strm, $2438585bd7e1d91e$var$Z_BUF_ERROR$1);
    /* Write the header */ if (s.status === $2438585bd7e1d91e$var$INIT_STATE && s.wrap === 0) s.status = $2438585bd7e1d91e$var$BUSY_STATE;
    if (s.status === $2438585bd7e1d91e$var$INIT_STATE) {
        /* zlib header */ let header = $2438585bd7e1d91e$var$Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
        let level_flags = -1;
        if (s.strategy >= $2438585bd7e1d91e$var$Z_HUFFMAN_ONLY || s.level < 2) level_flags = 0;
        else if (s.level < 6) level_flags = 1;
        else if (s.level === 6) level_flags = 2;
        else level_flags = 3;
        header |= level_flags << 6;
        if (s.strstart !== 0) header |= $2438585bd7e1d91e$var$PRESET_DICT;
        header += 31 - header % 31;
        $2438585bd7e1d91e$var$putShortMSB(s, header);
        /* Save the adler32 of the preset dictionary: */ if (s.strstart !== 0) {
            $2438585bd7e1d91e$var$putShortMSB(s, strm.adler >>> 16);
            $2438585bd7e1d91e$var$putShortMSB(s, strm.adler & 0xffff);
        }
        strm.adler = 1; // adler32(0L, Z_NULL, 0);
        s.status = $2438585bd7e1d91e$var$BUSY_STATE;
        /* Compression must start with an empty pending buffer */ $2438585bd7e1d91e$var$flush_pending(strm);
        if (s.pending !== 0) {
            s.last_flush = -1;
            return $2438585bd7e1d91e$var$Z_OK$3;
        }
    }
    //#ifdef GZIP
    if (s.status === $2438585bd7e1d91e$var$GZIP_STATE) {
        /* gzip header */ strm.adler = 0; //crc32(0L, Z_NULL, 0);
        $2438585bd7e1d91e$var$put_byte(s, 31);
        $2438585bd7e1d91e$var$put_byte(s, 139);
        $2438585bd7e1d91e$var$put_byte(s, 8);
        if (!s.gzhead) {
            $2438585bd7e1d91e$var$put_byte(s, 0);
            $2438585bd7e1d91e$var$put_byte(s, 0);
            $2438585bd7e1d91e$var$put_byte(s, 0);
            $2438585bd7e1d91e$var$put_byte(s, 0);
            $2438585bd7e1d91e$var$put_byte(s, 0);
            $2438585bd7e1d91e$var$put_byte(s, s.level === 9 ? 2 : s.strategy >= $2438585bd7e1d91e$var$Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            $2438585bd7e1d91e$var$put_byte(s, $2438585bd7e1d91e$var$OS_CODE);
            s.status = $2438585bd7e1d91e$var$BUSY_STATE;
            /* Compression must start with an empty pending buffer */ $2438585bd7e1d91e$var$flush_pending(strm);
            if (s.pending !== 0) {
                s.last_flush = -1;
                return $2438585bd7e1d91e$var$Z_OK$3;
            }
        } else {
            $2438585bd7e1d91e$var$put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
            $2438585bd7e1d91e$var$put_byte(s, s.gzhead.time & 0xff);
            $2438585bd7e1d91e$var$put_byte(s, s.gzhead.time >> 8 & 0xff);
            $2438585bd7e1d91e$var$put_byte(s, s.gzhead.time >> 16 & 0xff);
            $2438585bd7e1d91e$var$put_byte(s, s.gzhead.time >> 24 & 0xff);
            $2438585bd7e1d91e$var$put_byte(s, s.level === 9 ? 2 : s.strategy >= $2438585bd7e1d91e$var$Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            $2438585bd7e1d91e$var$put_byte(s, s.gzhead.os & 0xff);
            if (s.gzhead.extra && s.gzhead.extra.length) {
                $2438585bd7e1d91e$var$put_byte(s, s.gzhead.extra.length & 0xff);
                $2438585bd7e1d91e$var$put_byte(s, s.gzhead.extra.length >> 8 & 0xff);
            }
            if (s.gzhead.hcrc) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending, 0);
            s.gzindex = 0;
            s.status = $2438585bd7e1d91e$var$EXTRA_STATE;
        }
    }
    if (s.status === $2438585bd7e1d91e$var$EXTRA_STATE) {
        if (s.gzhead.extra /* != Z_NULL*/ ) {
            let beg = s.pending; /* start of bytes to update crc */ 
            let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
            while(s.pending + left > s.pending_buf_size){
                let copy = s.pending_buf_size - s.pending;
                // zmemcpy(s.pending_buf + s.pending,
                //    s.gzhead.extra + s.gzindex, copy);
                s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
                s.pending = s.pending_buf_size;
                //--- HCRC_UPDATE(beg) ---//
                if (s.gzhead.hcrc && s.pending > beg) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                //---//
                s.gzindex += copy;
                $2438585bd7e1d91e$var$flush_pending(strm);
                if (s.pending !== 0) {
                    s.last_flush = -1;
                    return $2438585bd7e1d91e$var$Z_OK$3;
                }
                beg = 0;
                left -= copy;
            }
            // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
            //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
            let gzhead_extra = new Uint8Array(s.gzhead.extra);
            // zmemcpy(s->pending_buf + s->pending,
            //     s->gzhead->extra + s->gzindex, left);
            s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
            s.pending += left;
            //--- HCRC_UPDATE(beg) ---//
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            //---//
            s.gzindex = 0;
        }
        s.status = $2438585bd7e1d91e$var$NAME_STATE;
    }
    if (s.status === $2438585bd7e1d91e$var$NAME_STATE) {
        if (s.gzhead.name /* != Z_NULL*/ ) {
            let beg = s.pending; /* start of bytes to update crc */ 
            let val;
            do {
                if (s.pending === s.pending_buf_size) {
                    //--- HCRC_UPDATE(beg) ---//
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    //---//
                    $2438585bd7e1d91e$var$flush_pending(strm);
                    if (s.pending !== 0) {
                        s.last_flush = -1;
                        return $2438585bd7e1d91e$var$Z_OK$3;
                    }
                    beg = 0;
                }
                // JS specific: little magic to add zero terminator to end of string
                if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
                else val = 0;
                $2438585bd7e1d91e$var$put_byte(s, val);
            }while (val !== 0);
            //--- HCRC_UPDATE(beg) ---//
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            //---//
            s.gzindex = 0;
        }
        s.status = $2438585bd7e1d91e$var$COMMENT_STATE;
    }
    if (s.status === $2438585bd7e1d91e$var$COMMENT_STATE) {
        if (s.gzhead.comment /* != Z_NULL*/ ) {
            let beg = s.pending; /* start of bytes to update crc */ 
            let val;
            do {
                if (s.pending === s.pending_buf_size) {
                    //--- HCRC_UPDATE(beg) ---//
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    //---//
                    $2438585bd7e1d91e$var$flush_pending(strm);
                    if (s.pending !== 0) {
                        s.last_flush = -1;
                        return $2438585bd7e1d91e$var$Z_OK$3;
                    }
                    beg = 0;
                }
                // JS specific: little magic to add zero terminator to end of string
                if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
                else val = 0;
                $2438585bd7e1d91e$var$put_byte(s, val);
            }while (val !== 0);
            //--- HCRC_UPDATE(beg) ---//
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = $2438585bd7e1d91e$var$crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        //---//
        }
        s.status = $2438585bd7e1d91e$var$HCRC_STATE;
    }
    if (s.status === $2438585bd7e1d91e$var$HCRC_STATE) {
        if (s.gzhead.hcrc) {
            if (s.pending + 2 > s.pending_buf_size) {
                $2438585bd7e1d91e$var$flush_pending(strm);
                if (s.pending !== 0) {
                    s.last_flush = -1;
                    return $2438585bd7e1d91e$var$Z_OK$3;
                }
            }
            $2438585bd7e1d91e$var$put_byte(s, strm.adler & 0xff);
            $2438585bd7e1d91e$var$put_byte(s, strm.adler >> 8 & 0xff);
            strm.adler = 0; //crc32(0L, Z_NULL, 0);
        }
        s.status = $2438585bd7e1d91e$var$BUSY_STATE;
        /* Compression must start with an empty pending buffer */ $2438585bd7e1d91e$var$flush_pending(strm);
        if (s.pending !== 0) {
            s.last_flush = -1;
            return $2438585bd7e1d91e$var$Z_OK$3;
        }
    }
    //#endif
    /* Start a new block or continue the current one.
   */ if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== $2438585bd7e1d91e$var$Z_NO_FLUSH$2 && s.status !== $2438585bd7e1d91e$var$FINISH_STATE) {
        let bstate = s.level === 0 ? $2438585bd7e1d91e$var$deflate_stored(s, flush) : s.strategy === $2438585bd7e1d91e$var$Z_HUFFMAN_ONLY ? $2438585bd7e1d91e$var$deflate_huff(s, flush) : s.strategy === $2438585bd7e1d91e$var$Z_RLE ? $2438585bd7e1d91e$var$deflate_rle(s, flush) : $2438585bd7e1d91e$var$configuration_table[s.level].func(s, flush);
        if (bstate === $2438585bd7e1d91e$var$BS_FINISH_STARTED || bstate === $2438585bd7e1d91e$var$BS_FINISH_DONE) s.status = $2438585bd7e1d91e$var$FINISH_STATE;
        if (bstate === $2438585bd7e1d91e$var$BS_NEED_MORE || bstate === $2438585bd7e1d91e$var$BS_FINISH_STARTED) {
            if (strm.avail_out === 0) s.last_flush = -1;
            return $2438585bd7e1d91e$var$Z_OK$3;
        /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */ }
        if (bstate === $2438585bd7e1d91e$var$BS_BLOCK_DONE) {
            if (flush === $2438585bd7e1d91e$var$Z_PARTIAL_FLUSH) $2438585bd7e1d91e$var$_tr_align(s);
            else if (flush !== $2438585bd7e1d91e$var$Z_BLOCK$1) {
                $2438585bd7e1d91e$var$_tr_stored_block(s, 0, 0, false);
                /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */ if (flush === $2438585bd7e1d91e$var$Z_FULL_FLUSH$1) {
                    /*** CLEAR_HASH(s); ***/ /* forget history */ $2438585bd7e1d91e$var$zero(s.head); // Fill with NIL (= 0);
                    if (s.lookahead === 0) {
                        s.strstart = 0;
                        s.block_start = 0;
                        s.insert = 0;
                    }
                }
            }
            $2438585bd7e1d91e$var$flush_pending(strm);
            if (strm.avail_out === 0) {
                s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */ 
                return $2438585bd7e1d91e$var$Z_OK$3;
            }
        }
    }
    if (flush !== $2438585bd7e1d91e$var$Z_FINISH$3) return $2438585bd7e1d91e$var$Z_OK$3;
    if (s.wrap <= 0) return $2438585bd7e1d91e$var$Z_STREAM_END$3;
    /* Write the trailer */ if (s.wrap === 2) {
        $2438585bd7e1d91e$var$put_byte(s, strm.adler & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.adler >> 8 & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.adler >> 16 & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.adler >> 24 & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.total_in & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.total_in >> 8 & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.total_in >> 16 & 0xff);
        $2438585bd7e1d91e$var$put_byte(s, strm.total_in >> 24 & 0xff);
    } else {
        $2438585bd7e1d91e$var$putShortMSB(s, strm.adler >>> 16);
        $2438585bd7e1d91e$var$putShortMSB(s, strm.adler & 0xffff);
    }
    $2438585bd7e1d91e$var$flush_pending(strm);
    /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */ if (s.wrap > 0) s.wrap = -s.wrap;
    /* write the trailer only once! */ return s.pending !== 0 ? $2438585bd7e1d91e$var$Z_OK$3 : $2438585bd7e1d91e$var$Z_STREAM_END$3;
};
const $2438585bd7e1d91e$var$deflateEnd = (strm)=>{
    if ($2438585bd7e1d91e$var$deflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$2;
    const status = strm.state.status;
    strm.state = null;
    return status === $2438585bd7e1d91e$var$BUSY_STATE ? $2438585bd7e1d91e$var$err(strm, $2438585bd7e1d91e$var$Z_DATA_ERROR$2) : $2438585bd7e1d91e$var$Z_OK$3;
};
/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */ const $2438585bd7e1d91e$var$deflateSetDictionary = (strm, dictionary)=>{
    let dictLength = dictionary.length;
    if ($2438585bd7e1d91e$var$deflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$2;
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== $2438585bd7e1d91e$var$INIT_STATE || s.lookahead) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$2;
    /* when using zlib wrappers, compute Adler-32 for provided dictionary */ if (wrap === 1) /* adler32(strm->adler, dictionary, dictLength); */ strm.adler = $2438585bd7e1d91e$var$adler32_1(strm.adler, dictionary, dictLength, 0);
    s.wrap = 0; /* avoid computing Adler-32 in read_buf */ 
    /* if dictionary would fill window, just replace the history */ if (dictLength >= s.w_size) {
        if (wrap === 0) {
            /*** CLEAR_HASH(s); ***/ $2438585bd7e1d91e$var$zero(s.head); // Fill with NIL (= 0);
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
        }
        /* use the tail */ // dictionary = dictionary.slice(dictLength - s.w_size);
        let tmpDict = new Uint8Array(s.w_size);
        tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
    }
    /* insert dictionary into window and hash */ const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    $2438585bd7e1d91e$var$fill_window(s);
    while(s.lookahead >= $2438585bd7e1d91e$var$MIN_MATCH){
        let str = s.strstart;
        let n = s.lookahead - ($2438585bd7e1d91e$var$MIN_MATCH - 1);
        do {
            /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */ s.ins_h = $2438585bd7e1d91e$var$HASH(s, s.ins_h, s.window[str + $2438585bd7e1d91e$var$MIN_MATCH - 1]);
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
        }while (--n);
        s.strstart = str;
        s.lookahead = $2438585bd7e1d91e$var$MIN_MATCH - 1;
        $2438585bd7e1d91e$var$fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = $2438585bd7e1d91e$var$MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return $2438585bd7e1d91e$var$Z_OK$3;
};
var $2438585bd7e1d91e$var$deflateInit_1 = $2438585bd7e1d91e$var$deflateInit;
var $2438585bd7e1d91e$var$deflateInit2_1 = $2438585bd7e1d91e$var$deflateInit2;
var $2438585bd7e1d91e$var$deflateReset_1 = $2438585bd7e1d91e$var$deflateReset;
var $2438585bd7e1d91e$var$deflateResetKeep_1 = $2438585bd7e1d91e$var$deflateResetKeep;
var $2438585bd7e1d91e$var$deflateSetHeader_1 = $2438585bd7e1d91e$var$deflateSetHeader;
var $2438585bd7e1d91e$var$deflate_2$1 = $2438585bd7e1d91e$var$deflate$2;
var $2438585bd7e1d91e$var$deflateEnd_1 = $2438585bd7e1d91e$var$deflateEnd;
var $2438585bd7e1d91e$var$deflateSetDictionary_1 = $2438585bd7e1d91e$var$deflateSetDictionary;
var $2438585bd7e1d91e$var$deflateInfo = 'pako deflate (from Nodeca project)';
/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/ var $2438585bd7e1d91e$var$deflate_1$2 = {
    deflateInit: $2438585bd7e1d91e$var$deflateInit_1,
    deflateInit2: $2438585bd7e1d91e$var$deflateInit2_1,
    deflateReset: $2438585bd7e1d91e$var$deflateReset_1,
    deflateResetKeep: $2438585bd7e1d91e$var$deflateResetKeep_1,
    deflateSetHeader: $2438585bd7e1d91e$var$deflateSetHeader_1,
    deflate: $2438585bd7e1d91e$var$deflate_2$1,
    deflateEnd: $2438585bd7e1d91e$var$deflateEnd_1,
    deflateSetDictionary: $2438585bd7e1d91e$var$deflateSetDictionary_1,
    deflateInfo: $2438585bd7e1d91e$var$deflateInfo
};
const $2438585bd7e1d91e$var$_has = (obj, key)=>{
    return Object.prototype.hasOwnProperty.call(obj, key);
};
var $2438585bd7e1d91e$var$assign = function(obj /*from1, from2, from3, ...*/ ) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while(sources.length){
        const source = sources.shift();
        if (!source) continue;
        if (typeof source !== 'object') throw new TypeError(source + 'must be non-object');
        for(const p in source)if ($2438585bd7e1d91e$var$_has(source, p)) obj[p] = source[p];
    }
    return obj;
};
// Join array of chunks to single array.
var $2438585bd7e1d91e$var$flattenChunks = (chunks)=>{
    // calculate data length
    let len = 0;
    for(let i = 0, l = chunks.length; i < l; i++)len += chunks[i].length;
    // join chunks
    const result = new Uint8Array(len);
    for(let i = 0, pos = 0, l = chunks.length; i < l; i++){
        let chunk = chunks[i];
        result.set(chunk, pos);
        pos += chunk.length;
    }
    return result;
};
var $2438585bd7e1d91e$var$common = {
    assign: $2438585bd7e1d91e$var$assign,
    flattenChunks: $2438585bd7e1d91e$var$flattenChunks
};
// String encode/decode helpers
// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let $2438585bd7e1d91e$var$STR_APPLY_UIA_OK = true;
try {
    String.fromCharCode.apply(null, new Uint8Array(1));
} catch (__) {
    $2438585bd7e1d91e$var$STR_APPLY_UIA_OK = false;
}
// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const $2438585bd7e1d91e$var$_utf8len = new Uint8Array(256);
for(let q = 0; q < 256; q++)$2438585bd7e1d91e$var$_utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
$2438585bd7e1d91e$var$_utf8len[254] = $2438585bd7e1d91e$var$_utf8len[254] = 1; // Invalid sequence start
// convert string to array (typed, when possible)
var $2438585bd7e1d91e$var$string2buf = (str)=>{
    if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) return new TextEncoder().encode(str);
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    // count binary size
    for(m_pos = 0; m_pos < str_len; m_pos++){
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }
    // allocate buffer
    buf = new Uint8Array(buf_len);
    // convert
    for(i = 0, m_pos = 0; i < buf_len; m_pos++){
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        if (c < 0x80) /* one byte */ buf[i++] = c;
        else if (c < 0x800) {
            /* two bytes */ buf[i++] = 0xC0 | c >>> 6;
            buf[i++] = 0x80 | c & 0x3f;
        } else if (c < 0x10000) {
            /* three bytes */ buf[i++] = 0xE0 | c >>> 12;
            buf[i++] = 0x80 | c >>> 6 & 0x3f;
            buf[i++] = 0x80 | c & 0x3f;
        } else {
            /* four bytes */ buf[i++] = 0xf0 | c >>> 18;
            buf[i++] = 0x80 | c >>> 12 & 0x3f;
            buf[i++] = 0x80 | c >>> 6 & 0x3f;
            buf[i++] = 0x80 | c & 0x3f;
        }
    }
    return buf;
};
// Helper
const $2438585bd7e1d91e$var$buf2binstring = (buf, len)=>{
    // On Chrome, the arguments in a function call that are allowed is `65534`.
    // If the length of the buffer is smaller than that, we can use this optimization,
    // otherwise we will take a slower path.
    if (len < 65534) {
        if (buf.subarray && $2438585bd7e1d91e$var$STR_APPLY_UIA_OK) return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
    let result = '';
    for(let i = 0; i < len; i++)result += String.fromCharCode(buf[i]);
    return result;
};
// convert array to string
var $2438585bd7e1d91e$var$buf2string = (buf, max)=>{
    const len = max || buf.length;
    if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) return new TextDecoder().decode(buf.subarray(0, max));
    let i, out;
    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    const utf16buf = new Array(len * 2);
    for(out = 0, i = 0; i < len;){
        let c = buf[i++];
        // quick process ascii
        if (c < 0x80) {
            utf16buf[out++] = c;
            continue;
        }
        let c_len = $2438585bd7e1d91e$var$_utf8len[c];
        // skip 5 & 6 byte codes
        if (c_len > 4) {
            utf16buf[out++] = 0xfffd;
            i += c_len - 1;
            continue;
        }
        // apply mask on first byte
        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
        // join the rest
        while(c_len > 1 && i < len){
            c = c << 6 | buf[i++] & 0x3f;
            c_len--;
        }
        // terminated by end of string?
        if (c_len > 1) {
            utf16buf[out++] = 0xfffd;
            continue;
        }
        if (c < 0x10000) utf16buf[out++] = c;
        else {
            c -= 0x10000;
            utf16buf[out++] = 0xd800 | c >> 10 & 0x3ff;
            utf16buf[out++] = 0xdc00 | c & 0x3ff;
        }
    }
    return $2438585bd7e1d91e$var$buf2binstring(utf16buf, out);
};
// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var $2438585bd7e1d91e$var$utf8border = (buf, max)=>{
    max = max || buf.length;
    if (max > buf.length) max = buf.length;
    // go back from last position, until start of sequence found
    let pos = max - 1;
    while(pos >= 0 && (buf[pos] & 0xC0) === 0x80)pos--;
    // Very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) return max;
    // If we came to start of buffer - that means buffer is too small,
    // return max too.
    if (pos === 0) return max;
    return pos + $2438585bd7e1d91e$var$_utf8len[buf[pos]] > max ? pos : max;
};
var $2438585bd7e1d91e$var$strings = {
    string2buf: $2438585bd7e1d91e$var$string2buf,
    buf2string: $2438585bd7e1d91e$var$buf2string,
    utf8border: $2438585bd7e1d91e$var$utf8border
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function $2438585bd7e1d91e$var$ZStream() {
    /* next input byte */ this.input = null; // JS specific, because we have no pointers
    this.next_in = 0;
    /* number of bytes available at input */ this.avail_in = 0;
    /* total number of input bytes read so far */ this.total_in = 0;
    /* next output byte should be put there */ this.output = null; // JS specific, because we have no pointers
    this.next_out = 0;
    /* remaining free space at output */ this.avail_out = 0;
    /* total number of bytes output so far */ this.total_out = 0;
    /* last error message, NULL if no error */ this.msg = '' /*Z_NULL*/ ;
    /* not visible by applications */ this.state = null;
    /* best guess about the data type: binary or text */ this.data_type = 2 /*Z_UNKNOWN*/ ;
    /* adler32 value of the uncompressed data */ this.adler = 0;
}
var $2438585bd7e1d91e$var$zstream = $2438585bd7e1d91e$var$ZStream;
const $2438585bd7e1d91e$var$toString$1 = Object.prototype.toString;
/* Public constants ==========================================================*/ /* ===========================================================================*/ const { Z_NO_FLUSH: $2438585bd7e1d91e$var$Z_NO_FLUSH$1, Z_SYNC_FLUSH: $2438585bd7e1d91e$var$Z_SYNC_FLUSH, Z_FULL_FLUSH: $2438585bd7e1d91e$var$Z_FULL_FLUSH, Z_FINISH: $2438585bd7e1d91e$var$Z_FINISH$2, Z_OK: $2438585bd7e1d91e$var$Z_OK$2, Z_STREAM_END: $2438585bd7e1d91e$var$Z_STREAM_END$2, Z_DEFAULT_COMPRESSION: $2438585bd7e1d91e$var$Z_DEFAULT_COMPRESSION, Z_DEFAULT_STRATEGY: $2438585bd7e1d91e$var$Z_DEFAULT_STRATEGY, Z_DEFLATED: $2438585bd7e1d91e$var$Z_DEFLATED$1 } = $2438585bd7e1d91e$var$constants$2;
/* ===========================================================================*/ /**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/ /* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/ /**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/ /**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/ /**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/ /**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/ function $2438585bd7e1d91e$var$Deflate$1(options) {
    this.options = $2438585bd7e1d91e$var$common.assign({
        level: $2438585bd7e1d91e$var$Z_DEFAULT_COMPRESSION,
        method: $2438585bd7e1d91e$var$Z_DEFLATED$1,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: $2438585bd7e1d91e$var$Z_DEFAULT_STRATEGY
    }, options || {});
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
    else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
    this.err = 0; // error code, if happens (0 = Z_OK)
    this.msg = ''; // error message
    this.ended = false; // used to avoid multiple onEnd() calls
    this.chunks = []; // chunks of compressed data
    this.strm = new $2438585bd7e1d91e$var$zstream();
    this.strm.avail_out = 0;
    let status = $2438585bd7e1d91e$var$deflate_1$2.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
    if (status !== $2438585bd7e1d91e$var$Z_OK$2) throw new Error($2438585bd7e1d91e$var$messages[status]);
    if (opt.header) $2438585bd7e1d91e$var$deflate_1$2.deflateSetHeader(this.strm, opt.header);
    if (opt.dictionary) {
        let dict;
        // Convert data if needed
        if (typeof opt.dictionary === 'string') // If we need to compress text, change encoding to utf8.
        dict = $2438585bd7e1d91e$var$strings.string2buf(opt.dictionary);
        else if ($2438585bd7e1d91e$var$toString$1.call(opt.dictionary) === '[object ArrayBuffer]') dict = new Uint8Array(opt.dictionary);
        else dict = opt.dictionary;
        status = $2438585bd7e1d91e$var$deflate_1$2.deflateSetDictionary(this.strm, dict);
        if (status !== $2438585bd7e1d91e$var$Z_OK$2) throw new Error($2438585bd7e1d91e$var$messages[status]);
        this._dict_set = true;
    }
}
/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/ $2438585bd7e1d91e$var$Deflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;
    if (this.ended) return false;
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? $2438585bd7e1d91e$var$Z_FINISH$2 : $2438585bd7e1d91e$var$Z_NO_FLUSH$1;
    // Convert data if needed
    if (typeof data === 'string') // If we need to compress text, change encoding to utf8.
    strm.input = $2438585bd7e1d91e$var$strings.string2buf(data);
    else if ($2438585bd7e1d91e$var$toString$1.call(data) === '[object ArrayBuffer]') strm.input = new Uint8Array(data);
    else strm.input = data;
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for(;;){
        if (strm.avail_out === 0) {
            strm.output = new Uint8Array(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
        }
        // Make sure avail_out > 6 to avoid repeating markers
        if ((_flush_mode === $2438585bd7e1d91e$var$Z_SYNC_FLUSH || _flush_mode === $2438585bd7e1d91e$var$Z_FULL_FLUSH) && strm.avail_out <= 6) {
            this.onData(strm.output.subarray(0, strm.next_out));
            strm.avail_out = 0;
            continue;
        }
        status = $2438585bd7e1d91e$var$deflate_1$2.deflate(strm, _flush_mode);
        // Ended => flush and finish
        if (status === $2438585bd7e1d91e$var$Z_STREAM_END$2) {
            if (strm.next_out > 0) this.onData(strm.output.subarray(0, strm.next_out));
            status = $2438585bd7e1d91e$var$deflate_1$2.deflateEnd(this.strm);
            this.onEnd(status);
            this.ended = true;
            return status === $2438585bd7e1d91e$var$Z_OK$2;
        }
        // Flush if out buffer full
        if (strm.avail_out === 0) {
            this.onData(strm.output);
            continue;
        }
        // Flush if requested and has data
        if (_flush_mode > 0 && strm.next_out > 0) {
            this.onData(strm.output.subarray(0, strm.next_out));
            strm.avail_out = 0;
            continue;
        }
        if (strm.avail_in === 0) break;
    }
    return true;
};
/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/ $2438585bd7e1d91e$var$Deflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
};
/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/ $2438585bd7e1d91e$var$Deflate$1.prototype.onEnd = function(status) {
    // On success - join
    if (status === $2438585bd7e1d91e$var$Z_OK$2) this.result = $2438585bd7e1d91e$var$common.flattenChunks(this.chunks);
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
};
/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/ function $2438585bd7e1d91e$var$deflate$1(input, options) {
    const deflator = new $2438585bd7e1d91e$var$Deflate$1(options);
    deflator.push(input, true);
    // That will never happens, if you don't cheat with options :)
    if (deflator.err) throw deflator.msg || $2438585bd7e1d91e$var$messages[deflator.err];
    return deflator.result;
}
/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/ function $2438585bd7e1d91e$var$deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return $2438585bd7e1d91e$var$deflate$1(input, options);
}
/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/ function $2438585bd7e1d91e$var$gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return $2438585bd7e1d91e$var$deflate$1(input, options);
}
var $2438585bd7e1d91e$var$Deflate_1$1 = $2438585bd7e1d91e$var$Deflate$1;
var $2438585bd7e1d91e$var$deflate_2 = $2438585bd7e1d91e$var$deflate$1;
var $2438585bd7e1d91e$var$deflateRaw_1$1 = $2438585bd7e1d91e$var$deflateRaw$1;
var $2438585bd7e1d91e$var$gzip_1$1 = $2438585bd7e1d91e$var$gzip$1;
var $2438585bd7e1d91e$var$constants$1 = $2438585bd7e1d91e$var$constants$2;
var $2438585bd7e1d91e$var$deflate_1$1 = {
    Deflate: $2438585bd7e1d91e$var$Deflate_1$1,
    deflate: $2438585bd7e1d91e$var$deflate_2,
    deflateRaw: $2438585bd7e1d91e$var$deflateRaw_1$1,
    gzip: $2438585bd7e1d91e$var$gzip_1$1,
    constants: $2438585bd7e1d91e$var$constants$1
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
// See state defs from inflate.js
const $2438585bd7e1d91e$var$BAD$1 = 16209; /* got a data error -- remain here until reset */ 
const $2438585bd7e1d91e$var$TYPE$1 = 16191; /* i: waiting for type bits, including last-flag bit */ 
/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */ var $2438585bd7e1d91e$var$inffast = function inflate_fast(strm, start) {
    let _in; /* local strm.input */ 
    let last; /* have enough input while in < last */ 
    let _out; /* local strm.output */ 
    let beg; /* inflate()'s initial strm.output */ 
    let end; /* while out < end, enough space available */ 
    //#ifdef INFLATE_STRICT
    let dmax; /* maximum distance from zlib header */ 
    //#endif
    let wsize; /* window size or zero if not using window */ 
    let whave; /* valid bytes in the window */ 
    let wnext; /* window write index */ 
    // Use `s_window` instead `window`, avoid conflict with instrumentation tools
    let s_window; /* allocated sliding window, if wsize != 0 */ 
    let hold; /* local strm.hold */ 
    let bits; /* local strm.bits */ 
    let lcode; /* local strm.lencode */ 
    let dcode; /* local strm.distcode */ 
    let lmask; /* mask for first level of length codes */ 
    let dmask; /* mask for first level of distance codes */ 
    let here; /* retrieved table entry */ 
    let op; /* code bits, operation, extra bits, or */ 
    /*  window position, window bytes to copy */ let len; /* match length, unused bytes */ 
    let dist; /* match distance */ 
    let from; /* where to copy match from */ 
    let from_source;
    let input, output; // JS specific, because we have no pointers
    /* copy state to local variables */ const state = strm.state;
    //here = state.here;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    //#ifdef INFLATE_STRICT
    dmax = state.dmax;
    //#endif
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    /* decode literals and length/distances until end-of-block or not enough
     input data or output space */ top: do {
        if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
        }
        here = lcode[hold & lmask];
        dolen: for(;;){
            op = here >>> 24 /*here.bits*/ ;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 0xff /*here.op*/ ;
            if (op === 0) //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            output[_out++] = here & 0xffff /*here.val*/ ;
            else if (op & 16) {
                len = here & 0xffff /*here.val*/ ;
                op &= 15; /* number of extra bits */ 
                if (op) {
                    if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                    }
                    len += hold & (1 << op) - 1;
                    hold >>>= op;
                    bits -= op;
                }
                //Tracevv((stderr, "inflate:         length %u\n", len));
                if (bits < 15) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    hold += input[_in++] << bits;
                    bits += 8;
                }
                here = dcode[hold & dmask];
                dodist: for(;;){
                    op = here >>> 24 /*here.bits*/ ;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 0xff /*here.op*/ ;
                    if (op & 16) {
                        dist = here & 0xffff /*here.val*/ ;
                        op &= 15; /* number of extra bits */ 
                        if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                            if (bits < op) {
                                hold += input[_in++] << bits;
                                bits += 8;
                            }
                        }
                        dist += hold & (1 << op) - 1;
                        //#ifdef INFLATE_STRICT
                        if (dist > dmax) {
                            strm.msg = 'invalid distance too far back';
                            state.mode = $2438585bd7e1d91e$var$BAD$1;
                            break top;
                        }
                        //#endif
                        hold >>>= op;
                        bits -= op;
                        //Tracevv((stderr, "inflate:         distance %u\n", dist));
                        op = _out - beg; /* max distance in output */ 
                        if (dist > op) {
                            op = dist - op; /* distance back in window */ 
                            if (op > whave) {
                                if (state.sane) {
                                    strm.msg = 'invalid distance too far back';
                                    state.mode = $2438585bd7e1d91e$var$BAD$1;
                                    break top;
                                }
                            }
                            from = 0; // window index
                            from_source = s_window;
                            if (wnext === 0) {
                                from += wsize - op;
                                if (op < len) {
                                    len -= op;
                                    do output[_out++] = s_window[from++];
                                    while (--op);
                                    from = _out - dist; /* rest from output */ 
                                    from_source = output;
                                }
                            } else if (wnext < op) {
                                from += wsize + wnext - op;
                                op -= wnext;
                                if (op < len) {
                                    len -= op;
                                    do output[_out++] = s_window[from++];
                                    while (--op);
                                    from = 0;
                                    if (wnext < len) {
                                        op = wnext;
                                        len -= op;
                                        do output[_out++] = s_window[from++];
                                        while (--op);
                                        from = _out - dist; /* rest from output */ 
                                        from_source = output;
                                    }
                                }
                            } else {
                                from += wnext - op;
                                if (op < len) {
                                    len -= op;
                                    do output[_out++] = s_window[from++];
                                    while (--op);
                                    from = _out - dist; /* rest from output */ 
                                    from_source = output;
                                }
                            }
                            while(len > 2){
                                output[_out++] = from_source[from++];
                                output[_out++] = from_source[from++];
                                output[_out++] = from_source[from++];
                                len -= 3;
                            }
                            if (len) {
                                output[_out++] = from_source[from++];
                                if (len > 1) output[_out++] = from_source[from++];
                            }
                        } else {
                            from = _out - dist; /* copy direct from output */ 
                            do {
                                output[_out++] = output[from++];
                                output[_out++] = output[from++];
                                output[_out++] = output[from++];
                                len -= 3;
                            }while (len > 2);
                            if (len) {
                                output[_out++] = output[from++];
                                if (len > 1) output[_out++] = output[from++];
                            }
                        }
                    } else if ((op & 64) === 0) {
                        here = dcode[(here & 0xffff) + (hold & (1 << op) - 1)];
                        continue dodist;
                    } else {
                        strm.msg = 'invalid distance code';
                        state.mode = $2438585bd7e1d91e$var$BAD$1;
                        break top;
                    }
                    break; // need to emulate goto via "continue"
                }
            } else if ((op & 64) === 0) {
                here = lcode[(here & 0xffff) + (hold & (1 << op) - 1)];
                continue dolen;
            } else if (op & 32) {
                //Tracevv((stderr, "inflate:         end of block\n"));
                state.mode = $2438585bd7e1d91e$var$TYPE$1;
                break top;
            } else {
                strm.msg = 'invalid literal/length code';
                state.mode = $2438585bd7e1d91e$var$BAD$1;
                break top;
            }
            break; // need to emulate goto via "continue"
        }
    }while (_in < last && _out < end);
    /* return unused bytes (on entry, bits < 8, so in won't go too far back) */ len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    /* update state and return */ strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
const $2438585bd7e1d91e$var$MAXBITS = 15;
const $2438585bd7e1d91e$var$ENOUGH_LENS$1 = 852;
const $2438585bd7e1d91e$var$ENOUGH_DISTS$1 = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);
const $2438585bd7e1d91e$var$CODES$1 = 0;
const $2438585bd7e1d91e$var$LENS$1 = 1;
const $2438585bd7e1d91e$var$DISTS$1 = 2;
const $2438585bd7e1d91e$var$lbase = new Uint16Array([
    /* Length codes 257..285 base */ 3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
]);
const $2438585bd7e1d91e$var$lext = new Uint8Array([
    /* Length codes 257..285 extra */ 16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
]);
const $2438585bd7e1d91e$var$dbase = new Uint16Array([
    /* Distance codes 0..29 base */ 1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
]);
const $2438585bd7e1d91e$var$dext = new Uint8Array([
    /* Distance codes 0..29 extra */ 16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
]);
const $2438585bd7e1d91e$var$inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts)=>{
    const bits = opts.bits;
    //here = opts.here; /* table entry for duplication */
    let len = 0; /* a code's length in bits */ 
    let sym = 0; /* index of code symbols */ 
    let min = 0, max = 0; /* minimum and maximum code lengths */ 
    let root = 0; /* number of index bits for root table */ 
    let curr = 0; /* number of index bits for current table */ 
    let drop = 0; /* code bits to drop for sub-table */ 
    let left = 0; /* number of prefix codes available */ 
    let used = 0; /* code entries in table used */ 
    let huff = 0; /* Huffman code */ 
    let incr; /* for incrementing code, index */ 
    let fill; /* index for replicating entries */ 
    let low; /* low bits for current root entry */ 
    let mask; /* mask for low root bits */ 
    let next; /* next available space in table */ 
    let base = null; /* base value table to use */ 
    //  let shoextra;    /* extra bits table to use */
    let match; /* use base and extra for symbol >= match */ 
    const count = new Uint16Array($2438585bd7e1d91e$var$MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
    const offs = new Uint16Array($2438585bd7e1d91e$var$MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
    let extra = null;
    let here_bits, here_op, here_val;
    /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */ /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */ for(len = 0; len <= $2438585bd7e1d91e$var$MAXBITS; len++)count[len] = 0;
    for(sym = 0; sym < codes; sym++)count[lens[lens_index + sym]]++;
    /* bound code lengths, force root to be within code lengths */ root = bits;
    for(max = $2438585bd7e1d91e$var$MAXBITS; max >= 1; max--){
        if (count[max] !== 0) break;
    }
    if (root > max) root = max;
    if (max === 0) {
        //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
        //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
        //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
        table[table_index++] = 20971520;
        //table.op[opts.table_index] = 64;
        //table.bits[opts.table_index] = 1;
        //table.val[opts.table_index++] = 0;
        table[table_index++] = 20971520;
        opts.bits = 1;
        return 0; /* no symbols, but wait for decoding to report error */ 
    }
    for(min = 1; min < max; min++){
        if (count[min] !== 0) break;
    }
    if (root < min) root = min;
    /* check for an over-subscribed or incomplete set of lengths */ left = 1;
    for(len = 1; len <= $2438585bd7e1d91e$var$MAXBITS; len++){
        left <<= 1;
        left -= count[len];
        if (left < 0) return -1;
         /* over-subscribed */ 
    }
    if (left > 0 && (type === $2438585bd7e1d91e$var$CODES$1 || max !== 1)) return -1; /* incomplete set */ 
    /* generate offsets into symbol table for each length for sorting */ offs[1] = 0;
    for(len = 1; len < $2438585bd7e1d91e$var$MAXBITS; len++)offs[len + 1] = offs[len] + count[len];
    /* sort symbols by length, by symbol order within each length */ for(sym = 0; sym < codes; sym++)if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
    /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */ /* set up for code type */ // poor man optimization - use if-else instead of switch,
    // to avoid deopts in old v8
    if (type === $2438585bd7e1d91e$var$CODES$1) {
        base = extra = work; /* dummy value--not used */ 
        match = 20;
    } else if (type === $2438585bd7e1d91e$var$LENS$1) {
        base = $2438585bd7e1d91e$var$lbase;
        extra = $2438585bd7e1d91e$var$lext;
        match = 257;
    } else {
        base = $2438585bd7e1d91e$var$dbase;
        extra = $2438585bd7e1d91e$var$dext;
        match = 0;
    }
    /* initialize opts for loop */ huff = 0; /* starting code */ 
    sym = 0; /* starting code symbol */ 
    len = min; /* starting code length */ 
    next = table_index; /* current table to fill in */ 
    curr = root; /* current table index bits */ 
    drop = 0; /* current bits to drop from code for index */ 
    low = -1; /* trigger new sub-table when len > root */ 
    used = 1 << root; /* use root table entries */ 
    mask = used - 1; /* mask for comparing low */ 
    /* check available table space */ if (type === $2438585bd7e1d91e$var$LENS$1 && used > $2438585bd7e1d91e$var$ENOUGH_LENS$1 || type === $2438585bd7e1d91e$var$DISTS$1 && used > $2438585bd7e1d91e$var$ENOUGH_DISTS$1) return 1;
    /* process all codes and make table entries */ for(;;){
        /* create table entry */ here_bits = len - drop;
        if (work[sym] + 1 < match) {
            here_op = 0;
            here_val = work[sym];
        } else if (work[sym] >= match) {
            here_op = extra[work[sym] - match];
            here_val = base[work[sym] - match];
        } else {
            here_op = 96; /* end of block */ 
            here_val = 0;
        }
        /* replicate for those indices with low len bits equal to huff */ incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill; /* save offset to next table */ 
        do {
            fill -= incr;
            table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        }while (fill !== 0);
        /* backwards increment the len-bit code huff */ incr = 1 << len - 1;
        while(huff & incr)incr >>= 1;
        if (incr !== 0) {
            huff &= incr - 1;
            huff += incr;
        } else huff = 0;
        /* go to next symbol, update count, len */ sym++;
        if (--count[len] === 0) {
            if (len === max) break;
            len = lens[lens_index + work[sym]];
        }
        /* create new sub-table if needed */ if (len > root && (huff & mask) !== low) {
            /* if first time, transition to sub-tables */ if (drop === 0) drop = root;
            /* increment past last table */ next += min; /* here min is 1 << curr */ 
            /* determine length of next table */ curr = len - drop;
            left = 1 << curr;
            while(curr + drop < max){
                left -= count[curr + drop];
                if (left <= 0) break;
                curr++;
                left <<= 1;
            }
            /* check for enough space */ used += 1 << curr;
            if (type === $2438585bd7e1d91e$var$LENS$1 && used > $2438585bd7e1d91e$var$ENOUGH_LENS$1 || type === $2438585bd7e1d91e$var$DISTS$1 && used > $2438585bd7e1d91e$var$ENOUGH_DISTS$1) return 1;
            /* point entry in root table to sub-table */ low = huff & mask;
            /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/ table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
    }
    /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */ if (huff !== 0) //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = len - drop << 24 | 4194304;
    /* set return parameters */ //opts.table_index += used;
    opts.bits = root;
    return 0;
};
var $2438585bd7e1d91e$var$inftrees = $2438585bd7e1d91e$var$inflate_table;
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
const $2438585bd7e1d91e$var$CODES = 0;
const $2438585bd7e1d91e$var$LENS = 1;
const $2438585bd7e1d91e$var$DISTS = 2;
/* Public constants ==========================================================*/ /* ===========================================================================*/ const { Z_FINISH: $2438585bd7e1d91e$var$Z_FINISH$1, Z_BLOCK: $2438585bd7e1d91e$var$Z_BLOCK, Z_TREES: $2438585bd7e1d91e$var$Z_TREES, Z_OK: $2438585bd7e1d91e$var$Z_OK$1, Z_STREAM_END: $2438585bd7e1d91e$var$Z_STREAM_END$1, Z_NEED_DICT: $2438585bd7e1d91e$var$Z_NEED_DICT$1, Z_STREAM_ERROR: $2438585bd7e1d91e$var$Z_STREAM_ERROR$1, Z_DATA_ERROR: $2438585bd7e1d91e$var$Z_DATA_ERROR$1, Z_MEM_ERROR: $2438585bd7e1d91e$var$Z_MEM_ERROR$1, Z_BUF_ERROR: $2438585bd7e1d91e$var$Z_BUF_ERROR, Z_DEFLATED: $2438585bd7e1d91e$var$Z_DEFLATED } = $2438585bd7e1d91e$var$constants$2;
/* STATES ====================================================================*/ /* ===========================================================================*/ const $2438585bd7e1d91e$var$HEAD = 16180; /* i: waiting for magic header */ 
const $2438585bd7e1d91e$var$FLAGS = 16181; /* i: waiting for method and flags (gzip) */ 
const $2438585bd7e1d91e$var$TIME = 16182; /* i: waiting for modification time (gzip) */ 
const $2438585bd7e1d91e$var$OS = 16183; /* i: waiting for extra flags and operating system (gzip) */ 
const $2438585bd7e1d91e$var$EXLEN = 16184; /* i: waiting for extra length (gzip) */ 
const $2438585bd7e1d91e$var$EXTRA = 16185; /* i: waiting for extra bytes (gzip) */ 
const $2438585bd7e1d91e$var$NAME = 16186; /* i: waiting for end of file name (gzip) */ 
const $2438585bd7e1d91e$var$COMMENT = 16187; /* i: waiting for end of comment (gzip) */ 
const $2438585bd7e1d91e$var$HCRC = 16188; /* i: waiting for header crc (gzip) */ 
const $2438585bd7e1d91e$var$DICTID = 16189; /* i: waiting for dictionary check value */ 
const $2438585bd7e1d91e$var$DICT = 16190; /* waiting for inflateSetDictionary() call */ 
const $2438585bd7e1d91e$var$TYPE = 16191; /* i: waiting for type bits, including last-flag bit */ 
const $2438585bd7e1d91e$var$TYPEDO = 16192; /* i: same, but skip check to exit inflate on new block */ 
const $2438585bd7e1d91e$var$STORED = 16193; /* i: waiting for stored size (length and complement) */ 
const $2438585bd7e1d91e$var$COPY_ = 16194; /* i/o: same as COPY below, but only first time in */ 
const $2438585bd7e1d91e$var$COPY = 16195; /* i/o: waiting for input or output to copy stored block */ 
const $2438585bd7e1d91e$var$TABLE = 16196; /* i: waiting for dynamic block table lengths */ 
const $2438585bd7e1d91e$var$LENLENS = 16197; /* i: waiting for code length code lengths */ 
const $2438585bd7e1d91e$var$CODELENS = 16198; /* i: waiting for length/lit and distance code lengths */ 
const $2438585bd7e1d91e$var$LEN_ = 16199; /* i: same as LEN below, but only first time in */ 
const $2438585bd7e1d91e$var$LEN = 16200; /* i: waiting for length/lit/eob code */ 
const $2438585bd7e1d91e$var$LENEXT = 16201; /* i: waiting for length extra bits */ 
const $2438585bd7e1d91e$var$DIST = 16202; /* i: waiting for distance code */ 
const $2438585bd7e1d91e$var$DISTEXT = 16203; /* i: waiting for distance extra bits */ 
const $2438585bd7e1d91e$var$MATCH = 16204; /* o: waiting for output space to copy string */ 
const $2438585bd7e1d91e$var$LIT = 16205; /* o: waiting for output space to write literal */ 
const $2438585bd7e1d91e$var$CHECK = 16206; /* i: waiting for 32-bit check value */ 
const $2438585bd7e1d91e$var$LENGTH = 16207; /* i: waiting for 32-bit length (gzip) */ 
const $2438585bd7e1d91e$var$DONE = 16208; /* finished check, done -- remain here until reset */ 
const $2438585bd7e1d91e$var$BAD = 16209; /* got a data error -- remain here until reset */ 
const $2438585bd7e1d91e$var$MEM = 16210; /* got an inflate() memory error -- remain here until reset */ 
const $2438585bd7e1d91e$var$SYNC = 16211; /* looking for synchronization bytes to restart inflate() */ 
/* ===========================================================================*/ const $2438585bd7e1d91e$var$ENOUGH_LENS = 852;
const $2438585bd7e1d91e$var$ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);
const $2438585bd7e1d91e$var$MAX_WBITS = 15;
/* 32K LZ77 window */ const $2438585bd7e1d91e$var$DEF_WBITS = $2438585bd7e1d91e$var$MAX_WBITS;
const $2438585bd7e1d91e$var$zswap32 = (q)=>{
    return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);
};
function $2438585bd7e1d91e$var$InflateState() {
    this.strm = null; /* pointer back to this zlib stream */ 
    this.mode = 0; /* current inflate mode */ 
    this.last = false; /* true if processing last block */ 
    this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */ 
    this.havedict = false; /* true if dictionary provided */ 
    this.flags = 0; /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */ 
    this.dmax = 0; /* zlib header max distance (INFLATE_STRICT) */ 
    this.check = 0; /* protected copy of check value */ 
    this.total = 0; /* protected copy of output count */ 
    // TODO: may be {}
    this.head = null; /* where to save gzip header information */ 
    /* sliding window */ this.wbits = 0; /* log base 2 of requested window size */ 
    this.wsize = 0; /* window size or zero if not using window */ 
    this.whave = 0; /* valid bytes in the window */ 
    this.wnext = 0; /* window write index */ 
    this.window = null; /* allocated sliding window, if needed */ 
    /* bit accumulator */ this.hold = 0; /* input bit accumulator */ 
    this.bits = 0; /* number of bits in "in" */ 
    /* for string and stored block copying */ this.length = 0; /* literal or length of data to copy */ 
    this.offset = 0; /* distance back to copy string from */ 
    /* for table and code decoding */ this.extra = 0; /* extra bits needed */ 
    /* fixed and dynamic code tables */ this.lencode = null; /* starting table for length/literal codes */ 
    this.distcode = null; /* starting table for distance codes */ 
    this.lenbits = 0; /* index bits for lencode */ 
    this.distbits = 0; /* index bits for distcode */ 
    /* dynamic table building */ this.ncode = 0; /* number of code length code lengths */ 
    this.nlen = 0; /* number of length code lengths */ 
    this.ndist = 0; /* number of distance code lengths */ 
    this.have = 0; /* number of code lengths in lens[] */ 
    this.next = null; /* next available space in codes[] */ 
    this.lens = new Uint16Array(320); /* temporary storage for code lengths */ 
    this.work = new Uint16Array(288); /* work area for code table building */ 
    /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */ //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
    this.lendyn = null; /* dynamic table for length/literal codes (JS specific) */ 
    this.distdyn = null; /* dynamic table for distance codes (JS specific) */ 
    this.sane = 0; /* if false, allow invalid distance too far */ 
    this.back = 0; /* bits back of last unprocessed length/lit */ 
    this.was = 0; /* initial length of match */ 
}
const $2438585bd7e1d91e$var$inflateStateCheck = (strm)=>{
    if (!strm) return 1;
    const state = strm.state;
    if (!state || state.strm !== strm || state.mode < $2438585bd7e1d91e$var$HEAD || state.mode > $2438585bd7e1d91e$var$SYNC) return 1;
    return 0;
};
const $2438585bd7e1d91e$var$inflateResetKeep = (strm)=>{
    if ($2438585bd7e1d91e$var$inflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = ''; /*Z_NULL*/ 
    if (state.wrap) strm.adler = state.wrap & 1;
    state.mode = $2438585bd7e1d91e$var$HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null /*Z_NULL*/ ;
    state.hold = 0;
    state.bits = 0;
    //state.lencode = state.distcode = state.next = state.codes;
    state.lencode = state.lendyn = new Int32Array($2438585bd7e1d91e$var$ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array($2438585bd7e1d91e$var$ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    //Tracev((stderr, "inflate: reset\n"));
    return $2438585bd7e1d91e$var$Z_OK$1;
};
const $2438585bd7e1d91e$var$inflateReset = (strm)=>{
    if ($2438585bd7e1d91e$var$inflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return $2438585bd7e1d91e$var$inflateResetKeep(strm);
};
const $2438585bd7e1d91e$var$inflateReset2 = (strm, windowBits)=>{
    let wrap;
    /* get the state */ if ($2438585bd7e1d91e$var$inflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    const state = strm.state;
    /* extract wrap request from windowBits parameter */ if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
    } else {
        wrap = (windowBits >> 4) + 5;
        if (windowBits < 48) windowBits &= 15;
    }
    /* set number of window bits, free window if different */ if (windowBits && (windowBits < 8 || windowBits > 15)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    if (state.window !== null && state.wbits !== windowBits) state.window = null;
    /* update state and reset the rest of it */ state.wrap = wrap;
    state.wbits = windowBits;
    return $2438585bd7e1d91e$var$inflateReset(strm);
};
const $2438585bd7e1d91e$var$inflateInit2 = (strm, windowBits)=>{
    if (!strm) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    //strm.msg = Z_NULL;                 /* in case we return an error */
    const state = new $2438585bd7e1d91e$var$InflateState();
    //if (state === Z_NULL) return Z_MEM_ERROR;
    //Tracev((stderr, "inflate: allocated\n"));
    strm.state = state;
    state.strm = strm;
    state.window = null /*Z_NULL*/ ;
    state.mode = $2438585bd7e1d91e$var$HEAD; /* to pass state test in inflateReset2() */ 
    const ret = $2438585bd7e1d91e$var$inflateReset2(strm, windowBits);
    if (ret !== $2438585bd7e1d91e$var$Z_OK$1) strm.state = null /*Z_NULL*/ ;
    return ret;
};
const $2438585bd7e1d91e$var$inflateInit = (strm)=>{
    return $2438585bd7e1d91e$var$inflateInit2(strm, $2438585bd7e1d91e$var$DEF_WBITS);
};
/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */ let $2438585bd7e1d91e$var$virgin = true;
let $2438585bd7e1d91e$var$lenfix, $2438585bd7e1d91e$var$distfix; // We have no pointers in JS, so keep tables separate
const $2438585bd7e1d91e$var$fixedtables = (state)=>{
    /* build fixed huffman tables if first call (may not be thread safe) */ if ($2438585bd7e1d91e$var$virgin) {
        $2438585bd7e1d91e$var$lenfix = new Int32Array(512);
        $2438585bd7e1d91e$var$distfix = new Int32Array(32);
        /* literal/length table */ let sym = 0;
        while(sym < 144)state.lens[sym++] = 8;
        while(sym < 256)state.lens[sym++] = 9;
        while(sym < 280)state.lens[sym++] = 7;
        while(sym < 288)state.lens[sym++] = 8;
        $2438585bd7e1d91e$var$inftrees($2438585bd7e1d91e$var$LENS, state.lens, 0, 288, $2438585bd7e1d91e$var$lenfix, 0, state.work, {
            bits: 9
        });
        /* distance table */ sym = 0;
        while(sym < 32)state.lens[sym++] = 5;
        $2438585bd7e1d91e$var$inftrees($2438585bd7e1d91e$var$DISTS, state.lens, 0, 32, $2438585bd7e1d91e$var$distfix, 0, state.work, {
            bits: 5
        });
        /* do this just once */ $2438585bd7e1d91e$var$virgin = false;
    }
    state.lencode = $2438585bd7e1d91e$var$lenfix;
    state.lenbits = 9;
    state.distcode = $2438585bd7e1d91e$var$distfix;
    state.distbits = 5;
};
/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */ const $2438585bd7e1d91e$var$updatewindow = (strm, src, end, copy)=>{
    let dist;
    const state = strm.state;
    /* if it hasn't been done already, allocate space for the window */ if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new Uint8Array(state.wsize);
    }
    /* copy state->wsize or less output bytes into the circular window */ if (copy >= state.wsize) {
        state.window.set(src.subarray(end - state.wsize, end), 0);
        state.wnext = 0;
        state.whave = state.wsize;
    } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) dist = copy;
        //zmemcpy(state->window + state->wnext, end - copy, dist);
        state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
        copy -= dist;
        if (copy) {
            //zmemcpy(state->window, end - copy, copy);
            state.window.set(src.subarray(end - copy, end), 0);
            state.wnext = copy;
            state.whave = state.wsize;
        } else {
            state.wnext += dist;
            if (state.wnext === state.wsize) state.wnext = 0;
            if (state.whave < state.wsize) state.whave += dist;
        }
    }
    return 0;
};
const $2438585bd7e1d91e$var$inflate$2 = (strm, flush)=>{
    let state;
    let input, output; // input/output buffers
    let next; /* next input INDEX */ 
    let put; /* next output INDEX */ 
    let have, left; /* available input and output */ 
    let hold; /* bit buffer */ 
    let bits; /* bits in bit buffer */ 
    let _in, _out; /* save starting available input and output */ 
    let copy; /* number of stored or match bytes to copy */ 
    let from; /* where to copy match bytes from */ 
    let from_source;
    let here = 0; /* current decoding table entry */ 
    let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
    //let last;                   /* parent table entry */
    let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
    let len; /* length to copy for repeats, bits to drop */ 
    let ret; /* return code */ 
    const hbuf = new Uint8Array(4); /* buffer for gzip header crc calculation */ 
    let opts;
    let n; // temporary variable for NEED_BITS
    const order = /* permutation of code lengths */ new Uint8Array([
        16,
        17,
        18,
        0,
        8,
        7,
        9,
        6,
        10,
        5,
        11,
        4,
        12,
        3,
        13,
        2,
        14,
        1,
        15
    ]);
    if ($2438585bd7e1d91e$var$inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    state = strm.state;
    if (state.mode === $2438585bd7e1d91e$var$TYPE) state.mode = $2438585bd7e1d91e$var$TYPEDO;
     /* skip check */ 
    //--- LOAD() ---
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    //---
    _in = have;
    _out = left;
    ret = $2438585bd7e1d91e$var$Z_OK$1;
    inf_leave: for(;;)switch(state.mode){
        case $2438585bd7e1d91e$var$HEAD:
            if (state.wrap === 0) {
                state.mode = $2438585bd7e1d91e$var$TYPEDO;
                break;
            }
            //=== NEEDBITS(16);
            while(bits < 16){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if (state.wrap & 2 && hold === 0x8b1f) {
                if (state.wbits === 0) state.wbits = 15;
                state.check = 0 /*crc32(0L, Z_NULL, 0)*/ ;
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 0xff;
                hbuf[1] = hold >>> 8 & 0xff;
                state.check = $2438585bd7e1d91e$var$crc32_1(state.check, hbuf, 2, 0);
                //===//
                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
                state.mode = $2438585bd7e1d91e$var$FLAGS;
                break;
            }
            if (state.head) state.head.done = false;
            if (!(state.wrap & 1) || /* check if zlib header allowed */ (((hold & 0xff) << 8) + (hold >> 8)) % 31) {
                strm.msg = 'incorrect header check';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            if ((hold & 0x0f) !== $2438585bd7e1d91e$var$Z_DEFLATED) {
                strm.msg = 'unknown compression method';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            //--- DROPBITS(4) ---//
            hold >>>= 4;
            bits -= 4;
            //---//
            len = (hold & 0x0f) + 8;
            if (state.wbits === 0) state.wbits = len;
            if (len > 15 || len > state.wbits) {
                strm.msg = 'invalid window size';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            // !!! pako patch. Force use `options.windowBits` if passed.
            // Required to always use max window size by default.
            state.dmax = 1 << state.wbits;
            //state.dmax = 1 << len;
            state.flags = 0; /* indicate zlib header */ 
            //Tracev((stderr, "inflate:   zlib header ok\n"));
            strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/ ;
            state.mode = hold & 0x200 ? $2438585bd7e1d91e$var$DICTID : $2438585bd7e1d91e$var$TYPE;
            //=== INITBITS();
            hold = 0;
            bits = 0;
            break;
        case $2438585bd7e1d91e$var$FLAGS:
            //=== NEEDBITS(16); */
            while(bits < 16){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            state.flags = hold;
            if ((state.flags & 0xff) !== $2438585bd7e1d91e$var$Z_DEFLATED) {
                strm.msg = 'unknown compression method';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            if (state.flags & 0xe000) {
                strm.msg = 'unknown header flags set';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            if (state.head) state.head.text = hold >> 8 & 1;
            if (state.flags & 0x0200 && state.wrap & 4) {
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 0xff;
                hbuf[1] = hold >>> 8 & 0xff;
                state.check = $2438585bd7e1d91e$var$crc32_1(state.check, hbuf, 2, 0);
            //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $2438585bd7e1d91e$var$TIME;
        /* falls through */ case $2438585bd7e1d91e$var$TIME:
            //=== NEEDBITS(32); */
            while(bits < 32){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if (state.head) state.head.time = hold;
            if (state.flags & 0x0200 && state.wrap & 4) {
                //=== CRC4(state.check, hold)
                hbuf[0] = hold & 0xff;
                hbuf[1] = hold >>> 8 & 0xff;
                hbuf[2] = hold >>> 16 & 0xff;
                hbuf[3] = hold >>> 24 & 0xff;
                state.check = $2438585bd7e1d91e$var$crc32_1(state.check, hbuf, 4, 0);
            //===
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $2438585bd7e1d91e$var$OS;
        /* falls through */ case $2438585bd7e1d91e$var$OS:
            //=== NEEDBITS(16); */
            while(bits < 16){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if (state.head) {
                state.head.xflags = hold & 0xff;
                state.head.os = hold >> 8;
            }
            if (state.flags & 0x0200 && state.wrap & 4) {
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 0xff;
                hbuf[1] = hold >>> 8 & 0xff;
                state.check = $2438585bd7e1d91e$var$crc32_1(state.check, hbuf, 2, 0);
            //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $2438585bd7e1d91e$var$EXLEN;
        /* falls through */ case $2438585bd7e1d91e$var$EXLEN:
            if (state.flags & 0x0400) {
                //=== NEEDBITS(16); */
                while(bits < 16){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.length = hold;
                if (state.head) state.head.extra_len = hold;
                if (state.flags & 0x0200 && state.wrap & 4) {
                    //=== CRC2(state.check, hold);
                    hbuf[0] = hold & 0xff;
                    hbuf[1] = hold >>> 8 & 0xff;
                    state.check = $2438585bd7e1d91e$var$crc32_1(state.check, hbuf, 2, 0);
                //===//
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            } else if (state.head) state.head.extra = null /*Z_NULL*/ ;
            state.mode = $2438585bd7e1d91e$var$EXTRA;
        /* falls through */ case $2438585bd7e1d91e$var$EXTRA:
            if (state.flags & 0x0400) {
                copy = state.length;
                if (copy > have) copy = have;
                if (copy) {
                    if (state.head) {
                        len = state.head.extra_len - state.length;
                        if (!state.head.extra) // Use untyped array for more convenient processing later
                        state.head.extra = new Uint8Array(state.head.extra_len);
                        state.head.extra.set(input.subarray(next, // extra field is limited to 65536 bytes
                        // - no need for additional size check
                        next + copy), /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/ len);
                    //zmemcpy(state.head.extra + len, next,
                    //        len + copy > state.head.extra_max ?
                    //        state.head.extra_max - len : copy);
                    }
                    if (state.flags & 0x0200 && state.wrap & 4) state.check = $2438585bd7e1d91e$var$crc32_1(state.check, input, copy, next);
                    have -= copy;
                    next += copy;
                    state.length -= copy;
                }
                if (state.length) break inf_leave;
            }
            state.length = 0;
            state.mode = $2438585bd7e1d91e$var$NAME;
        /* falls through */ case $2438585bd7e1d91e$var$NAME:
            if (state.flags & 0x0800) {
                if (have === 0) break inf_leave;
                copy = 0;
                do {
                    // TODO: 2 or 1 bytes?
                    len = input[next + copy++];
                    /* use constant limit because in js we should not preallocate memory */ if (state.head && len && state.length < 65536 /*state.head.name_max*/ ) state.head.name += String.fromCharCode(len);
                }while (len && copy < have);
                if (state.flags & 0x0200 && state.wrap & 4) state.check = $2438585bd7e1d91e$var$crc32_1(state.check, input, copy, next);
                have -= copy;
                next += copy;
                if (len) break inf_leave;
            } else if (state.head) state.head.name = null;
            state.length = 0;
            state.mode = $2438585bd7e1d91e$var$COMMENT;
        /* falls through */ case $2438585bd7e1d91e$var$COMMENT:
            if (state.flags & 0x1000) {
                if (have === 0) break inf_leave;
                copy = 0;
                do {
                    len = input[next + copy++];
                    /* use constant limit because in js we should not preallocate memory */ if (state.head && len && state.length < 65536 /*state.head.comm_max*/ ) state.head.comment += String.fromCharCode(len);
                }while (len && copy < have);
                if (state.flags & 0x0200 && state.wrap & 4) state.check = $2438585bd7e1d91e$var$crc32_1(state.check, input, copy, next);
                have -= copy;
                next += copy;
                if (len) break inf_leave;
            } else if (state.head) state.head.comment = null;
            state.mode = $2438585bd7e1d91e$var$HCRC;
        /* falls through */ case $2438585bd7e1d91e$var$HCRC:
            if (state.flags & 0x0200) {
                //=== NEEDBITS(16); */
                while(bits < 16){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                if (state.wrap & 4 && hold !== (state.check & 0xffff)) {
                    strm.msg = 'header crc mismatch';
                    state.mode = $2438585bd7e1d91e$var$BAD;
                    break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            }
            if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = $2438585bd7e1d91e$var$TYPE;
            break;
        case $2438585bd7e1d91e$var$DICTID:
            //=== NEEDBITS(32); */
            while(bits < 32){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            strm.adler = state.check = $2438585bd7e1d91e$var$zswap32(hold);
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $2438585bd7e1d91e$var$DICT;
        /* falls through */ case $2438585bd7e1d91e$var$DICT:
            if (state.havedict === 0) {
                //--- RESTORE() ---
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                //---
                return $2438585bd7e1d91e$var$Z_NEED_DICT$1;
            }
            strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/ ;
            state.mode = $2438585bd7e1d91e$var$TYPE;
        /* falls through */ case $2438585bd7e1d91e$var$TYPE:
            if (flush === $2438585bd7e1d91e$var$Z_BLOCK || flush === $2438585bd7e1d91e$var$Z_TREES) break inf_leave;
        /* falls through */ case $2438585bd7e1d91e$var$TYPEDO:
            if (state.last) {
                //--- BYTEBITS() ---//
                hold >>>= bits & 7;
                bits -= bits & 7;
                //---//
                state.mode = $2438585bd7e1d91e$var$CHECK;
                break;
            }
            //=== NEEDBITS(3); */
            while(bits < 3){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            state.last = hold & 0x01 /*BITS(1)*/ ;
            //--- DROPBITS(1) ---//
            hold >>>= 1;
            bits -= 1;
            //---//
            switch(hold & 0x03){
                case 0:
                    /* stored block */ //Tracev((stderr, "inflate:     stored block%s\n",
                    //        state.last ? " (last)" : ""));
                    state.mode = $2438585bd7e1d91e$var$STORED;
                    break;
                case 1:
                    /* fixed block */ $2438585bd7e1d91e$var$fixedtables(state);
                    //Tracev((stderr, "inflate:     fixed codes block%s\n",
                    //        state.last ? " (last)" : ""));
                    state.mode = $2438585bd7e1d91e$var$LEN_; /* decode codes */ 
                    if (flush === $2438585bd7e1d91e$var$Z_TREES) {
                        //--- DROPBITS(2) ---//
                        hold >>>= 2;
                        bits -= 2;
                        break inf_leave;
                    }
                    break;
                case 2:
                    /* dynamic block */ //Tracev((stderr, "inflate:     dynamic codes block%s\n",
                    //        state.last ? " (last)" : ""));
                    state.mode = $2438585bd7e1d91e$var$TABLE;
                    break;
                case 3:
                    strm.msg = 'invalid block type';
                    state.mode = $2438585bd7e1d91e$var$BAD;
            }
            //--- DROPBITS(2) ---//
            hold >>>= 2;
            bits -= 2;
            break;
        case $2438585bd7e1d91e$var$STORED:
            //--- BYTEBITS() ---// /* go to byte boundary */
            hold >>>= bits & 7;
            bits -= bits & 7;
            //---//
            //=== NEEDBITS(32); */
            while(bits < 32){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if ((hold & 0xffff) !== (hold >>> 16 ^ 0xffff)) {
                strm.msg = 'invalid stored block lengths';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            state.length = hold & 0xffff;
            //Tracev((stderr, "inflate:       stored length %u\n",
            //        state.length));
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $2438585bd7e1d91e$var$COPY_;
            if (flush === $2438585bd7e1d91e$var$Z_TREES) break inf_leave;
        /* falls through */ case $2438585bd7e1d91e$var$COPY_:
            state.mode = $2438585bd7e1d91e$var$COPY;
        /* falls through */ case $2438585bd7e1d91e$var$COPY:
            copy = state.length;
            if (copy) {
                if (copy > have) copy = have;
                if (copy > left) copy = left;
                if (copy === 0) break inf_leave;
                //--- zmemcpy(put, next, copy); ---
                output.set(input.subarray(next, next + copy), put);
                //---//
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
            }
            //Tracev((stderr, "inflate:       stored end\n"));
            state.mode = $2438585bd7e1d91e$var$TYPE;
            break;
        case $2438585bd7e1d91e$var$TABLE:
            //=== NEEDBITS(14); */
            while(bits < 14){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            state.nlen = (hold & 0x1f) + 257;
            //--- DROPBITS(5) ---//
            hold >>>= 5;
            bits -= 5;
            //---//
            state.ndist = (hold & 0x1f) + 1;
            //--- DROPBITS(5) ---//
            hold >>>= 5;
            bits -= 5;
            //---//
            state.ncode = (hold & 0x0f) + 4;
            //--- DROPBITS(4) ---//
            hold >>>= 4;
            bits -= 4;
            //---//
            //#ifndef PKZIP_BUG_WORKAROUND
            if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = 'too many length or distance symbols';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            //#endif
            //Tracev((stderr, "inflate:       table sizes ok\n"));
            state.have = 0;
            state.mode = $2438585bd7e1d91e$var$LENLENS;
        /* falls through */ case $2438585bd7e1d91e$var$LENLENS:
            while(state.have < state.ncode){
                //=== NEEDBITS(3);
                while(bits < 3){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.lens[order[state.have++]] = hold & 0x07; //BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
            //---//
            }
            while(state.have < 19)state.lens[order[state.have++]] = 0;
            // We have separate tables & no pointers. 2 commented lines below not needed.
            //state.next = state.codes;
            //state.lencode = state.next;
            // Switch to use dynamic table
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = {
                bits: state.lenbits
            };
            ret = $2438585bd7e1d91e$var$inftrees($2438585bd7e1d91e$var$CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
                strm.msg = 'invalid code lengths set';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            //Tracev((stderr, "inflate:       code lengths ok\n"));
            state.have = 0;
            state.mode = $2438585bd7e1d91e$var$CODELENS;
        /* falls through */ case $2438585bd7e1d91e$var$CODELENS:
            while(state.have < state.nlen + state.ndist){
                for(;;){
                    here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/ 
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 0xff;
                    here_val = here & 0xffff;
                    if (here_bits <= bits) break;
                    //--- PULLBYTE() ---//
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                //---//
                }
                if (here_val < 16) {
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    state.lens[state.have++] = here_val;
                } else {
                    if (here_val === 16) {
                        //=== NEEDBITS(here.bits + 2);
                        n = here_bits + 2;
                        while(bits < n){
                            if (have === 0) break inf_leave;
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        //--- DROPBITS(here.bits) ---//
                        hold >>>= here_bits;
                        bits -= here_bits;
                        //---//
                        if (state.have === 0) {
                            strm.msg = 'invalid bit length repeat';
                            state.mode = $2438585bd7e1d91e$var$BAD;
                            break;
                        }
                        len = state.lens[state.have - 1];
                        copy = 3 + (hold & 0x03); //BITS(2);
                        //--- DROPBITS(2) ---//
                        hold >>>= 2;
                        bits -= 2;
                    //---//
                    } else if (here_val === 17) {
                        //=== NEEDBITS(here.bits + 3);
                        n = here_bits + 3;
                        while(bits < n){
                            if (have === 0) break inf_leave;
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        //--- DROPBITS(here.bits) ---//
                        hold >>>= here_bits;
                        bits -= here_bits;
                        //---//
                        len = 0;
                        copy = 3 + (hold & 0x07); //BITS(3);
                        //--- DROPBITS(3) ---//
                        hold >>>= 3;
                        bits -= 3;
                    //---//
                    } else {
                        //=== NEEDBITS(here.bits + 7);
                        n = here_bits + 7;
                        while(bits < n){
                            if (have === 0) break inf_leave;
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        //--- DROPBITS(here.bits) ---//
                        hold >>>= here_bits;
                        bits -= here_bits;
                        //---//
                        len = 0;
                        copy = 11 + (hold & 0x7f); //BITS(7);
                        //--- DROPBITS(7) ---//
                        hold >>>= 7;
                        bits -= 7;
                    //---//
                    }
                    if (state.have + copy > state.nlen + state.ndist) {
                        strm.msg = 'invalid bit length repeat';
                        state.mode = $2438585bd7e1d91e$var$BAD;
                        break;
                    }
                    while(copy--)state.lens[state.have++] = len;
                }
            }
            /* handle error breaks in while */ if (state.mode === $2438585bd7e1d91e$var$BAD) break;
            /* check for end-of-block code (better have one) */ if (state.lens[256] === 0) {
                strm.msg = 'invalid code -- missing end-of-block';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */ state.lenbits = 9;
            opts = {
                bits: state.lenbits
            };
            ret = $2438585bd7e1d91e$var$inftrees($2438585bd7e1d91e$var$LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            // We have separate tables & no pointers. 2 commented lines below not needed.
            // state.next_index = opts.table_index;
            state.lenbits = opts.bits;
            // state.lencode = state.next;
            if (ret) {
                strm.msg = 'invalid literal/lengths set';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            state.distbits = 6;
            //state.distcode.copy(state.codes);
            // Switch to use dynamic table
            state.distcode = state.distdyn;
            opts = {
                bits: state.distbits
            };
            ret = $2438585bd7e1d91e$var$inftrees($2438585bd7e1d91e$var$DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            // We have separate tables & no pointers. 2 commented lines below not needed.
            // state.next_index = opts.table_index;
            state.distbits = opts.bits;
            // state.distcode = state.next;
            if (ret) {
                strm.msg = 'invalid distances set';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            //Tracev((stderr, 'inflate:       codes ok\n'));
            state.mode = $2438585bd7e1d91e$var$LEN_;
            if (flush === $2438585bd7e1d91e$var$Z_TREES) break inf_leave;
        /* falls through */ case $2438585bd7e1d91e$var$LEN_:
            state.mode = $2438585bd7e1d91e$var$LEN;
        /* falls through */ case $2438585bd7e1d91e$var$LEN:
            if (have >= 6 && left >= 258) {
                //--- RESTORE() ---
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                //---
                $2438585bd7e1d91e$var$inffast(strm, _out);
                //--- LOAD() ---
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                //---
                if (state.mode === $2438585bd7e1d91e$var$TYPE) state.back = -1;
                break;
            }
            state.back = 0;
            for(;;){
                here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/ 
                here_bits = here >>> 24;
                here_op = here >>> 16 & 0xff;
                here_val = here & 0xffff;
                if (here_bits <= bits) break;
                //--- PULLBYTE() ---//
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            //---//
            }
            if (here_op && (here_op & 0xf0) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for(;;){
                    here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 0xff;
                    here_val = here & 0xffff;
                    if (last_bits + here_bits <= bits) break;
                    //--- PULLBYTE() ---//
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                //---//
                }
                //--- DROPBITS(last.bits) ---//
                hold >>>= last_bits;
                bits -= last_bits;
                //---//
                state.back += last_bits;
            }
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
                //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
                //        "inflate:         literal '%c'\n" :
                //        "inflate:         literal 0x%02x\n", here.val));
                state.mode = $2438585bd7e1d91e$var$LIT;
                break;
            }
            if (here_op & 32) {
                //Tracevv((stderr, "inflate:         end of block\n"));
                state.back = -1;
                state.mode = $2438585bd7e1d91e$var$TYPE;
                break;
            }
            if (here_op & 64) {
                strm.msg = 'invalid literal/length code';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            state.extra = here_op & 15;
            state.mode = $2438585bd7e1d91e$var$LENEXT;
        /* falls through */ case $2438585bd7e1d91e$var$LENEXT:
            if (state.extra) {
                //=== NEEDBITS(state.extra);
                n = state.extra;
                while(bits < n){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.length += hold & (1 << state.extra) - 1 /*BITS(state.extra)*/ ;
                //--- DROPBITS(state.extra) ---//
                hold >>>= state.extra;
                bits -= state.extra;
                //---//
                state.back += state.extra;
            }
            //Tracevv((stderr, "inflate:         length %u\n", state.length));
            state.was = state.length;
            state.mode = $2438585bd7e1d91e$var$DIST;
        /* falls through */ case $2438585bd7e1d91e$var$DIST:
            for(;;){
                here = state.distcode[hold & (1 << state.distbits) - 1]; /*BITS(state.distbits)*/ 
                here_bits = here >>> 24;
                here_op = here >>> 16 & 0xff;
                here_val = here & 0xffff;
                if (here_bits <= bits) break;
                //--- PULLBYTE() ---//
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            //---//
            }
            if ((here_op & 0xf0) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for(;;){
                    here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 0xff;
                    here_val = here & 0xffff;
                    if (last_bits + here_bits <= bits) break;
                    //--- PULLBYTE() ---//
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                //---//
                }
                //--- DROPBITS(last.bits) ---//
                hold >>>= last_bits;
                bits -= last_bits;
                //---//
                state.back += last_bits;
            }
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.back += here_bits;
            if (here_op & 64) {
                strm.msg = 'invalid distance code';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = $2438585bd7e1d91e$var$DISTEXT;
        /* falls through */ case $2438585bd7e1d91e$var$DISTEXT:
            if (state.extra) {
                //=== NEEDBITS(state.extra);
                n = state.extra;
                while(bits < n){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.offset += hold & (1 << state.extra) - 1 /*BITS(state.extra)*/ ;
                //--- DROPBITS(state.extra) ---//
                hold >>>= state.extra;
                bits -= state.extra;
                //---//
                state.back += state.extra;
            }
            //#ifdef INFLATE_STRICT
            if (state.offset > state.dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = $2438585bd7e1d91e$var$BAD;
                break;
            }
            //#endif
            //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
            state.mode = $2438585bd7e1d91e$var$MATCH;
        /* falls through */ case $2438585bd7e1d91e$var$MATCH:
            if (left === 0) break inf_leave;
            copy = _out - left;
            if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                    if (state.sane) {
                        strm.msg = 'invalid distance too far back';
                        state.mode = $2438585bd7e1d91e$var$BAD;
                        break;
                    }
                }
                if (copy > state.wnext) {
                    copy -= state.wnext;
                    from = state.wsize - copy;
                } else from = state.wnext - copy;
                if (copy > state.length) copy = state.length;
                from_source = state.window;
            } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
            }
            if (copy > left) copy = left;
            left -= copy;
            state.length -= copy;
            do output[put++] = from_source[from++];
            while (--copy);
            if (state.length === 0) state.mode = $2438585bd7e1d91e$var$LEN;
            break;
        case $2438585bd7e1d91e$var$LIT:
            if (left === 0) break inf_leave;
            output[put++] = state.length;
            left--;
            state.mode = $2438585bd7e1d91e$var$LEN;
            break;
        case $2438585bd7e1d91e$var$CHECK:
            if (state.wrap) {
                //=== NEEDBITS(32);
                while(bits < 32){
                    if (have === 0) break inf_leave;
                    have--;
                    // Use '|' instead of '+' to make sure that result is signed
                    hold |= input[next++] << bits;
                    bits += 8;
                }
                //===//
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (state.wrap & 4 && _out) strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/ state.flags ? $2438585bd7e1d91e$var$crc32_1(state.check, output, _out, put - _out) : $2438585bd7e1d91e$var$adler32_1(state.check, output, _out, put - _out);
                _out = left;
                // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
                if (state.wrap & 4 && (state.flags ? hold : $2438585bd7e1d91e$var$zswap32(hold)) !== state.check) {
                    strm.msg = 'incorrect data check';
                    state.mode = $2438585bd7e1d91e$var$BAD;
                    break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            //Tracev((stderr, "inflate:   check matches trailer\n"));
            }
            state.mode = $2438585bd7e1d91e$var$LENGTH;
        /* falls through */ case $2438585bd7e1d91e$var$LENGTH:
            if (state.wrap && state.flags) {
                //=== NEEDBITS(32);
                while(bits < 32){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                if (state.wrap & 4 && hold !== (state.total & 0xffffffff)) {
                    strm.msg = 'incorrect length check';
                    state.mode = $2438585bd7e1d91e$var$BAD;
                    break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            //Tracev((stderr, "inflate:   length matches trailer\n"));
            }
            state.mode = $2438585bd7e1d91e$var$DONE;
        /* falls through */ case $2438585bd7e1d91e$var$DONE:
            ret = $2438585bd7e1d91e$var$Z_STREAM_END$1;
            break inf_leave;
        case $2438585bd7e1d91e$var$BAD:
            ret = $2438585bd7e1d91e$var$Z_DATA_ERROR$1;
            break inf_leave;
        case $2438585bd7e1d91e$var$MEM:
            return $2438585bd7e1d91e$var$Z_MEM_ERROR$1;
        case $2438585bd7e1d91e$var$SYNC:
        /* falls through */ default:
            return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    }
    // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"
    /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */ //--- RESTORE() ---
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    //---
    if (state.wsize || _out !== strm.avail_out && state.mode < $2438585bd7e1d91e$var$BAD && (state.mode < $2438585bd7e1d91e$var$CHECK || flush !== $2438585bd7e1d91e$var$Z_FINISH$1)) $2438585bd7e1d91e$var$updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out);
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/ state.flags ? $2438585bd7e1d91e$var$crc32_1(state.check, output, _out, strm.next_out - _out) : $2438585bd7e1d91e$var$adler32_1(state.check, output, _out, strm.next_out - _out);
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === $2438585bd7e1d91e$var$TYPE ? 128 : 0) + (state.mode === $2438585bd7e1d91e$var$LEN_ || state.mode === $2438585bd7e1d91e$var$COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === $2438585bd7e1d91e$var$Z_FINISH$1) && ret === $2438585bd7e1d91e$var$Z_OK$1) ret = $2438585bd7e1d91e$var$Z_BUF_ERROR;
    return ret;
};
const $2438585bd7e1d91e$var$inflateEnd = (strm)=>{
    if ($2438585bd7e1d91e$var$inflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    let state = strm.state;
    if (state.window) state.window = null;
    strm.state = null;
    return $2438585bd7e1d91e$var$Z_OK$1;
};
const $2438585bd7e1d91e$var$inflateGetHeader = (strm, head)=>{
    /* check state */ if ($2438585bd7e1d91e$var$inflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    const state = strm.state;
    if ((state.wrap & 2) === 0) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    /* save header structure */ state.head = head;
    head.done = false;
    return $2438585bd7e1d91e$var$Z_OK$1;
};
const $2438585bd7e1d91e$var$inflateSetDictionary = (strm, dictionary)=>{
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    /* check state */ if ($2438585bd7e1d91e$var$inflateStateCheck(strm)) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== $2438585bd7e1d91e$var$DICT) return $2438585bd7e1d91e$var$Z_STREAM_ERROR$1;
    /* check for correct dictionary identifier */ if (state.mode === $2438585bd7e1d91e$var$DICT) {
        dictid = 1; /* adler32(0, null, 0)*/ 
        /* dictid = adler32(dictid, dictionary, dictLength); */ dictid = $2438585bd7e1d91e$var$adler32_1(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) return $2438585bd7e1d91e$var$Z_DATA_ERROR$1;
    }
    /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */ ret = $2438585bd7e1d91e$var$updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
        state.mode = $2438585bd7e1d91e$var$MEM;
        return $2438585bd7e1d91e$var$Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    // Tracev((stderr, "inflate:   dictionary set\n"));
    return $2438585bd7e1d91e$var$Z_OK$1;
};
var $2438585bd7e1d91e$var$inflateReset_1 = $2438585bd7e1d91e$var$inflateReset;
var $2438585bd7e1d91e$var$inflateReset2_1 = $2438585bd7e1d91e$var$inflateReset2;
var $2438585bd7e1d91e$var$inflateResetKeep_1 = $2438585bd7e1d91e$var$inflateResetKeep;
var $2438585bd7e1d91e$var$inflateInit_1 = $2438585bd7e1d91e$var$inflateInit;
var $2438585bd7e1d91e$var$inflateInit2_1 = $2438585bd7e1d91e$var$inflateInit2;
var $2438585bd7e1d91e$var$inflate_2$1 = $2438585bd7e1d91e$var$inflate$2;
var $2438585bd7e1d91e$var$inflateEnd_1 = $2438585bd7e1d91e$var$inflateEnd;
var $2438585bd7e1d91e$var$inflateGetHeader_1 = $2438585bd7e1d91e$var$inflateGetHeader;
var $2438585bd7e1d91e$var$inflateSetDictionary_1 = $2438585bd7e1d91e$var$inflateSetDictionary;
var $2438585bd7e1d91e$var$inflateInfo = 'pako inflate (from Nodeca project)';
/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/ var $2438585bd7e1d91e$var$inflate_1$2 = {
    inflateReset: $2438585bd7e1d91e$var$inflateReset_1,
    inflateReset2: $2438585bd7e1d91e$var$inflateReset2_1,
    inflateResetKeep: $2438585bd7e1d91e$var$inflateResetKeep_1,
    inflateInit: $2438585bd7e1d91e$var$inflateInit_1,
    inflateInit2: $2438585bd7e1d91e$var$inflateInit2_1,
    inflate: $2438585bd7e1d91e$var$inflate_2$1,
    inflateEnd: $2438585bd7e1d91e$var$inflateEnd_1,
    inflateGetHeader: $2438585bd7e1d91e$var$inflateGetHeader_1,
    inflateSetDictionary: $2438585bd7e1d91e$var$inflateSetDictionary_1,
    inflateInfo: $2438585bd7e1d91e$var$inflateInfo
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function $2438585bd7e1d91e$var$GZheader() {
    /* true if compressed data believed to be text */ this.text = 0;
    /* modification time */ this.time = 0;
    /* extra flags (not used when writing a gzip file) */ this.xflags = 0;
    /* operating system */ this.os = 0;
    /* pointer to extra field or Z_NULL if none */ this.extra = null;
    /* extra field length (valid if extra != Z_NULL) */ this.extra_len = 0; // Actually, we don't need it in JS,
    // but leave for few code modifications
    //
    // Setup limits is not necessary because in js we should not preallocate memory
    // for inflate use constant limit in 65536 bytes
    //
    /* space at extra (only when reading header) */ // this.extra_max  = 0;
    /* pointer to zero-terminated file name or Z_NULL */ this.name = '';
    /* space at name (only when reading header) */ // this.name_max   = 0;
    /* pointer to zero-terminated comment or Z_NULL */ this.comment = '';
    /* space at comment (only when reading header) */ // this.comm_max   = 0;
    /* true if there was or will be a header crc */ this.hcrc = 0;
    /* true when done reading gzip header (not used when writing a gzip file) */ this.done = false;
}
var $2438585bd7e1d91e$var$gzheader = $2438585bd7e1d91e$var$GZheader;
const $2438585bd7e1d91e$var$toString = Object.prototype.toString;
/* Public constants ==========================================================*/ /* ===========================================================================*/ const { Z_NO_FLUSH: $2438585bd7e1d91e$var$Z_NO_FLUSH, Z_FINISH: $2438585bd7e1d91e$var$Z_FINISH, Z_OK: $2438585bd7e1d91e$var$Z_OK, Z_STREAM_END: $2438585bd7e1d91e$var$Z_STREAM_END, Z_NEED_DICT: $2438585bd7e1d91e$var$Z_NEED_DICT, Z_STREAM_ERROR: $2438585bd7e1d91e$var$Z_STREAM_ERROR, Z_DATA_ERROR: $2438585bd7e1d91e$var$Z_DATA_ERROR, Z_MEM_ERROR: $2438585bd7e1d91e$var$Z_MEM_ERROR } = $2438585bd7e1d91e$var$constants$2;
/* ===========================================================================*/ /**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/ /* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/ /**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/ /**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/ /**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/ /**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/ function $2438585bd7e1d91e$var$Inflate$1(options) {
    this.options = $2438585bd7e1d91e$var$common.assign({
        chunkSize: 65536,
        windowBits: 15,
        to: ''
    }, options || {});
    const opt = this.options;
    // Force window size for `raw` data, if not set directly,
    // because we have no header for autodetect.
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) opt.windowBits = -15;
    }
    // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) opt.windowBits += 32;
    // Gzip header has no info about windows size, we can do autodetect only
    // for deflate. So, if window size not set, force it to max when gzip possible
    if (opt.windowBits > 15 && opt.windowBits < 48) // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    {
        if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
    }
    this.err = 0; // error code, if happens (0 = Z_OK)
    this.msg = ''; // error message
    this.ended = false; // used to avoid multiple onEnd() calls
    this.chunks = []; // chunks of compressed data
    this.strm = new $2438585bd7e1d91e$var$zstream();
    this.strm.avail_out = 0;
    let status = $2438585bd7e1d91e$var$inflate_1$2.inflateInit2(this.strm, opt.windowBits);
    if (status !== $2438585bd7e1d91e$var$Z_OK) throw new Error($2438585bd7e1d91e$var$messages[status]);
    this.header = new $2438585bd7e1d91e$var$gzheader();
    $2438585bd7e1d91e$var$inflate_1$2.inflateGetHeader(this.strm, this.header);
    // Setup dictionary
    if (opt.dictionary) {
        // Convert data if needed
        if (typeof opt.dictionary === 'string') opt.dictionary = $2438585bd7e1d91e$var$strings.string2buf(opt.dictionary);
        else if ($2438585bd7e1d91e$var$toString.call(opt.dictionary) === '[object ArrayBuffer]') opt.dictionary = new Uint8Array(opt.dictionary);
        if (opt.raw) {
            status = $2438585bd7e1d91e$var$inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
            if (status !== $2438585bd7e1d91e$var$Z_OK) throw new Error($2438585bd7e1d91e$var$messages[status]);
        }
    }
}
/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/ $2438585bd7e1d91e$var$Inflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended) return false;
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? $2438585bd7e1d91e$var$Z_FINISH : $2438585bd7e1d91e$var$Z_NO_FLUSH;
    // Convert data if needed
    if ($2438585bd7e1d91e$var$toString.call(data) === '[object ArrayBuffer]') strm.input = new Uint8Array(data);
    else strm.input = data;
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for(;;){
        if (strm.avail_out === 0) {
            strm.output = new Uint8Array(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
        }
        status = $2438585bd7e1d91e$var$inflate_1$2.inflate(strm, _flush_mode);
        if (status === $2438585bd7e1d91e$var$Z_NEED_DICT && dictionary) {
            status = $2438585bd7e1d91e$var$inflate_1$2.inflateSetDictionary(strm, dictionary);
            if (status === $2438585bd7e1d91e$var$Z_OK) status = $2438585bd7e1d91e$var$inflate_1$2.inflate(strm, _flush_mode);
            else if (status === $2438585bd7e1d91e$var$Z_DATA_ERROR) // Replace code with more verbose
            status = $2438585bd7e1d91e$var$Z_NEED_DICT;
        }
        // Skip snyc markers if more data follows and not raw mode
        while(strm.avail_in > 0 && status === $2438585bd7e1d91e$var$Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0){
            $2438585bd7e1d91e$var$inflate_1$2.inflateReset(strm);
            status = $2438585bd7e1d91e$var$inflate_1$2.inflate(strm, _flush_mode);
        }
        switch(status){
            case $2438585bd7e1d91e$var$Z_STREAM_ERROR:
            case $2438585bd7e1d91e$var$Z_DATA_ERROR:
            case $2438585bd7e1d91e$var$Z_NEED_DICT:
            case $2438585bd7e1d91e$var$Z_MEM_ERROR:
                this.onEnd(status);
                this.ended = true;
                return false;
        }
        // Remember real `avail_out` value, because we may patch out buffer content
        // to align utf8 strings boundaries.
        last_avail_out = strm.avail_out;
        if (strm.next_out) {
            if (strm.avail_out === 0 || status === $2438585bd7e1d91e$var$Z_STREAM_END) {
                if (this.options.to === 'string') {
                    let next_out_utf8 = $2438585bd7e1d91e$var$strings.utf8border(strm.output, strm.next_out);
                    let tail = strm.next_out - next_out_utf8;
                    let utf8str = $2438585bd7e1d91e$var$strings.buf2string(strm.output, next_out_utf8);
                    // move tail & realign counters
                    strm.next_out = tail;
                    strm.avail_out = chunkSize - tail;
                    if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
                    this.onData(utf8str);
                } else this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
            }
        }
        // Must repeat iteration if out buffer is full
        if (status === $2438585bd7e1d91e$var$Z_OK && last_avail_out === 0) continue;
        // Finalize if end of stream reached.
        if (status === $2438585bd7e1d91e$var$Z_STREAM_END) {
            status = $2438585bd7e1d91e$var$inflate_1$2.inflateEnd(this.strm);
            this.onEnd(status);
            this.ended = true;
            return true;
        }
        if (strm.avail_in === 0) break;
    }
    return true;
};
/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/ $2438585bd7e1d91e$var$Inflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
};
/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/ $2438585bd7e1d91e$var$Inflate$1.prototype.onEnd = function(status) {
    // On success - join
    if (status === $2438585bd7e1d91e$var$Z_OK) {
        if (this.options.to === 'string') this.result = this.chunks.join('');
        else this.result = $2438585bd7e1d91e$var$common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
};
/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/ function $2438585bd7e1d91e$var$inflate$1(input, options) {
    const inflator = new $2438585bd7e1d91e$var$Inflate$1(options);
    inflator.push(input);
    // That will never happens, if you don't cheat with options :)
    if (inflator.err) throw inflator.msg || $2438585bd7e1d91e$var$messages[inflator.err];
    return inflator.result;
}
/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/ function $2438585bd7e1d91e$var$inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return $2438585bd7e1d91e$var$inflate$1(input, options);
}
/**
 * ungzip(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/ var $2438585bd7e1d91e$var$Inflate_1$1 = $2438585bd7e1d91e$var$Inflate$1;
var $2438585bd7e1d91e$var$inflate_2 = $2438585bd7e1d91e$var$inflate$1;
var $2438585bd7e1d91e$var$inflateRaw_1$1 = $2438585bd7e1d91e$var$inflateRaw$1;
var $2438585bd7e1d91e$var$ungzip$1 = $2438585bd7e1d91e$var$inflate$1;
var $2438585bd7e1d91e$var$constants = $2438585bd7e1d91e$var$constants$2;
var $2438585bd7e1d91e$var$inflate_1$1 = {
    Inflate: $2438585bd7e1d91e$var$Inflate_1$1,
    inflate: $2438585bd7e1d91e$var$inflate_2,
    inflateRaw: $2438585bd7e1d91e$var$inflateRaw_1$1,
    ungzip: $2438585bd7e1d91e$var$ungzip$1,
    constants: $2438585bd7e1d91e$var$constants
};
const { Deflate: $2438585bd7e1d91e$var$Deflate, deflate: $2438585bd7e1d91e$var$deflate, deflateRaw: $2438585bd7e1d91e$var$deflateRaw, gzip: $2438585bd7e1d91e$var$gzip } = $2438585bd7e1d91e$var$deflate_1$1;
const { Inflate: $2438585bd7e1d91e$var$Inflate, inflate: $2438585bd7e1d91e$var$inflate, inflateRaw: $2438585bd7e1d91e$var$inflateRaw, ungzip: $2438585bd7e1d91e$var$ungzip } = $2438585bd7e1d91e$var$inflate_1$1;
var $2438585bd7e1d91e$export$ae157b6234afe138 = $2438585bd7e1d91e$var$Deflate;
var $2438585bd7e1d91e$export$2316623ecd1285ab = $2438585bd7e1d91e$var$deflate;
var $2438585bd7e1d91e$export$e95d6a8f69fb340a = $2438585bd7e1d91e$var$deflateRaw;
var $2438585bd7e1d91e$export$69f0ea7cf3a331a8 = $2438585bd7e1d91e$var$gzip;
var $2438585bd7e1d91e$export$d1de70a877d6e43c = $2438585bd7e1d91e$var$Inflate;
var $2438585bd7e1d91e$export$cae1ce83fe4a1782 = $2438585bd7e1d91e$var$inflate;
var $2438585bd7e1d91e$export$d0f0aa2d05c905c5 = $2438585bd7e1d91e$var$inflateRaw;
var $2438585bd7e1d91e$export$95adf9d270383091 = $2438585bd7e1d91e$var$ungzip;
var $2438585bd7e1d91e$export$1a988e7317c65621 = $2438585bd7e1d91e$var$constants$2;
var $2438585bd7e1d91e$export$2e2bcd8739ae039 = {
    Deflate: $2438585bd7e1d91e$export$ae157b6234afe138,
    deflate: $2438585bd7e1d91e$export$2316623ecd1285ab,
    deflateRaw: $2438585bd7e1d91e$export$e95d6a8f69fb340a,
    gzip: $2438585bd7e1d91e$export$69f0ea7cf3a331a8,
    Inflate: $2438585bd7e1d91e$export$d1de70a877d6e43c,
    inflate: $2438585bd7e1d91e$export$cae1ce83fe4a1782,
    inflateRaw: $2438585bd7e1d91e$export$d0f0aa2d05c905c5,
    ungzip: $2438585bd7e1d91e$export$95adf9d270383091,
    constants: $2438585bd7e1d91e$export$1a988e7317c65621
};


/* global SerialPort, ParityType, FlowControlType */ 
/**
 * Pad to the next alignment boundary
 * @param {Uint8Array} data Uint8Array data to pad
 * @param {number} alignment Alignment boundary to fulfill
 * @param {number} padCharacter Character to fill with
 * @returns {Uint8Array} Padded UInt8Array image
 */ function $216eff205ef04904$export$fcbe1efa6919329(data, alignment, padCharacter = 0xff) {
    const padMod = data.length % alignment;
    if (padMod !== 0) {
        const padding = new Uint8Array(alignment - padMod).fill(padCharacter);
        const paddedData = new Uint8Array(data.length + padding.length);
        paddedData.set(data);
        paddedData.set(padding, data.length);
        return paddedData;
    }
    return data;
}
const $216eff205ef04904$export$afcb79357d459880 = 0xef;
function $216eff205ef04904$export$bd4137bcc5170a90(data, state = $216eff205ef04904$export$afcb79357d459880) {
    for(let i = 0; i < data.length; i++)state ^= data[i];
    return state;
}
function $216eff205ef04904$export$f3be784ddd918f3a(bStr) {
    const u8Array = new Uint8Array(bStr.length);
    for(let i = 0; i < bStr.length; i++)u8Array[i] = bStr.charCodeAt(i);
    return u8Array;
}
function $216eff205ef04904$export$e772c8ff12451969(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}


/**
 * Wrapper class around Webserial API to communicate with the serial device.
 * @param {typeof import("w3c-web-serial").SerialPort} device - Requested device prompted by the browser.
 *
 * ```
 * const port = await navigator.serial.requestPort();
 * ```
 */ class $4616b1a2f9a5b082$export$86495b081fef8e52 {
    constructor(device, tracing = false, enableSlipReader = true){
        this.device = device;
        this.tracing = tracing;
        this.slipReaderEnabled = false;
        this.baudrate = 0;
        this.traceLog = "";
        this.lastTraceTime = Date.now();
        this.buffer = new Uint8Array(0);
        this.onDeviceLostCallback = null;
        this.SLIP_END = 0xc0;
        this.SLIP_ESC = 0xdb;
        this.SLIP_ESC_END = 0xdc;
        this.SLIP_ESC_ESC = 0xdd;
        this._DTR_state = false;
        this.slipReaderEnabled = enableSlipReader;
    }
    /**
     * Set callback for when device is lost
     * @param {Function} callback Function to call when device is lost
     */ setDeviceLostCallback(callback) {
        this.onDeviceLostCallback = callback;
    }
    /**
     * Update the device reference (used when re-selecting device after reset)
     * @param {typeof import("w3c-web-serial").SerialPort} newDevice New SerialPort device
     */ updateDevice(newDevice) {
        this.device = newDevice;
        this.trace("Device reference updated");
    }
    /**
     * Request the serial device vendor ID and Product ID as string.
     * @returns {string} Return the device VendorID and ProductID from SerialPortInfo as formatted string.
     */ getInfo() {
        const info = this.device.getInfo();
        return info.usbVendorId && info.usbProductId ? `WebSerial VendorID 0x${info.usbVendorId.toString(16)} ProductID 0x${info.usbProductId.toString(16)}` : "";
    }
    /**
     * Request the serial device vendor id from SerialPortInfo.
     * @returns {number | undefined} Return the vendor ID.
     */ getVid() {
        return this.device.getInfo().usbVendorId;
    }
    /**
     * Request the serial device product id from SerialPortInfo.
     * @returns {number | undefined} Return the product ID.
     */ getPid() {
        return this.device.getInfo().usbProductId;
    }
    /**
     * Format received or sent data for tracing output.
     * @param {string} message Message to format as trace line.
     */ trace(message) {
        const delta = Date.now() - this.lastTraceTime;
        const prefix = `TRACE ${delta.toFixed(3)}`;
        const traceMessage = `${prefix} ${message}`;
        console.log(traceMessage);
        this.traceLog += traceMessage + "\n";
    }
    async returnTrace() {
        try {
            await navigator.clipboard.writeText(this.traceLog);
            console.log("Text copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    }
    hexify(s) {
        return Array.from(s).map((byte)=>byte.toString(16).padStart(2, "0")).join("").padEnd(16, " ");
    }
    hexConvert(uint8Array, autoSplit = true) {
        if (autoSplit && uint8Array.length > 16) {
            let result = "";
            let s = uint8Array;
            while(s.length > 0){
                const line = s.slice(0, 16);
                const asciiLine = String.fromCharCode(...line).split("").map((c)=>c === " " || c >= " " && c <= "~" && c !== "  " ? c : ".").join("");
                s = s.slice(16);
                result += `\n    ${this.hexify(line.slice(0, 8))} ${this.hexify(line.slice(8))} | ${asciiLine}`;
            }
            return result;
        } else return this.hexify(uint8Array);
    }
    /**
     * Format data packet using the Serial Line Internet Protocol (SLIP).
     * @param {Uint8Array} data Binary unsigned 8 bit array data to format.
     * @returns {Uint8Array} Formatted unsigned 8 bit data array.
     */ slipWriter(data) {
        const outData = [];
        outData.push(0xc0);
        for(let i = 0; i < data.length; i++){
            if (data[i] === 0xdb) outData.push(0xdb, 0xdd);
            else if (data[i] === 0xc0) outData.push(0xdb, 0xdc);
            else outData.push(data[i]);
        }
        outData.push(0xc0);
        return new Uint8Array(outData);
    }
    /**
     * Write binary data to device using the WebSerial device writable stream.
     * @param {Uint8Array} data 8 bit unsigned data array to write to device.
     */ async write(data) {
        const outData = this.slipWriter(data);
        if (this.device.writable) {
            const writer = this.device.writable.getWriter();
            if (this.tracing) this.trace(`Write ${outData.length} bytes: ${this.hexConvert(outData)}`);
            await writer.write(outData);
            writer.releaseLock();
        }
    }
    /**
     * Append a buffer array after another buffer array
     * @param {Uint8Array} arr1 - First array buffer.
     * @param {Uint8Array} arr2 - magic hex number to select ROM.
     * @returns {Uint8Array} Return a 8 bit unsigned array.
     */ appendArray(arr1, arr2) {
        const combined = new Uint8Array(arr1.length + arr2.length);
        combined.set(arr1);
        combined.set(arr2, arr1.length);
        return combined;
    }
    /**
     * Read from serial device and append to buffer
     */ async readLoop() {
        var _a;
        while(this.device.readable){
            this.reader = (_a = this.device.readable) === null || _a === void 0 ? void 0 : _a.getReader();
            try {
                const { value: value, done: done } = await this.reader.read();
                if (done) {
                    this.trace(`Serial port done`);
                    break;
                }
                // The following test is purely precautionary because .read()
                // is not supposed to return empty data when done is false
                if (value && value.length) {
                    const newValue = Uint8Array.from(value);
                    this.buffer = this.appendArray(this.buffer, newValue);
                }
            } catch (error) {
                if (error instanceof Error) {
                    // Read retry is possible for the following errors
                    const nonFatal = [
                        "BufferOverrunError",
                        "FramingError",
                        "BreakError",
                        "ParityError"
                    ];
                    if (nonFatal.includes(error.name)) {
                        this.trace(`Recoverable serial port error: ${error.message}`);
                        continue;
                    }
                    // Otherwise the read loop cannot continue
                    this.trace(`Unrecoverable serial port error: ${error.message}`);
                    break;
                }
                if (error instanceof DOMException) {
                    // The read loop cannot continue after a DOMException error
                    if (this.onDeviceLostCallback) this.onDeviceLostCallback();
                    else this.trace(`Unrecoverable serial port error: ${error.message}`);
                    break;
                }
                // The read loop cannot continue after an error whose class is unknown
                this.trace(`Unrecoverable serial port error: ${error}`);
                break;
            } finally{
                this.reader.releaseLock();
            }
        }
        // Fatal error or serial port stream ended
        this.trace(`readLoop exited`);
    }
    flushInput() {
        this.buffer = new Uint8Array(0);
    }
    /**
     * Actively drain the input buffer: wait for in-flight bytes to arrive
     * (the ROM repeats an unsupported command response 8 times) and discard them.
     * Flushing alone only drops the bytes already buffered.
     * @param {number} quietMs Time without new bytes before considering the stream drained
     * @param {number} maxMs Upper bound on the total wait
     */ async drainInput(quietMs = 100, maxMs = 400) {
        const deadline = Date.now() + maxMs;
        let lastLength = -1;
        while(Date.now() < deadline && this.buffer.length !== lastLength){
            lastLength = this.buffer.length;
            await (0, $216eff205ef04904$export$e772c8ff12451969)(quietMs);
        }
        if (this.tracing) this.trace(`Drained ${this.buffer.length} bytes from serial buffer`);
        this.flushInput();
    }
    async flushOutput() {
        try {
            if (this.device.writable) {
                const writer = this.device.writable.getWriter();
                await writer.close();
                writer.releaseLock();
            }
        } catch (error) {
            this.trace(`Error while flushing output: ${error}`);
        }
    }
    // `inWaiting` returns the count of bytes in the buffer
    inWaiting() {
        return this.buffer.length;
    }
    // peek at the buffer without removing the data from the buffer
    peek() {
        return this.buffer;
    }
    /**
     * Detect if the data read from device is a Fatal or Guru meditation error.
     * @param {Uint8Array} input Data read from device
     */ detectPanicHandler(input) {
        const guruMeditationRegex = /G?uru Meditation Error: (?:Core \d panic'ed \(([a-zA-Z ]*)\))?/;
        const fatalExceptionRegex = /F?atal exception \(\d+\): (?:([a-zA-Z ]*)?.*epc)?/;
        const inputString = new TextDecoder("utf-8").decode(input);
        const match = inputString.match(guruMeditationRegex) || inputString.match(fatalExceptionRegex);
        if (match) {
            const cause = match[1] || match[2];
            const msg = `Guru Meditation Error detected${cause ? ` (${cause})` : ""}`;
            throw new Error(msg);
        }
    }
    /**
     * Take a data array and return the first well formed packet after
     * replacing the escape sequence. Reads at least 8 bytes.
     * @param {number} timeout Timeout read data.
     * @returns {Uint8Array} Formatted packet using SLIP escape sequences.
     */ async read(timeout) {
        let partialPacket = null;
        let isEscaping = false;
        let readBytes = null;
        // eslint-disable-next-line no-constant-condition
        while(true){
            const timeStamp = Date.now();
            readBytes = new Uint8Array(0);
            // Wait for data to be available, but read all available bytes at once
            while(Date.now() - timeStamp < timeout)if (this.buffer.length > 0) {
                // Read all available bytes at once instead of one at a time
                readBytes = this.buffer;
                this.buffer = new Uint8Array(0);
                break;
            } else await (0, $216eff205ef04904$export$e772c8ff12451969)(1);
            if (!readBytes || readBytes.length === 0) {
                const msg = partialPacket === null ? "Serial data stream stopped: Possible serial noise or corruption." : "No serial data received.";
                if (this.tracing) this.trace(msg);
                throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(msg);
            }
            if (this.tracing) this.trace(`Read ${readBytes.length} bytes: ${this.hexConvert(readBytes)}`);
            for(let i = 0; i < readBytes.length; i++){
                const byte = readBytes[i];
                if (partialPacket === null) {
                    if (byte === this.SLIP_END) partialPacket = new Uint8Array(0); // Start of a new packet
                    else {
                        if (this.tracing) this.trace(`Read invalid data: ${this.hexConvert(readBytes)}`);
                        const remainingData = this.buffer;
                        if (this.tracing) this.trace(`Remaining data in serial buffer: ${this.hexConvert(remainingData)}`);
                        this.detectPanicHandler(new Uint8Array([
                            ...readBytes,
                            ...remainingData || []
                        ]));
                        throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Invalid head of packet (0x${byte.toString(16)}): Possible serial noise or corruption.`);
                    }
                } else if (isEscaping) {
                    isEscaping = false;
                    if (byte === this.SLIP_ESC_END) partialPacket = this.appendArray(partialPacket, new Uint8Array([
                        this.SLIP_END
                    ]));
                    else if (byte === this.SLIP_ESC_ESC) partialPacket = this.appendArray(partialPacket, new Uint8Array([
                        this.SLIP_ESC
                    ]));
                    else {
                        if (this.tracing) this.trace(`Read invalid data: ${this.hexConvert(readBytes)}`);
                        const remainingData = this.buffer;
                        if (this.tracing) this.trace(`Remaining data in serial buffer: ${this.hexConvert(remainingData)}`);
                        this.detectPanicHandler(new Uint8Array([
                            ...readBytes,
                            ...remainingData || []
                        ]));
                        throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Invalid SLIP escape (0xdb, 0x${byte.toString(16)})`);
                    }
                } else if (byte === this.SLIP_ESC) isEscaping = true;
                else if (byte === this.SLIP_END) {
                    if (this.tracing) this.trace(`Received full packet: ${this.hexConvert(partialPacket)}`);
                    // Put any remaining bytes after SLIP_END back into the buffer
                    if (i + 1 < readBytes.length) {
                        const remainingBytes = readBytes.slice(i + 1);
                        this.buffer = this.appendArray(remainingBytes, this.buffer);
                    }
                    return partialPacket;
                } else partialPacket = this.appendArray(partialPacket, new Uint8Array([
                    byte
                ]));
            }
        }
    }
    /**
     * Read from serial device without SLIP formatting. Calls onData for each chunk.
     * Stops when isClosed() returns true, the stream ends/errors, or disconnect() is called.
     *
     * The reader is stored on the instance so that disconnect() can cancel a pending
     * read: isClosed() is only evaluated after each chunk arrives, so on an idle
     * device a function-local reader would keep the stream locked forever and make
     * disconnect() block in waitForUnlock().
     * @param {Function} onData Callback for each chunk of data read
     * @param {Function} isClosed Function that returns true when reading should stop (e.g. when console is closed)
     */ async rawRead(onData, isClosed) {
        let reader;
        try {
            if (!this.device.readable) return;
            reader = this.device.readable.getReader();
            this.reader = reader;
            while(!isClosed()){
                const { value: value, done: done } = await reader.read();
                if (done || !value) break;
                if (this.tracing) this.trace(`Read ${value.length} bytes: ${this.hexConvert(value)}`);
                onData(value);
            }
        } catch (error) {
            this.trace(`Error reading from serial port: ${error}`);
            if (error instanceof Error && error.name === "NetworkError" && error.message.includes("device has been lost")) {
                this.trace("Device lost detected (NetworkError)");
                if (this.onDeviceLostCallback) this.onDeviceLostCallback();
            }
        } finally{
            reader === null || reader === void 0 || reader.releaseLock();
            if (this.reader === reader) this.reader = undefined;
        }
    }
    /**
     * Send the RequestToSend (RTS) signal to given state
     * # True for EN=LOW, chip in reset and False EN=HIGH, chip out of reset
     * @param {boolean} state Boolean state to set the signal
     */ async setRTS(state) {
        await this.device.setSignals({
            requestToSend: state
        });
        // # Work-around for adapters on Windows using the usbser.sys driver:
        // # generate a dummy change to DTR so that the set-control-line-state
        // # request is sent with the updated RTS state and the same DTR state
        // Referenced to esptool.py
        await this.setDTR(this._DTR_state);
    }
    /**
     * Send the dataTerminalReady (DTS) signal to given state
     * # True for IO0=LOW, chip in reset and False IO0=HIGH
     * @param {boolean} state Boolean state to set the signal
     */ async setDTR(state) {
        this._DTR_state = state;
        await this.device.setSignals({
            dataTerminalReady: state
        });
    }
    /**
     * Set the device signals to given states
     * # True for IO0=LOW, chip in reset and False IO0=HIGH
     * @param {boolean} dtr dataTerminalReady (DTS) signal boolean state
     * @param {boolean} rts requestToSend (RTS) signal boolean state
     * @param {boolean} breakSignal break signal boolean state
     */ async setSignals(dtr, rts, breakSignal) {
        if (dtr) this._DTR_state = dtr;
        await this.device.setSignals({
            dataTerminalReady: dtr,
            requestToSend: rts,
            break: breakSignal
        });
    }
    /**
     * Connect to serial device using the Webserial open method.
     * @param {number} baud Number baud rate for serial connection. Default is 115200.
     * @param {typeof import("w3c-web-serial").SerialOptions} serialOptions Serial Options for WebUSB SerialPort class.
     */ async connect(baud = 115200, serialOptions = {}) {
        await this.device.open({
            baudRate: baud,
            dataBits: serialOptions === null || serialOptions === void 0 ? void 0 : serialOptions.dataBits,
            stopBits: serialOptions === null || serialOptions === void 0 ? void 0 : serialOptions.stopBits,
            bufferSize: serialOptions === null || serialOptions === void 0 ? void 0 : serialOptions.bufferSize,
            parity: serialOptions === null || serialOptions === void 0 ? void 0 : serialOptions.parity,
            flowControl: serialOptions === null || serialOptions === void 0 ? void 0 : serialOptions.flowControl
        });
        this.baudrate = baud;
    }
    /**
     * Change the host-side baud rate, preferring an in-place capability when the
     * serial-port implementation provides one.
     * @param {number} baud New baud rate.
     * @param {SerialOptions} serialOptions Options to preserve when a reopen is required.
     * @returns {boolean} True when the port had to be closed and reopened.
     */ async changeBaudrate(baud, serialOptions = {}) {
        const configurableDevice = this.device;
        if (typeof configurableDevice.setBaudRate === "function") {
            if (this.tracing) this.trace(`Changing host baud rate to ${baud} in place`);
            await configurableDevice.setBaudRate(baud);
            this.baudrate = baud;
            return false;
        }
        if (this.tracing) this.trace(`Reopening serial port at ${baud} baud`);
        await this.disconnect();
        await (0, $216eff205ef04904$export$e772c8ff12451969)(50);
        await this.connect(baud, serialOptions);
        await (0, $216eff205ef04904$export$e772c8ff12451969)(50);
        this.readLoop();
        return true;
    }
    /**
     * Wait for a given timeout ms for serial device unlock.
     * @param {number} timeout Timeout time in milliseconds (ms) to sleep
     */ async waitForUnlock(timeout) {
        while(this.device.readable && this.device.readable.locked || this.device.writable && this.device.writable.locked)await (0, $216eff205ef04904$export$e772c8ff12451969)(timeout);
    }
    /**
     * Disconnect from serial device by running SerialPort.close() after streams unlock.
     */ async disconnect() {
        var _a, _b;
        if ((_a = this.device.readable) === null || _a === void 0 ? void 0 : _a.locked) await ((_b = this.reader) === null || _b === void 0 ? void 0 : _b.cancel());
        await this.waitForUnlock(400);
        await this.device.close();
        this.reader = undefined;
    }
}


/**
 * Sleep for ms milliseconds
 * @param {number} ms Milliseconds to wait
 * @returns {Promise<void>}
 */ function $c7981c93d06fe700$var$sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
class $c7981c93d06fe700$export$4de7cfbc0d78cb8e {
    constructor(transport, resetDelay){
        this.resetDelay = resetDelay;
        this.transport = transport;
    }
    async reset() {
        await this.transport.setSignals(false, true);
        await $c7981c93d06fe700$var$sleep(100);
        await this.transport.setSignals(true, false);
        await $c7981c93d06fe700$var$sleep(this.resetDelay);
        await this.transport.setSignals(false, false);
    }
}
class $c7981c93d06fe700$export$f728aa04f347362c {
    constructor(transport){
        this.transport = transport;
    }
    async reset() {
        await this.transport.setRTS(false);
        await this.transport.setDTR(false);
        await $c7981c93d06fe700$var$sleep(100);
        await this.transport.setDTR(true);
        await this.transport.setRTS(false);
        await $c7981c93d06fe700$var$sleep(100);
        await this.transport.setRTS(true);
        await this.transport.setDTR(false);
        await this.transport.setRTS(true);
        await $c7981c93d06fe700$var$sleep(100);
        await this.transport.setRTS(false);
        await this.transport.setDTR(false);
    }
}
class $c7981c93d06fe700$export$529f1679a228f28a {
    constructor(transport, usingUsbOtg = false){
        this.transport = transport;
        this.usingUsbOtg = usingUsbOtg;
        this.transport = transport;
    }
    async reset() {
        if (this.usingUsbOtg) {
            await $c7981c93d06fe700$var$sleep(200);
            await this.transport.setRTS(false);
            await $c7981c93d06fe700$var$sleep(200);
        } else {
            await $c7981c93d06fe700$var$sleep(100);
            await this.transport.setRTS(false);
        }
    }
}
function $c7981c93d06fe700$export$929a22f56823f4cb(seqStr) {
    const commands = [
        "D",
        "R",
        "W"
    ];
    const commandsList = seqStr.split("|");
    for (const cmd of commandsList){
        const code = cmd[0];
        const arg = cmd.slice(1);
        if (!commands.includes(code)) return false; // Invalid command code
        if (code === "D" || code === "R") {
            if (arg !== "0" && arg !== "1") return false; // Invalid argument for D and R commands
        } else if (code === "W") {
            const delay = parseInt(arg);
            if (isNaN(delay) || delay <= 0) return false; // Invalid argument for W command
        }
    }
    return true; // All commands are valid
}
class $c7981c93d06fe700$export$587746fadce59bb9 {
    constructor(transport, sequenceString){
        this.transport = transport;
        this.sequenceString = sequenceString;
        this.transport = transport;
    }
    async reset() {
        const resetDictionary = {
            D: async (arg)=>await this.transport.setDTR(arg),
            R: async (arg)=>await this.transport.setRTS(arg),
            W: async (delay)=>await $c7981c93d06fe700$var$sleep(delay)
        };
        try {
            const isValidSequence = $c7981c93d06fe700$export$929a22f56823f4cb(this.sequenceString);
            if (!isValidSequence) return;
            const cmds = this.sequenceString.split("|");
            for (const cmd of cmds){
                const cmdKey = cmd[0];
                const cmdVal = cmd.slice(1);
                if (cmdKey === "W") await resetDictionary["W"](Number(cmdVal));
                else if (cmdKey === "D" || cmdKey === "R") await resetDictionary[cmdKey](cmdVal === "1");
            }
        } catch (error) {
            throw new Error("Invalid custom reset sequence");
        }
    }
}
var $c7981c93d06fe700$export$2e2bcd8739ae039 = {
    ClassicReset: $c7981c93d06fe700$export$4de7cfbc0d78cb8e,
    CustomReset: $c7981c93d06fe700$export$587746fadce59bb9,
    HardReset: $c7981c93d06fe700$export$529f1679a228f28a,
    UsbJtagSerialReset: $c7981c93d06fe700$export$f728aa04f347362c,
    validateCustomResetStringSequence: $c7981c93d06fe700$export$929a22f56823f4cb
};


var $eb08ceb29680012e$exports = {};
$eb08ceb29680012e$exports = function _atob(str) {
    return atob(str);
};
















async function $c14fcc49e58a64cf$export$575862e1d5c85871(chipName, chipRevision) {
    let jsonStub;
    switch(chipName){
        case "ESP32":
            jsonStub = await (parcelRequire("3yBgx"));
            break;
        case "ESP32-C2":
            jsonStub = await (parcelRequire("1G7Bv"));
            break;
        case "ESP32-C3":
            jsonStub = await (parcelRequire("1PmWo"));
            break;
        case "ESP32-C5":
            jsonStub = await (parcelRequire("gtAlv"));
            break;
        case "ESP32-C6":
            jsonStub = await (parcelRequire("bdgYL"));
            break;
        case "ESP32-C61":
            jsonStub = await (parcelRequire("1MmTl"));
            break;
        case "ESP32-H2":
            jsonStub = await (parcelRequire("lYxc5"));
            break;
        case "ESP32-H4":
            jsonStub = await (parcelRequire("1XdOD"));
            break;
        case "ESP32-H21":
            break;
        case "ESP32-E22":
            break;
        case "ESP32-P4":
            if (chipRevision && chipRevision < 300) jsonStub = await (parcelRequire("cTg0S"));
            else jsonStub = await (parcelRequire("d52g0"));
            break;
        case "ESP32-S2":
            jsonStub = await (parcelRequire("6lRzd"));
            break;
        case "ESP32-S3":
            jsonStub = await (parcelRequire("cteFO"));
            break;
        case "ESP32-S31":
            jsonStub = await (parcelRequire("4kuQ6"));
            break;
        case "ESP8266":
            jsonStub = await (parcelRequire("frscf"));
            break;
    }
    if (jsonStub) {
        const stub = "default" in jsonStub ? jsonStub.default : jsonStub;
        return {
            bss_start: stub.bss_start,
            data: stub.data,
            data_start: stub.data_start,
            entry: stub.entry,
            text: stub.text,
            text_start: stub.text_start,
            decodedData: $c14fcc49e58a64cf$export$7e57cd56df6c9bb5(stub.data),
            decodedText: $c14fcc49e58a64cf$export$7e57cd56df6c9bb5(stub.text)
        };
    }
    return;
}
function $c14fcc49e58a64cf$export$7e57cd56df6c9bb5(dataStr) {
    const decoded = (0, (/*@__PURE__*/$parcel$interopDefault($eb08ceb29680012e$exports)))(dataStr);
    const chardata = decoded.split("").map(function(x) {
        return x.charCodeAt(0);
    });
    return new Uint8Array(chardata);
}






var $6fpwM = parcelRequire("6fpwM");


const $cd67366136220ea9$export$ea342b1af2e2649a = 0xe9;
function $cd67366136220ea9$export$553f8b4cfe8b575a(position, size) {
    const align = size - 1 - position % size;
    return position + align;
}
/**
 * Read a UINT32 from a byte array (little-endian)
 * @param {Uint8Array} data Data to read a UINT32
 * @param {number} offset data start offset
 * @returns {number} The read UINT32 value
 */ function $cd67366136220ea9$var$readUInt32LE(data, offset) {
    return data[offset] | data[offset + 1] << 8 | data[offset + 2] << 16 | data[offset + 3] << 24;
}
class $cd67366136220ea9$export$e57b589d895eacab {
    constructor(addr, data, fileOffs = null, flags = 0){
        this.addr = addr;
        this.data = data;
        this.fileOffs = fileOffs;
        this.flags = flags;
        this.includeInChecksum = true;
        if (this.addr !== 0) this.padToAlignment(4); // pad all "real" ImageSegments 4 byte aligned length
    }
    copyWithNewAddr(newAddr) {
        return new $cd67366136220ea9$export$e57b589d895eacab(newAddr, this.data, 0);
    }
    splitImage(splitLen) {
        const result = new $cd67366136220ea9$export$e57b589d895eacab(this.addr, this.data.slice(0, splitLen), 0);
        this.data = this.data.slice(splitLen);
        this.addr += splitLen;
        this.fileOffs = null;
        return result;
    }
    toString() {
        let r = `len 0x${this.data.length.toString(16).padStart(5, "0")} load 0x${this.addr.toString(16).padStart(8, "0")}`;
        if (this.fileOffs !== null) r += ` file_offs 0x${this.fileOffs.toString(16).padStart(8, "0")}`;
        return r;
    }
    getMemoryType(image) {
        return image.ROM_LOADER.MEMORY_MAP.filter((mapRange)=>mapRange[0] <= this.addr && this.addr < mapRange[1]).map((mapRange)=>mapRange[2]);
    }
    padToAlignment(alignment) {
        this.data = (0, $216eff205ef04904$export$fcbe1efa6919329)(this.data, alignment, 0);
    }
}
class $cd67366136220ea9$export$bd939c6b7fe2b31f extends $cd67366136220ea9$export$e57b589d895eacab {
    constructor(name, addr, data, flags){
        super(addr, data, null, flags);
        this.name = name;
    }
    toString() {
        return `${this.name} ${super.toString()}`;
    }
}
class $cd67366136220ea9$export$584af0585636cbca {
    constructor(rom){
        this.SEG_HEADER_LEN = 8;
        this.SHA256_DIGEST_LEN = 32;
        this.ELF_FLAG_WRITE = 0x1;
        this.ELF_FLAG_READ = 0x2;
        this.ELF_FLAG_EXEC = 0x4;
        this.segments = [];
        this.entrypoint = 0;
        this.elfSha256 = null;
        this.elfSha256Offset = 0;
        this.padToSize = 0;
        this.flashMode = 0;
        this.flashSizeFreq = 0;
        this.checksum = 0;
        this.datalength = 0;
        this.IROM_ALIGN = 0;
        this.MMU_PAGE_SIZE_CONF = []; // Default is an empty array
        this.ROM_LOADER = rom;
    }
    loadCommonHeader(data, offset, expectedMagic) {
        const magic = data[offset];
        const segments = data[offset + 1];
        this.flashMode = data[offset + 2];
        this.flashSizeFreq = data[offset + 3];
        this.entrypoint = $cd67366136220ea9$var$readUInt32LE(data, offset + 4);
        if (magic !== expectedMagic) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Invalid firmware image magic=0x${magic.toString(16)}`);
        return segments;
    }
    verify() {
        if (this.segments.length > 16) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Invalid segment count ${this.segments.length} (max 16). ` + "Usually this indicates a linker script problem.");
    }
    loadSegment(data, offset, isIromSegment = false) {
        const fileOffs = offset;
        const segmentAddr = $cd67366136220ea9$var$readUInt32LE(data, offset);
        const segmentSize = $cd67366136220ea9$var$readUInt32LE(data, offset + 4);
        this.warnIfUnusualSegment(segmentAddr, segmentSize, isIromSegment);
        const segmentData = data.slice(offset + 8, offset + 8 + segmentSize);
        if (segmentData.length < segmentSize) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`End of file reading segment 0x${segmentAddr.toString(16)}, length ${segmentSize} (actual length ${segmentData.length})`);
        const segment = new $cd67366136220ea9$export$e57b589d895eacab(segmentAddr, segmentData, fileOffs);
        this.segments.push(segment);
        return segment;
    }
    warnIfUnusualSegment(offset, size, isIromSegment) {
        if (!isIromSegment) {
            if (offset > 0x40200000 || offset < 0x3ffe0000 || size > 65536) console.warn(`WARNING: Suspicious segment 0x${offset.toString(16)}, length ${size}`);
        }
    }
    maybePatchSegmentData(data, filePos) {
        const segmentLen = data.length;
        if (this.elfSha256Offset >= filePos && this.elfSha256Offset < filePos + segmentLen) {
            const patchOffset = this.elfSha256Offset - filePos;
            if (patchOffset < this.SEG_HEADER_LEN || patchOffset + this.SHA256_DIGEST_LEN > segmentLen) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Cannot place SHA256 digest on segment boundary" + `(elf_sha256_offset=${this.elfSha256Offset}, file_pos=${filePos}, segment_size=${segmentLen})`);
            const dataPatchOffset = patchOffset - this.SEG_HEADER_LEN;
            const targetArea = data.slice(dataPatchOffset, dataPatchOffset + this.SHA256_DIGEST_LEN);
            const isAllZeros = targetArea.every((byte)=>byte === 0);
            if (!isAllZeros) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Contents of segment at SHA256 digest offset 0x${this.elfSha256Offset.toString(16)} are not all zero. ` + "Refusing to overwrite.");
            if (!this.elfSha256 || this.elfSha256.length !== this.SHA256_DIGEST_LEN) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("ELF SHA256 digest is not properly initialized");
            const beforePatch = data.slice(0, dataPatchOffset);
            const afterPatch = data.slice(dataPatchOffset + this.SHA256_DIGEST_LEN);
            const newLength = beforePatch.length + this.elfSha256.length + afterPatch.length;
            const result = new Uint8Array(newLength);
            result.set(beforePatch, 0);
            result.set(this.elfSha256, beforePatch.length);
            result.set(afterPatch, beforePatch.length + this.elfSha256.length);
            return result;
        }
        return data;
    }
    saveSegment(output, offset, segment, checksumValue = null) {
        const segmentData = this.maybePatchSegmentData(segment.data, offset);
        // Write segment header
        const view = new DataView(output.buffer, offset);
        view.setUint32(0, segment.addr, true);
        view.setUint32(4, segmentData.length, true);
        // Write segment data
        output.set(segmentData, offset + 8);
        if (checksumValue !== null) return (0, $216eff205ef04904$export$bd4137bcc5170a90)(segmentData, checksumValue);
        return 0;
    }
    saveFlashSegment(output, offset, segment, checksumValue = null) {
        if (this.ROM_LOADER.CHIP_NAME === "ESP32") {
            // Work around a bug in ESP-IDF 2nd stage bootloader, that it didn't map the
            // last MMU page, if an IROM/DROM segment was < 0x24 bytes
            // over the page boundary.
            const segmentEndPos = offset + segment.data.length + this.SEG_HEADER_LEN;
            const segmentLenRemainder = segmentEndPos % this.IROM_ALIGN;
            if (segmentLenRemainder < 0x24) {
                // Create a new array with padding
                const paddedData = new Uint8Array(segment.data.length + (0x24 - segmentLenRemainder));
                paddedData.set(segment.data);
                // Fill the padding with zeros
                paddedData.fill(0, segment.data.length);
                segment.data = paddedData;
            }
        }
        return this.saveSegment(output, offset, segment, checksumValue);
    }
    /**
     * Return ESPLoader checksum from end of just-read image
     * @param {Uint8Array} data image to read checksum from
     * @param {number} offset Current offset in image
     * @returns {number} checksum value
     */ readChecksum(data, offset) {
        // Skip the padding. The checksum is stored in the last byte so that the
        // file is a multiple of 16 bytes.
        const alignedOffset = $cd67366136220ea9$export$553f8b4cfe8b575a(offset, 16);
        return data[alignedOffset];
    }
    /**
     * Calculate checksum of loaded image, based on segments in segment array.
     * @returns {number} checksum value
     */ calculateChecksum() {
        let checksumValue = (0, $216eff205ef04904$export$afcb79357d459880);
        for (const seg of this.segments)if (seg.includeInChecksum) checksumValue = (0, $216eff205ef04904$export$bd4137bcc5170a90)(seg.data, checksumValue);
        return checksumValue;
    }
    appendChecksum(output, offset, checksumValue) {
        const alignedOffset = $cd67366136220ea9$export$553f8b4cfe8b575a(offset, 16);
        output[alignedOffset] = checksumValue;
    }
    writeCommonHeader(output, offset, segments) {
        output[offset] = $cd67366136220ea9$export$ea342b1af2e2649a;
        output[offset + 1] = segments;
        output[offset + 2] = this.flashMode;
        output[offset + 3] = this.flashSizeFreq;
        const view = new DataView(output.buffer, offset + 4);
        view.setUint32(0, this.entrypoint, true);
    }
    isIromAddr(addr) {
        return (0, $6fpwM.ESP8266ROM).IROM_MAP_START <= addr && addr < (0, $6fpwM.ESP8266ROM).IROM_MAP_END;
    }
    getIromSegment() {
        const iromSegments = this.segments.filter((s)=>this.isIromAddr(s.addr));
        if (iromSegments.length > 0) {
            if (iromSegments.length !== 1) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Found ${iromSegments.length} segments that could be irom0. Bad ELF file?`);
            return iromSegments[0];
        }
        return null;
    }
    getNonIromSegments() {
        const iromSegment = this.getIromSegment();
        return this.segments.filter((s)=>s !== iromSegment);
    }
    sortSegments() {
        if (!this.segments.length) return; // nothing to sort
        this.segments.sort((a, b)=>a.addr - b.addr);
    }
    mergeAdjacentSegments() {
        if (!this.segments.length) return; // nothing to merge
        const segments = [];
        // The easiest way to merge the sections is to browse them backward.
        for(let i = this.segments.length - 1; i > 0; i--){
            // elem is the previous section, the one `next_elem` may need to be
            // merged in
            const elem = this.segments[i - 1];
            const nextElem = this.segments[i];
            if (elem.getMemoryType(this).join(",") === nextElem.getMemoryType(this).join(",") && elem.includeInChecksum === nextElem.includeInChecksum && nextElem.addr === elem.addr + elem.data.length && (nextElem.flags & this.ELF_FLAG_EXEC) === (elem.flags & this.ELF_FLAG_EXEC)) {
                // Merge any segment that ends where the next one starts,
                // without spanning memory types
                //
                // (don't 'pad' any gaps here as they may be excluded from the image
                // due to 'noinit' or other reasons.)
                const mergedData = new Uint8Array(elem.data.length + nextElem.data.length);
                mergedData.set(elem.data);
                mergedData.set(nextElem.data, elem.data.length);
                elem.data = mergedData;
            } else // The section next_elem cannot be merged into the previous one,
            // which means it needs to be part of the final segments.
            // As we are browsing the list backward, the elements need to be
            // inserted at the beginning of the final list.
            segments.unshift(nextElem);
        }
        // The first segment will always be here as it cannot be merged into any
        // "previous" section.
        segments.unshift(this.segments[0]);
        this.segments = segments;
    }
    setMmuPageSize(size) {
        if (!this.MMU_PAGE_SIZE_CONF && size !== this.IROM_ALIGN) // For chips where MMU page size cannot be set or is fixed, log a warning and use the default.
        console.warn(`WARNING: Changing MMU page size is not supported on ${this.ROM_LOADER.CHIP_NAME}! ` + (this.IROM_ALIGN !== 0 ? `Defaulting to ${this.IROM_ALIGN / 1024}KB.` : ""));
        else if (this.MMU_PAGE_SIZE_CONF && !this.MMU_PAGE_SIZE_CONF.includes(size)) {
            // For chips with configurable MMU page sizes, throw an error if the size is invalid.
            const validSizes = this.MMU_PAGE_SIZE_CONF.map((x)=>`${x / 1024}KB`).join(", ");
            throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`${size} bytes is not a valid ${this.ROM_LOADER.CHIP_NAME} page size, select from ${validSizes}.`);
        } else // Set the MMU page size if valid.
        this.IROM_ALIGN = size;
    }
}





class $9caff50b28779aaa$export$2f6fb873c909bdc7 extends (0, $cd67366136220ea9$export$584af0585636cbca) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom);
        this.securePad = null;
        this.flashMode = 0;
        this.flashSizeFreq = 0;
        this.version = 1;
        // ROM bootloader will read the wp_pin field if SPI flash
        // pins are remapped via flash. IDF actually enables QIO only
        // from software bootloader, so this can be ignored. But needs
        // to be set to this value so ROM bootloader will skip it.
        this.WP_PIN_DISABLED = 0xee;
        this.wpPin = this.WP_PIN_DISABLED;
        // Extended header fields
        this.clkDrv = 0;
        this.qDrv = 0;
        this.dDrv = 0;
        this.csDrv = 0;
        this.hdDrv = 0;
        this.wpDrv = 0;
        this.chipId = 0;
        this.minRev = 0;
        this.minRevFull = 0;
        this.maxRevFull = 0;
        this.storedDigest = null;
        this.calcDigest = null;
        this.dataLength = 0;
        this.IROM_ALIGN = 65536;
        this.ROM_LOADER = rom;
        this.appendDigest = appendDigest;
        this.ramOnlyHeader = ramOnlyHeader;
        if (loadFile !== null) this.loadFromFile(loadFile);
    }
    async loadFromFile(loadFile) {
        const start = 0;
        const binaryData = loadFile instanceof Uint8Array ? loadFile : (0, $216eff205ef04904$export$f3be784ddd918f3a)(loadFile);
        let offset = 0;
        const segments = this.loadCommonHeader(binaryData, offset, (0, $cd67366136220ea9$export$ea342b1af2e2649a));
        offset += 8;
        this.loadExtendedHeader(binaryData, offset);
        offset += 16; // Extended header is 16 bytes
        // Load segments
        for(let i = 0; i < segments; i++){
            const segment = this.loadSegment(binaryData, offset);
            offset += 8 + segment.data.length;
        }
        // Read checksum
        this.checksum = this.readChecksum(binaryData, offset);
        offset = (0, $cd67366136220ea9$export$553f8b4cfe8b575a)(offset, 16);
        if (this.appendDigest) {
            const end = offset;
            this.storedDigest = binaryData.slice(offset, offset + this.SHA256_DIGEST_LEN);
            const shaDigest = await crypto.subtle.digest("SHA-256", binaryData.slice(start, end));
            this.calcDigest = new Uint8Array(shaDigest);
            this.dataLength = end - start;
        }
        this.verify();
    }
    isFlashAddr(addr) {
        return this.ROM_LOADER.IROM_MAP_START <= addr && addr < this.ROM_LOADER.IROM_MAP_END || this.ROM_LOADER.DROM_MAP_START <= addr && addr < this.ROM_LOADER.DROM_MAP_END;
    }
    async save() {
        let totalSegments = 0;
        const output = new Uint8Array(1048576); // Start with 1MB buffer, will grow if needed
        let offset = 0;
        // Write common header
        this.writeCommonHeader(output, offset, this.segments.length);
        offset += 8;
        // Write extended header
        this.saveExtendedHeader(output, offset);
        offset += 16;
        let checksum = (0, $216eff205ef04904$export$afcb79357d459880);
        // Split segments into flash-mapped vs ram-loaded
        const flashSegments = this.segments.filter((s)=>this.isFlashAddr(s.addr)).sort((a, b)=>a.addr - b.addr);
        const ramSegments = this.segments.filter((s)=>!this.isFlashAddr(s.addr)).sort((a, b)=>a.addr - b.addr);
        // Patch to support ESP32-C6 union bus memmap
        // move ".flash.appdesc" segment to the top of the flash segment
        for(let i = 0; i < flashSegments.length; i++){
            const segment = flashSegments[i];
            if (segment instanceof (0, $cd67366136220ea9$export$bd939c6b7fe2b31f) && segment.name === ".flash.appdesc") {
                flashSegments.splice(i, 1);
                flashSegments.unshift(segment);
                break;
            }
        }
        // For the bootloader image
        // move ".dram0.bootdesc" segment to the top of the ram segment
        // So bootdesc will be at the very top of the binary at 0x20 offset
        // (in the first segment).
        for(let i = 0; i < ramSegments.length; i++){
            const segment = ramSegments[i];
            if (segment instanceof (0, $cd67366136220ea9$export$bd939c6b7fe2b31f) && segment.name === ".dram0.bootdesc") {
                ramSegments.splice(i, 1);
                ramSegments.unshift(segment);
                break;
            }
        }
        // Check for multiple ELF sections in same flash mapping region
        if (flashSegments.length > 0) {
            let lastAddr = flashSegments[0].addr;
            for (const segment of flashSegments.slice(1)){
                if (Math.floor(segment.addr / this.IROM_ALIGN) === Math.floor(lastAddr / this.IROM_ALIGN)) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Segment loaded at 0x${segment.addr.toString(16)} lands in same 64KB flash mapping ` + `as segment loaded at 0x${lastAddr.toString(16)}. Can't generate binary. ` + "Suggest changing linker script or ELF to merge sections.");
                lastAddr = segment.addr;
            }
        }
        if (this.ramOnlyHeader) {
            // Write RAM segments first
            for (const segment of ramSegments){
                checksum = this.saveSegment(output, offset, segment, checksum);
                offset += 8 + segment.data.length;
                totalSegments++;
            }
            this.appendChecksum(output, offset, checksum);
            offset = (0, $cd67366136220ea9$export$553f8b4cfe8b575a)(offset, 16);
            // Write flash segments
            for (const segment of flashSegments.reverse()){
                let padLen = this.getAlignmentDataNeeded(segment, offset);
                if (padLen > 0) {
                    const align_min = this.ROM_LOADER.BOOTLOADER_FLASH_OFFSET - this.SEG_HEADER_LEN;
                    if (padLen < align_min) // in case pad_len does not fit minimum alignment,
                    // pad it to next aligned boundary
                    padLen += this.IROM_ALIGN;
                    padLen -= this.ROM_LOADER.BOOTLOADER_FLASH_OFFSET;
                    const padSegment = new (0, $cd67366136220ea9$export$e57b589d895eacab)(0, new Uint8Array(padLen).fill(0), offset);
                    checksum = this.saveSegment(output, offset, padSegment, checksum);
                    offset += 8 + padLen;
                    totalSegments++;
                }
                this.saveFlashSegment(output, offset, segment);
                offset += 8 + segment.data.length;
                totalSegments++;
            }
        } else {
            // Write flash segments with padding
            while(flashSegments.length > 0){
                const segment = flashSegments[0];
                const padLen = this.getAlignmentDataNeeded(segment, offset);
                if (padLen > 0) {
                    // need to pad
                    if (ramSegments.length > 0 && padLen > this.SEG_HEADER_LEN) {
                        // Split a part of the first RAM segment to use as padding
                        const padSegment = ramSegments[0].splitImage(padLen);
                        if (ramSegments[0].data.length === 0) ramSegments.shift();
                        checksum = this.saveSegment(output, offset, padSegment, checksum);
                    } else {
                        // Use zero padding
                        const padSegment = new (0, $cd67366136220ea9$export$e57b589d895eacab)(0, new Uint8Array(padLen).fill(0), offset);
                        checksum = this.saveSegment(output, offset, padSegment, checksum);
                    }
                    offset += 8 + padLen;
                    totalSegments++;
                } else {
                    // write the flash segment
                    if ((offset + 8) % this.IROM_ALIGN !== segment.addr % this.IROM_ALIGN) throw new Error("Flash segment alignment mismatch");
                    checksum = this.saveFlashSegment(output, offset, segment, checksum);
                    flashSegments.shift();
                    offset += 8 + segment.data.length;
                    totalSegments++;
                }
            }
            // Write remaining RAM segments
            for (const segment of ramSegments){
                checksum = this.saveSegment(output, offset, segment, checksum);
                offset += 8 + segment.data.length;
                totalSegments++;
            }
        }
        // Handle secure padding if needed
        if (this.securePad) {
            if (!this.appendDigest) throw new Error("secure_pad only applies if a SHA-256 digest is also appended to the image");
            const alignPast = (offset + this.SEG_HEADER_LEN) % this.IROM_ALIGN;
            const checksumSpace = 16; // 16 byte aligned checksum
            let spaceAfterChecksum = 0;
            if (this.securePad === "1") // Secure Boot V1: SHA-256 digest + version + signature + 12 trailing bytes
            spaceAfterChecksum = 112;
            else if (this.securePad === "2") // Secure Boot V2: SHA-256 digest + signature sector (placed after 64KB boundary)
            spaceAfterChecksum = 32;
            const padLen = (this.IROM_ALIGN - alignPast - checksumSpace - spaceAfterChecksum) % this.IROM_ALIGN;
            const padSegment = new (0, $cd67366136220ea9$export$e57b589d895eacab)(0, new Uint8Array(padLen).fill(0), offset);
            checksum = this.saveSegment(output, offset, padSegment, checksum);
            offset += 8 + padLen;
            totalSegments++;
        }
        // Append checksum after all segments are written
        if (!this.ramOnlyHeader) {
            this.appendChecksum(output, offset, checksum);
            offset = (0, $cd67366136220ea9$export$553f8b4cfe8b575a)(offset, 16);
        }
        const imageLength = offset;
        // Go back to the initial header and write the new segment count
        // This header is not checksummed
        if (this.ramOnlyHeader) // Update the header with the RAM segments quantity as it should be
        // visible by the ROM bootloader
        output[1] = ramSegments.length;
        else output[1] = totalSegments;
        if (this.appendDigest) {
            // calculate the SHA256 of the whole file and append it
            const shaDigest = await crypto.subtle.digest("SHA-256", output.slice(0, imageLength));
            const digest = new Uint8Array(shaDigest);
            output.set(digest, imageLength);
            offset += 32;
        }
        if (this.padToSize) {
            if (offset % this.padToSize !== 0) {
                const padBy = this.padToSize - offset % this.padToSize;
                const padding = new Uint8Array(padBy);
                padding.fill(0xff);
                output.set(padding, offset);
                offset += padBy;
            }
        }
        return output;
    }
    loadExtendedHeader(data, offset) {
        const view = new DataView(data.buffer, offset);
        this.wpPin = view.getUint8(0);
        const driveConfig = view.getUint8(1);
        [this.clkDrv, this.qDrv] = this.splitByte(driveConfig);
        const dConfig = view.getUint8(2);
        [this.dDrv, this.csDrv] = this.splitByte(dConfig);
        const hdConfig = view.getUint8(3);
        [this.hdDrv, this.wpDrv] = this.splitByte(hdConfig);
        this.chipId = view.getUint8(4);
        if (this.ROM_LOADER.IMAGE_CHIP_ID !== undefined && this.chipId !== this.ROM_LOADER.IMAGE_CHIP_ID) console.warn(`Unexpected chip id in image. Expected ${this.ROM_LOADER.IMAGE_CHIP_ID} but value was ${this.chipId}. ` + "Is this image for a different chip model?");
        this.minRev = view.getUint8(5);
        this.minRevFull = view.getUint16(6, true);
        this.maxRevFull = view.getUint16(8, true);
        // Last byte is append_digest validation
        const appendDigest = view.getUint8(15);
        if (appendDigest === 0 || appendDigest === 1) this.appendDigest = appendDigest === 1;
        else throw new Error(`Invalid value for append_digest field (0x${appendDigest.toString(16)}). Should be 0 or 1.`);
    }
    saveExtendedHeader(output, offset) {
        var _a;
        const headerBuffer = new ArrayBuffer(16);
        const view = new DataView(headerBuffer);
        view.setUint8(0, this.wpPin);
        view.setUint8(1, this.joinByte(this.clkDrv, this.qDrv));
        view.setUint8(2, this.joinByte(this.dDrv, this.csDrv));
        view.setUint8(3, this.joinByte(this.hdDrv, this.wpDrv));
        view.setUint8(4, (_a = this.ROM_LOADER.IMAGE_CHIP_ID) !== null && _a !== void 0 ? _a : 0);
        view.setUint8(5, this.minRev);
        view.setUint16(6, this.minRevFull, true);
        view.setUint16(8, this.maxRevFull, true);
        for(let i = 9; i < 15; i++)view.setUint8(i, 0);
        view.setUint8(15, this.appendDigest ? 1 : 0);
        // Copy the header buffer to the output
        output.set(new Uint8Array(headerBuffer), offset);
    }
    splitByte(n) {
        return [
            n & 0x0f,
            n >> 4 & 0x0f
        ];
    }
    joinByte(ln, hn) {
        return ln & 0x0f | (hn & 0x0f) << 4;
    }
    getAlignmentDataNeeded(segment, currentOffset) {
        // Calculate alignment needed for segment
        const alignPast = segment.addr % this.IROM_ALIGN - this.SEG_HEADER_LEN;
        let padLen = this.IROM_ALIGN - currentOffset % this.IROM_ALIGN + alignPast;
        if (padLen === 0 || padLen === this.IROM_ALIGN) return 0; // already aligned
        padLen -= this.SEG_HEADER_LEN;
        if (padLen < 0) padLen += this.IROM_ALIGN;
        return padLen;
    }
}



var $6fpwM = parcelRequire("6fpwM");


class $350552f6499d5655$export$1bfee81f41a7db29 extends (0, $cd67366136220ea9$export$584af0585636cbca) {
    constructor(rom, loadFile = null){
        super(rom);
        this.version = 1;
        this.ROM_LOADER = rom;
        this.flashMode = 0;
        this.flashSizeFreq = 0;
        if (loadFile !== null) this.loadFromFile(loadFile);
    }
    loadFromFile(file) {
        const binaryData = file instanceof Uint8Array ? file : (0, $216eff205ef04904$export$f3be784ddd918f3a)(file);
        let offset = 0;
        const segments = this.loadCommonHeader(binaryData, offset, (0, $cd67366136220ea9$export$ea342b1af2e2649a));
        offset += 8;
        for(let i = 0; i < segments; i++){
            const segment = this.loadSegment(binaryData, offset);
            offset += 8 + segment.data.length;
        }
        this.checksum = this.readChecksum(binaryData, offset);
        this.verify();
    }
    defaultOutputName(inputFile) {
        return inputFile + "-";
    }
}
class $350552f6499d5655$export$bb3f6fbe2c14b60d extends (0, $cd67366136220ea9$export$584af0585636cbca) {
    constructor(rom, loadFile = null){
        super(rom);
        this.version = 2;
        this.ROM_LOADER = rom;
        this.flashMode = 0;
        this.flashSizeFreq = 0;
        if (loadFile !== null) this.loadFromFile(loadFile);
    }
    async loadFromFile(fileStr) {
        const binaryData = fileStr instanceof Uint8Array ? fileStr : (0, $216eff205ef04904$export$f3be784ddd918f3a)(fileStr);
        let offset = 0;
        // Load first header
        const segments = this.loadCommonHeader(binaryData, offset, $350552f6499d5655$export$bb3f6fbe2c14b60d.IMAGE_V2_MAGIC);
        offset += 8;
        if (segments !== $350552f6499d5655$export$bb3f6fbe2c14b60d.IMAGE_V2_SEGMENT) console.warn(`Warning: V2 header has unexpected "segment" count ${segments} (usually 4)`);
        // Save first header values
        const firstFlashMode = this.flashMode;
        const firstFlashSizeFreq = this.flashSizeFreq;
        const firstEntrypoint = this.entrypoint;
        // irom segment comes before the second header
        const iromSegment = this.loadSegment(binaryData, offset, true);
        // for actual mapped addr, add ESP8266ROM.IROM_MAP_START + flashing_addr + 8
        iromSegment.addr = 0;
        iromSegment.includeInChecksum = false;
        offset += 8 + iromSegment.data.length;
        // Load the second header
        const secondSegments = this.loadCommonHeader(binaryData, offset, (0, $cd67366136220ea9$export$ea342b1af2e2649a));
        offset += 8;
        // Compare headers
        if (firstFlashMode !== this.flashMode) console.warn(`WARNING: Flash mode value in first header (0x${firstFlashMode.toString(16)}) disagrees with second (0x${this.flashMode.toString(16)}). Using second value.`);
        if (firstFlashSizeFreq !== this.flashSizeFreq) console.warn(`WARNING: Flash size/freq value in first header (0x${firstFlashSizeFreq.toString(16)}) disagrees with second (0x${this.flashSizeFreq.toString(16)}). Using second value.`);
        if (firstEntrypoint !== this.entrypoint) console.warn(`WARNING: Entrypoint address in first header (0x${firstEntrypoint.toString(16)}) disagrees with second header (0x${this.entrypoint.toString(16)}). Using second value.`);
        // Load all the usual segments
        for(let i = 0; i < secondSegments; i++){
            const segment = this.loadSegment(binaryData, offset);
            offset += 8 + segment.data.length;
        }
        this.checksum = this.readChecksum(binaryData, offset);
        this.verify();
    }
    defaultOutputName(inputFile) {
        const iromSegment = this.getIromSegment();
        let iromOffs = 0;
        if (iromSegment !== null) iromOffs = iromSegment.addr - (0, $6fpwM.ESP8266ROM).IROM_MAP_START;
        // Get the base name without extension
        const baseName = inputFile.replace(/\.[^/.]+$/, "");
        const FLASH_SECTOR_SIZE = 0x1000;
        // Calculate the offset aligned to flash sector size
        const alignedOffset = iromOffs & ~(FLASH_SECTOR_SIZE - 1);
        return `${baseName}-0x${alignedOffset.toString(16).padStart(5, "0")}.bin`;
    }
}
// First byte of the "v2" application image
$350552f6499d5655$export$bb3f6fbe2c14b60d.IMAGE_V2_MAGIC = 0xea;
// First 'segment' value in a "v2" application image
$350552f6499d5655$export$bb3f6fbe2c14b60d.IMAGE_V2_SEGMENT = 4;



class $22605c5ecb6a88eb$export$1e95079873c7cf0b extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$60b07fbe8f0fe2fd extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$c1f78ca1bcda227b extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$ec1374edd6b0e15d extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.MMU_PAGE_SIZE_CONF = [
            16384,
            32768,
            65536
        ]; // 16KB, 32KB, 64KB
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$d423c71a5cce152b extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.MMU_PAGE_SIZE_CONF = [
            8192,
            16384,
            32768,
            65536
        ];
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$5404cbf7148435c7 extends $22605c5ecb6a88eb$export$d423c71a5cce152b {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$c4eb9c119a7fc09 extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$2c652ff4b98b04d5 extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$9687c2e4994b4f5b extends $22605c5ecb6a88eb$export$d423c71a5cce152b {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$9f0da86a6c8ea1e6 extends $22605c5ecb6a88eb$export$d423c71a5cce152b {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$c447ee7007bbd145 extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.MMU_PAGE_SIZE_CONF = [
            8192,
            16384,
            32768,
            65536
        ];
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$9cffdd9b0cd83004 extends $22605c5ecb6a88eb$export$c4eb9c119a7fc09 {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.MMU_PAGE_SIZE_CONF = [
            32768,
            65536,
            131072,
            262144
        ];
        this.ROM_LOADER = rom;
    }
}
class $22605c5ecb6a88eb$export$cee7e2de086ae399 extends (0, $9caff50b28779aaa$export$2f6fb873c909bdc7) {
    constructor(rom, loadFile = null, appendDigest = true, ramOnlyHeader = false){
        super(rom, loadFile, appendDigest, ramOnlyHeader);
        this.ROM_LOADER = rom;
    }
}


async function $25d8e6fcf26795d1$export$cd945b8ec6c09481(rom, imageData) {
    // Convert the string data to a Uint8Array if needed
    const binaryData = imageData instanceof Uint8Array ? imageData : (0, $216eff205ef04904$export$f3be784ddd918f3a)(imageData);
    // Select the appropriate image class based on the chip
    const chipName = rom.CHIP_NAME.toLowerCase().replace(/[-()]/g, "");
    let firmwareImageClass;
    if (chipName !== "esp8266") switch(chipName){
        case "esp32":
            firmwareImageClass = (0, $9caff50b28779aaa$export$2f6fb873c909bdc7);
            break;
        case "esp32s2":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$1e95079873c7cf0b);
            break;
        case "esp32s3":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$60b07fbe8f0fe2fd);
            break;
        case "esp32s31":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$9cffdd9b0cd83004);
            break;
        case "esp32c3":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$c1f78ca1bcda227b);
            break;
        case "esp32c2":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$ec1374edd6b0e15d);
            break;
        case "esp32c6":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$d423c71a5cce152b);
            break;
        case "esp32c61":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$5404cbf7148435c7);
            break;
        case "esp32c5":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$c4eb9c119a7fc09);
            break;
        case "esp32e22":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$cee7e2de086ae399);
            break;
        case "esp32h2":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$9687c2e4994b4f5b);
            break;
        case "esp32h21":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$9f0da86a6c8ea1e6);
            break;
        case "esp32h4":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$c447ee7007bbd145);
            break;
        case "esp32p4":
            firmwareImageClass = (0, $22605c5ecb6a88eb$export$2c652ff4b98b04d5);
            break;
        default:
            throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Unsupported chip name: ${chipName}`);
    }
    else {
        const magic = binaryData[0];
        if (magic === (0, $cd67366136220ea9$export$ea342b1af2e2649a)) firmwareImageClass = (0, $350552f6499d5655$export$1bfee81f41a7db29);
        else if (magic === (0, $350552f6499d5655$export$bb3f6fbe2c14b60d).IMAGE_V2_MAGIC) firmwareImageClass = (0, $350552f6499d5655$export$bb3f6fbe2c14b60d);
        else throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Invalid image magic number: ${magic}`);
    }
    // Create an instance of the selected image class
    const image = new firmwareImageClass(rom);
    const imageWithLoad = image;
    if (typeof imageWithLoad.loadFromFile === "function") {
        const loadResult = imageWithLoad.loadFromFile(binaryData);
        if (loadResult instanceof Promise) await loadResult;
    }
    return image;
}



var $jDde6 = parcelRequire("jDde6");

var $7WxGE = parcelRequire("7WxGE");

var $5CcEa = parcelRequire("5CcEa");

var $gVK7e = parcelRequire("gVK7e");

var $4ALwD = parcelRequire("4ALwD");

var $kUD0R = parcelRequire("kUD0R");

var $jDde6 = parcelRequire("jDde6");
class $f5101f7fcb463007$export$87589e306c704da extends (0, $jDde6.ESP32ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-E22";
        this.IMAGE_CHIP_ID = 31;
        this.USES_MAGIC_VALUE = false;
        this.IROM_MAP_START = 0x3c000000;
        this.IROM_MAP_END = 0x40000000;
        this.DROM_MAP_START = 0x3c000000;
        this.DROM_MAP_END = 0x40000000;
        this.BOOTLOADER_FLASH_OFFSET = 0x0;
        this.UART_DATE_REG_ADDR = 3272614028;
        this.UART_CLKDIV_REG = 3272613908;
        this.EFUSE_BASE = 0xc4008000;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.SPI_REG_BASE = 0xc3003000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.SPI_ADDR_REG_MSB = false;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 24;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 28;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 4;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 8;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 12;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_SECURE_BOOT_EN_MASK = 1048576;
        this.PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
        this.PURPOSE_VAL_XTS_AES128_KEY = 4;
        this.FLASH_ENCRYPTED_WRITE_ALIGN = 16;
        this.USB_RAM_BLOCK = 0x800;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x3c000000,
                0x40000000,
                "DROM"
            ],
            [
                0x31000000,
                0x31200000,
                "DRAM"
            ],
            [
                0x31000000,
                0x31200000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x30000000,
                0x30120000,
                "DROM_MASK"
            ],
            [
                0x30000000,
                0x30120000,
                "IROM_MASK"
            ],
            [
                0x3c000000,
                0x40000000,
                "IROM"
            ],
            [
                0x30fe0000,
                0x31200000,
                "IRAM"
            ],
            [
                0xc0000000,
                0xc0008000,
                "RTC_IRAM"
            ],
            [
                0xc0000000,
                0xc0008000,
                "RTC_DRAM"
            ]
        ];
        this.EFUSE_MAX_KEY = 5;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            2: "XTS_AES_256_KEY_1",
            3: "XTS_AES_256_KEY_2",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2",
            12: "KM_INIT_KEY"
        };
    }
    async getPkgVersion(loader) {
        return 0;
    }
    async getMinorChipVersion(loader) {
        return 0;
    }
    async getMajorChipVersion(loader) {
        return 0;
    }
    async getChipRevision(loader) {
        const major = await this.getMajorChipVersion(loader);
        const minor = await this.getMinorChipVersion(loader);
        return major * 100 + minor;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        const desc = pkgVer === 0 ? "ESP32-E22" : "unknown ESP32-E22";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "Wi-Fi 6E (tri-band, 2x2 MU-MIMO)",
            "BT 5.4 (LE) + Classic",
            "Dual Core",
            "500MHz"
        ];
    }
    async readMac(loader) {
        let mac0 = await loader.readReg(this.MAC_EFUSE_REG);
        mac0 = mac0 >>> 0;
        let mac1 = await loader.readReg(this.MAC_EFUSE_REG + 4);
        mac1 = mac1 >>> 0 & 0x0000ffff;
        const mac = new Uint8Array(6);
        mac[0] = mac1 >> 8 & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = mac0 >> 24 & 0xff;
        mac[3] = mac0 >> 16 & 0xff;
        mac[4] = mac0 >> 8 & 0xff;
        mac[5] = mac0 & 0xff;
        return this._d2h(mac[0]) + ":" + this._d2h(mac[1]) + ":" + this._d2h(mac[2]) + ":" + this._d2h(mac[3]) + ":" + this._d2h(mac[4]) + ":" + this._d2h(mac[5]);
    }
    async getKeyBlockPurpose(loader, keyBlock) {
        if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) throw new Error(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
        const regShiftDictionary = [
            [
                this.EFUSE_PURPOSE_KEY0_REG,
                this.EFUSE_PURPOSE_KEY0_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY1_REG,
                this.EFUSE_PURPOSE_KEY1_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY2_REG,
                this.EFUSE_PURPOSE_KEY2_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY3_REG,
                this.EFUSE_PURPOSE_KEY3_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY4_REG,
                this.EFUSE_PURPOSE_KEY4_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY5_REG,
                this.EFUSE_PURPOSE_KEY5_SHIFT
            ]
        ];
        const [reg, shift] = regShiftDictionary[keyBlock];
        const registerValue = await loader.readReg(reg);
        return registerValue >> shift & 0xf;
    }
    checkSpiConnection(loader, spiConnection) {
        if (!spiConnection.every((pin)=>pin >= 0 && pin <= 52)) throw new Error("SPI Pin numbers must be in the range 0-52.");
        if (spiConnection.some((pin)=>pin === 18 || pin === 19)) loader.info("GPIO pins 18 and 19 are used by USB-OTG, consider using other pins for SPI flash connection.");
    }
    async postConnect(loader) {
        if (await loader.usesUsbOtg()) loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
}



var $H1kyH = parcelRequire("H1kyH");

var $H1kyH = parcelRequire("H1kyH");
class $867d4bfd7d3d490a$export$5445d6d0c3b99e43 extends (0, $H1kyH.ESP32H2ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-H21";
        this.IMAGE_CHIP_ID = 25;
        this.USES_MAGIC_VALUE = false;
        this.UF2_FAMILY_ID = 0xb6dd00af;
        this.DR_REG_LP_WDT_BASE = 0x600b1c00;
        this.RTC_CNTL_WDTCONFIG0_REG = this.DR_REG_LP_WDT_BASE + 0x0;
        this.RTC_CNTL_WDTWPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x001c;
        this.RTC_CNTL_SWD_CONF_REG = this.DR_REG_LP_WDT_BASE + 0x0020;
        this.RTC_CNTL_SWD_AUTO_FEED_EN = 262144;
        this.RTC_CNTL_SWD_WPROTECT_REG = this.DR_REG_LP_WDT_BASE + 0x0024;
        this.RTC_CNTL_SWD_WKEY = 0x50d83aa1;
        this.EFUSE_BASE = 0x600b4000;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 24;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 28;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 4;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 8;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 12;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1048576;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 1835008;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_SECURE_BOOT_EN_MASK = 1048576;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            2: "RESERVED",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2"
        };
    }
    async getPkgVersion(loader) {
        const numWord = 5;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 11 & 0x07;
    }
    async getMinorChipVersion(loader) {
        const numWord = 5;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 4 & 0x0f;
    }
    async getMajorChipVersion(loader) {
        const numWord = 5;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 8 & 0x03;
    }
    async getChipRevision(loader) {
        const major = await this.getMajorChipVersion(loader);
        const minor = await this.getMinorChipVersion(loader);
        return major * 100 + minor;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        const desc = pkgVer === 0 ? "ESP32-H21" : "Unknown ESP32-H21";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "BT 5 (LE)",
            "IEEE802.15.4",
            "Single Core",
            "96MHz"
        ];
    }
    async getCrystalFreq(loader) {
        return 32;
    }
    checkSpiConnection(loader, spiConnection) {
        if (!spiConnection.every((pin)=>pin >= 0 && pin <= 27)) throw new Error("SPI Pin numbers must be in the range 0-27.");
        if (spiConnection.some((pin)=>pin === 26 || pin === 27)) loader.info("GPIO pins 26 and 27 are used by USB-Serial/JTAG, consider using other pins for SPI flash connection.");
    }
}



var $5CcEa = parcelRequire("5CcEa");
class $97f4b9e70378dc8a$export$ef604080c99287aa extends (0, $5CcEa.ESP32C3ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-H4";
        this.IMAGE_CHIP_ID = 28;
        this.USES_MAGIC_VALUE = false;
        this.IROM_MAP_START = 0x42000000;
        this.IROM_MAP_END = 0x42800000;
        this.DROM_MAP_START = 0x42800000;
        this.DROM_MAP_END = 0x43000000;
        this.BOOTLOADER_FLASH_OFFSET = 0x2000;
        this.SPI_REG_BASE = 0x60099000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.UART_DATE_REG_ADDR = 1610686588;
        this.EFUSE_BASE = 0x600b1800;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x044;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 5;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 10;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 15;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 20;
        this.EFUSE_PURPOSE_KEY5_REG = this.EFUSE_BASE + 0x34;
        this.EFUSE_PURPOSE_KEY5_SHIFT = 25;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 16384;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x030;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 58720256;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_SECURE_BOOT_EN_MASK = 32;
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x038;
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 19;
        this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
        this.PURPOSE_VAL_XTS_AES128_KEY = 4;
        this.FLASH_ENCRYPTED_WRITE_ALIGN = 16;
        this.FLASH_FREQUENCY = {
            "48m": 0xf,
            "24m": 0x0,
            "16m": 0x1,
            "12m": 0x2
        };
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x42000000,
                0x44000000,
                "DROM"
            ],
            [
                0x40810000,
                0x40860000,
                "DRAM"
            ],
            [
                0x40810000,
                0x40860000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x40000000,
                0x40050000,
                "DROM_MASK"
            ],
            [
                0x40000000,
                0x40050000,
                "IROM_MASK"
            ],
            [
                0x42000000,
                0x44000000,
                "IROM"
            ],
            [
                0x40810000,
                0x40860000,
                "IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_IRAM"
            ],
            [
                0x50000000,
                0x50004000,
                "RTC_DRAM"
            ],
            [
                0x60000000,
                0x60100000,
                "MEM_INTERNAL2"
            ]
        ];
        this.UF2_FAMILY_ID = 0x9e0baa8a;
        this.EFUSE_MAX_KEY = 5;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            2: "XTS_AES_256_KEY_FLASH_1",
            3: "XTS_AES_256_KEY_FLASH_2",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2",
            12: "KM_INIT_KEY",
            13: "XTS_AES_256_KEY_PSRAM_1",
            14: "XTS_AES_256_KEY_PSRAM_2",
            15: "XTS_AES_128_KEY_PSRAM",
            16: "ECDSA_KEY_P192",
            17: "ECDSA_KEY_P384_L",
            18: "ECDSA_KEY_P384_H"
        };
    }
    async getPkgVersion(loader) {
        const numWord = 4;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 12 & 0x07;
    }
    async getMinorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 18 & 0x0f;
    }
    async getMajorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 22 & 0x03;
    }
    async getChipRevision(loader) {
        const major = await this.getMajorChipVersion(loader);
        const minor = await this.getMinorChipVersion(loader);
        return major * 100 + minor;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        const desc = pkgVer === 0 ? "ESP32-H4 (QFN40)" : "Unknown ESP32-H4";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "BT 5 (LE)",
            "IEEE802.15.4",
            "Dual Core",
            "96MHz"
        ];
    }
    async getCrystalFreq(loader) {
        return 32;
    }
    async getKeyBlockPurpose(loader, keyBlock) {
        if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) throw new Error(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
        const regShiftDictionary = [
            [
                this.EFUSE_PURPOSE_KEY0_REG,
                this.EFUSE_PURPOSE_KEY0_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY1_REG,
                this.EFUSE_PURPOSE_KEY1_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY2_REG,
                this.EFUSE_PURPOSE_KEY2_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY3_REG,
                this.EFUSE_PURPOSE_KEY3_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY4_REG,
                this.EFUSE_PURPOSE_KEY4_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY5_REG,
                this.EFUSE_PURPOSE_KEY5_SHIFT
            ]
        ];
        const [reg, shift] = regShiftDictionary[keyBlock];
        const registerValue = await loader.readReg(reg);
        return registerValue >> shift & 0x1f;
    }
    checkSpiConnection(loader, spiConnection) {
        if (!spiConnection.every((pin)=>pin >= 0 && pin <= 39)) throw new Error("SPI Pin numbers must be in the range 0-39.");
        if (spiConnection.some((pin)=>pin === 13 || pin === 14)) loader.info("GPIO pins 13 and 14 are used by USB-Serial/JTAG, consider using other pins for SPI flash connection.");
    }
}



var $41MQS = parcelRequire("41MQS");

var $dTziU = parcelRequire("dTziU");

var $jI9O3 = parcelRequire("jI9O3");

var $gVK7e = parcelRequire("gVK7e");
class $f04e71ce96d5af5a$export$65efa68eb174d316 extends (0, $gVK7e.ESP32C5ROM) {
    constructor(){
        super(...arguments);
        this.CHIP_NAME = "ESP32-S31";
        this.IMAGE_CHIP_ID = 32;
        this.USES_MAGIC_VALUE = false;
        this.IROM_MAP_START = 0x40000000;
        this.IROM_MAP_END = 0x54000000;
        this.DROM_MAP_START = 0x40000000;
        this.DROM_MAP_END = 0x54000000;
        this.BOOTLOADER_FLASH_OFFSET = 0x2000;
        this.UART_DATE_REG_ADDR = 540582028;
        this.UART_CLKDIV_REG = 540581908;
        this.EFUSE_BASE = 0x20715000;
        this.EFUSE_BLOCK1_ADDR = this.EFUSE_BASE + 0x050;
        this.MAC_EFUSE_REG = this.EFUSE_BASE + 0x050;
        this.SPI_REG_BASE = 0x20501000;
        this.SPI_USR_OFFS = 0x18;
        this.SPI_USR1_OFFS = 0x1c;
        this.SPI_USR2_OFFS = 0x20;
        this.SPI_MOSI_DLEN_OFFS = 0x24;
        this.SPI_MISO_DLEN_OFFS = 0x28;
        this.SPI_W0_OFFS = 0x58;
        this.SPI_ADDR_REG_MSB = false;
        this.EFUSE_RD_REG_BASE = this.EFUSE_BASE + 0x030;
        this.EFUSE_PURPOSE_KEY0_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY0_SHIFT = 0;
        this.EFUSE_PURPOSE_KEY1_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY1_SHIFT = 5;
        this.EFUSE_PURPOSE_KEY2_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY2_SHIFT = 10;
        this.EFUSE_PURPOSE_KEY3_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY3_SHIFT = 15;
        this.EFUSE_PURPOSE_KEY4_REG = this.EFUSE_BASE + 0x38;
        this.EFUSE_PURPOSE_KEY4_SHIFT = 20;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT_REG = this.EFUSE_RD_REG_BASE;
        this.EFUSE_DIS_DOWNLOAD_MANUAL_ENCRYPT = 1048576;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_SPI_BOOT_CRYPT_CNT_MASK = 14680064;
        this.EFUSE_SECURE_BOOT_EN_REG = this.EFUSE_BASE + 0x03c;
        this.EFUSE_SECURE_BOOT_EN_MASK = 4;
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG = this.EFUSE_BASE + 0x034;
        this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT = 12;
        this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_1 = 2;
        this.PURPOSE_VAL_XTS_AES256_KEY_2 = 3;
        this.PURPOSE_VAL_XTS_AES128_KEY = 4;
        this.FLASH_ENCRYPTED_WRITE_ALIGN = 16;
        this.USB_RAM_BLOCK = 0x800;
        this.MEMORY_MAP = [
            [
                0x00000000,
                0x00010000,
                "PADDING"
            ],
            [
                0x40000000,
                0x54000000,
                "DROM"
            ],
            [
                0x2f000000,
                0x2f080000,
                "DRAM"
            ],
            [
                0x2f000000,
                0x2f080000,
                "BYTE_ACCESSIBLE"
            ],
            [
                0x2f800000,
                0x2f850000,
                "DROM_MASK"
            ],
            [
                0x2f800000,
                0x2f850000,
                "IROM_MASK"
            ],
            [
                0x40000000,
                0x54000000,
                "IROM"
            ],
            [
                0x2f000000,
                0x2f080000,
                "IRAM"
            ],
            [
                0x2e000000,
                0x2e008000,
                "RTC_IRAM"
            ],
            [
                0x2e000000,
                0x2e008000,
                "RTC_DRAM"
            ]
        ];
        this.UF2_FAMILY_ID = 0x3101f7c1;
        this.EFUSE_MAX_KEY = 4;
        this.KEY_PURPOSES = {
            0: "USER/EMPTY",
            1: "ECDSA_KEY",
            2: "XTS_AES_256_KEY_1",
            3: "XTS_AES_256_KEY_2",
            4: "XTS_AES_128_KEY",
            5: "HMAC_DOWN_ALL",
            6: "HMAC_DOWN_JTAG",
            7: "HMAC_DOWN_DIGITAL_SIGNATURE",
            8: "HMAC_UP",
            9: "SECURE_BOOT_DIGEST0",
            10: "SECURE_BOOT_DIGEST1",
            11: "SECURE_BOOT_DIGEST2",
            12: "KM_INIT_KEY",
            13: "XTS_AES_256_PSRAM_KEY_1",
            14: "XTS_AES_256_PSRAM_KEY_2",
            15: "XTS_AES_128_PSRAM_KEY",
            16: "ECDSA_KEY_P192",
            17: "ECDSA_KEY_P384_L",
            18: "ECDSA_KEY_P384_H",
            19: "SDC_KEY_DIGEST"
        };
    }
    async getPkgVersion(loader) {
        const numWord = 4;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 6 & 0x03;
    }
    async getMinorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 18 & 0x0f;
    }
    async getMajorChipVersion(loader) {
        const numWord = 3;
        return await loader.readReg(this.EFUSE_BLOCK1_ADDR + 4 * numWord) >> 22 & 0x03;
    }
    async getChipRevision(loader) {
        const major = await this.getMajorChipVersion(loader);
        const minor = await this.getMinorChipVersion(loader);
        return major * 100 + minor;
    }
    async getChipDescription(loader) {
        const pkgVer = await this.getPkgVersion(loader);
        const desc = pkgVer === 0 ? "ESP32-S31" : "unknown ESP32-S31";
        const majorRev = await this.getMajorChipVersion(loader);
        const minorRev = await this.getMinorChipVersion(loader);
        return `${desc} (revision v${majorRev}.${minorRev})`;
    }
    async getChipFeatures(loader) {
        return [
            "Wi-Fi 6",
            "BT 5.4 (LE)",
            "IEEE802.15.4",
            "Dual Core + LP Core",
            "300MHz"
        ];
    }
    async getCrystalFreq(loader) {
        return 40;
    }
    async getKeyBlockPurpose(loader, keyBlock) {
        if (keyBlock < 0 || keyBlock > this.EFUSE_MAX_KEY) throw new Error(`Valid key block numbers must be in range 0-${this.EFUSE_MAX_KEY}`);
        const regShiftDictionary = [
            [
                this.EFUSE_PURPOSE_KEY0_REG,
                this.EFUSE_PURPOSE_KEY0_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY1_REG,
                this.EFUSE_PURPOSE_KEY1_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY2_REG,
                this.EFUSE_PURPOSE_KEY2_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY3_REG,
                this.EFUSE_PURPOSE_KEY3_SHIFT
            ],
            [
                this.EFUSE_PURPOSE_KEY4_REG,
                this.EFUSE_PURPOSE_KEY4_SHIFT
            ]
        ];
        const [reg, shift] = regShiftDictionary[keyBlock];
        const registerValue = await loader.readReg(reg);
        return registerValue >> shift & 0x1f;
    }
    async isFlashEncryptionKeyValid(loader) {
        const purposes = [];
        for(let i = 0; i <= this.EFUSE_MAX_KEY; i++)purposes.push(await this.getKeyBlockPurpose(loader, i));
        if (purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES128_KEY)) return true;
        if (purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES256_KEY_1) && purposes.some((p)=>p === this.PURPOSE_VAL_XTS_AES256_KEY_2)) return true;
        const registerValue = await loader.readReg(this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_REG);
        return (registerValue >> this.EFUSE_FORCE_USE_KEY_MANAGER_KEY_SHIFT & this.FORCE_USE_KEY_MANAGER_VAL_XTS_AES_KEY) !== 0;
    }
    checkSpiConnection(loader, spiConnection) {
        if (!spiConnection.every((pin)=>pin >= 0 && pin <= 60)) throw new Error("SPI Pin numbers must be in the range 0-60.");
        if (spiConnection.some((pin)=>pin === 33 || pin === 34)) loader.info("GPIO pins 33 and 34 are used by USB-Serial/JTAG, consider using other pins for SPI flash connection.");
    }
    async postConnect(loader) {
        // Python uses_usb_otg(): Espressif VID + IMAGE_CHIP_ID as USB-OTG PID
        if (await loader.usesUsbOtg()) loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
    async changeBaud(loader) {
        await loader.changeBaud();
    }
}



var $6fpwM = parcelRequire("6fpwM");
const $7fac5ef4941af15b$export$49f2d5f1cbd7dd00 = {
    esp8266: new (0, $6fpwM.ESP8266ROM)(),
    esp32: new (0, $jDde6.ESP32ROM)(),
    esp32s2: new (0, $dTziU.ESP32S2ROM)(),
    esp32s3: new (0, $jI9O3.ESP32S3ROM)(),
    esp32s31: new (0, $f04e71ce96d5af5a$export$65efa68eb174d316)(),
    esp32c3: new (0, $5CcEa.ESP32C3ROM)(),
    esp32c2: new (0, $7WxGE.ESP32C2ROM)(),
    esp32c6: new (0, $4ALwD.ESP32C6ROM)(),
    esp32c61: new (0, $kUD0R.ESP32C61ROM)(),
    esp32c5: new (0, $gVK7e.ESP32C5ROM)(),
    esp32e22: new (0, $f5101f7fcb463007$export$87589e306c704da)(),
    esp32h2: new (0, $H1kyH.ESP32H2ROM)(),
    esp32h21: new (0, $867d4bfd7d3d490a$export$5445d6d0c3b99e43)(),
    esp32p4: new (0, $41MQS.ESP32P4ROM)(),
    esp32h4: new (0, $97f4b9e70378dc8a$export$ef604080c99287aa)()
};
const $7fac5ef4941af15b$export$27a13d15c80c6609 = Object.keys($7fac5ef4941af15b$export$49f2d5f1cbd7dd00);
const $7fac5ef4941af15b$export$7bc57576e30c2afc = Object.values($7fac5ef4941af15b$export$49f2d5f1cbd7dd00);


/** ROM security-info flag bits (same mapping across targets). */ const $0760b8d8bf2d6237$export$3f9337b6d3c1851a = {
    SECURE_BOOT_EN: 1,
    SECURE_BOOT_AGGRESSIVE_REVOKE: 2,
    SECURE_DOWNLOAD_ENABLE: 4,
    SECURE_BOOT_KEY_REVOKE0: 8,
    SECURE_BOOT_KEY_REVOKE1: 16,
    SECURE_BOOT_KEY_REVOKE2: 32,
    SOFT_DIS_JTAG: 64,
    HARD_DIS_JTAG: 128,
    DIS_USB: 256,
    DIS_DOWNLOAD_DCACHE: 512,
    DIS_DOWNLOAD_ICACHE: 1024
};
function $0760b8d8bf2d6237$export$621d5083132ce967(flagsValue) {
    const parsedFlags = {};
    for (const flagName of Object.keys($0760b8d8bf2d6237$export$3f9337b6d3c1851a))parsedFlags[flagName] = (flagsValue & $0760b8d8bf2d6237$export$3f9337b6d3c1851a[flagName]) !== 0;
    return parsedFlags;
}


const $b9be20b2c9078c9b$export$5559d61a150fabe5 = 0x303a;
const $b9be20b2c9078c9b$export$2f0304870961b486 = 0x1001;











/**
 * Return the chip ROM based on the given magic number
 * @param {number} magic - magic hex number to select ROM.
 * @returns {ROM} The chip ROM class related to given magic hex number.
 */ async function $b9be20b2c9078c9b$var$magic2Chip(magic) {
    switch(magic){
        case 0x00f01d83:
            {
                const { ESP32ROM: ESP32ROM } = await Promise.resolve((parcelRequire("jDde6")));
                return new ESP32ROM();
            }
        case 0xc21e06f:
        case 0x6f51306f:
        case 0x7c41a06f:
            {
                const { ESP32C2ROM: ESP32C2ROM } = await Promise.resolve((parcelRequire("7WxGE")));
                return new ESP32C2ROM();
            }
        case 0x6921506f:
        case 0x1b31506f:
        case 0x4881606f:
        case 0x4361606f:
            {
                const { ESP32C3ROM: ESP32C3ROM } = await Promise.resolve((parcelRequire("5CcEa")));
                return new ESP32C3ROM();
            }
        case 0x2ce0806f:
            {
                const { ESP32C6ROM: ESP32C6ROM } = await Promise.resolve((parcelRequire("4ALwD")));
                return new ESP32C6ROM();
            }
        case 0x2421606f:
        case 0x33f0206f:
        case 0x4f81606f:
            {
                const { ESP32C61ROM: ESP32C61ROM } = await Promise.resolve((parcelRequire("kUD0R")));
                return new ESP32C61ROM();
            }
        case 0x1101406f:
        case 0x63e1406f:
        case 0x5fd1406f:
        case 0x30e1706f:
            {
                const { ESP32C5ROM: ESP32C5ROM } = await Promise.resolve((parcelRequire("gVK7e")));
                return new ESP32C5ROM();
            }
        case 0xd7b73e80:
        case 0x97e30068:
            {
                const { ESP32H2ROM: ESP32H2ROM } = await Promise.resolve((parcelRequire("H1kyH")));
                return new ESP32H2ROM();
            }
        case 0x09:
            {
                const { ESP32S3ROM: ESP32S3ROM } = await Promise.resolve((parcelRequire("jI9O3")));
                return new ESP32S3ROM();
            }
        case 0x000007c6:
            {
                const { ESP32S2ROM: ESP32S2ROM } = await Promise.resolve((parcelRequire("dTziU")));
                return new ESP32S2ROM();
            }
        case 0xfff0c101:
            {
                const { ESP8266ROM: ESP8266ROM } = await Promise.resolve((parcelRequire("6fpwM")));
                return new ESP8266ROM();
            }
        case 0x0:
        case 0x0addbad0:
        case 0x7039ad9:
            {
                const { ESP32P4ROM: ESP32P4ROM } = await Promise.resolve((parcelRequire("41MQS")));
                return new ESP32P4ROM();
            }
        default:
            return null;
    }
}
class $b9be20b2c9078c9b$export$b0f7a6c745790308 {
    /**
     * Create a new ESPLoader to perform serial communication
     * such as read/write flash memory and registers using a LoaderOptions object.
     * @param {LoaderOptions} options - LoaderOptions object argument for ESPLoader.
     * ```
     * const myLoader = new ESPLoader({ transport: Transport, baudrate: number, terminal?: IEspLoaderTerminal });
     * ```
     */ constructor(options){
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.ESP_RAM_BLOCK = 0x1800;
        this.ESP_FLASH_BEGIN = 0x02;
        this.ESP_FLASH_DATA = 0x03;
        this.ESP_FLASH_END = 0x04;
        this.ESP_MEM_BEGIN = 0x05;
        this.ESP_MEM_END = 0x06;
        this.ESP_MEM_DATA = 0x07;
        this.ESP_WRITE_REG = 0x09;
        this.ESP_READ_REG = 0x0a;
        this.ESP_SPI_ATTACH = 0x0d;
        this.ESP_CHANGE_BAUDRATE = 0x0f;
        this.ESP_FLASH_DEFL_BEGIN = 0x10;
        this.ESP_FLASH_DEFL_DATA = 0x11;
        this.ESP_FLASH_DEFL_END = 0x12;
        this.ESP_SPI_FLASH_MD5 = 0x13;
        this.ESP_GET_SECURITY_INFO = 0x14;
        // Only Stub supported commands
        this.ESP_ERASE_FLASH = 0xd0;
        this.ESP_ERASE_REGION = 0xd1;
        this.ESP_READ_FLASH = 0xd2;
        this.ESP_RUN_USER_CODE = 0xd3;
        this.ESP_IMAGE_MAGIC = 0xe9;
        this.ESP_CHECKSUM_MAGIC = 0xef;
        // Response code(s) sent by ROM
        this.ROM_INVALID_RECV_MSG = 0x05; // response if an invalid message is received
        this.DEFAULT_TIMEOUT = 3000;
        this.ERASE_REGION_TIMEOUT_PER_MB = 30000;
        this.ERASE_WRITE_TIMEOUT_PER_MB = 40000;
        this.MD5_TIMEOUT_PER_MB = 8000;
        this.CHIP_ERASE_TIMEOUT = 120000;
        this.FLASH_READ_TIMEOUT = 100000;
        this.MAX_TIMEOUT = this.CHIP_ERASE_TIMEOUT * 2;
        this.WRITE_BLOCK_ATTEMPTS = 3;
        this.WRITE_BLOCK_RETRY_DELAY_MS = 150;
        this.SPI_ADDR_REG_MSB = true;
        this.CHIP_DETECT_MAGIC_REG_ADDR = 0x40001000;
        this.DETECTED_FLASH_SIZES = {
            0x12: "256KB",
            0x13: "512KB",
            0x14: "1MB",
            0x15: "2MB",
            0x16: "4MB",
            0x17: "8MB",
            0x18: "16MB",
            0x19: "32MB",
            0x1a: "64MB",
            0x1b: "128MB",
            0x1c: "256MB",
            0x20: "64MB",
            0x21: "128MB",
            0x22: "256MB",
            0x32: "256KB",
            0x33: "512KB",
            0x34: "1MB",
            0x35: "2MB",
            0x36: "4MB",
            0x37: "8MB",
            0x38: "16MB",
            0x39: "32MB",
            0x3a: "64MB"
        };
        this.secureDownloadMode = false;
        this.securityInfoCache = null;
        this.romBaudrate = 115200;
        this.debugLogging = false;
        this.syncStubDetected = false;
        this.IS_STUB = false;
        this.FLASH_WRITE_SIZE = 0x4000;
        this.transport = options.transport;
        this.baudrate = options.baudrate;
        if (typeof options.romBaudrate !== "undefined") this.romBaudrate = options.romBaudrate;
        this.resetConstructors = {
            classicReset: (transport, resetDelay)=>new (0, $c7981c93d06fe700$export$4de7cfbc0d78cb8e)(transport, resetDelay),
            customReset: (transport, sequenceString)=>new (0, $c7981c93d06fe700$export$587746fadce59bb9)(transport, sequenceString),
            hardReset: (transport, usingUsbOtg)=>new (0, $c7981c93d06fe700$export$529f1679a228f28a)(transport, usingUsbOtg),
            usbJTAGSerialReset: (transport)=>new (0, $c7981c93d06fe700$export$f728aa04f347362c)(transport)
        };
        if (options.serialOptions) this.serialOptions = options.serialOptions;
        if (options.terminal) {
            this.terminal = options.terminal;
            this.terminal.clean();
        }
        if (typeof options.debugLogging !== "undefined") this.debugLogging = options.debugLogging;
        if (options.port) this.transport = new (0, $4616b1a2f9a5b082$export$86495b081fef8e52)(options.port);
        if (typeof options.enableTracing !== "undefined") this.transport.tracing = options.enableTracing;
        if ((_a = options.resetConstructors) === null || _a === void 0 ? void 0 : _a.classicReset) this.resetConstructors.classicReset = (_b = options.resetConstructors) === null || _b === void 0 ? void 0 : _b.classicReset;
        if ((_c = options.resetConstructors) === null || _c === void 0 ? void 0 : _c.customReset) this.resetConstructors.customReset = (_d = options.resetConstructors) === null || _d === void 0 ? void 0 : _d.customReset;
        if ((_e = options.resetConstructors) === null || _e === void 0 ? void 0 : _e.hardReset) this.resetConstructors.hardReset = (_f = options.resetConstructors) === null || _f === void 0 ? void 0 : _f.hardReset;
        if ((_g = options.resetConstructors) === null || _g === void 0 ? void 0 : _g.usbJTAGSerialReset) this.resetConstructors.usbJTAGSerialReset = (_h = options.resetConstructors) === null || _h === void 0 ? void 0 : _h.usbJTAGSerialReset;
        this.info("esptool.js");
        this.info("Serial port " + this.transport.getInfo());
    }
    /**
     * Write to ESP Loader constructor's terminal with or without new line.
     * @param {string} str - String to write.
     * @param {boolean} withNewline - Add new line at the end ?
     */ write(str, withNewline = true) {
        if (this.terminal) {
            if (withNewline) this.terminal.writeLine(str);
            else this.terminal.write(str);
        } else // eslint-disable-next-line no-console
        console.log(str);
    }
    /**
     * Write error message to ESP Loader constructor's terminal with or without new line.
     * @param {string} str - String to write.
     * @param {boolean} withNewline - Add new line at the end ?
     */ error(str, withNewline = true) {
        this.write(`Error: ${str}`, withNewline);
    }
    /**
     * Write information message to ESP Loader constructor's terminal with or without new line.
     * @param {string} str - String to write.
     * @param {boolean} withNewline - Add new line at the end ?
     */ info(str, withNewline = true) {
        this.write(str, withNewline);
    }
    /**
     * Write debug message to ESP Loader constructor's terminal with or without new line.
     * @param {string} str - String to write.
     * @param {boolean} withNewline - Add new line at the end ?
     */ debug(str, withNewline = true) {
        if (this.debugLogging) this.write(`Debug: ${str}`, withNewline);
    }
    /**
     * Convert short integer to byte array
     * @param {number} i - Number to convert.
     * @returns {Uint8Array} Byte array.
     */ _shortToBytearray(i) {
        return new Uint8Array([
            i & 0xff,
            i >> 8 & 0xff
        ]);
    }
    /**
     * Convert an integer to byte array
     * @param {number} i - Number to convert.
     * @returns {ROM} The chip ROM class related to given magic hex number.
     */ _intToByteArray(i) {
        return new Uint8Array([
            i & 0xff,
            i >> 8 & 0xff,
            i >> 16 & 0xff,
            i >> 24 & 0xff
        ]);
    }
    /**
     * Convert a byte array to integer.
     * @param {number} i - Number to convert.
     * @param {number} j - Number to convert.
     * @param {number} k - Number to convert.
     * @param {number} l - Number to convert.
     * @returns {number} Return a integer number.
     */ _byteArrayToInt(i, j, k, l) {
        return i | j << 8 | k << 16 | l << 24;
    }
    /**
     * Append a buffer array after another buffer array
     * @param {Uint8Array} arr1 - First array buffer.
     * @param {Uint8Array} arr2 - magic hex number to select ROM.
     * @returns {Uint8Array} Return a 8 bit unsigned array.
     */ _appendArray(arr1, arr2) {
        const c = new Uint8Array(arr1.length + arr2.length);
        c.set(arr1, 0);
        c.set(arr2, arr1.length);
        return c;
    }
    /**
     * Use the device serial port read function with given timeout to create a valid packet.
     * @param {number} op Operation number
     * @param {number} timeout timeout number in milliseconds
     * @returns {[number, Uint8Array]} valid response packet.
     */ async readPacket(op = null, timeout = this.DEFAULT_TIMEOUT) {
        // Check up-to next 100 packets for valid response packet
        for(let i = 0; i < 100; i++){
            const p = await this.transport.read(timeout);
            if (!p || p.length < 8) continue;
            const resp = p[0];
            if (resp !== 1) continue;
            const opRet = p[1];
            const val = this._byteArrayToInt(p[4], p[5], p[6], p[7]);
            const data = p.slice(8);
            if (resp == 1) {
                if (op == null || opRet == op) return [
                    val,
                    data
                ];
                else if (data[0] != 0 && data[1] == this.ROM_INVALID_RECV_MSG) {
                    // The ROM repeats an unsupported command response 8 times; flushing
                    // alone leaves the rest in flight, desyncing the next command.
                    await this.transport.drainInput();
                    throw new (0, $f1887d9f177795ef$export$4bb69fbdc6ba8341)();
                }
            }
        }
        throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("invalid response");
    }
    /**
     * Write a serial command to the chip
     * @param {number} op - Operation number
     * @param {Uint8Array} data - Unsigned 8 bit array
     * @param {number} chk - channel number
     * @param {boolean} waitResponse - wait for response ?
     * @param {number} timeout - timeout number in milliseconds
     * @returns {Promise<[number, Uint8Array]>} Return a number and a 8 bit unsigned integer array.
     */ async command(op = null, data = new Uint8Array(0), chk = 0, waitResponse = true, timeout = this.DEFAULT_TIMEOUT) {
        if (op != null) {
            // Discard any stale input before sending: leftover bytes (e.g. an
            // extra ack packet from a fire-and-forget write) would otherwise be
            // read as this command's response, desyncing the protocol — observed
            // as flashMd5sum/readFlash returning constant junk right after a
            // completed writeFlash.
            this.transport.flushInput();
            if (this.transport.tracing) this.transport.trace(`command op:0x${op.toString(16).padStart(2, "0")} data len=${data.length} wait_response=${waitResponse ? 1 : 0} timeout=${(timeout / 1000).toFixed(3)} data=${this.transport.hexConvert(data)}`);
            const pkt = new Uint8Array(8 + data.length);
            pkt[0] = 0x00;
            pkt[1] = op;
            pkt[2] = this._shortToBytearray(data.length)[0];
            pkt[3] = this._shortToBytearray(data.length)[1];
            pkt[4] = this._intToByteArray(chk)[0];
            pkt[5] = this._intToByteArray(chk)[1];
            pkt[6] = this._intToByteArray(chk)[2];
            pkt[7] = this._intToByteArray(chk)[3];
            let i;
            for(i = 0; i < data.length; i++)pkt[8 + i] = data[i];
            await this.transport.write(pkt);
        }
        if (!waitResponse) return [
            0,
            new Uint8Array(0)
        ];
        return this.readPacket(op, timeout);
    }
    /**
     * Read a register from chip.
     * @param {number} addr - Register address number
     * @param {number} timeout - Timeout in milliseconds (Default: 3000ms)
     * @returns {number} - Command number value
     */ async readReg(addr, timeout = this.DEFAULT_TIMEOUT) {
        this.debug(`Read Register:${this.toHex(addr)}`);
        const pkt = this._intToByteArray(addr);
        const val = await this.command(this.ESP_READ_REG, pkt, undefined, undefined, timeout);
        this.debug(`Read Register Value:${val[0]}`);
        return val[0];
    }
    /**
     * Write a number value to register address in chip.
     * @param {number} addr - Register address number
     * @param {number} value - Number value to write in register
     * @param {number} mask - Hex number for mask
     * @param {number} delayUs Delay number
     * @param {number} delayAfterUs Delay after previous delay
     */ async writeReg(addr, value, mask = 0xffffffff, delayUs = 0, delayAfterUs = 0) {
        let pkt = this._appendArray(this._intToByteArray(addr), this._intToByteArray(value));
        pkt = this._appendArray(pkt, this._intToByteArray(mask));
        pkt = this._appendArray(pkt, this._intToByteArray(delayUs));
        if (delayAfterUs > 0) {
            pkt = this._appendArray(pkt, this._intToByteArray(this.chip.UART_DATE_REG_ADDR));
            pkt = this._appendArray(pkt, this._intToByteArray(0));
            pkt = this._appendArray(pkt, this._intToByteArray(0));
            pkt = this._appendArray(pkt, this._intToByteArray(delayAfterUs));
        }
        await this.checkCommand("write target memory", this.ESP_WRITE_REG, pkt);
    }
    /**
     * Sync chip by sending sync command.
     * @returns {[number, Uint8Array]} Command result
     */ async sync() {
        this.debug("Sync");
        const cmd = new Uint8Array(36);
        let i;
        cmd[0] = 0x07;
        cmd[1] = 0x07;
        cmd[2] = 0x12;
        cmd[3] = 0x20;
        for(i = 0; i < 32; i++)cmd[4 + i] = 0x55;
        try {
            let resp = await this.command(0x08, cmd, undefined, undefined, 100);
            // ROM bootloaders send some non-zero "val" response. The flasher stub sends 0.
            // If we receive 0 then it probably indicates that the chip wasn't or couldn't be
            // reset properly and esptool is talking to the flasher stub.
            this.syncStubDetected = resp[0] === 0;
            for(let i = 0; i < 7; i++){
                resp = await this.readPacket(0x08, 100);
                this.syncStubDetected = this.syncStubDetected && resp[0] === 0;
            }
            return resp;
        } catch (e) {
            this.debug("Sync err " + e);
            throw e;
        }
    }
    /**
     * Attempt to connect to the chip by sending a reset sequence and later a sync command.
     * @param {string} mode - Reset mode to use
     * @param {ResetStrategy} resetStrategy - Reset strategy class to use for connect
     * @returns {string} - Returns 'success' or 'error' message.
     */ async _connectAttempt(mode = "default_reset", resetStrategy) {
        this.debug("_connect_attempt " + mode);
        if (resetStrategy) await resetStrategy.reset();
        const readBytes = this.transport.peek();
        const binaryString = Array.from(readBytes, (byte)=>String.fromCharCode(byte)).join("");
        const regex = /boot:(0x[0-9a-fA-F]+)([\s\S]*?waiting for download)?/;
        const match = binaryString.match(regex);
        let bootLogDetected = false, bootMode = "", downloadMode = false;
        if (match) {
            bootLogDetected = true;
            bootMode = match[1];
            downloadMode = !!match[2];
        }
        this.debug(`bootMode:${bootMode} downloadMode:${downloadMode}`);
        let lastError = "";
        for(let i = 0; i < 5; i++)try {
            this.debug(`Sync connect attempt ${i}`);
            this.transport.flushInput();
            const resp = await this.sync();
            this.debug(resp[0].toString());
            return "success";
        } catch (error) {
            this.debug(`Error at sync ${error}`);
            if (error instanceof Error) lastError = error.message;
            else if (typeof error === "string") lastError = error;
            else lastError = JSON.stringify(error);
        }
        if (bootLogDetected) {
            lastError = `Wrong boot mode detected (${bootMode}).
        This chip needs to be in download mode.`;
            if (downloadMode) lastError = `Download mode successfully detected, but getting no sync reply:
           The serial TX path seems to be down.`;
        }
        return lastError;
    }
    /**
     * True when Web Serial reports Espressif USB-Serial/JTAG VID/PID.
     * Safe before chip identify/sync (no register reads).
     */ isUsbJtagSerialPort() {
        return this.transport.getVid() === $b9be20b2c9078c9b$export$5559d61a150fabe5 && this.transport.getPid() === $b9be20b2c9078c9b$export$2f0304870961b486;
    }
    /**
     * True if the host sees this port as Espressif USB-OTG (VID/PID match).
     * Falls back to the chip UARTDEV_BUF_NO helper when Web Serial omits IDs
     * or the USB product ID was customized.
     */ async usesUsbOtg() {
        const vid = this.transport.getVid();
        const pid = this.transport.getPid();
        if (vid === $b9be20b2c9078c9b$export$5559d61a150fabe5 && this.chip.IMAGE_CHIP_ID != null && pid === this.chip.IMAGE_CHIP_ID) return true;
        if (vid === $b9be20b2c9078c9b$export$5559d61a150fabe5 && pid === $b9be20b2c9078c9b$export$2f0304870961b486) return false;
        if (vid !== undefined && vid !== $b9be20b2c9078c9b$export$5559d61a150fabe5) return false;
        if (typeof this.chip.usesUsbOtg === "function") return await this.chip.usesUsbOtg(this);
        if (typeof this.chip.usingUsbOtg === "function") return await this.chip.usingUsbOtg(this);
        return false;
    }
    /**
     * Cap FLASH_WRITE_SIZE to USB_RAM_BLOCK when the stub is talking over
     * USB-OTG. Matches esptool.py's stub USB buffer limit; USB-Serial/JTAG
     * and USB-UART bridges keep the 16 KB default.
     */ async applyUsbFlashWriteSize() {
        const usbRamBlock = this.chip.USB_RAM_BLOCK;
        if (!usbRamBlock) return;
        if (await this.usesUsbOtg()) {
            this.FLASH_WRITE_SIZE = usbRamBlock;
            this.debug(`Using USB_RAM_BLOCK (0x${usbRamBlock.toString(16)}) for FLASH_WRITE_SIZE (USB-OTG)`);
        }
    }
    /**
     * Constructs a sequence of reset strategies based on the OS,
     * used ESP chip, external settings, and environment variables.
     * Returns a tuple of one or more reset strategies to be tried sequentially.
     * @param {string} mode - Reset mode to use
     * @returns {ResetStrategy[]} - Array of reset strategies
     */ constructResetSequence(mode) {
        if (mode === "no_reset") return [];
        if (mode === "usb_reset" || this.isUsbJtagSerialPort()) // Custom reset sequence, which is required when the device
        // is connecting via its USB-JTAG-Serial peripheral
        {
            if (this.resetConstructors.usbJTAGSerialReset) {
                this.debug("using USB JTAG Serial Reset");
                return [
                    this.resetConstructors.usbJTAGSerialReset(this.transport)
                ];
            }
        } else {
            const DEFAULT_RESET_DELAY = 50;
            const EXTRA_DELAY = DEFAULT_RESET_DELAY + 500;
            if (this.resetConstructors.classicReset) {
                this.debug("using Classic Serial Reset");
                return [
                    this.resetConstructors.classicReset(this.transport, DEFAULT_RESET_DELAY),
                    this.resetConstructors.classicReset(this.transport, EXTRA_DELAY)
                ];
            }
        }
        return [];
    }
    /**
     * Open the serial port and sync with the ROM bootloader.
     * Does not identify the chip.
     * @param {Before} mode - Reset mode to use. Example: 'default_reset' | 'no_reset'
     * @param {number} attempts - Number of connection attempts
     */ async openAndSync(mode, attempts) {
        this.securityInfoCache = null;
        let resp;
        this.info("Connecting...", false);
        await this.transport.connect(this.romBaudrate, this.serialOptions);
        this.transport.readLoop();
        const resetSequences = this.constructResetSequence(mode);
        for(let i = 0; i < attempts; i++){
            const resetSequence = resetSequences.length > 0 ? resetSequences[i % resetSequences.length] : null;
            resp = await this._connectAttempt(mode, resetSequence);
            if (resp === "success") break;
        }
        if (resp !== "success") throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Failed to connect with the device");
        this.debug("Connect attempt successful.");
        this.info("\n\r", false);
    }
    /**
     * Perform a connection to chip.
     * @param {string} mode - Reset mode to use. Example: 'default_reset' | 'no_reset'
     * @param {number} attempts - Number of connection attempts
     * @param {boolean} detecting - Detect the connected chip
     */ async connect(mode = "default_reset", attempts = 7, detecting = true) {
        await this.openAndSync(mode, attempts);
        if (!detecting) return;
        this.info("Detecting chip type... ");
        try {
            this.applyDetectedChip(await this.identifyChip());
        } catch (error) {
            if (error instanceof (0, $f1887d9f177795ef$export$5a2942f5d00ec522) || error instanceof (0, $f1887d9f177795ef$export$edcc68853e16235f)) throw error;
            if (!(error instanceof (0, $f1887d9f177795ef$export$5b519f82636185ec))) throw error;
            this.info(" Autodetection failed, trying again...");
            await this.transport.disconnect();
            await this.openAndSync(mode, attempts);
            this.info("Detecting chip type... ");
            this.applyDetectedChip(await this.identifyChipByMagic());
        }
    }
    /**
     * Identify the connected chip using GET_SECURITY_INFO chip-id, then magic-register fallback.
     * @returns {Promise<ROM>} Detected chip ROM
     */ async identifyChip() {
        try {
            const chipId = await this.getChipId();
            const chip = this.romFromChipId(chipId);
            if (chip === null) throw new (0, $f1887d9f177795ef$export$5a2942f5d00ec522)(chipId);
            await this.readSecureDownloadMode();
            return chip;
        } catch (error) {
            if (error instanceof (0, $f1887d9f177795ef$export$5a2942f5d00ec522)) throw error;
            if (error instanceof (0, $f1887d9f177795ef$export$4bb69fbdc6ba8341) || error instanceof (0, $f1887d9f177795ef$export$70ed0266d0662de6)) this.debug("GET_SECURITY_INFO not supported, falling back to magic value");
            else throw error;
        }
        return this.identifyChipByMagic();
    }
    /**
     * Map a GET_SECURITY_INFO chip ID to a registered ROM instance.
     * @param {number} chipId Chip ID from GET_SECURITY_INFO
     * @returns {ROM | null} Matching ROM, or null if the ID is unknown
     */ romFromChipId(chipId) {
        for (const cls of (0, $7fac5ef4941af15b$export$7bc57576e30c2afc)){
            // ESP8266/ESP32: command unsupported; ESP32-S2: no chip-id in the payload
            if (cls.USES_MAGIC_VALUE) continue;
            if (chipId === cls.IMAGE_CHIP_ID) return cls;
        }
        return null;
    }
    /**
     * Read GET_SECURITY_INFO flags and update secure download mode.
     * @returns {Promise<boolean>} Whether secure download mode is enabled
     */ async readSecureDownloadMode() {
        const securityInfo = await this.getSecurityInfo();
        this.secureDownloadMode = securityInfo.parsedFlags.SECURE_DOWNLOAD_ENABLE;
        return this.secureDownloadMode;
    }
    /**
     * Identify the chip from the magic register, or ESP32-S2 in secure download mode.
     * @returns {Promise<ROM>} Detected chip ROM
     */ async identifyChipByMagic() {
        try {
            return await this.chipFromMagicValue();
        } catch (error) {
            if (error instanceof (0, $f1887d9f177795ef$export$4bb69fbdc6ba8341)) {
                // ESP32-S2 supports GET_SECURITY_INFO but not magic-register reads in SDM
                await this.readSecureDownloadMode();
                return (0, $7fac5ef4941af15b$export$49f2d5f1cbd7dd00).esp32s2;
            }
            throw error;
        }
    }
    /**
     * Store the detected ROM on the loader.
     * @param {ROM} chip Detected chip ROM
     */ applyDetectedChip(chip) {
        this.chip = chip;
        if (chip.SPI_ADDR_REG_MSB !== undefined) this.SPI_ADDR_REG_MSB = chip.SPI_ADDR_REG_MSB;
    }
    async chipFromMagicValue() {
        const chipMagicValue = await this.readReg(this.CHIP_DETECT_MAGIC_REG_ADDR) >>> 0;
        this.debug("Chip Magic " + chipMagicValue.toString(16));
        const chip = await $b9be20b2c9078c9b$var$magic2Chip(chipMagicValue);
        if (chip === null) throw new (0, $f1887d9f177795ef$export$edcc68853e16235f)(chipMagicValue);
        return chip;
    }
    /**
     * Read GET_SECURITY_INFO (0x14): flags, flash crypt count, key purposes, chip id, API version.
     * Tries the 20-byte layout first (ESP32-S3 and later), then 12 bytes (ESP32-S2).
     * @param {boolean} cache Return a previously parsed result when available
     * @returns {Promise<SecurityInfo>} Parsed security information
     */ async getSecurityInfo(cache = true) {
        if (cache && this.securityInfoCache !== null) return this.securityInfoCache;
        let res;
        let esp32s2 = false;
        try {
            res = await this.checkCommand("get security info", this.ESP_GET_SECURITY_INFO, new Uint8Array(0), 0, 20);
        } catch (error) {
            if (error instanceof (0, $f1887d9f177795ef$export$4bb69fbdc6ba8341)) // ESP8266 and ESP32 have no such command, let the caller fall back
            throw error;
            res = await this.checkCommand("get security info", this.ESP_GET_SECURITY_INFO, new Uint8Array(0), 0, 12);
            esp32s2 = true;
        }
        const flags = this._byteArrayToInt(res[0], res[1], res[2], res[3]) >>> 0;
        const securityInfo = {
            flags: flags,
            flashCryptCnt: res[4],
            keyPurposes: Array.from(res.slice(5, 12)),
            chipId: esp32s2 ? null : this._byteArrayToInt(res[12], res[13], res[14], res[15]) >>> 0,
            apiVersion: esp32s2 ? null : this._byteArrayToInt(res[16], res[17], res[18], res[19]) >>> 0,
            parsedFlags: (0, $0760b8d8bf2d6237$export$621d5083132ce967)(flags)
        };
        this.securityInfoCache = securityInfo;
        return securityInfo;
    }
    /**
     * Get the CHIP ID from ESP_GET_SECURITY_INFO.
     * @returns {number} Chip ID number
     */ async getChipId() {
        const chipId = (await this.getSecurityInfo()).chipId;
        if (chipId === null) throw new (0, $f1887d9f177795ef$export$70ed0266d0662de6)();
        this.debug("get_chip_id " + chipId.toString(16));
        return chipId;
    }
    /**
     * Connect and detect the existing chip.
     * @param {string} mode Reset mode to use for connection.
     * @param {number} attempts - Number of connection attempts
     */ async detectChip(mode = "default_reset", attempts = 7) {
        await this.connect(mode, attempts, true);
        if (this.chip != null) this.info(this.chip.CHIP_NAME);
        else this.info("unknown chip! detectchip has failed.");
    }
    /**
     * Execute the command and check the command response.
     * @param {string} opDescription Command operation description.
     * @param {number} op Command operation number
     * @param {Uint8Array} data Command value
     * @param {number} chk Checksum to use
     * @param {number} responseDataLength Length of the response data to expect
     * @param {number} timeout TImeout number in milliseconds (ms)
     * @returns {number} Command result
     */ async checkCommand(opDescription = "", op = null, data = new Uint8Array(0), chk = 0, responseDataLength = 0, timeout = this.DEFAULT_TIMEOUT) {
        this.debug("check_command " + opDescription);
        const STATUS_BYTES_LENGTH = 2;
        const resp = await this.command(op, data, chk, undefined, timeout);
        if (resp && resp[1] && resp[1].length < responseDataLength + STATUS_BYTES_LENGTH) {
            const statusBytes = resp[1].slice(0, 2);
            if (statusBytes[0] !== 0) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Failed to ${opDescription} failed with status ${statusBytes}`);
            else throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Failed to ${opDescription}.\n Only got ${resp[1].length} bytes of data.`);
        }
        const statusBytes = resp[1].slice(responseDataLength, responseDataLength + STATUS_BYTES_LENGTH);
        if (statusBytes[0] !== 0) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Failed to ${opDescription} failed with status ${statusBytes}`);
        if (responseDataLength > 0) return resp[1].slice(0, responseDataLength);
        else return resp[0];
    }
    /**
     * Start downloading an application image to RAM
     * @param {number} size Image size number
     * @param {number} blocks Number of data blocks
     * @param {number} blocksize Size of each data block
     * @param {number} offset Image offset number
     */ async memBegin(size, blocks, blocksize, offset) {
        /* XXX: Add check to ensure that STUB is not getting overwritten */ if (this.IS_STUB) {
            const loadStart = offset;
            const loadEnd = offset + size;
            const chipRevision = this.chip.getChipRevision ? await this.chip.getChipRevision(this) : undefined;
            const stub = await (0, $c14fcc49e58a64cf$export$575862e1d5c85871)(this.chip.CHIP_NAME, chipRevision);
            if (stub) {
                const areasToCheck = [
                    [
                        stub.bss_start || stub.data_start,
                        stub.data_start + stub.decodedData.length
                    ],
                    [
                        stub.text_start,
                        stub.text_start + stub.decodedText.length
                    ]
                ];
                for (const [stubStart, stubEnd] of areasToCheck){
                    if (loadStart < stubEnd && loadEnd > stubStart) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Software loader is resident at 0x${stubStart.toString(16).padStart(8, "0")}-0x${stubEnd.toString(16).padStart(8, "0")}.
            Can't load binary at overlapping address range 0x${loadStart.toString(16).padStart(8, "0")}-0x${loadEnd.toString(16).padStart(8, "0")}.
            Either change binary loading address, or use the no-stub option to disable the software loader.`);
                }
            }
        }
        this.debug("mem_begin " + size + " " + blocks + " " + blocksize + " " + offset.toString(16));
        let pkt = this._appendArray(this._intToByteArray(size), this._intToByteArray(blocks));
        pkt = this._appendArray(pkt, this._intToByteArray(blocksize));
        pkt = this._appendArray(pkt, this._intToByteArray(offset));
        await this.checkCommand("enter RAM download mode", this.ESP_MEM_BEGIN, pkt);
    }
    /**
     * Get the checksum for given unsigned 8-bit array
     * @param {Uint8Array} data Unsigned 8-bit integer array
     * @param {number} state Initial checksum
     * @returns {number} - Array checksum
     */ checksum(data, state = this.ESP_CHECKSUM_MAGIC) {
        for(let i = 0; i < data.length; i++)state ^= data[i];
        return state;
    }
    /**
     * Send a block of image to RAM
     * @param {Uint8Array} buffer Unsigned 8-bit array
     * @param {number} seq Sequence number
     */ async memBlock(buffer, seq) {
        let pkt = this._appendArray(this._intToByteArray(buffer.length), this._intToByteArray(seq));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, buffer);
        const checksum = this.checksum(buffer);
        await this.checkCommand("write to target RAM", this.ESP_MEM_DATA, pkt, checksum);
    }
    /**
     * Leave RAM download mode and run application
     * @param {number} entrypoint - Entrypoint number
     */ async memFinish(entrypoint) {
        const isEntry = entrypoint === 0 ? 1 : 0;
        const pkt = this._appendArray(this._intToByteArray(isEntry), this._intToByteArray(entrypoint));
        await this.checkCommand("leave RAM download mode", this.ESP_MEM_END, pkt, undefined, undefined, 200); // XXX: handle non-stub with diff timeout
    }
    /**
     * Configure SPI flash pins
     * @param {number} hspiArg -  Argument for SPI attachment
     */ async flashSpiAttach(hspiArg) {
        const pkt = this._intToByteArray(hspiArg);
        await this.checkCommand("configure SPI flash pins", this.ESP_SPI_ATTACH, pkt);
    }
    /**
     * Scale timeouts which are size-specific.
     * @param {number} secondsPerMb Seconds per megabytes as number
     * @param {number} sizeBytes Size bytes number
     * @returns {number} - Scaled timeout for specified size.
     */ timeoutPerMb(secondsPerMb, sizeBytes) {
        const result = secondsPerMb * (sizeBytes / 1000000);
        if (result < 3000) return 3000;
        else return result;
    }
    /**
     * Start downloading to Flash (performs an erase)
     * @param {number} size Size to erase
     * @param {number} offset Offset to erase
     * @returns {number} Number of blocks (of size self.FLASH_WRITE_SIZE) to write.
     */ async flashBegin(size, offset) {
        const numBlocks = Math.floor((size + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
        const eraseSize = this.chip.getEraseSize(offset, size);
        const d = new Date();
        const t1 = d.getTime();
        let timeout = 3000;
        if (this.IS_STUB == false) timeout = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, size);
        this.debug("flash begin " + eraseSize + " " + numBlocks + " " + this.FLASH_WRITE_SIZE + " " + offset + " " + size);
        let pkt = this._appendArray(this._intToByteArray(eraseSize), this._intToByteArray(numBlocks));
        pkt = this._appendArray(pkt, this._intToByteArray(this.FLASH_WRITE_SIZE));
        pkt = this._appendArray(pkt, this._intToByteArray(offset));
        if (this.IS_STUB == false) pkt = this._appendArray(pkt, this._intToByteArray(0)); // XXX: Support encrypted
        await this.checkCommand("enter Flash download mode", this.ESP_FLASH_BEGIN, pkt, undefined, undefined, timeout);
        const t2 = d.getTime();
        if (size != 0 && this.IS_STUB == false) this.info("Took " + (t2 - t1) / 1000 + "." + (t2 - t1) % 1000 + "s to erase flash block");
        return numBlocks;
    }
    /**
     * Start downloading compressed data to Flash (performs an erase)
     * @param {number} size Write size
     * @param {number} compsize Compressed size
     * @param {number} offset Offset for write
     * @returns {number} Returns number of blocks (size self.FLASH_WRITE_SIZE) to write.
     */ async flashDeflBegin(size, compsize, offset) {
        const numBlocks = Math.floor((compsize + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
        const eraseBlocks = Math.floor((size + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE);
        const d = new Date();
        const t1 = d.getTime();
        let writeSize, timeout;
        if (this.IS_STUB) {
            writeSize = size;
            timeout = this.DEFAULT_TIMEOUT;
        } else {
            writeSize = eraseBlocks * this.FLASH_WRITE_SIZE;
            timeout = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, writeSize);
        }
        this.info("Compressed " + size + " bytes to " + compsize + "...");
        let pkt = this._appendArray(this._intToByteArray(writeSize), this._intToByteArray(numBlocks));
        pkt = this._appendArray(pkt, this._intToByteArray(this.FLASH_WRITE_SIZE));
        pkt = this._appendArray(pkt, this._intToByteArray(offset));
        if ((this.chip.CHIP_NAME === "ESP32-S2" || this.chip.CHIP_NAME === "ESP32-S3" || this.chip.CHIP_NAME === "ESP32-C3" || this.chip.CHIP_NAME === "ESP32-C2") && this.IS_STUB === false) pkt = this._appendArray(pkt, this._intToByteArray(0));
        await this.checkCommand("enter compressed flash mode", this.ESP_FLASH_DEFL_BEGIN, pkt, undefined, undefined, timeout);
        const t2 = d.getTime();
        if (size != 0 && this.IS_STUB === false) this.info("Took " + (t2 - t1) / 1000 + "." + (t2 - t1) % 1000 + "s to erase flash block");
        return numBlocks;
    }
    /**
     * Write block to flash, retry up to WRITE_BLOCK_ATTEMPTS times on failure.
     * @param {Uint8Array} data Unsigned 8-bit array data.
     * @param {number} seq Sequence number
     * @param {number} timeout Timeout in milliseconds (ms)
     * @returns {Promise<void>} Promise that resolves when the block is written.
     */ async flashBlock(data, seq, timeout) {
        let pkt = this._appendArray(this._intToByteArray(data.length), this._intToByteArray(seq));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, data);
        const checksum = this.checksum(data);
        for(let attemptsLeft = this.WRITE_BLOCK_ATTEMPTS - 1; attemptsLeft >= 0; attemptsLeft--)try {
            await this.checkCommand("write to target Flash after seq " + seq, this.ESP_FLASH_DATA, pkt, checksum, undefined, timeout);
            return;
        } catch (e) {
            if (attemptsLeft === 0) throw e;
            this.debug(`Block ${seq} write failed (${e}), retrying with ${attemptsLeft} attempts left...`);
            await (0, $216eff205ef04904$export$e772c8ff12451969)(this.WRITE_BLOCK_RETRY_DELAY_MS);
        }
    }
    /**
     * Write compressed block to flash, retry up to WRITE_BLOCK_ATTEMPTS times on failure.
     * @param {Uint8Array} data Unsigned int 8-bit array data to write
     * @param {number} seq Sequence number
     * @param {number} timeout Timeout in milliseconds (ms)
     */ async flashDeflBlock(data, seq, timeout) {
        let pkt = this._appendArray(this._intToByteArray(data.length), this._intToByteArray(seq));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, data);
        const checksum = this.checksum(data);
        this.debug(`flash_defl_block ${Array.from(data.slice(0, 2)).map((b)=>b.toString(16)).join(" ")}`);
        for(let attemptsLeft = this.WRITE_BLOCK_ATTEMPTS - 1; attemptsLeft >= 0; attemptsLeft--)try {
            await this.checkCommand("write compressed data to flash after seq " + seq, this.ESP_FLASH_DEFL_DATA, pkt, checksum, undefined, timeout);
            return;
        } catch (e) {
            if (attemptsLeft === 0) throw e;
            this.debug(`Compressed block ${seq} write failed (${e}), retrying with ${attemptsLeft} attempts left...`);
            await (0, $216eff205ef04904$export$e772c8ff12451969)(this.WRITE_BLOCK_RETRY_DELAY_MS);
        }
    }
    /**
     * Leave flash mode and run/reboot
     * @param {boolean} reboot Reboot after leaving flash mode ?
     * @param {number} timeout Timeout in milliseconds (ms)
     * @returns {Promise<void>} Promise that resolves when the flash mode is left.
     */ async flashFinish(reboot = false, timeout = this.DEFAULT_TIMEOUT) {
        const val = reboot ? 0 : 1;
        const pkt = this._intToByteArray(val);
        await this.checkCommand("leave Flash mode", this.ESP_FLASH_END, pkt, undefined, undefined, timeout);
    }
    /**
     * Leave compressed flash mode and run/reboot
     * @param {boolean} reboot Reboot after leaving flash mode ?
     * @param {number} timeout Timeout in milliseconds (ms)
     * @returns {Promise<void>} Promise that resolves when the compressed flash mode is left.
     */ async flashDeflFinish(reboot = false, timeout = this.DEFAULT_TIMEOUT) {
        const val = reboot ? 0 : 1;
        const pkt = this._intToByteArray(val);
        await this.checkCommand("leave compressed flash mode", this.ESP_FLASH_DEFL_END, pkt, undefined, undefined, timeout);
    }
    /**
     * Run an arbitrary SPI flash command.
     *
     * This function uses the "USR_COMMAND" functionality in the ESP
     * SPI hardware, rather than the precanned commands supported by
     * hardware. So the value of spiflashCommand is an actual command
     * byte, sent over the wire.
     *
     * After writing command byte, writes 'data' to MOSI and then
     * reads back 'readBits' of reply on MISO. Result is a number.
     * @param {number} spiflashCommand Command to execute in SPI
     * @param {Uint8Array} data Data to send
     * @param {number} readBits Number of bits to read
     * @param {number} addr Address to use
     * @param {number} addrLen Length of address
     * @param {number} dummyLen length of dummy
     * @returns {number} Register SPI_W0_REG value
     */ async runSpiflashCommand(spiflashCommand, data, readBits, addr = null, addrLen = 0, dummyLen = 0) {
        // SPI_USR register flags
        const SPI_USR_COMMAND = -2147483648;
        const SPI_USR_ADDR = 1073741824;
        const SPI_USR_DUMMY = 536870912;
        const SPI_USR_MISO = 268435456;
        const SPI_USR_MOSI = 134217728;
        // SPI registers, base address differs ESP32* vs 8266
        const base = this.chip.SPI_REG_BASE;
        const SPI_CMD_REG = base + 0x00;
        const SPI_ADDR_REG = base + 0x04;
        const SPI_USR_REG = base + this.chip.SPI_USR_OFFS;
        const SPI_USR1_REG = base + this.chip.SPI_USR1_OFFS;
        const SPI_USR2_REG = base + this.chip.SPI_USR2_OFFS;
        const SPI_W0_REG = base + this.chip.SPI_W0_OFFS;
        let setDataLengths;
        if (this.chip.SPI_MOSI_DLEN_OFFS != null) setDataLengths = async (mosiBits, misoBits)=>{
            const SPI_MOSI_DLEN_REG = base + this.chip.SPI_MOSI_DLEN_OFFS;
            const SPI_MISO_DLEN_REG = base + this.chip.SPI_MISO_DLEN_OFFS;
            if (mosiBits > 0) await this.writeReg(SPI_MOSI_DLEN_REG, mosiBits - 1);
            if (misoBits > 0) await this.writeReg(SPI_MISO_DLEN_REG, misoBits - 1);
            let flags = 0;
            if (dummyLen > 0) flags |= dummyLen - 1;
            if (addrLen > 0) flags |= addrLen - 1 << SPI_USR_ADDR_LEN_SHIFT;
            if (flags) await this.writeReg(SPI_USR1_REG, flags);
        };
        else setDataLengths = async (mosiBits, misoBits)=>{
            const SPI_DATA_LEN_REG = SPI_USR1_REG;
            const SPI_MOSI_BITLEN_S = 17;
            const SPI_MISO_BITLEN_S = 8;
            const mosiMask = mosiBits === 0 ? 0 : mosiBits - 1;
            const misoMask = misoBits === 0 ? 0 : misoBits - 1;
            let flags = misoMask << SPI_MISO_BITLEN_S | mosiMask << SPI_MOSI_BITLEN_S;
            if (dummyLen > 0) flags |= dummyLen - 1;
            if (addrLen > 0) flags |= addrLen - 1 << SPI_USR_ADDR_LEN_SHIFT;
            await this.writeReg(SPI_DATA_LEN_REG, flags);
        };
        const SPI_CMD_USR = 262144;
        const SPI_USR2_COMMAND_LEN_SHIFT = 28;
        const SPI_USR_ADDR_LEN_SHIFT = 26;
        if (readBits > 32) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Reading more than 32 bits back from a SPI flash operation is unsupported");
        if (data.length > 64) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Writing more than 64 bytes of data with one SPI command is unsupported");
        const dataBits = data.length * 8;
        const oldSpiUsr = await this.readReg(SPI_USR_REG);
        const oldSpiUsr2 = await this.readReg(SPI_USR2_REG);
        let flags = SPI_USR_COMMAND;
        if (readBits > 0) flags |= SPI_USR_MISO;
        if (dataBits > 0) flags |= SPI_USR_MOSI;
        if (addrLen > 0) flags |= SPI_USR_ADDR;
        if (dummyLen > 0) flags |= SPI_USR_DUMMY;
        await setDataLengths(dataBits, readBits);
        await this.writeReg(SPI_USR_REG, flags);
        let val = 7 << SPI_USR2_COMMAND_LEN_SHIFT | spiflashCommand;
        await this.writeReg(SPI_USR2_REG, val);
        if (addr && addrLen > 0) {
            if (this.SPI_ADDR_REG_MSB) addr = addr << 32 - addrLen;
            await this.writeReg(SPI_ADDR_REG, addr);
        }
        if (dataBits == 0) await this.writeReg(SPI_W0_REG, 0);
        else {
            data = (0, $216eff205ef04904$export$fcbe1efa6919329)(data, 4, 0x00);
            const words = [];
            for(let i = 0; i < data.length; i += 4)words.push((data[i] | data[i + 1] << 8 | data[i + 2] << 16 | data[i + 3] << 24) >>> 0);
            let nextReg = SPI_W0_REG;
            for (const word of words){
                await this.writeReg(nextReg, word);
                nextReg += 4;
            }
        }
        await this.writeReg(SPI_CMD_REG, SPI_CMD_USR);
        // wait done function
        let i;
        for(i = 0; i < 10; i++){
            val = await this.readReg(SPI_CMD_REG) & SPI_CMD_USR;
            if (val == 0) break;
        }
        if (i === 10) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("SPI command did not complete in time");
        const status = await this.readReg(SPI_W0_REG);
        await this.writeReg(SPI_USR_REG, oldSpiUsr);
        await this.writeReg(SPI_USR2_REG, oldSpiUsr2);
        return status;
    }
    /**
     * Read flash id by executing the SPIFLASH_RDID flash command.
     * @returns {Promise<number>} Register SPI_W0_REG value
     */ async readFlashId() {
        const SPIFLASH_RDID = 0x9f;
        const pkt = new Uint8Array(0);
        return await this.runSpiflashCommand(SPIFLASH_RDID, pkt, 24);
    }
    /**
     * Execute the erase flash command
     * @returns {Promise<number | Uint8Array>} Erase flash command result
     */ async eraseFlash() {
        this.info("Erasing flash (this may take a while)...");
        let d = new Date();
        const t1 = d.getTime();
        const ret = await this.checkCommand("erase flash", this.ESP_ERASE_FLASH, undefined, undefined, undefined, this.CHIP_ERASE_TIMEOUT);
        d = new Date();
        const t2 = d.getTime();
        this.info("Chip erase completed successfully in " + (t2 - t1) / 1000 + "s");
        return ret;
    }
    /**
     * Convert a number or unsigned 8-bit array to hex string
     * @param {number | Uint8Array } buffer Data to convert to hex string.
     * @returns {string} A hex string
     */ toHex(buffer) {
        return Array.prototype.map.call(buffer, (x)=>("00" + x.toString(16)).slice(-2)).join("");
    }
    /**
     * Calculate the MD5 Checksum command
     * @param {number} addr Address number
     * @param {number} size Package size
     * @returns {string} MD5 Checksum string
     */ async flashMd5sum(addr, size) {
        const timeout = this.timeoutPerMb(this.MD5_TIMEOUT_PER_MB, size);
        let pkt = this._appendArray(this._intToByteArray(addr), this._intToByteArray(size));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        pkt = this._appendArray(pkt, this._intToByteArray(0));
        const RESP_DATA_LEN = 32;
        const RESP_DATA_LEN_STUB = 16;
        const RESP_DATA_LEN_TO_USE = this.IS_STUB ? RESP_DATA_LEN_STUB : RESP_DATA_LEN;
        const res = await this.checkCommand("calculate md5sum", this.ESP_SPI_FLASH_MD5, pkt, undefined, RESP_DATA_LEN_TO_USE, timeout);
        const strmd5 = this.toHex(res);
        return strmd5;
    }
    /**
     * Read data from flash memory of the chip.
     * This function reads a specified amount of data from the flash memory starting at a given address.
     * It sends a read command to the chip and processes the response packets until the requested size is read.
     * @param {number} addr - The starting address in flash memory to read from.
     * @param {number} size - The number of bytes to read from flash memory.
     * @param {FlashReadCallback} onPacketReceived - Optional callback function to handle each received packet.
     * @returns {Promise<Uint8Array>} A promise that resolves to the data read from flash memory as a Uint8Array.
     * @throws {ESPError} If the read operation fails or an unexpected response is received.
     */ async readFlash(addr, size, onPacketReceived = null) {
        let pkt = this._appendArray(this._intToByteArray(addr), this._intToByteArray(size));
        pkt = this._appendArray(pkt, this._intToByteArray(0x1000));
        pkt = this._appendArray(pkt, this._intToByteArray(1024));
        const res = await this.checkCommand("read flash", this.ESP_READ_FLASH, pkt);
        if (res != 0) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Failed to read memory: " + res);
        let resp = new Uint8Array(0);
        while(resp.length < size){
            const packet = await this.transport.read(this.FLASH_READ_TIMEOUT);
            if (packet instanceof Uint8Array) {
                if (packet.length > 0) {
                    resp = this._appendArray(resp, packet);
                    await this.transport.write(this._intToByteArray(resp.length));
                    if (onPacketReceived) onPacketReceived(packet, resp.length, size);
                }
            } else throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Failed to read memory: " + packet);
        }
        return resp;
    }
    /**
     * Upload the flasher ROM bootloader (flasher stub) to the chip.
     * @returns {ROM} The Chip ROM
     */ async runStub() {
        if (this.syncStubDetected) {
            this.info("Stub is already running. No upload is necessary.");
            this.IS_STUB = true;
            await this.applyUsbFlashWriteSize();
            return this.chip;
        }
        if (this.secureDownloadMode) {
            this.info("Stub flasher is not supported in Secure Download Mode, it has been disabled.");
            return this.chip;
        }
        const chipRevision = this.chip.getChipRevision ? await this.chip.getChipRevision(this) : undefined;
        const stubFlasher = await (0, $c14fcc49e58a64cf$export$575862e1d5c85871)(this.chip.CHIP_NAME, chipRevision);
        if (stubFlasher === undefined) {
            this.info(`Stub flasher is not yet supported on ${this.chip.CHIP_NAME}, it has been disabled.`);
            return this.chip;
        }
        this.info("Uploading stub...");
        const stub = [
            stubFlasher.decodedText,
            stubFlasher.decodedData
        ];
        for(let i = 0; i < stub.length; i++)if (stub[i]) {
            const offs = i === 0 ? stubFlasher.text_start : stubFlasher.data_start;
            const length = stub[i].length;
            const blocks = Math.floor((length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
            await this.memBegin(length, blocks, this.ESP_RAM_BLOCK, offs);
            for(let seq = 0; seq < blocks; seq++){
                const fromOffs = seq * this.ESP_RAM_BLOCK;
                const toOffs = fromOffs + this.ESP_RAM_BLOCK;
                await this.memBlock(stub[i].slice(fromOffs, toOffs), seq);
            }
        }
        this.info("Running stub...");
        await this.memFinish(stubFlasher.entry);
        const packetResult = await this.transport.read(this.DEFAULT_TIMEOUT);
        const packetStr = String.fromCharCode(...packetResult);
        if (packetStr !== "OHAI") throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Failed to start stub. Unexpected response ${packetStr}`);
        this.info("Stub running...");
        this.IS_STUB = true;
        await this.applyUsbFlashWriteSize();
        return this.chip;
    }
    /**
     * Probe whether the chip still answers a register read.
     * Used after a baud-rate port reopen; sync() is unsuitable because the stub
     * answers SYNC once, not eight times like the ROM.
     */ async isResponsive(attempts = 2) {
        for(let i = 0; i < attempts; i++)try {
            await this.readReg(this.CHIP_DETECT_MAGIC_REG_ADDR, 500);
            return true;
        } catch (error) {
            this.debug(`Responsiveness probe failed: ${error}`);
            this.transport.flushInput();
        }
        return false;
    }
    /**
     * Change the chip baudrate.
     */ async changeBaud() {
        if (this.secureDownloadMode) {
            this.info("Baud rate change is not supported in secure download mode. Keeping 115200 baud.");
            return;
        }
        this.info("Changing baudrate to " + this.baudrate);
        const secondArg = this.IS_STUB ? this.romBaudrate : 0;
        const pkt = this._appendArray(this._intToByteArray(this.baudrate), this._intToByteArray(secondArg));
        await this.command(this.ESP_CHANGE_BAUDRATE, pkt);
        this.info("Changed");
        this.info("If the chip does not respond to any further commands, consider using a lower baud rate.");
        await (0, $216eff205ef04904$export$e772c8ff12451969)(50);
        this.securityInfoCache = null;
        let portReopened = false;
        let baudChangeError;
        try {
            portReopened = await this.transport.changeBaudrate(this.baudrate, this.serialOptions);
        } catch (error) {
            baudChangeError = error;
            this.debug(`Host baud-rate change failed: ${error}`);
        }
        await this.transport.drainInput();
        if (!baudChangeError && await this.isResponsive()) return;
        if (baudChangeError) this.info(`Unable to use ${this.baudrate} baud. Continuing at ${this.romBaudrate} baud.`);
        else if (portReopened) this.info(`The board reset while the serial port was reopened. Continuing at ${this.romBaudrate} baud.`);
        else this.info(`The board stopped responding after changing baud rate. Continuing at ${this.romBaudrate} baud.`);
        await this.transport.disconnect();
        await (0, $216eff205ef04904$export$e772c8ff12451969)(50);
        this.baudrate = this.romBaudrate;
        this.IS_STUB = false;
        await this.connect("default_reset", 7, false);
        // The reset dropped whatever main() set up before the stub; redo it as main() does.
        if (typeof this.chip.postConnect != "undefined") await this.chip.postConnect(this);
        await this.runStub();
    }
    /**
     * Execute the main function of ESPLoader.
     * @param {string} mode Reset mode to use
     * @returns {string} chip ROM
     */ async main(mode = "default_reset") {
        await this.detectChip(mode);
        let chip;
        if (this.secureDownloadMode) {
            this.info("WARNING: Connected chip is in Secure Download Mode. Register reads (chip description, features, MAC) are not supported.");
            chip = this.chip.CHIP_NAME;
            this.info("Chip is " + chip);
        } else {
            chip = await this.chip.getChipDescription(this);
            if (this.chip.getChipRevision) {
                const chipRevision = await this.chip.getChipRevision(this);
                this.info("Chip Revision: " + chipRevision);
            }
            this.info("Chip is " + chip);
            this.info("Features: " + await this.chip.getChipFeatures(this));
            this.info("Crystal is " + await this.chip.getCrystalFreq(this) + "MHz");
            this.info("MAC: " + await this.chip.readMac(this));
            await this.chip.readMac(this);
            if (typeof this.chip.postConnect != "undefined") await this.chip.postConnect(this);
        }
        await this.runStub();
        if (this.romBaudrate !== this.baudrate) await this.changeBaud();
        if (!this.secureDownloadMode) // Check flash chip connection (SPI register ops are unsupported in SDM)
        try {
            const flashId = await this.readFlashId();
            this.info("Flash ID: " + flashId.toString(16));
            if (flashId === 0xffffff || flashId === 0x000000) this.info(`WARNING: Failed to communicate with the flash chip,\nread/write operations will fail.\nTry checking the chip connections or removing\nany other hardware connected to IOs.`);
        } catch (error) {
            throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Unable to verify flash chip connection " + error);
        }
        return chip;
    }
    /**
     * Get flash size bytes from flash size string.
     * @param {string} flashSize Flash Size string
     * @returns {number} Flash size bytes
     */ flashSizeBytes(flashSize) {
        let flashSizeB = -1;
        this.transport.trace(`Flash size string ${flashSize}`);
        if (flashSize.toString().indexOf("KB") !== -1) flashSizeB = parseInt(flashSize.toString().slice(0, flashSize.toString().indexOf("KB"))) * 1024;
        else if (flashSize.toString().indexOf("MB") !== -1) flashSizeB = parseInt(flashSize.toString().slice(0, flashSize.toString().indexOf("MB"))) * 1048576;
        this.transport.trace(`Flash size in bytes ${flashSizeB}`);
        return flashSizeB;
    }
    /**
     * Parse a given flash size string to a number
     * @param {string} flsz Flash size to request
     * @returns {number} Flash size number
     */ parseFlashSizeArg(flsz) {
        if (typeof this.chip.FLASH_SIZES[flsz] === "undefined") throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Flash size " + flsz + " is not supported by this chip type. Supported sizes: " + this.chip.FLASH_SIZES);
        return this.chip.FLASH_SIZES[flsz];
    }
    /**
     * Update the image flash parameters with given arguments.
     * @param {Uint8Array} image binary image as Uint8Array
     * @param {number} address flash address number
     * @param {FlashModeValues} flashMode Flash mode string
     * @param {FlashFreqValues} flashFreq Flash frequency string
     * @param {FlashSizeValues} flashSize Already-resolved flash size (`"keep"` or a concrete size such as `"8MB"`).
     * `"detect"` is not accepted here; resolve it in `writeFlash` first.
     * @returns {Uint8Array} modified image Uint8Array
     */ async _updateImageFlashParams(image, address, flashMode = "keep", flashFreq = "keep", flashSize = "keep") {
        this.debug(`_update_image_flash_params ${flashSize} ${flashMode} ${flashFreq}`);
        if (image.length < 8) return image;
        if (address != this.chip.BOOTLOADER_FLASH_OFFSET) return image;
        if (flashSize === "keep" && flashMode === "keep" && flashFreq === "keep") {
            this.info("Not changing the image");
            return image;
        }
        const magic = image[0];
        let aFlashMode = image[2];
        const flashSizeFreq = image[3];
        if (magic !== this.ESP_IMAGE_MAGIC) {
            this.info("Warning: Image file at 0x" + address.toString(16) + " doesn't look like an image file, so not changing any flash settings.");
            return image;
        }
        // Verify this is a valid image
        try {
            const imageObject = await (0, $25d8e6fcf26795d1$export$cd945b8ec6c09481)(this.chip, image);
            imageObject.verify();
        } catch (error) {
            this.debug(`Warning: Image file at 0x${address.toString(16)} is not a valid ${this.chip.CHIP_NAME} image, so not changing any flash settings.`);
            return image;
        }
        const shaAppended = this.chip.CHIP_NAME !== "ESP8266" && image[23] === 0x31; // '1' character code
        if (flashMode !== "keep") {
            const flashModes = {
                qio: 0,
                qout: 1,
                dio: 2,
                dout: 3
            };
            aFlashMode = flashModes[flashMode];
        }
        let aFlashFreq = flashSizeFreq & 0x0f;
        if (flashFreq !== "keep") {
            const flashFreqs = {
                "40m": 0,
                "26m": 1,
                "20m": 2,
                "80m": 0xf
            };
            aFlashFreq = flashFreqs[flashFreq];
        }
        let aFlashSize = flashSizeFreq & 0xf0;
        if (flashSize !== "keep") aFlashSize = this.parseFlashSizeArg(flashSize);
        const flashParams = aFlashMode << 8 | aFlashFreq + aFlashSize;
        this.info("Flash params set to " + flashParams.toString(16));
        // Create a copy of the image to modify
        const updatedImage = new Uint8Array(image);
        // Flash mode is stored as a single byte at offset 2
        if (image[2] !== aFlashMode) updatedImage[2] = aFlashMode;
        // Flash size and frequency are combined in a single byte at offset 3
        if (image[3] !== aFlashFreq + aFlashSize) updatedImage[3] = aFlashFreq + aFlashSize;
        // Recalculate SHA digest if needed
        if (shaAppended) {
            // Create image object to get data length
            const imageObject = await (0, $25d8e6fcf26795d1$export$cd945b8ec6c09481)(this.chip, updatedImage);
            // Get the image data before SHA digest
            const imageDataBeforeSha = updatedImage.slice(0, imageObject.datalength);
            // Get the image data after SHA digest
            const imageDataAfterSha = updatedImage.slice(imageObject.datalength + imageObject.SHA256_DIGEST_LEN);
            // Calculate new SHA digest
            const shaDigestCalculated = await crypto.subtle.digest("SHA-256", imageDataAfterSha);
            const shaDigestCalculatedUintArray = new Uint8Array(shaDigestCalculated);
            // Combine all parts
            const finalImage = new Uint8Array(imageDataBeforeSha.length + shaDigestCalculatedUintArray.length + imageDataAfterSha.length);
            finalImage.set(imageDataBeforeSha, 0);
            finalImage.set(shaDigestCalculatedUintArray, imageDataBeforeSha.length);
            finalImage.set(imageDataAfterSha, imageDataBeforeSha.length + shaDigestCalculatedUintArray.length);
            // Get the SHA digest stored in the image
            const imageStoredSha = finalImage.slice(imageObject.datalength, imageObject.datalength + imageObject.SHA256_DIGEST_LEN);
            // Compare calculated and stored SHA digests
            if (this.transport.hexify(shaDigestCalculatedUintArray) === this.transport.hexify(imageStoredSha)) this.info("SHA digest in image updated");
            else this.info("WARNING: SHA recalculation for binary failed!\n" + `\tExpected calculated SHA: ${this.transport.hexify(shaDigestCalculatedUintArray)}\n` + `\tSHA stored in binary:    ${this.transport.hexify(imageStoredSha)}`);
            return finalImage;
        }
        return updatedImage;
    }
    /**
     * Write set of file images into given address based on given FlashOptions object.
     * When `options.flashSize` is `"detect"`, the flash ID is read before any file is written
     * (including images that are not at `BOOTLOADER_FLASH_OFFSET`) so the bounds check can
     * use a concrete size. Throws if the flash ID cannot be read or mapped.
     * @param {FlashOptions} options FlashOptions to configure how and what to write into flash.
     */ async writeFlash(options) {
        this.debug("EspLoader program");
        for(let i = 0; i < options.fileArray.length; i++){
            if (!(options.fileArray[i].data instanceof Uint8Array)) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`File ${i + 1} data must be a Uint8Array`);
        }
        let resolvedFlashSize = options.flashSize;
        if (options.flashSize === "detect") {
            this.info("Configuring flash size...");
            const detectedFlashSize = await this.detectFlashSize();
            if (!detectedFlashSize) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Could not auto-detect Flash size. Set flash size explicitly or check the flash connection.");
            this.info("Detected flash size set to " + detectedFlashSize);
            resolvedFlashSize = detectedFlashSize;
        }
        if (resolvedFlashSize !== "keep") {
            const flashEnd = this.flashSizeBytes(resolvedFlashSize);
            if (flashEnd < 0) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Invalid flash size: ${resolvedFlashSize}`);
            for(let i = 0; i < options.fileArray.length; i++){
                if (options.fileArray[i].data.length + options.fileArray[i].address > flashEnd) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`File ${i + 1} doesn't fit in the available flash`);
            }
        }
        if (this.IS_STUB === true && options.eraseAll === true) await this.eraseFlash();
        let image, address;
        for(let i = 0; i < options.fileArray.length; i++){
            this.debug("Data Length " + options.fileArray[i].data.length);
            image = options.fileArray[i].data;
            this.debug("Image Length " + image.length);
            if (image.length === 0) {
                this.debug("Warning: File is empty");
                continue;
            }
            image = (0, $216eff205ef04904$export$fcbe1efa6919329)(image, 4);
            address = options.fileArray[i].address;
            image = await this._updateImageFlashParams(image, address, options.flashMode, options.flashFreq, resolvedFlashSize);
            let calcmd5 = null;
            if (options.calculateMD5Hash) {
                calcmd5 = options.calculateMD5Hash(image);
                this.debug("Image MD5 " + calcmd5);
            }
            const uncsize = image.length;
            let blocks;
            if (options.compress) {
                const compressedImage = (0, $2438585bd7e1d91e$export$2316623ecd1285ab)(image, {
                    level: 9
                });
                // deflate returns Uint8Array, use it directly
                image = compressedImage;
                blocks = await this.flashDeflBegin(uncsize, image.length, address);
            } else blocks = await this.flashBegin(uncsize, address);
            let seq = 0;
            let bytesSent = 0;
            const totalBytes = image.length;
            if (options.reportProgress) options.reportProgress(i, 0, totalBytes);
            let d = new Date();
            const t1 = d.getTime();
            let timeout = 5000;
            // Create a decompressor to keep track of the size of uncompressed data
            // to be written in each chunk.
            const inflate = new (0, $2438585bd7e1d91e$export$d1de70a877d6e43c)({
                chunkSize: 1
            });
            let totalLenUncompressed = 0;
            inflate.onData = function(chunk) {
                totalLenUncompressed += chunk.byteLength;
            };
            let imageOffset = 0;
            while(imageOffset < image.length){
                this.debug("Write loop " + address + " " + seq + " " + blocks);
                this.info("Writing at 0x" + (address + (options.compress ? totalLenUncompressed : bytesSent)).toString(16) + "... (" + Math.floor(100 * (seq + 1) / blocks) + "%)");
                const blockSize = Math.min(this.FLASH_WRITE_SIZE, image.length - imageOffset);
                const block = image.slice(imageOffset, imageOffset + blockSize);
                const isLastBlock = imageOffset + blockSize >= image.length;
                if (options.compress) {
                    const lenUncompressedPrevious = totalLenUncompressed;
                    inflate.push(block, isLastBlock);
                    const blockUncompressed = totalLenUncompressed - lenUncompressedPrevious;
                    let blockTimeout = 3000;
                    if (this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, blockUncompressed) > 3000) blockTimeout = this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, blockUncompressed);
                    if (this.IS_STUB === false) // ROM code writes block to flash before ACKing
                    timeout = blockTimeout;
                    await this.flashDeflBlock(block, seq, timeout);
                    if (this.IS_STUB) // Stub ACKs when block is received, then writes to flash while receiving the block after it
                    timeout = blockTimeout;
                } else {
                    // Last block is padded to FLASH_WRITE_SIZE with 0xFF, matching esptool.py.
                    let dataToSend = block;
                    if (block.length < this.FLASH_WRITE_SIZE) {
                        dataToSend = new Uint8Array(this.FLASH_WRITE_SIZE).fill(0xff);
                        dataToSend.set(block);
                    }
                    let blockTimeout = 3000;
                    if (this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, dataToSend.length) > 3000) blockTimeout = this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, dataToSend.length);
                    if (this.IS_STUB === false) timeout = blockTimeout;
                    await this.flashBlock(dataToSend, seq, timeout);
                    if (this.IS_STUB) timeout = blockTimeout;
                }
                bytesSent += block.length;
                imageOffset += blockSize;
                seq++;
                if (options.reportProgress) options.reportProgress(i, bytesSent, totalBytes);
            }
            if (this.IS_STUB) {
                if (options.compress) await this.flashDeflFinish(false, timeout);
                else await this.flashFinish(false, timeout);
            }
            d = new Date();
            const t = d.getTime() - t1;
            if (options.compress) this.info("Wrote " + uncsize + " bytes (" + bytesSent + " compressed) at 0x" + address.toString(16) + " in " + t / 1000 + " seconds.");
            else this.info("Wrote " + bytesSent + " bytes at 0x" + address.toString(16) + " in " + t / 1000 + " seconds.");
            if (calcmd5) {
                this.info("File  md5: " + calcmd5);
                const res = await this.flashMd5sum(address, uncsize);
                this.info("Flash md5: " + res);
                if (new String(res).valueOf() != new String(calcmd5).valueOf()) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("MD5 of file does not match data in flash!");
                else this.info("Hash of data verified.");
            }
        }
        this.info("Leaving...");
    }
    /**
     * Read SPI flash manufacturer and device id.
     */ async flashId() {
        this.debug("flash_id");
        const flashid = await this.readFlashId();
        this.info("Manufacturer: " + (flashid & 0xff).toString(16));
        const flidLowbyte = flashid >> 16 & 0xff;
        this.info("Device: " + (flashid >> 8 & 0xff).toString(16) + flidLowbyte.toString(16));
        this.info("Detected flash size: " + this.DETECTED_FLASH_SIZES[flidLowbyte]);
    }
    /**
     * Detect attached flash size from the SPI flash ID.
     * @returns {Promise<string | undefined>} Detected size string, or undefined if the flash ID could not be read / mapped.
     */ async detectFlashSize() {
        this.debug("detectFlashSize");
        const flashid = await this.readFlashId();
        const sizeId = flashid >> 16 & 0xff;
        const flashSizeStr = this.DETECTED_FLASH_SIZES[sizeId];
        if (!flashSizeStr) {
            this.info("Could not auto-detect Flash size");
            return undefined;
        }
        this.info("Auto-detected Flash size: " + flashSizeStr);
        return flashSizeStr;
    }
    /**
     * Soft reset the device chip. Soft reset with run user code is the closest.
     * @param {boolean} stayInBootloader Flag to indicate if to stay in bootloader
     */ async softReset(stayInBootloader) {
        if (!this.IS_STUB) {
            if (stayInBootloader) return; // ROM bootloader is already in bootloader!
            // "run user code" is as close to a soft reset as we can do
            await this.flashBegin(0, 0);
            await this.flashFinish(false);
        } else if (this.chip.CHIP_NAME != "ESP8266") throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)("Soft resetting is currently only supported on ESP8266");
        else if (stayInBootloader) {
            // soft resetting from the stub loader
            // will re-load the ROM bootloader
            await this.flashBegin(0, 0);
            await this.flashFinish(true);
        } else // running user code from stub loader requires some hacks
        // in the stub loader
        await this.command(this.ESP_RUN_USER_CODE, undefined, undefined, false);
    }
    /**
     * Execute this function to execute after operation reset functions.
     * @param {After} mode After operation mode. Default is 'hard_reset'.
     * @param { boolean } usingUsbOtg For 'hard_reset'. When omitted, detected via usesUsbOtg()
     * @param {string} sequenceString For 'custom_reset' to specify the custom reset sequence string
     */ async after(mode = "hard_reset", usingUsbOtg, sequenceString) {
        switch(mode){
            case "hard_reset":
                if (this.resetConstructors.hardReset) {
                    this.info("Hard resetting via RTS pin...");
                    const usbOtg = usingUsbOtg !== null && usingUsbOtg !== void 0 ? usingUsbOtg : await this.usesUsbOtg();
                    const hardReset = this.resetConstructors.hardReset(this.transport, usbOtg);
                    await hardReset.reset();
                }
                break;
            case "soft_reset":
                this.info("Soft resetting...");
                await this.softReset(false);
                break;
            case "no_reset_stub":
                this.info("Staying in flasher stub.");
                break;
            case "custom_reset":
                if (!sequenceString) this.info("Custom reset sequence not provided, doing nothing.");
                if (!this.resetConstructors.customReset) this.info("Custom reset constructor not available, doing nothing.");
                if (this.resetConstructors.customReset && sequenceString) {
                    this.info("Custom resetting using sequence " + sequenceString);
                    const customReset = this.resetConstructors.customReset(this.transport, sequenceString);
                    await customReset.reset();
                }
                break;
            default:
                this.info("Staying in bootloader.");
                if (this.IS_STUB) this.softReset(true);
                break;
        }
    }
}






var $3KHBw = parcelRequire("3KHBw");



/** Flash sector size used by esptool when checking Intel HEX regions for overlap. */ const $72241dbd916138bd$var$FLASH_SECTOR_SIZE = 0x1000;
/**
 * Parse one Intel HEX line.
 * @param {string} line Trimmed record, including the leading colon.
 * @param {number} lineNumber 1-based line number for error messages.
 * @returns {HexRecord} Decoded record. The checksum is verified.
 */ function $72241dbd916138bd$var$parseRecord(line, lineNumber) {
    if (!line.startsWith(":")) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX line ${lineNumber} does not start with ':'`);
    const raw = line.slice(1);
    if (raw.length < 10 || raw.length % 2 !== 0 || !/^[0-9A-Fa-f]+$/.test(raw)) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX line ${lineNumber} is not a valid record`);
    const bytes = new Uint8Array(raw.length / 2);
    for(let i = 0; i < bytes.length; i++)bytes[i] = parseInt(raw.slice(i * 2, i * 2 + 2), 16);
    const length = bytes[0];
    if (bytes.length !== length + 5) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX line ${lineNumber} length does not match the record`);
    let sum = 0;
    for(let i = 0; i < bytes.length; i++)sum = sum + bytes[i] & 0xff;
    if (sum !== 0) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX checksum mismatch at line ${lineNumber}`);
    return {
        type: bytes[3],
        offset: bytes[1] << 8 | bytes[2],
        data: bytes.slice(4, 4 + length)
    };
}
/**
 * Group populated addresses into contiguous regions, matching esptool's gap split.
 * @param {Map<number, number>} bytes Address to byte value. Keys are unique.
 * @returns {IntelHexSegment[]} Regions in ascending address order.
 */ function $72241dbd916138bd$var$segmentsFromMap(bytes) {
    if (bytes.size === 0) return [];
    const addresses = Array.from(bytes.keys()).sort((a, b)=>a - b);
    const segments = [];
    let rangeStart = addresses[0];
    let previous = addresses[0];
    const pushRange = (start, endInclusive)=>{
        const data = new Uint8Array(endInclusive - start + 1);
        for(let i = 0; i < data.length; i++){
            const value = bytes.get(start + i);
            if (value === undefined) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX internal error: missing byte at 0x${(start + i).toString(16)}`);
            data[i] = value;
        }
        segments.push({
            address: start,
            data: data
        });
    };
    for(let i = 1; i < addresses.length; i++){
        const address = addresses[i];
        if (address !== previous + 1) {
            pushRange(rangeStart, previous);
            rangeStart = address;
        }
        previous = address;
    }
    pushRange(rangeStart, previous);
    return segments;
}
/**
 * Copy fast-path segments into a single buffer each.
 * @param {PendingSegment[]} segments Segments built by appending contiguous records.
 * @returns {IntelHexSegment[]} Concrete regions.
 */ function $72241dbd916138bd$var$finalizeSegments(segments) {
    return segments.map((segment)=>{
        const data = new Uint8Array(segment.length);
        let offset = 0;
        for (const part of segment.parts){
            data.set(part, offset);
            offset += part.length;
        }
        return {
            address: segment.address,
            data: data
        };
    });
}
/**
 * Reject regions whose 4 KiB erase sectors overlap, matching esptool's address/file check.
 * A hole inside one sector cannot be preserved: the stub erases that whole sector.
 * @param {IntelHexSegment[]} segments Regions in ascending address order.
 * @returns {void}
 */ function $72241dbd916138bd$var$assertNoSectorOverlap(segments) {
    let occupiedUntil = 0;
    for (const segment of segments){
        const sectorStart = segment.address & ~($72241dbd916138bd$var$FLASH_SECTOR_SIZE - 1);
        const sectorEnd = (segment.address + segment.data.length + $72241dbd916138bd$var$FLASH_SECTOR_SIZE - 1 & ~($72241dbd916138bd$var$FLASH_SECTOR_SIZE - 1)) - 1;
        if (sectorStart < occupiedUntil) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Detected overlap at address: 0x${segment.address.toString(16)} ` + `(regions share a ${$72241dbd916138bd$var$FLASH_SECTOR_SIZE} byte flash sector)`);
        occupiedUntil = sectorEnd;
    }
}
function $72241dbd916138bd$export$92eff444b2bc371b(input) {
    const text = typeof input === "string" ? input : new TextDecoder().decode(input);
    const lines = text.split(/\r\n|\n|\r/);
    const segments = [];
    let randomBytes = null;
    let base = 0;
    let sawEof = false;
    const spillToMap = ()=>{
        if (randomBytes) return randomBytes;
        const map = new Map();
        for (const segment of segments){
            let address = segment.address;
            for (const part of segment.parts){
                for(let i = 0; i < part.length; i++)map.set(address + i, part[i]);
                address += part.length;
            }
        }
        segments.length = 0;
        randomBytes = map;
        return map;
    };
    const writeData = (address, data)=>{
        if (data.length === 0) return;
        if (randomBytes) {
            for(let i = 0; i < data.length; i++)randomBytes.set(address + i, data[i]);
            return;
        }
        const last = segments[segments.length - 1];
        if (!last) {
            segments.push({
                address: address,
                parts: [
                    data
                ],
                length: data.length
            });
            return;
        }
        const lastEnd = last.address + last.length;
        if (address === lastEnd) {
            last.parts.push(data);
            last.length += data.length;
            return;
        }
        if (address > lastEnd) {
            segments.push({
                address: address,
                parts: [
                    data
                ],
                length: data.length
            });
            return;
        }
        const map = spillToMap();
        for(let i = 0; i < data.length; i++)map.set(address + i, data[i]);
    };
    for(let i = 0; i < lines.length; i++){
        const line = lines[i].trim();
        if (line.length === 0) continue;
        if (sawEof) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX data after end-of-file record at line ${i + 1}`);
        const record = $72241dbd916138bd$var$parseRecord(line, i + 1);
        switch(record.type){
            case 0x00:
                writeData(base + record.offset, record.data);
                break;
            case 0x01:
                sawEof = true;
                break;
            case 0x02:
                {
                    if (record.data.length !== 2) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX extended segment address at line ${i + 1} must be 2 bytes`);
                    const segment = record.data[0] << 8 | record.data[1];
                    base = segment << 4;
                    break;
                }
            case 0x03:
            case 0x05:
                break;
            case 0x04:
                {
                    if (record.data.length !== 2) throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX extended linear address at line ${i + 1} must be 2 bytes`);
                    const upper = record.data[0] << 8 | record.data[1];
                    base = upper << 16;
                    break;
                }
            default:
                throw new (0, $f1887d9f177795ef$export$5b519f82636185ec)(`Intel HEX unsupported record type 0x${record.type.toString(16)} at line ${i + 1}`);
        }
    }
    const built = randomBytes ? $72241dbd916138bd$var$segmentsFromMap(randomBytes) : $72241dbd916138bd$var$finalizeSegments(segments);
    $72241dbd916138bd$var$assertNoSectorOverlap(built);
    return built;
}



const $a54a1b3e2ae1b2a3$var$WCH_VID = 0x1a86;
const $a54a1b3e2ae1b2a3$var$CH343_PID = 0x55d3;
const $a54a1b3e2ae1b2a3$var$CH341_BAUDBASE_FACTOR = 1532620800;
const $a54a1b3e2ae1b2a3$var$CH341_BAUDBASE_DIVMAX = 3;
const $a54a1b3e2ae1b2a3$var$CH340_INIT = 0xa1;
const $a54a1b3e2ae1b2a3$var$CH340_SET_BAUDRATE = 0x9a;
const $a54a1b3e2ae1b2a3$var$CH340_SET_HANDSHAKE = 0xa4;
const $a54a1b3e2ae1b2a3$var$VENDOR_CLASS = 0xff;
const $a54a1b3e2ae1b2a3$var$MAX_TRANSFER_SIZE = 64;
/**
 * Throw when a USB transfer did not complete successfully.
 * @param {object} result USB transfer result.
 * @param {string} action Description of the operation for the error message.
 */ function $a54a1b3e2ae1b2a3$var$assertTransferOk(result, action) {
    if (result.status !== "ok") throw new Error(`CH340 ${action} failed: ${result.status}`);
}
class $a54a1b3e2ae1b2a3$export$a4b8013f1b846cf0 {
    /**
     * Wrap an already-selected USBDevice.
     * @param {object} usbDevice CH340/CH341 USB device.
     */ constructor(usbDevice){
        this.usbDevice = usbDevice;
        this.readable = null;
        this.writable = null;
        this.interfaceNumber = null;
        this.endpointIn = null;
        this.endpointOut = null;
        this.currentDtr = false;
        this.currentRts = false;
        this.controlQueue = Promise.resolve();
        this.readLoopRunning = false;
    }
    /**
     * Prompt for a WCH USB-serial device (VID 0x1a86). CH343 (PID 0x55d3) is rejected.
     * @returns {Promise<WebUSBSerialPort>} Adapter for the selected device.
     */ static async requestPort() {
        if (!navigator.usb) throw new Error("WebUSB is not available in this browser");
        const device = await navigator.usb.requestDevice({
            filters: [
                {
                    vendorId: $a54a1b3e2ae1b2a3$var$WCH_VID
                }
            ]
        });
        if (device.productId === $a54a1b3e2ae1b2a3$var$CH343_PID) throw new Error("CH343 is a CDC device; use the Web Serial API instead of WebUSBSerialPort");
        return new $a54a1b3e2ae1b2a3$export$a4b8013f1b846cf0(device);
    }
    /**
     * USB vendor and product identifiers.
     * @returns {object} Vendor and product IDs.
     */ getInfo() {
        return {
            usbVendorId: this.usbDevice.vendorId,
            usbProductId: this.usbDevice.productId
        };
    }
    /**
     * Open the device, claim the vendor bulk interface, and initialize CH340 UART.
     * @param {SerialOptions} options Serial options. Only baudRate is applied on CH340.
     */ async open(options = {}) {
        var _a;
        const baudRate = (_a = options.baudRate) !== null && _a !== void 0 ? _a : 115200;
        if (this.usbDevice.opened) await this.close();
        await this.usbDevice.open();
        if (!this.usbDevice.configuration || this.usbDevice.configuration.configurationValue !== 1) await this.usbDevice.selectConfiguration(1);
        this.claimBulkInterface();
        if (this.interfaceNumber === null || this.endpointIn === null || this.endpointOut === null) throw new Error("No CH340 vendor bulk IN/OUT interface found");
        try {
            await this.usbDevice.claimInterface(this.interfaceNumber);
        } catch (error) {
            throw new Error(`Unable to claim the CH340 USB interface. On desktop OS the kernel driver often owns the device. ${error}`);
        }
        await this.vendorOut($a54a1b3e2ae1b2a3$var$CH340_INIT, 0, 0);
        await this.setBaudRate(baudRate);
        await this.setSignals({
            dataTerminalReady: false,
            requestToSend: false
        });
        this.createStreams();
    }
    /**
     * Change baud rate in place using CH340 vendor request 0x9A.
     * @param {number} baudRate New baud rate.
     */ async setBaudRate(baudRate) {
        let factor = Math.floor($a54a1b3e2ae1b2a3$var$CH341_BAUDBASE_FACTOR / baudRate);
        let divisor = $a54a1b3e2ae1b2a3$var$CH341_BAUDBASE_DIVMAX;
        while(factor > 0xfff0 && divisor > 0){
            factor >>= 3;
            divisor--;
        }
        if (factor > 0xfff0) throw new Error(`Baudrate ${baudRate} is not supported by CH340`);
        factor = 0x10000 - factor;
        const a = factor & 0xff00 | divisor;
        const b = factor & 0xff;
        await this.vendorOut($a54a1b3e2ae1b2a3$var$CH340_SET_BAUDRATE, 0x1312, a);
        await this.vendorOut($a54a1b3e2ae1b2a3$var$CH340_SET_BAUDRATE, 0x0f2c, b);
        await (0, $216eff205ef04904$export$e772c8ff12451969)(50);
    }
    /**
     * Set DTR/RTS via CH340 handshake request 0xA4.
     * @param {object} signals Control-line values.
     * @param {boolean} [signals.dataTerminalReady] DTR line.
     * @param {boolean} [signals.requestToSend] RTS line.
     */ async setSignals(signals) {
        if (signals.dataTerminalReady !== undefined) this.currentDtr = signals.dataTerminalReady;
        if (signals.requestToSend !== undefined) this.currentRts = signals.requestToSend;
        const value = ~((this.currentDtr ? 32 : 0) | (this.currentRts ? 64 : 0)) & 0xffff;
        await this.vendorOut($a54a1b3e2ae1b2a3$var$CH340_SET_HANDSHAKE, value, 0);
    }
    /**
     * Release the USB interface and close the device.
     */ async close() {
        this.readLoopRunning = false;
        this.readable = null;
        this.writable = null;
        if (this.usbDevice.opened) {
            if (this.interfaceNumber !== null) try {
                await this.usbDevice.releaseInterface(this.interfaceNumber);
            } catch  {
            // Interface may already be released after a disconnect.
            }
            await this.usbDevice.close();
        }
        this.interfaceNumber = null;
        this.endpointIn = null;
        this.endpointOut = null;
    }
    /**
     * Use with Transport, which is typed against the Web Serial SerialPort.
     * @returns {BaudRateConfigurablePort} This adapter as a SerialPort-like object.
     */ asSerialPort() {
        return this;
    }
    /**
     * Locate the vendor class 0xFF bulk IN/OUT interface.
     */ claimBulkInterface() {
        const config = this.usbDevice.configuration;
        if (!config) throw new Error("USB device has no configuration");
        for (const iface of config.interfaces)for (const alternate of iface.alternates){
            if (alternate.interfaceClass !== $a54a1b3e2ae1b2a3$var$VENDOR_CLASS) continue;
            let inEndpoint = null;
            let outEndpoint = null;
            for (const endpoint of alternate.endpoints){
                if (endpoint.type === "bulk" && endpoint.direction === "in") inEndpoint = endpoint.endpointNumber;
                else if (endpoint.type === "bulk" && endpoint.direction === "out") outEndpoint = endpoint.endpointNumber;
            }
            if (inEndpoint !== null && outEndpoint !== null) {
                this.interfaceNumber = iface.interfaceNumber;
                this.endpointIn = inEndpoint;
                this.endpointOut = outEndpoint;
                return;
            }
        }
    }
    /**
     * Serialize vendor control transfers.
     * @param {number} request bRequest.
     * @param {number} value wValue.
     * @param {number} index wIndex.
     */ async vendorOut(request, value, index) {
        const run = this.controlQueue.then(async ()=>{
            if (!this.usbDevice.opened) throw new Error("CH340 device is not open");
            const result = await this.usbDevice.controlTransferOut({
                requestType: "vendor",
                recipient: "device",
                request: request,
                value: value,
                index: index
            });
            $a54a1b3e2ae1b2a3$var$assertTransferOk(result, `control request 0x${request.toString(16)}`);
        });
        this.controlQueue = run.then(()=>undefined, ()=>undefined);
        await run;
    }
    /**
     * Create ReadableStream / WritableStream over bulk endpoints.
     */ createStreams() {
        const endpointIn = this.endpointIn;
        const endpointOut = this.endpointOut;
        if (endpointIn === null || endpointOut === null) throw new Error("CH340 bulk endpoints are not configured");
        this.readLoopRunning = true;
        this.readable = new ReadableStream({
            pull: async (controller)=>{
                while(this.readLoopRunning && this.usbDevice.opened)try {
                    const result = await this.usbDevice.transferIn(endpointIn, $a54a1b3e2ae1b2a3$var$MAX_TRANSFER_SIZE);
                    if (result.status === "stall") {
                        await this.usbDevice.clearHalt("in", endpointIn);
                        continue;
                    }
                    if (result.status === "ok" && result.data && result.data.byteLength > 0) {
                        controller.enqueue(new Uint8Array(result.data.buffer, result.data.byteOffset, result.data.byteLength));
                        return;
                    }
                } catch (error) {
                    if (!this.readLoopRunning || !this.usbDevice.opened) return;
                    throw error;
                }
            },
            cancel: ()=>{
                this.readLoopRunning = false;
            }
        });
        this.writable = new WritableStream({
            write: async (chunk)=>{
                if (!this.usbDevice.opened) throw new Error("CH340 device is not open");
                const result = await this.usbDevice.transferOut(endpointOut, chunk);
                $a54a1b3e2ae1b2a3$var$assertTransferOk(result, "bulk OUT");
            }
        });
    }
}





/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of
 * the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
 * OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing
 * permissions and limitations under the License.
 */ 'use strict';
var $d2bbb828b377f05f$export$24d5ae9391ffe6e0;
(function(SerialPolyfillProtocol) {
    SerialPolyfillProtocol[SerialPolyfillProtocol["UsbCdcAcm"] = 0] = "UsbCdcAcm";
})($d2bbb828b377f05f$export$24d5ae9391ffe6e0 || ($d2bbb828b377f05f$export$24d5ae9391ffe6e0 = {}));
const $d2bbb828b377f05f$var$kSetLineCoding = 0x20;
const $d2bbb828b377f05f$var$kSetControlLineState = 0x22;
const $d2bbb828b377f05f$var$kSendBreak = 0x23;
const $d2bbb828b377f05f$var$kDefaultBufferSize = 255;
const $d2bbb828b377f05f$var$kDefaultDataBits = 8;
const $d2bbb828b377f05f$var$kDefaultParity = 'none';
const $d2bbb828b377f05f$var$kDefaultStopBits = 1;
const $d2bbb828b377f05f$var$kAcceptableDataBits = [
    16,
    8,
    7,
    6,
    5
];
const $d2bbb828b377f05f$var$kAcceptableStopBits = [
    1,
    2
];
const $d2bbb828b377f05f$var$kAcceptableParity = [
    'none',
    'even',
    'odd'
];
const $d2bbb828b377f05f$var$kParityIndexMapping = [
    'none',
    'odd',
    'even'
];
const $d2bbb828b377f05f$var$kStopBitsIndexMapping = [
    1,
    1.5,
    2
];
const $d2bbb828b377f05f$var$kDefaultPolyfillOptions = {
    protocol: $d2bbb828b377f05f$export$24d5ae9391ffe6e0.UsbCdcAcm,
    usbControlInterfaceClass: 2,
    usbTransferInterfaceClass: 10
};
/**
 * Utility function to get the interface implementing a desired class.
 * @param {USBDevice} device The USB device.
 * @param {number} classCode The desired interface class.
 * @return {USBInterface} The first interface found that implements the desired
 * class.
 * @throws TypeError if no interface is found.
 */ function $d2bbb828b377f05f$var$findInterface(device, classCode) {
    const configuration = device.configurations[0];
    for (const iface of configuration.interfaces){
        const alternate = iface.alternates[0];
        if (alternate.interfaceClass === classCode) return iface;
    }
    throw new TypeError(`Unable to find interface with class ${classCode}.`);
}
/**
 * Utility function to get an endpoint with a particular direction.
 * @param {USBInterface} iface The interface to search.
 * @param {USBDirection} direction The desired transfer direction.
 * @return {USBEndpoint} The first endpoint with the desired transfer direction.
 * @throws TypeError if no endpoint is found.
 */ function $d2bbb828b377f05f$var$findEndpoint(iface, direction) {
    const alternate = iface.alternates[0];
    for (const endpoint of alternate.endpoints){
        if (endpoint.direction == direction) return endpoint;
    }
    throw new TypeError(`Interface ${iface.interfaceNumber} does not have an ` + `${direction} endpoint.`);
}
/**
 * Implementation of the underlying source API[1] which reads data from a USB
 * endpoint. This can be used to construct a ReadableStream.
 *
 * [1]: https://streams.spec.whatwg.org/#underlying-source-api
 */ class $d2bbb828b377f05f$var$UsbEndpointUnderlyingSource {
    /**
     * Constructs a new UnderlyingSource that will pull data from the specified
     * endpoint on the given USB device.
     *
     * @param {USBDevice} device
     * @param {USBEndpoint} endpoint
     * @param {function} onError function to be called on error
     */ constructor(device, endpoint, onError){
        this.type = 'bytes';
        this.device_ = device;
        this.endpoint_ = endpoint;
        this.onError_ = onError;
    }
    /**
     * Reads a chunk of data from the device.
     *
     * @param {ReadableByteStreamController} controller
     */ pull(controller) {
        (async ()=>{
            var _a;
            let chunkSize;
            if (controller.desiredSize) {
                const d = controller.desiredSize / this.endpoint_.packetSize;
                chunkSize = Math.ceil(d) * this.endpoint_.packetSize;
            } else chunkSize = this.endpoint_.packetSize;
            try {
                const result = await this.device_.transferIn(this.endpoint_.endpointNumber, chunkSize);
                if (result.status != 'ok') {
                    controller.error(`USB error: ${result.status}`);
                    this.onError_();
                }
                if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.buffer) {
                    const chunk = new Uint8Array(result.data.buffer, result.data.byteOffset, result.data.byteLength);
                    controller.enqueue(chunk);
                }
            } catch (error) {
                controller.error(error.toString());
                this.onError_();
            }
        })();
    }
}
/**
 * Implementation of the underlying sink API[2] which writes data to a USB
 * endpoint. This can be used to construct a WritableStream.
 *
 * [2]: https://streams.spec.whatwg.org/#underlying-sink-api
 */ class $d2bbb828b377f05f$var$UsbEndpointUnderlyingSink {
    /**
     * Constructs a new UnderlyingSink that will write data to the specified
     * endpoint on the given USB device.
     *
     * @param {USBDevice} device
     * @param {USBEndpoint} endpoint
     * @param {function} onError function to be called on error
     */ constructor(device, endpoint, onError){
        this.device_ = device;
        this.endpoint_ = endpoint;
        this.onError_ = onError;
    }
    /**
     * Writes a chunk to the device.
     *
     * @param {Uint8Array} chunk
     * @param {WritableStreamDefaultController} controller
     */ async write(chunk, controller) {
        try {
            const result = await this.device_.transferOut(this.endpoint_.endpointNumber, chunk);
            if (result.status != 'ok') {
                controller.error(result.status);
                this.onError_();
            }
        } catch (error) {
            controller.error(error.toString());
            this.onError_();
        }
    }
}
class $d2bbb828b377f05f$export$237d90817cb05a2f {
    /**
     * constructor taking a WebUSB device that creates a SerialPort instance.
     * @param {USBDevice} device A device acquired from the WebUSB API
     * @param {SerialPolyfillOptions} polyfillOptions Optional options to
     * configure the polyfill.
     */ constructor(device, polyfillOptions){
        this.polyfillOptions_ = Object.assign(Object.assign({}, $d2bbb828b377f05f$var$kDefaultPolyfillOptions), polyfillOptions);
        this.outputSignals_ = {
            dataTerminalReady: false,
            requestToSend: false,
            break: false
        };
        this.device_ = device;
        this.controlInterface_ = $d2bbb828b377f05f$var$findInterface(this.device_, this.polyfillOptions_.usbControlInterfaceClass);
        this.transferInterface_ = $d2bbb828b377f05f$var$findInterface(this.device_, this.polyfillOptions_.usbTransferInterfaceClass);
        this.inEndpoint_ = $d2bbb828b377f05f$var$findEndpoint(this.transferInterface_, 'in');
        this.outEndpoint_ = $d2bbb828b377f05f$var$findEndpoint(this.transferInterface_, 'out');
    }
    /**
     * Getter for the readable attribute. Constructs a new ReadableStream as
     * necessary.
     * @return {ReadableStream} the current readable stream
     */ get readable() {
        var _a;
        if (!this.readable_ && this.device_.opened) this.readable_ = new ReadableStream(new $d2bbb828b377f05f$var$UsbEndpointUnderlyingSource(this.device_, this.inEndpoint_, ()=>{
            this.readable_ = null;
        }), {
            highWaterMark: (_a = this.serialOptions_.bufferSize) !== null && _a !== void 0 ? _a : $d2bbb828b377f05f$var$kDefaultBufferSize
        });
        return this.readable_;
    }
    /**
     * Getter for the writable attribute. Constructs a new WritableStream as
     * necessary.
     * @return {WritableStream} the current writable stream
     */ get writable() {
        var _a;
        if (!this.writable_ && this.device_.opened) this.writable_ = new WritableStream(new $d2bbb828b377f05f$var$UsbEndpointUnderlyingSink(this.device_, this.outEndpoint_, ()=>{
            this.writable_ = null;
        }), new ByteLengthQueuingStrategy({
            highWaterMark: (_a = this.serialOptions_.bufferSize) !== null && _a !== void 0 ? _a : $d2bbb828b377f05f$var$kDefaultBufferSize
        }));
        return this.writable_;
    }
    /**
     * a function that opens the device and claims all interfaces needed to
     * control and communicate to and from the serial device
     * @param {SerialOptions} options Object containing serial options
     * @return {Promise<void>} A promise that will resolve when device is ready
     * for communication
     */ async open(options) {
        this.serialOptions_ = options;
        this.validateOptions();
        try {
            await this.device_.open();
            if (this.device_.configuration === null) await this.device_.selectConfiguration(1);
            await this.device_.claimInterface(this.controlInterface_.interfaceNumber);
            if (this.controlInterface_ !== this.transferInterface_) await this.device_.claimInterface(this.transferInterface_.interfaceNumber);
            await this.setLineCoding();
            await this.setSignals({
                dataTerminalReady: true
            });
        } catch (error) {
            if (this.device_.opened) await this.device_.close();
            throw new Error('Error setting up device: ' + error.toString());
        }
    }
    /**
     * Closes the port.
     *
     * @return {Promise<void>} A promise that will resolve when the port is
     * closed.
     */ async close() {
        const promises = [];
        if (this.readable_) promises.push(this.readable_.cancel());
        if (this.writable_) promises.push(this.writable_.abort());
        await Promise.all(promises);
        this.readable_ = null;
        this.writable_ = null;
        if (this.device_.opened) {
            await this.setSignals({
                dataTerminalReady: false,
                requestToSend: false
            });
            await this.device_.close();
        }
    }
    /**
     * Forgets the port.
     *
     * @return {Promise<void>} A promise that will resolve when the port is
     * forgotten.
     */ async forget() {
        return this.device_.forget();
    }
    /**
     * A function that returns properties of the device.
     * @return {SerialPortInfo} Device properties.
     */ getInfo() {
        return {
            usbVendorId: this.device_.vendorId,
            usbProductId: this.device_.productId
        };
    }
    /**
     * A function used to change the serial settings of the device
     * @param {object} options the object which carries serial settings data
     * @return {Promise<void>} A promise that will resolve when the options are
     * set
     */ reconfigure(options) {
        this.serialOptions_ = Object.assign(Object.assign({}, this.serialOptions_), options);
        this.validateOptions();
        return this.setLineCoding();
    }
    /**
     * Sets control signal state for the port.
     * @param {SerialOutputSignals} signals The signals to enable or disable.
     * @return {Promise<void>} a promise that is resolved when the signal state
     * has been changed.
     */ async setSignals(signals) {
        this.outputSignals_ = Object.assign(Object.assign({}, this.outputSignals_), signals);
        if (signals.dataTerminalReady !== undefined || signals.requestToSend !== undefined) {
            // The Set_Control_Line_State command expects a bitmap containing the
            // values of all output signals that should be enabled or disabled.
            //
            // Ref: USB CDC specification version 1.1 §6.2.14.
            const value = (this.outputSignals_.dataTerminalReady ? 1 : 0) | (this.outputSignals_.requestToSend ? 2 : 0);
            await this.device_.controlTransferOut({
                'requestType': 'class',
                'recipient': 'interface',
                'request': $d2bbb828b377f05f$var$kSetControlLineState,
                'value': value,
                'index': this.controlInterface_.interfaceNumber
            });
        }
        if (signals.break !== undefined) {
            // The SendBreak command expects to be given a duration for how long the
            // break signal should be asserted. Passing 0xFFFF enables the signal
            // until 0x0000 is send.
            //
            // Ref: USB CDC specification version 1.1 §6.2.15.
            const value = this.outputSignals_.break ? 0xFFFF : 0x0000;
            await this.device_.controlTransferOut({
                'requestType': 'class',
                'recipient': 'interface',
                'request': $d2bbb828b377f05f$var$kSendBreak,
                'value': value,
                'index': this.controlInterface_.interfaceNumber
            });
        }
    }
    /**
     * Checks the serial options for validity and throws an error if it is
     * not valid
     */ validateOptions() {
        if (!this.isValidBaudRate(this.serialOptions_.baudRate)) throw new RangeError('invalid Baud Rate ' + this.serialOptions_.baudRate);
        if (!this.isValidDataBits(this.serialOptions_.dataBits)) throw new RangeError('invalid dataBits ' + this.serialOptions_.dataBits);
        if (!this.isValidStopBits(this.serialOptions_.stopBits)) throw new RangeError('invalid stopBits ' + this.serialOptions_.stopBits);
        if (!this.isValidParity(this.serialOptions_.parity)) throw new RangeError('invalid parity ' + this.serialOptions_.parity);
    }
    /**
     * Checks the baud rate for validity
     * @param {number} baudRate the baud rate to check
     * @return {boolean} A boolean that reflects whether the baud rate is valid
     */ isValidBaudRate(baudRate) {
        return baudRate % 1 === 0;
    }
    /**
     * Checks the data bits for validity
     * @param {number} dataBits the data bits to check
     * @return {boolean} A boolean that reflects whether the data bits setting is
     * valid
     */ isValidDataBits(dataBits) {
        if (typeof dataBits === 'undefined') return true;
        return $d2bbb828b377f05f$var$kAcceptableDataBits.includes(dataBits);
    }
    /**
     * Checks the stop bits for validity
     * @param {number} stopBits the stop bits to check
     * @return {boolean} A boolean that reflects whether the stop bits setting is
     * valid
     */ isValidStopBits(stopBits) {
        if (typeof stopBits === 'undefined') return true;
        return $d2bbb828b377f05f$var$kAcceptableStopBits.includes(stopBits);
    }
    /**
     * Checks the parity for validity
     * @param {string} parity the parity to check
     * @return {boolean} A boolean that reflects whether the parity is valid
     */ isValidParity(parity) {
        if (typeof parity === 'undefined') return true;
        return $d2bbb828b377f05f$var$kAcceptableParity.includes(parity);
    }
    /**
     * sends the options alog the control interface to set them on the device
     * @return {Promise} a promise that will resolve when the options are set
     */ async setLineCoding() {
        var _a, _b, _c;
        // Ref: USB CDC specification version 1.1 §6.2.12.
        const buffer = new ArrayBuffer(7);
        const view = new DataView(buffer);
        view.setUint32(0, this.serialOptions_.baudRate, true);
        view.setUint8(4, $d2bbb828b377f05f$var$kStopBitsIndexMapping.indexOf((_a = this.serialOptions_.stopBits) !== null && _a !== void 0 ? _a : $d2bbb828b377f05f$var$kDefaultStopBits));
        view.setUint8(5, $d2bbb828b377f05f$var$kParityIndexMapping.indexOf((_b = this.serialOptions_.parity) !== null && _b !== void 0 ? _b : $d2bbb828b377f05f$var$kDefaultParity));
        view.setUint8(6, (_c = this.serialOptions_.dataBits) !== null && _c !== void 0 ? _c : $d2bbb828b377f05f$var$kDefaultDataBits);
        const result = await this.device_.controlTransferOut({
            'requestType': 'class',
            'recipient': 'interface',
            'request': $d2bbb828b377f05f$var$kSetLineCoding,
            'value': 0x00,
            'index': this.controlInterface_.interfaceNumber
        }, buffer);
        if (result.status != 'ok') throw new DOMException('NetworkError', 'Failed to set line coding.');
    }
}
/** implementation of the global navigator.serial object */ class $d2bbb828b377f05f$var$Serial {
    /**
     * Requests permission to access a new port.
     *
     * @param {SerialPortRequestOptions} options
     * @param {SerialPolyfillOptions} polyfillOptions
     * @return {Promise<SerialPort>}
     */ async requestPort(options, polyfillOptions) {
        polyfillOptions = Object.assign(Object.assign({}, $d2bbb828b377f05f$var$kDefaultPolyfillOptions), polyfillOptions);
        const usbFilters = [];
        if (options && options.filters) for (const filter of options.filters){
            const usbFilter = {
                classCode: polyfillOptions.usbControlInterfaceClass
            };
            if (filter.usbVendorId !== undefined) usbFilter.vendorId = filter.usbVendorId;
            if (filter.usbProductId !== undefined) usbFilter.productId = filter.usbProductId;
            usbFilters.push(usbFilter);
        }
        if (usbFilters.length === 0) usbFilters.push({
            classCode: polyfillOptions.usbControlInterfaceClass
        });
        const device = await navigator.usb.requestDevice({
            'filters': usbFilters
        });
        const port = new $d2bbb828b377f05f$export$237d90817cb05a2f(device, polyfillOptions);
        return port;
    }
    /**
     * Get the set of currently available ports.
     *
     * @param {SerialPolyfillOptions} polyfillOptions Polyfill configuration that
     * should be applied to these ports.
     * @return {Promise<SerialPort[]>} a promise that is resolved with a list of
     * ports.
     */ async getPorts(polyfillOptions) {
        polyfillOptions = Object.assign(Object.assign({}, $d2bbb828b377f05f$var$kDefaultPolyfillOptions), polyfillOptions);
        const devices = await navigator.usb.getDevices();
        const ports = [];
        devices.forEach((device)=>{
            try {
                const port = new $d2bbb828b377f05f$export$237d90817cb05a2f(device, polyfillOptions);
                ports.push(port);
            } catch (e) {
            // Skip unrecognized port.
            }
        });
        return ports;
    }
}
const $d2bbb828b377f05f$export$6c2c9a00e27c07e8 = new $d2bbb828b377f05f$var$Serial();


const $382e02c9bbd5d50b$var$baudrates = document.getElementById("baudrates");
const $382e02c9bbd5d50b$var$consoleBaudrates = document.getElementById("consoleBaudrates");
const $382e02c9bbd5d50b$var$reconnectDelay = document.getElementById("reconnectDelay");
const $382e02c9bbd5d50b$var$maxRetriesInput = document.getElementById("maxRetries");
const $382e02c9bbd5d50b$var$connectButton = document.getElementById("connectButton");
const $382e02c9bbd5d50b$var$traceButton = document.getElementById("copyTraceButton");
const $382e02c9bbd5d50b$var$disconnectButton = document.getElementById("disconnectButton");
const $382e02c9bbd5d50b$var$resetButton = document.getElementById("resetButton");
const $382e02c9bbd5d50b$var$consoleStartButton = document.getElementById("consoleStartButton");
const $382e02c9bbd5d50b$var$consoleStopButton = document.getElementById("consoleStopButton");
const $382e02c9bbd5d50b$var$eraseButton = document.getElementById("eraseButton");
const $382e02c9bbd5d50b$var$addFileButton = document.getElementById("addFile");
const $382e02c9bbd5d50b$var$addHexFileButton = document.getElementById("addHexFile");
const $382e02c9bbd5d50b$var$hexFileInput = document.getElementById("hexFileInput");
const $382e02c9bbd5d50b$var$eraseAllCheckbox = document.getElementById("eraseAll");
const $382e02c9bbd5d50b$var$programButton = document.getElementById("programButton");
const $382e02c9bbd5d50b$var$filesDiv = document.getElementById("files");
const $382e02c9bbd5d50b$var$terminal = document.getElementById("terminal");
const $382e02c9bbd5d50b$var$programDiv = document.getElementById("program");
const $382e02c9bbd5d50b$var$consoleDiv = document.getElementById("console");
const $382e02c9bbd5d50b$var$lblBaudrate = document.getElementById("lblBaudrate");
const $382e02c9bbd5d50b$var$lblConsoleBaudrate = document.getElementById("lblConsoleBaudrate");
const $382e02c9bbd5d50b$var$lblConsoleFor = document.getElementById("lblConsoleFor");
const $382e02c9bbd5d50b$var$lblConnTo = document.getElementById("lblConnTo");
const $382e02c9bbd5d50b$var$table = document.getElementById("fileTable");
const $382e02c9bbd5d50b$var$alertDiv = document.getElementById("alertDiv");
const $382e02c9bbd5d50b$var$flashMode = document.getElementById("flashMode");
const $382e02c9bbd5d50b$var$flashFreq = document.getElementById("flashFreq");
const $382e02c9bbd5d50b$var$flashSize = document.getElementById("flashSize");
const $382e02c9bbd5d50b$var$lblFlashMode = document.getElementById("lblFlashMode");
const $382e02c9bbd5d50b$var$lblFlashFreq = document.getElementById("lblFlashFreq");
const $382e02c9bbd5d50b$var$lblFlashSize = document.getElementById("lblFlashSize");
const $382e02c9bbd5d50b$var$debugLogging = document.getElementById("debugLogging");
const $382e02c9bbd5d50b$var$serialLib = !navigator.serial && navigator.usb ? (0, $d2bbb828b377f05f$export$6c2c9a00e27c07e8) : navigator.serial;
const $382e02c9bbd5d50b$var$useWebUsb = document.getElementById("useWebUsb");
const $382e02c9bbd5d50b$var$term = new Terminal({
    cols: 120,
    rows: 40
});
$382e02c9bbd5d50b$var$term.open($382e02c9bbd5d50b$var$terminal);
let $382e02c9bbd5d50b$var$device = null;
let $382e02c9bbd5d50b$var$deviceInfo = null;
let $382e02c9bbd5d50b$var$usingWebUsb = false;
let $382e02c9bbd5d50b$var$transport;
let $382e02c9bbd5d50b$var$chip = null;
let $382e02c9bbd5d50b$var$esploader;
$382e02c9bbd5d50b$var$disconnectButton.style.display = "none";
$382e02c9bbd5d50b$var$traceButton.style.display = "none";
$382e02c9bbd5d50b$var$eraseButton.style.display = "none";
$382e02c9bbd5d50b$var$consoleStopButton.style.display = "none";
$382e02c9bbd5d50b$var$resetButton.style.display = "none";
$382e02c9bbd5d50b$var$filesDiv.style.display = "none";
$382e02c9bbd5d50b$var$flashMode.style.display = "none";
$382e02c9bbd5d50b$var$flashFreq.style.display = "none";
$382e02c9bbd5d50b$var$flashSize.style.display = "none";
$382e02c9bbd5d50b$var$lblFlashMode.style.display = "none";
$382e02c9bbd5d50b$var$lblFlashFreq.style.display = "none";
$382e02c9bbd5d50b$var$lblFlashSize.style.display = "none";
/**
 * Show the program alert.
 * @param {string} message Alert text.
 * @returns {void}
 */ function $382e02c9bbd5d50b$var$showAlert(message) {
    const alertMsg = document.getElementById("alertmsg");
    if (alertMsg) alertMsg.textContent = message;
    if ($382e02c9bbd5d50b$var$alertDiv) $382e02c9bbd5d50b$var$alertDiv.style.display = "block";
}
/**
 * Hide the program alert.
 * @returns {void}
 */ function $382e02c9bbd5d50b$var$hideAlert() {
    if ($382e02c9bbd5d50b$var$alertDiv) $382e02c9bbd5d50b$var$alertDiv.style.display = "none";
}
/**
 * Format a flash offset for the address field.
 * @param {number} address Flash offset.
 * @returns {string} Hex address text.
 */ function $382e02c9bbd5d50b$var$formatAddress(address) {
    return "0x" + address.toString(16);
}
/**
 * True when the row was created from an Intel HEX region.
 * @param {HTMLTableRowElement} row Flash table row.
 * @returns {boolean} Whether the row is a read-only HEX region.
 */ function $382e02c9bbd5d50b$var$isHexRow(row) {
    return row.dataset.kind === "hex";
}
/**
 * Read the address and image stored on a flash table row.
 * An empty BIN row has no image data.
 * @param {ImageRow} row Flash table row.
 * @returns {{ address: number, data: Uint8Array | undefined }} Address and image bytes.
 */ function $382e02c9bbd5d50b$var$imageFromRow(row) {
    const offsetInput = row.cells[0].querySelector("input");
    const address = offsetInput instanceof HTMLInputElement ? parseInt(offsetInput.value) : NaN;
    if ($382e02c9bbd5d50b$var$isHexRow(row)) return {
        address: address,
        data: row.imageData
    };
    const fileInput = row.cells[1].querySelector('input[type="file"]');
    return {
        address: address,
        data: fileInput?.data
    };
}
/**
 * File reader handler for a .bin row.
 * @param {Event} evt File select event.
 * @returns {void}
 */ function $382e02c9bbd5d50b$var$handleFileSelect(evt) {
    const input = evt.target;
    const file = input.files?.[0];
    if (!file) {
        input.data = undefined;
        input.fileName = undefined;
        return;
    }
    if (!file.name.toLowerCase().endsWith(".bin")) {
        input.value = "";
        input.data = undefined;
        input.fileName = undefined;
        $382e02c9bbd5d50b$var$showAlert("Add File only accepts .bin files. Use Add HEX File for a .hex file.");
        return;
    }
    input.fileName = file.name;
    const reader = new FileReader();
    reader.onload = (ev)=>{
        if (ev.target?.result instanceof ArrayBuffer) {
            input.data = new Uint8Array(ev.target.result);
            $382e02c9bbd5d50b$var$hideAlert();
        } else input.data = undefined;
    };
    reader.readAsArrayBuffer(file);
}
const $382e02c9bbd5d50b$var$espLoaderTerminal = {
    clean () {
        $382e02c9bbd5d50b$var$term.clear();
    },
    writeLine (data) {
        $382e02c9bbd5d50b$var$term.writeln(data);
    },
    write (data) {
        $382e02c9bbd5d50b$var$term.write(data);
    }
};
/**
 * Populate flash size and frequency dropdowns based on chip's supported values
 */ function $382e02c9bbd5d50b$var$populateFlashDropdowns() {
    if (!$382e02c9bbd5d50b$var$esploader || !$382e02c9bbd5d50b$var$esploader.chip) return;
    // Populate Flash Frequency dropdown
    $382e02c9bbd5d50b$var$flashFreq.innerHTML = '<option value="keep">keep</option>';
    const flashFreqKeys = Object.keys($382e02c9bbd5d50b$var$esploader.chip.FLASH_FREQUENCY).sort((a, b)=>{
        const freqOrder = [
            "80m",
            "60m",
            "48m",
            "40m",
            "30m",
            "26m",
            "24m",
            "20m",
            "16m",
            "15m",
            "12m"
        ];
        const indexA = freqOrder.indexOf(a);
        const indexB = freqOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });
    flashFreqKeys.forEach((freq)=>{
        const option = document.createElement("option");
        option.value = freq;
        option.textContent = freq;
        $382e02c9bbd5d50b$var$flashFreq.appendChild(option);
    });
    $382e02c9bbd5d50b$var$flashFreq.options[0].selected = true;
    // Populate Flash Size dropdown
    $382e02c9bbd5d50b$var$flashSize.innerHTML = '<option value="detect">detect</option><option value="keep">keep</option>';
    const flashSizeKeys = Object.keys($382e02c9bbd5d50b$var$esploader.chip.FLASH_SIZES).sort((a, b)=>{
        const sizeOrder = [
            "256KB",
            "512KB",
            "1MB",
            "2MB",
            "2MB-c1",
            "4MB",
            "4MB-c1",
            "8MB",
            "16MB",
            "32MB",
            "64MB",
            "128MB"
        ];
        const indexA = sizeOrder.indexOf(a);
        const indexB = sizeOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });
    flashSizeKeys.forEach((size)=>{
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        $382e02c9bbd5d50b$var$flashSize.appendChild(option);
    });
    $382e02c9bbd5d50b$var$flashSize.options[1].selected = true;
}
/**
 * Request a serial device via Web Serial or opt-in CH340 WebUSB.
 * @returns {Promise<object>} Selected port.
 */ async function $382e02c9bbd5d50b$var$requestDevice() {
    if ($382e02c9bbd5d50b$var$useWebUsb.checked) {
        $382e02c9bbd5d50b$var$usingWebUsb = true;
        const port = await (0, $a54a1b3e2ae1b2a3$export$a4b8013f1b846cf0).requestPort();
        return port.asSerialPort();
    }
    $382e02c9bbd5d50b$var$usingWebUsb = false;
    return $382e02c9bbd5d50b$var$serialLib.requestPort({});
}
$382e02c9bbd5d50b$var$connectButton.onclick = async ()=>{
    try {
        if ($382e02c9bbd5d50b$var$device === null) {
            $382e02c9bbd5d50b$var$device = await $382e02c9bbd5d50b$var$requestDevice();
            $382e02c9bbd5d50b$var$deviceInfo = $382e02c9bbd5d50b$var$device.getInfo();
            $382e02c9bbd5d50b$var$transport = new (0, $4616b1a2f9a5b082$export$86495b081fef8e52)($382e02c9bbd5d50b$var$device, true);
        }
        const flashOptions = {
            transport: $382e02c9bbd5d50b$var$transport,
            baudrate: parseInt($382e02c9bbd5d50b$var$baudrates.value),
            terminal: $382e02c9bbd5d50b$var$espLoaderTerminal,
            debugLogging: $382e02c9bbd5d50b$var$debugLogging.checked
        };
        $382e02c9bbd5d50b$var$esploader = new (0, $b9be20b2c9078c9b$export$b0f7a6c745790308)(flashOptions);
        $382e02c9bbd5d50b$var$traceButton.style.display = "initial";
        $382e02c9bbd5d50b$var$chip = await $382e02c9bbd5d50b$var$esploader.main();
        // Populate flash dropdowns based on chip's supported values
        $382e02c9bbd5d50b$var$populateFlashDropdowns();
        // Temporarily broken
        // await esploader.flashId();
        // eslint-disable-next-line no-console
        console.log("Settings done for :" + $382e02c9bbd5d50b$var$chip);
        $382e02c9bbd5d50b$var$lblBaudrate.style.display = "none";
        $382e02c9bbd5d50b$var$lblConnTo.innerHTML = "Connected to device: " + $382e02c9bbd5d50b$var$chip;
        $382e02c9bbd5d50b$var$lblConnTo.style.display = "block";
        $382e02c9bbd5d50b$var$baudrates.style.display = "none";
        $382e02c9bbd5d50b$var$connectButton.style.display = "none";
        $382e02c9bbd5d50b$var$disconnectButton.style.display = "initial";
        $382e02c9bbd5d50b$var$eraseButton.style.display = "initial";
        $382e02c9bbd5d50b$var$filesDiv.style.display = "initial";
        $382e02c9bbd5d50b$var$flashMode.style.display = "initial";
        $382e02c9bbd5d50b$var$flashFreq.style.display = "initial";
        $382e02c9bbd5d50b$var$flashSize.style.display = "initial";
        $382e02c9bbd5d50b$var$lblFlashMode.style.display = "initial";
        $382e02c9bbd5d50b$var$lblFlashFreq.style.display = "initial";
        $382e02c9bbd5d50b$var$lblFlashSize.style.display = "initial";
        $382e02c9bbd5d50b$var$consoleDiv.style.display = "none";
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        $382e02c9bbd5d50b$var$term.writeln(`Error: ${e.message}`);
    }
};
$382e02c9bbd5d50b$var$traceButton.onclick = async ()=>{
    if ($382e02c9bbd5d50b$var$transport) $382e02c9bbd5d50b$var$transport.returnTrace();
};
$382e02c9bbd5d50b$var$resetButton.onclick = async ()=>{
    if ($382e02c9bbd5d50b$var$transport) {
        await $382e02c9bbd5d50b$var$transport.setDTR(false);
        await new Promise((resolve)=>setTimeout(resolve, 100));
        await $382e02c9bbd5d50b$var$transport.setDTR(true);
    }
};
$382e02c9bbd5d50b$var$eraseButton.onclick = async ()=>{
    $382e02c9bbd5d50b$var$eraseButton.disabled = true;
    try {
        await $382e02c9bbd5d50b$var$esploader.eraseFlash();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        $382e02c9bbd5d50b$var$term.writeln(`Error: ${e.message}`);
    } finally{
        $382e02c9bbd5d50b$var$eraseButton.disabled = false;
    }
};
/**
 * Add the progress cell used while programming a row.
 * @param {HTMLTableRowElement} row Flash table row.
 * @returns {void}
 */ function $382e02c9bbd5d50b$var$addProgressCell(row) {
    const cell = row.insertCell(2);
    cell.classList.add("progress-cell");
    cell.style.display = "none";
    cell.innerHTML = `<progress value="0" max="100"></progress>`;
}
/**
 * Add the remove-button cell. The first BIN row has no button.
 * @param {HTMLTableRowElement} row Flash table row.
 * @param {boolean} includeButton Whether to show Remove.
 * @returns {void}
 */ function $382e02c9bbd5d50b$var$addRemoveCell(row, includeButton) {
    const cell = row.insertCell(3);
    cell.classList.add("action-cell");
    if (!includeButton) return;
    const button = document.createElement("input");
    button.type = "button";
    button.className = "btn";
    button.value = "Remove";
    button.onclick = function() {
        $382e02c9bbd5d50b$var$removeRow(row);
    };
    cell.appendChild(button);
}
$382e02c9bbd5d50b$var$addFileButton.onclick = ()=>{
    const rowCount = $382e02c9bbd5d50b$var$table.rows.length;
    const row = $382e02c9bbd5d50b$var$table.insertRow(rowCount);
    //Column 1 - Offset
    const cell1 = row.insertCell(0);
    const element1 = document.createElement("input");
    element1.type = "text";
    element1.id = "offset" + rowCount;
    element1.value = "0x1000";
    cell1.appendChild(element1);
    // Column 2 - File selector
    const cell2 = row.insertCell(1);
    const element2 = document.createElement("input");
    element2.type = "file";
    element2.accept = ".bin";
    element2.id = "selectFile" + rowCount;
    element2.name = "selected_File" + rowCount;
    element2.addEventListener("change", $382e02c9bbd5d50b$var$handleFileSelect, false);
    cell2.appendChild(element2);
    $382e02c9bbd5d50b$var$addProgressCell(row);
    $382e02c9bbd5d50b$var$addRemoveCell(row, rowCount > 1);
};
/**
 * Append one read-only row for a contiguous HEX region.
 * @param {string} fileName Source HEX file name.
 * @param {number} address Flash offset from the HEX file.
 * @param {Uint8Array} data Region bytes.
 * @returns {void}
 */ function $382e02c9bbd5d50b$var$appendHexRow(fileName, address, data) {
    const row = $382e02c9bbd5d50b$var$table.insertRow($382e02c9bbd5d50b$var$table.rows.length);
    row.dataset.kind = "hex";
    row.imageData = data;
    const addressCell = row.insertCell(0);
    const addressInput = document.createElement("input");
    addressInput.type = "text";
    addressInput.readOnly = true;
    addressInput.value = $382e02c9bbd5d50b$var$formatAddress(address);
    addressCell.appendChild(addressInput);
    const fileCell = row.insertCell(1);
    fileCell.textContent = fileName + " (" + data.length + " bytes)";
    $382e02c9bbd5d50b$var$addProgressCell(row);
    $382e02c9bbd5d50b$var$addRemoveCell(row, true);
}
$382e02c9bbd5d50b$var$addHexFileButton.onclick = ()=>{
    $382e02c9bbd5d50b$var$hexFileInput.click();
};
$382e02c9bbd5d50b$var$hexFileInput.addEventListener("change", (evt)=>{
    const input = evt.target;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".hex")) {
        $382e02c9bbd5d50b$var$showAlert("Add HEX File only accepts .hex files.");
        return;
    }
    const reader = new FileReader();
    reader.onload = (ev)=>{
        if (!(ev.target?.result instanceof ArrayBuffer)) {
            $382e02c9bbd5d50b$var$showAlert("Could not read HEX file.");
            return;
        }
        try {
            const segments = (0, $72241dbd916138bd$export$92eff444b2bc371b)(new Uint8Array(ev.target.result));
            if (segments.length === 0) {
                $382e02c9bbd5d50b$var$showAlert("Intel HEX file contains no data.");
                return;
            }
            for (const segment of segments)$382e02c9bbd5d50b$var$appendHexRow(file.name, segment.address, segment.data);
            $382e02c9bbd5d50b$var$eraseAllCheckbox.checked = false;
            $382e02c9bbd5d50b$var$hideAlert();
        } catch (e) {
            $382e02c9bbd5d50b$var$showAlert(e instanceof Error ? e.message : String(e));
        }
    };
    reader.readAsArrayBuffer(file);
});
/**
 * The built in HTMLTableRowElement object.
 * @external HTMLTableRowElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement}
 */ /**
 * Remove file row from HTML Table
 * @param {HTMLTableRowElement} row Table row element to remove
 */ function $382e02c9bbd5d50b$var$removeRow(row) {
    const rowIndex = Array.from($382e02c9bbd5d50b$var$table.rows).indexOf(row);
    $382e02c9bbd5d50b$var$table.deleteRow(rowIndex);
}
/**
 * Clean devices variables on chip disconnect. Remove stale references if any.
 */ function $382e02c9bbd5d50b$var$cleanUp() {
    $382e02c9bbd5d50b$var$device = null;
    $382e02c9bbd5d50b$var$deviceInfo = null;
    $382e02c9bbd5d50b$var$usingWebUsb = false;
    $382e02c9bbd5d50b$var$transport = null;
    $382e02c9bbd5d50b$var$chip = null;
}
$382e02c9bbd5d50b$var$disconnectButton.onclick = async ()=>{
    if ($382e02c9bbd5d50b$var$transport) await $382e02c9bbd5d50b$var$transport.disconnect();
    $382e02c9bbd5d50b$var$term.reset();
    $382e02c9bbd5d50b$var$lblBaudrate.style.display = "initial";
    $382e02c9bbd5d50b$var$baudrates.style.display = "initial";
    $382e02c9bbd5d50b$var$consoleBaudrates.style.display = "initial";
    $382e02c9bbd5d50b$var$connectButton.style.display = "initial";
    $382e02c9bbd5d50b$var$disconnectButton.style.display = "none";
    $382e02c9bbd5d50b$var$traceButton.style.display = "none";
    $382e02c9bbd5d50b$var$eraseButton.style.display = "none";
    $382e02c9bbd5d50b$var$lblConnTo.style.display = "none";
    $382e02c9bbd5d50b$var$filesDiv.style.display = "none";
    $382e02c9bbd5d50b$var$flashMode.style.display = "none";
    $382e02c9bbd5d50b$var$flashFreq.style.display = "none";
    $382e02c9bbd5d50b$var$flashSize.style.display = "none";
    $382e02c9bbd5d50b$var$lblFlashMode.style.display = "none";
    $382e02c9bbd5d50b$var$lblFlashFreq.style.display = "none";
    $382e02c9bbd5d50b$var$lblFlashSize.style.display = "none";
    $382e02c9bbd5d50b$var$alertDiv.style.display = "none";
    $382e02c9bbd5d50b$var$consoleDiv.style.display = "initial";
    $382e02c9bbd5d50b$var$cleanUp();
};
let $382e02c9bbd5d50b$var$isConsoleClosed = false;
let $382e02c9bbd5d50b$var$isReconnecting = false;
const $382e02c9bbd5d50b$var$sleep = async (ms)=>{
    return new Promise((resolve)=>setTimeout(resolve, ms));
};
$382e02c9bbd5d50b$var$consoleStartButton.onclick = async ()=>{
    if ($382e02c9bbd5d50b$var$device === null) {
        $382e02c9bbd5d50b$var$device = await $382e02c9bbd5d50b$var$requestDevice();
        $382e02c9bbd5d50b$var$transport = new (0, $4616b1a2f9a5b082$export$86495b081fef8e52)($382e02c9bbd5d50b$var$device, true);
        $382e02c9bbd5d50b$var$deviceInfo = $382e02c9bbd5d50b$var$device.getInfo();
        // Set up device lost callback
        $382e02c9bbd5d50b$var$transport.setDeviceLostCallback(async ()=>{
            if (!$382e02c9bbd5d50b$var$isConsoleClosed && !$382e02c9bbd5d50b$var$isReconnecting) {
                $382e02c9bbd5d50b$var$term.writeln("\n[DEVICE LOST] Device disconnected. Trying to reconnect...");
                await $382e02c9bbd5d50b$var$sleep(parseInt($382e02c9bbd5d50b$var$reconnectDelay.value));
                $382e02c9bbd5d50b$var$isReconnecting = true;
                const maxRetries = parseInt($382e02c9bbd5d50b$var$maxRetriesInput.value);
                let retryCount = 0;
                while(retryCount < maxRetries && !$382e02c9bbd5d50b$var$isConsoleClosed){
                    retryCount++;
                    $382e02c9bbd5d50b$var$term.writeln(`\n[RECONNECT] Attempt ${retryCount}/${maxRetries}...`);
                    let newDevice = null;
                    if ($382e02c9bbd5d50b$var$usingWebUsb && navigator.usb) {
                        const usbDevices = await navigator.usb.getDevices();
                        const match = usbDevices.find((usbDevice)=>usbDevice.vendorId === $382e02c9bbd5d50b$var$deviceInfo.usbVendorId && usbDevice.productId === $382e02c9bbd5d50b$var$deviceInfo.usbProductId);
                        if (match) newDevice = new (0, $a54a1b3e2ae1b2a3$export$a4b8013f1b846cf0)(match).asSerialPort();
                    } else if ($382e02c9bbd5d50b$var$serialLib && $382e02c9bbd5d50b$var$serialLib.getPorts) {
                        const ports = await $382e02c9bbd5d50b$var$serialLib.getPorts();
                        newDevice = ports.find((port)=>port.getInfo().usbVendorId === $382e02c9bbd5d50b$var$deviceInfo.usbVendorId && port.getInfo().usbProductId === $382e02c9bbd5d50b$var$deviceInfo.usbProductId);
                    }
                    if (newDevice) {
                        $382e02c9bbd5d50b$var$device = newDevice;
                        $382e02c9bbd5d50b$var$transport.updateDevice($382e02c9bbd5d50b$var$device);
                        $382e02c9bbd5d50b$var$term.writeln("[RECONNECT] Found previously authorized device, connecting...");
                        await $382e02c9bbd5d50b$var$transport.connect(parseInt($382e02c9bbd5d50b$var$consoleBaudrates.value));
                        $382e02c9bbd5d50b$var$term.writeln("[RECONNECT] Successfully reconnected!");
                        $382e02c9bbd5d50b$var$consoleStopButton.style.display = "initial";
                        $382e02c9bbd5d50b$var$resetButton.style.display = "initial";
                        $382e02c9bbd5d50b$var$isReconnecting = false;
                        $382e02c9bbd5d50b$var$startConsoleReading();
                        return;
                    }
                    if (retryCount < maxRetries) {
                        $382e02c9bbd5d50b$var$term.writeln(`[RECONNECT] Device not found, retrying in ${parseInt($382e02c9bbd5d50b$var$reconnectDelay.value)}ms...`);
                        await $382e02c9bbd5d50b$var$sleep(parseInt($382e02c9bbd5d50b$var$reconnectDelay.value));
                    }
                }
                if (retryCount >= maxRetries) {
                    $382e02c9bbd5d50b$var$term.writeln("\n[RECONNECT] Failed to reconnect after 5 attempts. Please manually reconnect.");
                    $382e02c9bbd5d50b$var$isReconnecting = false;
                }
            }
        });
    }
    $382e02c9bbd5d50b$var$lblConsoleFor.style.display = "block";
    $382e02c9bbd5d50b$var$lblConsoleBaudrate.style.display = "none";
    $382e02c9bbd5d50b$var$consoleBaudrates.style.display = "none";
    $382e02c9bbd5d50b$var$consoleStartButton.style.display = "none";
    $382e02c9bbd5d50b$var$consoleStopButton.style.display = "initial";
    $382e02c9bbd5d50b$var$resetButton.style.display = "initial";
    $382e02c9bbd5d50b$var$programDiv.style.display = "none";
    await $382e02c9bbd5d50b$var$transport.connect(parseInt($382e02c9bbd5d50b$var$consoleBaudrates.value));
    $382e02c9bbd5d50b$var$isConsoleClosed = false;
    $382e02c9bbd5d50b$var$isReconnecting = false;
    $382e02c9bbd5d50b$var$startConsoleReading();
};
/**
 * IDF Monitor–style auto-coloring: inject ANSI codes by log level (E/W/I) so colors
 * work without CONFIG_LOG_COLORS on the device. Same regex as esp-idf-monitor.
 */ const $382e02c9bbd5d50b$var$IDF_LOG_LEVEL_REGEX = /^(I|W|E) \([\d.: -]+\)/;
const $382e02c9bbd5d50b$var$ANSI = {
    RED: "\x1b[1;31m",
    GREEN: "\x1b[0;32m",
    YELLOW: "\x1b[0;33m",
    NORMAL: "\x1b[0m"
};
/**
 * Use IDF Monitor style log level prefixes to inject ANSI color codes for better readability. Lines that don't match the pattern are returned unmodified.
 * @param {string} line Console line to colorize
 * @returns {string} Colorized console line
 */ function $382e02c9bbd5d50b$var$colorizeIdfLine(line) {
    const match = $382e02c9bbd5d50b$var$IDF_LOG_LEVEL_REGEX.exec(line);
    if (!match) return line;
    const color = match[1] === "E" ? $382e02c9bbd5d50b$var$ANSI.RED : match[1] === "W" ? $382e02c9bbd5d50b$var$ANSI.YELLOW : $382e02c9bbd5d50b$var$ANSI.GREEN;
    return color + line + $382e02c9bbd5d50b$var$ANSI.NORMAL;
}
/**
 * Continuously read from the console until it's closed, applying colorization to IDF log lines. If the connection is lost, it will wait for reconnection and resume reading. Errors are caught and displayed in the terminal without breaking the reading loop.
 */ async function $382e02c9bbd5d50b$var$startConsoleReading() {
    if ($382e02c9bbd5d50b$var$isConsoleClosed || !$382e02c9bbd5d50b$var$transport) return;
    const decoder = new TextDecoder("utf-8");
    let lineBuffer = "";
    try {
        await $382e02c9bbd5d50b$var$transport.rawRead((value)=>{
            lineBuffer += decoder.decode(value);
            let idx;
            while((idx = lineBuffer.indexOf("\n")) !== -1){
                const lineWithEol = lineBuffer.slice(0, idx + 1);
                lineBuffer = lineBuffer.slice(idx + 1);
                const lineStripped = lineWithEol.replace(/\r?\n$/, "");
                const eol = lineWithEol.slice(lineStripped.length);
                $382e02c9bbd5d50b$var$term.write($382e02c9bbd5d50b$var$colorizeIdfLine(lineStripped) + eol);
            }
        }, ()=>$382e02c9bbd5d50b$var$isConsoleClosed);
        if (lineBuffer.length > 0) $382e02c9bbd5d50b$var$term.write($382e02c9bbd5d50b$var$colorizeIdfLine(lineBuffer));
    } catch (error) {
        if (!$382e02c9bbd5d50b$var$isConsoleClosed) $382e02c9bbd5d50b$var$term.writeln(`\n[CONSOLE ERROR] ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!$382e02c9bbd5d50b$var$isConsoleClosed) $382e02c9bbd5d50b$var$term.writeln("\n[CONSOLE] Connection lost, waiting for reconnection...");
}
$382e02c9bbd5d50b$var$consoleStopButton.onclick = async ()=>{
    $382e02c9bbd5d50b$var$isConsoleClosed = true;
    $382e02c9bbd5d50b$var$isReconnecting = false;
    if ($382e02c9bbd5d50b$var$transport) {
        await $382e02c9bbd5d50b$var$transport.disconnect();
        await $382e02c9bbd5d50b$var$transport.waitForUnlock(1500);
    }
    $382e02c9bbd5d50b$var$term.reset();
    $382e02c9bbd5d50b$var$lblConsoleBaudrate.style.display = "initial";
    $382e02c9bbd5d50b$var$consoleBaudrates.style.display = "initial";
    $382e02c9bbd5d50b$var$consoleStartButton.style.display = "initial";
    $382e02c9bbd5d50b$var$consoleStopButton.style.display = "none";
    $382e02c9bbd5d50b$var$resetButton.style.display = "none";
    $382e02c9bbd5d50b$var$lblConsoleFor.style.display = "none";
    $382e02c9bbd5d50b$var$programDiv.style.display = "initial";
    $382e02c9bbd5d50b$var$cleanUp();
};
/**
 * Rows that will be flashed. An empty BIN row is the placeholder added at startup
 * and is skipped so a HEX-only program can run.
 * @returns {{ row: ImageRow, address: number, data: Uint8Array }[] | string} Images, or an error message.
 */ function $382e02c9bbd5d50b$var$imagesToFlash() {
    const images = [];
    const offsetArr = [];
    for(let index = 1; index < $382e02c9bbd5d50b$var$table.rows.length; index++){
        const row = $382e02c9bbd5d50b$var$table.rows[index];
        const image = $382e02c9bbd5d50b$var$imageFromRow(row);
        if (!$382e02c9bbd5d50b$var$isHexRow(row) && image.data == null) {
            const addedByUser = row.cells[3].querySelector("input") != null;
            if (addedByUser) return "No file selected for row " + index + "!";
            continue;
        }
        if (image.data == null) return "No file selected for row " + index + "!";
        if (Number.isNaN(image.address)) return "Offset field in row " + index + " is not a valid address!";
        if (offsetArr.includes(image.address)) return "Offset field in row " + index + " is already in use!";
        offsetArr.push(image.address);
        images.push({
            row: row,
            address: image.address,
            data: image.data
        });
    }
    if (images.length === 0) return "No file selected!";
    return images;
}
$382e02c9bbd5d50b$var$programButton.onclick = async ()=>{
    const images = $382e02c9bbd5d50b$var$imagesToFlash();
    if (typeof images === "string") {
        $382e02c9bbd5d50b$var$showAlert(images);
        return;
    }
    $382e02c9bbd5d50b$var$hideAlert();
    const fileArray = [];
    const progressBars = [];
    for (const image of images){
        const progressBar = image.row.cells[2].childNodes[0];
        progressBar.textContent = "0";
        image.row.cells[2].style.display = "initial";
        image.row.cells[3].style.display = "none";
        fileArray.push({
            data: image.data,
            address: image.address
        });
        progressBars.push(progressBar);
    }
    try {
        const flashOptions = {
            fileArray: fileArray,
            eraseAll: $382e02c9bbd5d50b$var$eraseAllCheckbox.checked,
            compress: true,
            flashMode: $382e02c9bbd5d50b$var$flashMode.value,
            flashFreq: $382e02c9bbd5d50b$var$flashFreq.value,
            flashSize: $382e02c9bbd5d50b$var$flashSize.value,
            reportProgress: (fileIndex, written, total)=>{
                progressBars[fileIndex].value = written / total * 100;
            },
            calculateMD5Hash: (image)=>{
                const latin1String = Array.from(image, (byte)=>String.fromCharCode(byte)).join("");
                return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(latin1String)).toString();
            }
        };
        await $382e02c9bbd5d50b$var$esploader.writeFlash(flashOptions);
        await $382e02c9bbd5d50b$var$esploader.after();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        $382e02c9bbd5d50b$var$term.writeln(`Error: ${e.message}`);
    } finally{
        // Hide progress bars and show remove buttons
        for (const image of images){
            image.row.cells[2].style.display = "none";
            image.row.cells[3].style.display = "initial";
        }
    }
};
$382e02c9bbd5d50b$var$addFileButton.onclick(undefined);


//# sourceMappingURL=typescript.430e8b71.js.map
