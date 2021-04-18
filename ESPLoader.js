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
    static XTAL_CLK_DIVIDER= 1;

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

}

class ESP32S2ROM {
    static CHIP_NAME = "ESP32-S2";
    static IMAGE_CHIP_ID = 2;
    static CHIP_DETECT_MAGIC_VALUE = 0x000007c6;
    static MAC_EFUSE_REG = 0x3f41A044;
    static EFUSE_BASE = 0x3f41A000;

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
}

class ESPLoader {
    constructor(transport, terminal) {
        this.transport = transport;
        this.terminal = terminal;
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

    flush_input = async () => {
        try {
            await this.transport.read(200);
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
                var p = await this.transport.read(timeout);
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
        val = await this.command({op:0x0a, data:pkt, timeout:timeout});
        console.log("Read reg resp");
        console.log(val);
        return val[0];
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
                const res = await this.transport.read(1000);
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
        this.chip.read_mac(this);
    }
}


export { ESPLoader };

