// Minimal PNG codec for the art contract: 8-bit RGBA, non-interlaced.
// Uses only Node standard library. All five PNG row filters are supported.
import { deflateSync, inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length);
  name.copy(result, 4); data.copy(result, 8);
  result.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8);
  return result;
}

export function encodeRgba(width, height, data) {
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0 || data.length !== width * height * 4) throw new Error('Dimensões RGBA inválidas');
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 6;
  const rows = Buffer.alloc((width * 4 + 1) * height);
  const pixelBytes = Buffer.from(data);
  for (let y = 0; y < height; y++) pixelBytes.copy(rows, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  return Buffer.concat([SIGNATURE, chunk('IHDR', header), chunk('IDAT', deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}

function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

export function decodeRgba(input) {
  const bytes = Buffer.from(input);
  if (!bytes.subarray(0, 8).equals(SIGNATURE)) throw new Error('Assinatura PNG inválida');
  let width, height, offset = 8, ended = false;
  const compressed = [];
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw new Error('PNG truncado');
    const length = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8);
    if (offset + length + 12 > bytes.length) throw new Error('Chunk PNG truncado');
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (crc32(bytes.subarray(offset + 4, offset + 8 + length)) !== bytes.readUInt32BE(offset + 8 + length)) throw new Error('CRC PNG inválido');
    if (type === 'IHDR') {
      if (width !== undefined || offset !== 8 || length !== 13) throw new Error('IHDR inválido');
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      if (!width || !height || width * height > 4194304 || data[8] !== 8 || data[9] !== 6 || data[10] !== 0 || data[11] !== 0 || data[12] !== 0) throw new Error('Exigido PNG RGBA 8-bit sem entrelaçamento, até 4M pixels');
    } else if (type === 'IDAT') {
      if (width === undefined) throw new Error('IHDR ausente');
      compressed.push(data);
    } else if (type === 'IEND') {
      if (length !== 0) throw new Error('IEND inválido');
      ended = true; offset += 12; break;
    } else if ((bytes[offset + 4] & 32) === 0) throw new Error(`Chunk crítico não suportado: ${type}`);
    offset += length + 12;
  }
  if (!ended || offset !== bytes.length || !compressed.length) throw new Error('PNG incompleto ou dados extras');
  const stride = width * 4;
  const rows = inflateSync(Buffer.concat(compressed), { maxOutputLength: (stride + 1) * height });
  if (rows.length !== (stride + 1) * height) throw new Error('Quantidade de pixels inválida');
  const data = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = rows[y * (stride + 1)];
    if (filter > 4) throw new Error('Filtro PNG inválido');
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x;
      const a = x >= 4 ? data[i - 4] : 0, b = y ? data[i - stride] : 0, c = y && x >= 4 ? data[i - stride - 4] : 0;
      const predictor = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      data[i] = (rows[y * (stride + 1) + x + 1] + predictor) & 255;
    }
  }
  return { width, height, data };
}
