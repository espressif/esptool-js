'use strict';

class ESP8266ROM {
    static CHIP_NAME = "ESP8266";
    static CHIP_DETECT_MAGIC_VALUE = 0xfff0c101;
}

class ESP32ROM {
    static CHIP_NAME = "ESP32";
    static IMAGE_CHIP_ID = 0;
    static CHIP_DETECT_MAGIC_VALUE = 0x00f01d83;
    static EFUSE_RD_REG_BASE = 0x3ff5a000;
    static DR_REG_SYSCON_BASE = 0x3ff66000;
    static UART_CLKDIV_REG = 0x3ff40014;
    static UART_CLKDIV_MASK = 0xFFFFF;
    static UART_DATE_REG_ADDR = 0x60000078;
    static XTAL_CLK_DIVIDER= 1;

    static FLASH_WRITE_SIZE = 0x400;

    static SPI_REG_BASE   = 0x3ff42000;
    static SPI_USR_OFFS    = 0x1c;
    static SPI_USR1_OFFS   = 0x20;
    static SPI_USR2_OFFS   = 0x24;
    static SPI_W0_OFFS     = 0x80;
    static SPI_MOSI_DLEN_OFFS = 0x28;
    static SPI_MISO_DLEN_OFFS = 0x2c;

    static TEXT_START = 0x400BE000;
    static ENTRY = 0x400BE598;
    static DATA_START = 0x3FFDEBA8;
    static ROM_DATA = "CMD8Pw==";
    static ROM_TEXT = "" +
"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"+
"wqvdldrZOj9LCYJ8mer+L0DR4a0UDQAA";

    static read_efuse = async (loader, offset) => {
        var addr = this.EFUSE_RD_REG_BASE + (4 * offset);
        console.log("Read efuse " + addr);
        return await loader.read_reg({addr: addr});
    }

    static get_pkg_version = async (loader) => {
        var word3 = await this.read_efuse(loader, 3);
        var pkg_version = (word3 >> 9) & 0x07;
        pkg_version += ((word3 >> 2) & 0x1) << 3;
        return pkg_version;
    }

    static get_chip_revision = async (loader) => {
        var word3 = await this.read_efuse(loader, 3);
        var word5 = await this.read_efuse(loader, 5);
        var apb_ctl_date = await loader.read_reg({addr: this.DR_REG_SYSCON_BASE + 0x7C});

        var rev_bit0 = (word3 >> 15) & 0x1;
        var rev_bit1 = (word5 >> 20) & 0x1;
        var rev_bit2 = (apb_ctl_date >> 31) & 0x1;
        if (rev_bit0 != 0) {
            if (rev_bit1 != 0) {
                if (rev_bit2 != 0) {
                    return 3;
                } else {
                    return 2;
                }
            } else {
                return 1;
            }
        }
        return 0;
    }

    static get_chip_description = async (loader) => {
        var chip_desc = ["ESP32-D0WDQ6", "ESP32-D0WD", "ESP32-D2WD", "", "ESP32-U4WDH", "ESP32-PICO-D4", "ESP32-PICO-V3-02"];
        var chip_name = "";
        var pkg_version = await this.get_pkg_version(loader);
        var chip_revision = await this.get_chip_revision(loader);
        var rev3 = (chip_revision == 3);
        var single_core = await this.read_efuse(loader, 3) & (1 << 0);

        if (single_core != 0) {
            chip_desc[0] = "ESP32-S0WDQ6";
            chip_desc[1] = "ESP32-S0WD";
        }
        if (rev3) {
            chip_desc[5] = "ESP32-PICO-V3";
        }
        if (pkg_version >= 0 && pkg_version <= 6) {
            chip_name = chip_desc[pkg_version];
        } else {
            chip_name = "Unknown ESP32";
        }

        if (rev3 && (pkg_version === 0 || pkg_version === 1)) {
            chip_name += "-V3";
        }
        return chip_name + " (revision " + chip_revision + ")";
    }

