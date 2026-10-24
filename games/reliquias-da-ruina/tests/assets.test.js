import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { decodeRgba, encodeRgba, crc32 } from '../tools/png.mjs';
import { validateSheet } from '../tools/asset-validation.mjs';

const manifest = JSON.parse(await readFile(new URL('../src/assets/traveler.json', import.meta.url), 'utf8'));
const idleBytes = await readFile(new URL('../public/assets/actors/traveler/idle.png', import.meta.url));
const idle = decodeRgba(idleBytes);
test('tracked sheets match dimensions, alpha, margins and baseline', async () => {
  for (const [action, clip] of Object.entries(manifest.animations)) {
    const bytes = await readFile(new URL(`../public/${clip.file}`, import.meta.url));
    const result = validateSheet(manifest, action, decodeRgba(bytes));
    assert.equal(result.frames, clip.frames * 5);
  }
});
test('PNG encoder and decoder preserve exact RGBA, including transparent pixels', () => {
  const data = Buffer.from([10, 20, 30, 0, 100, 120, 200, 255, 1, 2, 3, 128, 255, 0, 32, 255]);
  assert.deepEqual(decodeRgba(encodeRgba(2, 2, data)), { width: 2, height: 2, data });
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});
test('PNG parser rejects corrupt, truncated and non-PNG inputs', () => {
  const corrupt = Buffer.from(idleBytes); corrupt[45] ^= 1;
  assert.throws(() => decodeRgba(corrupt));
  assert.throws(() => decodeRgba(idleBytes.subarray(0, -4)));
  assert.throws(() => decodeRgba(Buffer.from('not an image')));
});
test('sheet validation rejects dimensions, alpha blending, cropping, empty frames and foot drift', () => {
  assert.throws(() => validateSheet(manifest, 'idle', { ...idle, width: idle.width + 1 }), /dimensões/);
  const blend = structuredClone(idle);
  blend.data[(10 * idle.width + 20) * 4 + 3] = 128;
  assert.throws(() => validateSheet(manifest, 'idle', blend), /alpha intermediário/);
  const crop = structuredClone(idle); crop.data[3] = 255;
  assert.throws(() => validateSheet(manifest, 'idle', crop), /borda/);
  const empty = { ...idle, data: Buffer.alloc(idle.data.length) };
  assert.throws(() => validateSheet(manifest, 'idle', empty), /vazia/);
  const drift = structuredClone(idle); drift.data[(40 * idle.width + 24) * 4 + 3] = 255;
  assert.throws(() => validateSheet(manifest, 'idle', drift), /pés desalinhados/);
});

function pngFixture(filteredRows) {
  function block(type, bytes) {
    const result = Buffer.alloc(bytes.length + 12);
    result.writeUInt32BE(bytes.length); result.write(type, 4); bytes.copy(result, 8);
    result.writeUInt32BE(crc32(result.subarray(4, bytes.length + 8)), bytes.length + 8);
    return result;
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(2, 0); header.writeUInt32BE(2, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), block('IHDR', header), block('IDAT', deflateSync(Buffer.from(filteredRows))), block('IEND', Buffer.alloc(0))]);
}
test('decoder supports PNG row filters Sub, Up, Average and Paeth used by art exporters', () => {
  const cases = [
    [1, [10,20,30,40,10,10,10,10], [11,21,31,41,11,11,11,11]],
    [2, [10,20,30,40,20,30,40,50], [1,1,1,1,2,2,2,2]],
    [3, [10,20,30,40,15,20,25,30], [6,11,16,21,7,7,7,7]],
    [4, [10,20,30,40,10,10,10,10], [1,1,1,1,2,2,2,2]],
  ];
  const expected = Buffer.from([10,20,30,40,20,30,40,50,11,21,31,41,22,32,42,52]);
  for (const [filter, row1, row2] of cases) {
    const image = decodeRgba(pngFixture([filter, ...row1, filter, ...row2]));
    assert.deepEqual(image.data, expected, `filter ${filter}`);
  }
});
