import { AbstractTransport } from "../transport/AbstractTransport";
import { hexConvert } from "./hex";

/**
 * Format data packet using the Serial Line Internet Protocol (SLIP).
 * @param {Uint8Array} data Binary unsigned 8 bit array data to format.
 * @returns {Uint8Array} Formatted unsigned 8 bit data array.
 */
export function slipWriter(data: Uint8Array): Uint8Array {
  const outData = [];
  outData.push(0xc0);
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0xdb) {
      outData.push(0xdb, 0xdd);
    } else if (data[i] === 0xc0) {
      outData.push(0xdb, 0xdc);
    } else {
      outData.push(data[i]);
    }
  }
  outData.push(0xc0);
  return new Uint8Array(outData);
}

/**
 * Take a data array and return the first well formed packet after
 * replacing the escape sequence. Reads at least 8 bytes.
 * @param {Uint8Array} data Unsigned 8 bit array from the device read stream.
 * @returns Formatted packet using SLIP escape sequences.
 */
export function slipReaderFormat(data: Uint8Array): { packet: Uint8Array; newLeftOver: Uint8Array } {
  let i = 0;
  let dataStart = 0,
    dataEnd = 0;
  let state = "init";
  while (i < data.length) {
    if (state === "init" && data[i] == 0xc0) {
      dataStart = i + 1;
      state = "valid_data";
      i++;
      continue;
    }
    if (state === "valid_data" && data[i] == 0xc0) {
      dataEnd = i - 1;
      state = "packet_complete";
      break;
    }
    i++;
  }
  if (state !== "packet_complete") {
    return { packet: new Uint8Array(0), newLeftOver: data || new Uint8Array(0) };
  }

  const tempPkt = new Uint8Array(dataEnd - dataStart + 1);
  let j = 0;
  for (i = dataStart; i <= dataEnd; i++, j++) {
    if (data[i] === 0xdb && data[i + 1] === 0xdc) {
      tempPkt[j] = 0xc0;
      i++;
      continue;
    }
    if (data[i] === 0xdb && data[i + 1] === 0xdd) {
      tempPkt[j] = 0xdb;
      i++;
      continue;
    }
    tempPkt[j] = data[i];
  }
  const packet = tempPkt.slice(0, j); /* Remove unused bytes due to escape seq */
  const newLeftOver = data.slice(dataEnd + 2);

  return { packet, newLeftOver };
}

/**
 * Read from serial device using the device ReadableStream.
 * @param {number} timeout Read timeout number
 * @param {number} minData Minimum packet array length
 * @returns {Promise<Uint8Array>} 8 bit unsigned data array read from device.
 */
export async function slipRead(
  transport: AbstractTransport,
  timeout: number = 0,
  minData: number = 12,
): Promise<Uint8Array> {
  let packet = transport.leftOver;
  transport.leftOver = new Uint8Array(0);
  if (transport.slipReaderEnabled) {
    const slipResult = slipReaderFormat(packet);
    const valFinal = slipResult.packet;
    transport.leftOver = slipResult.newLeftOver;
    if (valFinal.length > 0) {
      return valFinal;
    }
    packet = transport.leftOver;
    transport.leftOver = new Uint8Array(0);
  }
  
  packet = await transport.rawRead(timeout, minData, packet);

  if (transport.tracing) {
    console.log("Read bytes");
    transport.trace(`Read ${packet.length} bytes: ${hexConvert(packet)}`);
  }

  if (transport.slipReaderEnabled) {
    const slipReaderResult = slipReaderFormat(packet);
    transport.leftOver = slipReaderResult.newLeftOver;
    if (transport.tracing) {
      console.log("Slip reader results");
      transport.trace(`Read ${slipReaderResult.packet.length} bytes: ${hexConvert(slipReaderResult.packet)}`);
    }
    return slipReaderResult.packet;
  }
  return packet;
}