    static get_chip_features = async (loader) => {
        var features = ["Wi-Fi"];
        var word3 = await this.read_efuse(loader, 3);

        var chip_ver_dis_bt = word3 & (1 << 1);
        if (chip_ver_dis_bt === 0) {
            features.push(" BT");
        }

        var chip_ver_dis_app_cpu = word3 & (1 << 0);
        if (chip_ver_dis_app_cpu !== 0) {
            features.push(" Single Core");
        } else {
            features.push(" Dual Core");
        }

        var chip_cpu_freq_rated = word3 & (1 << 13);
        if (chip_cpu_freq_rated !== 0) {
            var chip_cpu_freq_low = word3 & (1 << 12);
            if (chip_cpu_freq_low !== 0) {
                features.push(" 160MHz");
            } else {
                features.push(" 240MHz");
            }
        }

        var pkg_version = await this.get_pkg_version(loader);
        if ([2, 4, 5, 6].includes(pkg_version)) {
            features.push(" Embedded Flash");
        }

        if (pkg_version === 6) {
            features.push(" Embedded PSRAM");
        }

        var word4 = await this.read_efuse(loader, 4);
        var adc_vref = (word4 >> 8) & 0x1F;
        if (adc_vref !== 0) {
            features.push(" VRef calibration in efuse");
        }

        var blk3_part_res = word3 >> 14 & 0x1;
        if (blk3_part_res !== 0) {
            features.push(" BLK3 partially reserved");
        }

        var word6 = await this.read_efuse(loader, 6);
        var coding_scheme = word6 & 0x3;
        var coding_scheme_arr = ["None", "3/4", "Repeat (UNSUPPORTED)", "Invalid"];
        features.push(" Coding Scheme " + coding_scheme_arr[coding_scheme]);

        return features;
    }

    static get_crystal_freq = async (loader) => {
        var uart_div = await loader.read_reg({addr: this.UART_CLKDIV_REG}) & this.UART_CLKDIV_MASK;
        var ets_xtal = (loader.transport.baudrate * uart_div) / 1000000 / this.XTAL_CLK_DIVIDER;
        var norm_xtal;
        if (ets_xtal > 33) {
            norm_xtal = 40;
        } else {
            norm_xtal = 26;
        }
        if (Math.abs(norm_xtal - ets_xtal) > 1) {
            loader.log("WARNING: Unsupported crystal in use");
        }
        return norm_xtal;
    }

    static _d2h(d) {
        var h = (+d).toString(16);
        return h.length === 1 ? '0' + h: h;
    }

    static read_mac = async (loader) => {
        var mac0 = await this.read_efuse(loader, 1);
        mac0 = mac0 >>> 0;
        var mac1 = await this.read_efuse(loader, 2);
        mac1 = mac1 >>> 0;
        var mac = new Uint8Array(6);
        mac[0] = (mac1 >> 8) & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = (mac0 >> 24) & 0xff;
        mac[3] = (mac0 >> 16) & 0xff;
        mac[4] = (mac0 >> 8) & 0xff;
        mac[5] = mac0 & 0xff;

        return(this._d2h(mac[0])+":"+this._d2h(mac[1])+":"+this._d2h(mac[2])+":"+this._d2h(mac[3])+":"+this._d2h(mac[4])+":"+this._d2h(mac[5]));
    }

    static get_erase_size = function(offset, size) {
        return size;
    }

}

class ESP32S2ROM {
    static CHIP_NAME = "ESP32-S2";
    static IMAGE_CHIP_ID = 2;
    static CHIP_DETECT_MAGIC_VALUE = 0x000007c6;
    static MAC_EFUSE_REG = 0x3f41A044;
    static EFUSE_BASE = 0x3f41A000;
    static UART_CLKDIV_REG = 0x3f400014;
    static UART_CLKDIV_MASK = 0xFFFFF;
    static UART_DATE_REG_ADDR = 0x60000078;

    static FLASH_WRITE_SIZE = 0x400;

    static SPI_REG_BASE = 0x3f402000;
    static SPI_USR_OFFS    = 0x18;
    static SPI_USR1_OFFS   = 0x1c;
    static SPI_USR2_OFFS   = 0x20;
    static SPI_W0_OFFS = 0x58;
    static SPI_MOSI_DLEN_OFFS = 0x24;
    static SPI_MISO_DLEN_OFFS = 0x28;

    static TEXT_START = 0x40028000;
    static ENTRY = 0x4002873C;
    static DATA_START = 0x3FFE2BF4;
    static ROM_DATA = "CAD9Pw==";
    static ROM_TEXT = "" +
"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";

    static get_pkg_version = async (loader) => {
        var num_word = 3;
        var block1_addr = this.EFUSE_BASE + 0x044;
        var addr = block1_addr + (4 * num_word);
        var word3 = await loader.read_reg({addr: addr});
        var pkg_version = (word3 >> 21) & 0x0F;
        return pkg_version;
    }

    static get_chip_description = async (loader) => {
        var chip_desc = [ "ESP32-S2", "ESP32-S2FH16", "ESP32-S2FH32"];
        var pkg_ver = await this.get_pkg_version(loader);
        if (pkg_ver >= 0 && pkg_ver <=2) {
            return chip_desc[pkg_ver];
        } else {
            return "unknown ESP32-S2";
        }
    }

    static get_chip_features = async (loader) => {
        var features = [ "Wi-Fi" ];
        var pkg_ver = await this.get_pkg_version(loader);
        if (pkg_ver == 1) {
            features.push("Embedded 2MB Flash");
        } else if (pkg_ver == 2) {
            features.push("Embedded 4MB Flash");
        }
        var num_word = 4;
        var block2_addr = this.EFUSE_BASE + 0x05C;
        var addr = block2_addr + (4 * num_word);
        var word4 = await loader.read_reg({addr: addr});
        var block2_ver = (word4 >> 4) & 0x07;

        if (block2_ver == 1) {
            features.push("ADC and temperature sensor calibration in BLK2 of efuse");
        }
        return features;
    }

    static get_crystal_freq = async (loader) => {
        return 40;
    }
    static _d2h(d) {
        var h = (+d).toString(16);
        return h.length === 1 ? '0' + h: h;
    }
    static read_mac = async (loader) => {
        var mac0 = await loader.read_reg({addr: this.MAC_EFUSE_REG});
        mac0 = mac0 >>> 0;
        var mac1 = await loader.read_reg({addr: this.MAC_EFUSE_REG + 4});
        mac1 = (mac1 >>> 0) & 0x0000ffff;
        var mac = new Uint8Array(6);
        mac[0] = (mac1 >> 8) & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = (mac0 >> 24) & 0xff;
        mac[3] = (mac0 >> 16) & 0xff;
        mac[4] = (mac0 >> 8) & 0xff;
        mac[5] = mac0 & 0xff;

        return(this._d2h(mac[0])+":"+this._d2h(mac[1])+":"+this._d2h(mac[2])+":"+this._d2h(mac[3])+":"+this._d2h(mac[4])+":"+this._d2h(mac[5]));
    }

    static get_erase_size = function(offset, size) {
        return size;
    }
}

class ESP32S3BETA2ROM {
    static CHIP_NAME = "ESP32-S3(beta2)";
    static IMAGE_CHIP_ID = 4;
    static CHIP_DETECT_MAGIC_VALUE = 0xeb004136;
    static get_pkg_version = async (loader) => {
    }
    static get_chip_revision = async (loader) => {
    }
    static get_chip_description = async (loader) => {
    }
    static get_chip_features = async (loader) => {
    }
    static get_crystal_freq = async (loader) => {
    }
    static read_mac = async (loader) => {
    }
}

class ESP32C3ROM {
    static CHIP_NAME = "ESP32-C3";
    static IMAGE_CHIP_ID = 5;
    static CHIP_DETECT_MAGIC_VALUE = 0x6921506f;
    static EFUSE_BASE = 0x60008800;
    static MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
    static UART_CLKDIV_REG = 0x3ff40014;
    static UART_CLKDIV_MASK = 0xFFFFF;
    static UART_DATE_REG_ADDR = 0x6000007C;

    static FLASH_WRITE_SIZE = 0x400;

    static SPI_REG_BASE = 0x60002000;
    static SPI_USR_OFFS    = 0x18;
    static SPI_USR1_OFFS   = 0x1C;
    static SPI_USR2_OFFS   = 0x20;
    static SPI_MOSI_DLEN_OFFS = 0x24;
    static SPI_MISO_DLEN_OFFS = 0x28;
    static SPI_W0_OFFS = 0x58;

    static TEXT_START = 0x40380000;
    static ENTRY = 0x403805C8;
    static DATA_START = 0x3FC96BA8;
    static ROM_DATA = "DEDIPw==";
    static ROM_TEXT = "" +
"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";

    static get_pkg_version = async (loader) => {
        var num_word = 3;
        var block1_addr = this.EFUSE_BASE + 0x044;
        var addr = block1_addr + (4 * num_word);
        var word3 = await loader.read_reg({addr: addr});
        var pkg_version = (word3 >> 21) & 0x0F;
        return pkg_version;
    }

    static get_chip_revision = async (loader) => {
        var block1_addr = this.EFUSE_BASE + 0x044;
        var num_word = 3;
        var pos = 18;
        var addr = block1_addr + (4 * num_word);
        var ret = (await loader.read_reg({addr: addr}) & (0x7 << pos)) >> pos;
        return ret;
    }

    static get_chip_description = async (loader) => {
        var desc;
        var pkg_ver = await this.get_pkg_version(loader);
        if (pkg_ver === 0) {
            desc = "ESP32-C3";
        } else {
            desc = "unknown ESP32-C3";
        }
        var chip_rev = await this.get_chip_revision(loader);
        desc += " (revision " + chip_rev + ")";
        return desc;

    }

    static get_chip_features = async (loader) => {
        return ["Wi-Fi"];
    }

    static get_crystal_freq = async (loader) => {
        return 40;
    }

    static _d2h(d) {
        var h = (+d).toString(16);
        return h.length === 1 ? '0' + h: h;
    }

    static read_mac = async (loader) => {
        var mac0 = await loader.read_reg({addr: this.MAC_EFUSE_REG});
        mac0 = mac0 >>> 0;
        var mac1 = await loader.read_reg({addr: this.MAC_EFUSE_REG + 4});
        mac1 = (mac1 >>> 0) & 0x0000ffff;
        var mac = new Uint8Array(6);
        mac[0] = (mac1 >> 8) & 0xff;
        mac[1] = mac1 & 0xff;
        mac[2] = (mac0 >> 24) & 0xff;
        mac[3] = (mac0 >> 16) & 0xff;
        mac[4] = (mac0 >> 8) & 0xff;
        mac[5] = mac0 & 0xff;

        return(this._d2h(mac[0])+":"+this._d2h(mac[1])+":"+this._d2h(mac[2])+":"+this._d2h(mac[3])+":"+this._d2h(mac[4])+":"+this._d2h(mac[5]));
    }

    static get_erase_size = function(offset, size) {
        return size;
    }
}

class ESPLoader {
    ESP_RAM_BLOCK = 0x1800;
    ESP_FLASH_BEGIN = 0x02;
    ESP_FLASH_DATA = 0x03;
    ESP_FLASH_END = 0x04;
    ESP_MEM_BEGIN  = 0x05;
    ESP_MEM_END = 0x06;
    ESP_MEM_DATA = 0x07;
    ESP_WRITE_REG = 0x09;
    ESP_READ_REG = 0x0A;
    ESP_SPI_ATTACH = 0x0D;

    ERASE_REGION_TIMEOUT_PER_MB = 30000;
    ERASE_WRITE_TIMEOUT_PER_MB = 40000;
    CHIP_ERASE_TIMEOUT = 120000;
    MAX_TIMEOUT = this.CHIP_ERASE_TIMEOUT * 2;

    DETECTED_FLASH_SIZES = {0x12: '256KB', 0x13: '512KB', 0x14: '1MB', 0x15: '2MB', 0x16: '4MB', 0x17: '8MB', 0x18: '16MB'};

    constructor(transport, terminal) {
        this.transport = transport;
        this.terminal = terminal;
        this.IS_STUB = false;
        this.chip = null;

        if (terminal) {
            this.terminal.clear();
        }

        this.log("esptool.js v0.1-dev");
        this.log("Serial port " + this.transport.get_info());
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(str) {
        if (this.transport) {
            this.terminal.writeln(str);
        } else {
            console.log(str);
        }
    }
    write_char(str) {
        if (this.transport) {
            this.terminal.write(str);
        } else {
            console.log(str);
        }
    }
    _short_to_bytearray(i) {
        return [i & 0xff, (i >> 8) & 0xff];
    }

    _int_to_bytearray(i) {
        return [i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff];
    }

    _bytearray_to_short(i, j) {
        return (i | (j >> 8));
    }

    _bytearray_to_int(i, j, k, l) {
        return (i | (j << 8) | (k << 16) | (l << 24));
    }

    _appendBuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    }

    _appendArray(arr1, arr2) {
        var c = new Uint8Array(arr1.length + arr2.length);
        console.log(c);
        c.set(arr1, 0);
        c.set(arr2, arr1.length);
        return c;
    }

    flush_input = async () => {
        try {
            await this.transport.read({timeout:200});
        } catch(e) {
        }
    }

    command = async ({op=null, data=[], chk=0, wait_response=true, timeout=3000} = {})  => {
        console.log("command "+ op + " " + wait_response + " " + timeout);
        if (op != null) {
            var pkt = new Uint8Array(8 + data.length);
            pkt[0] = 0x00;
            pkt[1] = op;
            pkt[2] = this._short_to_bytearray(data.length)[0];
            pkt[3] = this._short_to_bytearray(data.length)[1];
            pkt[4] = this._int_to_bytearray(chk)[0];
            pkt[5] = this._int_to_bytearray(chk)[1];
            pkt[6] = this._int_to_bytearray(chk)[2];
            pkt[7] = this._int_to_bytearray(chk)[3];

            var i;
            for (i = 0; i < data.length; i++) {
                pkt[8 + i] = data[i];
            }
            await this.transport.write(pkt);
        }

        if (wait_response) {
            try {
                var p = await this.transport.read({timeout: timeout});
                const resp = p[0];
                const op_ret = p[1];
                const len_ret = this._bytearray_to_short(p[2], p[3]);
                const val = this._bytearray_to_int(p[4], p[5], p[6], p[7]);
                console.log("Resp "+resp + " " + op_ret + " " + len_ret + " " + val );
                const data = p.slice(8);
                if (op == null || op_ret == op) {
                    return [val, data];
                } else {
                    throw("invalid response");
                }
            } catch(e) {
                if (e === "timeout") {
                    throw(e);
                }
            }
        }
    }

    read_reg = async({addr, timeout = 3000} = {}) => {
        var val, data;
        console.log("read reg " + addr + " " + timeout);
        var pkt = this._int_to_bytearray(addr);
        console.log("Read reg");
        console.log(pkt);
        val = await this.command({op:this.ESP_READ_REG, data:pkt, timeout:timeout});
        console.log("Read reg resp");
        console.log(val);
        return val[0];
    }

    write_reg = async({addr, value, mask = 0xFFFFFFFF, delay_us = 0, delay_after_us = 0} = {}) => {
        var pkt = this._appendArray(this._int_to_bytearray(addr), this._int_to_bytearray(value));
        pkt = this._appendArray(pkt, this._int_to_bytearray(mask));
        pkt = this._appendArray(pkt, this._int_to_bytearray(delay_us));

        if (delay_after_us > 0) {
            pkt = this._appendArray(pkt, this._int_to_bytearray(this.chip.UART_DATE_REG_ADDR));
            pkt = this._appendArray(pkt, this._int_to_bytearray(0));
            pkt = this._appendArray(pkt, this._int_to_bytearray(0));
            pkt = this._appendArray(pkt, this._int_to_bytearray(delay_after_us));
        }

        await this.check_command({op_description: "write target memory", op: this.ESP_WRITE_REG, data: pkt});
    }

    sync = async () => {
        console.log("Sync");
        var cmd = new Uint8Array(36);
        var i;
        cmd[0] = 0x07;
        cmd[1] = 0x07;
        cmd[2] = 0x12;
        cmd[3] = 0x20;
        for (i = 0; i < 32; i++) {
            cmd[4 + i] = 0x55;
        }

        try {
            const resp = await this.command({op:0x08, data:cmd, timeout:100});
            return resp;
        } catch(e) {
            console.log("Sync err " + e);
            throw(e);
        }
    }

    _connect_attempt = async ({mode='default_reset', esp32r0_delay=false} = {}) => {
        console.log("_connect_attempt " + esp32r0_delay);
        if (mode !== 'no_reset') {
            await this.transport.setDTR(false);
            await this.transport.setRTS(true);
            await this._sleep(100);
            if (esp32r0_delay) {
                //await this._sleep(1200);
                await this._sleep(2000);
            }
            await this.transport.setDTR(true);
            await this.transport.setRTS(false);
            if (esp32r0_delay) {
                //await this._sleep(400);
            }
            await this._sleep(50);
            await this.transport.setDTR(false);
        }
        var i = 0;
        while (1) {
            try {
                const res = await this.transport.read({timeout: 1000});
                i += res.length;
                //console.log("Len = " + res.length);
                //var str = new TextDecoder().decode(res);
                //this.log(str);
            } catch (e) {
                if (e === "timeout") {
                    break;
                }
            }
            await this._sleep(50);
        }
        this.transport.slip_reader_enabled = true;
        var i = 7;
        while (i--) {
            try {
                var resp = await this.sync();
                console.log(resp);
                return "success";
            } catch(error) {
                if (error === "timeout") {
                    if (esp32r0_delay) {
                        this.write_char('_');
                    } else {
                        this.write_char('.');
                    }
                }
            }
            await this._sleep(50);
        }
        return "error";
    }

    connect = async ({mode='default_reset', attempts=7, detecting=false} = {}) => {
        var i;
        var resp;
        this.write_char('Connecting...');
        await this.transport.connect();
        for (i = 0 ; i < attempts; i++) {
            resp = await this._connect_attempt({esp32r0_delay:false});
            if (resp === "success") {
                break;
            }
            resp = await this._connect_attempt({esp32r0_delay:true});
            if (resp === "success") {
                break;
            }
        }
        if (resp !== "success") {
            this.log("Failed to connect with the device");
            return "error";
        }
        this.write_char('\n');
        this.write_char('\r');
        await this.flush_input();

        if (!detecting) {
            var chip_magic_value = await this.read_reg({addr:0x40001000});
            console.log("Chip Magic " + chip_magic_value);
            var chips = [ESP8266ROM, ESP32ROM, ESP32S2ROM, ESP32S3BETA2ROM, ESP32C3ROM];
            chips.forEach(function (cls) {
                if (chip_magic_value == cls.CHIP_DETECT_MAGIC_VALUE) {
                    console.log(cls);
                    this.chip = cls;
                }
            }, this);
        }
     }


    detect_chip = async () => {
        await this.connect();
        console.log(this.chip);
        this.write_char("Detecting chip type... ");
        if (this.chip != null) {
            this.log(this.chip.CHIP_NAME);
        }
    }

    check_command = async ({op_description="", op=null, data=[], chk=0, timeout=3000} = {}) => {
        console.log("check_command " + op + " " + data);
        var resp = await this.command({op:op, data:data, chk:chk, timeout:timeout});
        console.log("check_command resp");
        console.log(resp);
    }

    mem_begin = async (size, blocks, blocksize, offset) => {
        /* XXX: Add check to ensure that STUB is not getting overwritten */
        console.log("mem_begin " + size + " " + blocks + " " + blocksize + " " + offset);
        var pkt = this._appendArray(this._int_to_bytearray(size), this._int_to_bytearray(blocks));
        pkt = this._appendArray(pkt, this._int_to_bytearray(blocksize));
        pkt = this._appendArray(pkt, this._int_to_bytearray(offset));
        await this.check_command({op_description: "write to target RAM", op: this.ESP_MEM_BEGIN, data: pkt});
    }

    checksum = function (data) {
        var i;
        var chk = 0xEF;

        for (i = 0; i < data.length; i++) {
            chk ^= data[i];
        }
        return chk;
    }

    mem_block = async (buffer, seq) => {
        var pkt = this._appendArray(this._int_to_bytearray(buffer.length), this._int_to_bytearray(seq));
        pkt = this._appendArray(pkt, this._int_to_bytearray(0));
        pkt = this._appendArray(pkt, this._int_to_bytearray(0));
        pkt = this._appendArray(pkt, buffer);
        var checksum = this.checksum(buffer);
        await this.check_command({op_description: "write to target RAM", op: this.ESP_MEM_DATA, data: pkt, chk: checksum});
    }

    mem_finish = async (entrypoint) => {
        var is_entry = (entrypoint === 0) ? 1 : 0;
        var pkt = this._appendArray(this._int_to_bytearray(is_entry), this._int_to_bytearray(entrypoint));
        await this.check_command({op_description: "leave RAM download mode", op: this.ESP_MEM_END, data: pkt, timeout: 50}); // XXX: handle non-stub with diff timeout
    }

    flash_spi_attach = async (hspi_arg) => {
        var pkt = this._int_to_bytearray(hspi_arg);
        await this.check_command({op_description: "configure SPI flash pins", op: this.ESP_SPI_ATTACH, data: pkt});
    }

    timeout_per_mb = function(seconds_per_mb, size_bytes) {
        var result = seconds_per_mb * (size_bytes / 1000000);
        if (result < 3000) {
            return 3000;
        } else {
            return result;
        }
    }

    flash_begin = async (size, offset) => {

        var num_blocks = Math.floor((size + this.chip.FLASH_WRITE_SIZE - 1) / this.chip.FLASH_WRITE_SIZE);
        var erase_size = this.chip.get_erase_size(offset, size);

        var d = new Date();
        var t1 = d.getTime();

        var timeout = 3000;
        if (this.IS_STUB == false) {
            timeout = this.timeout_per_mb(this.ERASE_REGION_TIMEOUT_PER_MB, size);
        }

        console.log("flash begin " + erase_size + " " + num_blocks + " " + this.chip.FLASH_WRITE_SIZE + " " + offset + " " + size);
        var pkt = this._appendArray(this._int_to_bytearray(erase_size), this._int_to_bytearray(num_blocks));
        pkt = this._appendArray(pkt, this._int_to_bytearray(this.chip.FLASH_WRITE_SIZE));
        pkt = this._appendArray(pkt, this._int_to_bytearray(offset));
        if (this.IS_STUB == false) {
            pkt = this._appendArray(pkt, this._int_to_bytearray(0)); // XXX: Support encrypted
        }

        await this.check_command({op_description:"enter Flash download mode", op: this.ESP_FLASH_BEGIN, data: pkt, timeout: timeout});

        var t2 = d.getTime();
        if (size != 0 && this.IS_STUB == false) {
            this.log("Took "+((t2-t1)/1000)+"."+((t2-t1)%1000)+"s to erase flash block");
        }

    }

    flash_block = async (data, seq, timeout) => {
        var pkt = this._appendArray(this._int_to_bytearray(data.length), this._int_to_bytearray(seq));
        pkt = this._appendArray(pkt, this._int_to_bytearray(0));
        pkt = this._appendArray(pkt, this._int_to_bytearray(0));
        pkt = this._appendArray(pkt, data);

        var checksum = this.checksum(data);

        await this.check_command({op_description:"write to target Flash after seq " + seq, op: this.ESP_FLASH_DATA, data: pkt, chk: checksum, timeout: timeout});
    }

    flash_finish = async ({reboot = false } = {}) => {
        var val = reboot ? 0 : 1;
        var pkt = this._int_to_bytearray(val);

        await this.check_command({op_description:"leave Flash mode", op: this.ESP_FLASH_END, data: pkt});
    }

    run_spiflash_command = async (spiflash_command, data, read_bits) => {
        // SPI_USR register flags
        var SPI_USR_COMMAND = (1 << 31);
        var SPI_USR_MISO    = (1 << 28);
        var SPI_USR_MOSI    = (1 << 27);

        // SPI registers, base address differs ESP32* vs 8266
        var base = this.chip.SPI_REG_BASE;
        var SPI_CMD_REG = base + 0x00;
        var SPI_USR_REG       = base + this.chip.SPI_USR_OFFS;
        var SPI_USR1_REG      = base + this.chip.SPI_USR1_OFFS;
        var SPI_USR2_REG      = base + this.chip.SPI_USR2_OFFS;
        var SPI_W0_REG        = base + this.chip.SPI_W0_OFFS;

        var set_data_lengths;
        if (this.chip.SPI_MOSI_DLEN_OFFS != null) {
            set_data_lengths = async(mosi_bits, miso_bits) => {
                var SPI_MOSI_DLEN_REG = base + this.chip.SPI_MOSI_DLEN_OFFS;
                var SPI_MISO_DLEN_REG = base + this.chip.SPI_MISO_DLEN_OFFS;
                if (mosi_bits > 0) {
                    await this.write_reg({addr:SPI_MOSI_DLEN_REG, value:(mosi_bits - 1)});
                }
                if (miso_bits > 0) {
                    await this.write_reg({addr:SPI_MISO_DLEN_REG, value:(miso_bits - 1)});
                }
            };
        } else {
            set_data_lengths = async(mosi_bits, miso_bits) => {
                var SPI_DATA_LEN_REG = SPI_USR1_REG;
                var SPI_MOSI_BITLEN_S = 17;
                var SPI_MISO_BITLEN_S = 8;
                mosi_mask = (mosi_bits === 0) ? 0 : (mosi_bits - 1);
                miso_mask = (miso_bits === 0) ? 0 : (miso_bits - 1);
                var val = (miso_mask << SPI_MISO_BITLEN_S) | (mosi_mask << SPI_MOSI_BITLEN_S);
                await this.write_reg({addr:SPI_DATA_LEN_REG, value:val});
            };
        }

        var SPI_CMD_USR  = (1 << 18);
        var SPI_USR2_COMMAND_LEN_SHIFT = 28;
        if(read_bits > 32) {
            throw "Reading more than 32 bits back from a SPI flash operation is unsupported";
        }
        if (data.length > 64) {
            throw "Writing more than 64 bytes of data with one SPI command is unsupported";
        }

        var data_bits = data.length * 8;
        var old_spi_usr = await this.read_reg({addr:SPI_USR_REG});
        var old_spi_usr2 = await this.read_reg({addr:SPI_USR2_REG});
        var flags = SPI_USR_COMMAND;
        var i;
        if (read_bits > 0) {
            flags |= SPI_USR_MISO;
        }
        if (data_bits > 0) {
            flags |= SPI_USR_MOSI;
        }
        await set_data_lengths(data_bits, read_bits);
        await this.write_reg({addr:SPI_USR_REG, value:flags});
        var val = (7 << SPI_USR2_COMMAND_LEN_SHIFT) | spiflash_command;
        await this.write_reg({addr:SPI_USR2_REG, value:val});
        if (data_bits == 0) {
            await this.write_reg({addr:SPI_W0_REG, value:0});
        } else {
            if (data.length % 4 != 0) {
                var padding = new Uint8Array(data.length % 4);
                data = this._appendArray(data, padding);
            }
            var next_reg = SPI_W0_REG;
            for (i = 0 ; i < data.length - 4; i+=4) {
                val = this._bytearray_to_int(data[i], data[i+1], data[i+2], data[i+3]);
                await this.write_reg({addr:next_reg, value:val});
                next_reg += 4;
            }
        }
        await this.write_reg({addr:SPI_CMD_REG, value:SPI_CMD_USR});
        for (i = 0; i < 10; i++) {
            val = await this.read_reg({addr:SPI_CMD_REG}) & SPI_CMD_USR;
            if (val == 0) {
                break;
            }
        }
        if (i === 10) {
            throw "SPI command did not complete in time";
        }
        var stat = await this.read_reg({addr:SPI_W0_REG});
        await this.write_reg({addr:SPI_USR_REG, value:old_spi_usr});
        await this.write_reg({addr:SPI_USR2_REG, value:old_spi_usr2});
        return stat;
    }

    read_flash_id = async() => {
        var SPIFLASH_RDID = 0x9F;
        var pkt = new Uint8Array(0);
        return await this.run_spiflash_command(SPIFLASH_RDID, pkt, 24);
    }
    write_flash = async (data, offset) => {
        // verify file sizes fit in flash

    }

    run_stub = async () => {
        this.log("Uploading stub...");

        var decoded = atob(this.chip.ROM_TEXT);
        var chardata = decoded.split('').map(function(x){return x.charCodeAt(0);});
        var bindata = new Uint8Array(chardata);
        var text = pako.inflate(bindata);

        decoded = atob(this.chip.ROM_DATA);
        chardata = decoded.split('').map(function(x){return x.charCodeAt(0);});
        var data = new Uint8Array(chardata);

        var blocks = Math.floor((text.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
        var i;

        await this.mem_begin(text.length, blocks, this.ESP_RAM_BLOCK, this.chip.TEXT_START);
        for (i = 0; i < blocks; i++) {
            var from_offs = i * this.ESP_RAM_BLOCK;
            var to_offs = from_offs + this.ESP_RAM_BLOCK;
            await this.mem_block(text.slice(from_offs, to_offs), i);
        }

        blocks = Math.floor((data.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
        await this.mem_begin(data.length, blocks, this.ESP_RAM_BLOCK, this.chip.DATA_START);
        for (i = 0; i < blocks; i++) {
            var from_offs = i * this.ESP_RAM_BLOCK;
            var to_offs = from_offs + this.ESP_RAM_BLOCK;
            await this.mem_block(data.slice(from_offs, to_offs), i);
        }

        this.log("Running stub...");
        await this.mem_finish(this.chip.ENTRY);

        const res = await this.transport.read({timeout: 1000, min_data: 6});
        if (res[0] === 79 && res[1] === 72 && res[2] === 65 && res[3] === 73) {
            this.log("Stub running...");
            this.IS_STUB = true;
            this.FLASH_WRITE_SIZE = 0x4000;
            return this.chip;
        } else {
            this.log("Failed to start stub. Unexpected response");
            return null;
        }
    }

    main_fn = async () => {

        await this.detect_chip();
        if (this.chip == null) {
            this.log("Error in connecting to board");
            return;
        }

        var chip = await this.chip.get_chip_description(this);
        this.log("Chip is " + chip);
        this.log("Features: " + await this.chip.get_chip_features(this));
        this.log("Crystal is " + await this.chip.get_crystal_freq(this) + "MHz");
        this.log("MAC: " + await this.chip.read_mac(this));
        await this.chip.read_mac(this);

        await this.run_stub();

    }

    program = async (fileData) => {
        console.log("EspLoader program");
    }

    flash_id = async() => {
        console.log("flash_id");
        var flashid = await this.read_flash_id();
        this.log("Manufacturer: " + (flashid & 0xff).toString(16));
        var flid_lowbyte = (flashid >> 16) & 0xff;
        this.log("Device: "+((flashid >> 8) & 0xff).toString(16) + flid_lowbyte.toString(16));
        this.log("Detected flash size: " + this.DETECTED_FLASH_SIZES[flid_lowbyte]);
    }
}


export { ESPLoader };

