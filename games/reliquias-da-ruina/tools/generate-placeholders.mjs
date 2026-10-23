import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodeRgba } from './png.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(resolve(root, 'src/assets/traveler.json'), 'utf8'));
const palette = {
  outline: [35, 51, 61, 255], hair: [94, 65, 49, 255], hairLight: [140, 101, 64, 255],
  skin: [234, 187, 135, 255], shade: [192, 135, 91, 255], cloth: [98, 149, 132, 255],
  clothLight: [148, 183, 150, 255], belt: [112, 82, 53, 255], gold: [221, 185, 100, 255], boot: [58, 70, 75, 255],
};

for (const [action, clip] of Object.entries(manifest.animations)) {
  const width = manifest.cell[0] * clip.frames, height = manifest.cell[1] * manifest.directions.length;
  const pixels = Buffer.alloc(width * height * 4);
  for (let row = 0; row < manifest.directions.length; row++) {
    const direction = manifest.directions[row];
    for (let frame = 0; frame < clip.frames; frame++) {
      const ox = frame * 48, oy = row * 48;
      function rect(x, y, w, h, color) {
        for (let py = y; py < y + h; py++) for (let px = x; px < x + w; px++) {
          if (px < 0 || px >= 48 || py < 0 || py >= 48) throw new Error('Placeholder fora da célula');
          pixels.set(palette[color], ((oy + py) * width + ox + px) * 4);
        }
      }
      const bob = frame % 2 ? -1 : 0;
      const stride = action === 'move' ? [0, 2, 0, -2][frame] : 0;
      // Both feet retain a common baseline; animation never moves the physics body.
      rect(18, 32, 6, 8, 'outline'); rect(25, 32, 6, 8, 'outline');
      rect(19, 33 + Math.max(0, stride), 4, 6 - Math.max(0, stride), 'boot');
      rect(26, 33 + Math.max(0, -stride), 4, 6 - Math.max(0, -stride), 'boot');
      rect(15, 23 + bob, 19, 12, 'outline'); rect(17, 24 + bob, 15, 9, 'cloth');
      rect(14, 25 + bob, 4, 7, 'outline'); rect(32, 25 + bob, 4, 7, 'outline');
      rect(15, 26 + bob, 2, 5, 'clothLight'); rect(33, 26 + bob, 2, 5, 'cloth');
      rect(17, 31, 15, 3, 'belt'); rect(23, 31, 3, 2, 'gold');
      rect(15, 8 + bob, 18, 16, 'outline'); rect(13, 11 + bob, 22, 9, 'outline');
      rect(16, 9 + bob, 16, 14, 'hair'); rect(14, 12 + bob, 20, 7, 'hair');
      rect(17, 10 + bob, 13, 3, 'hairLight');
      if (direction === 'S') {
        rect(17, 15 + bob, 14, 8, 'skin'); rect(17, 15 + bob, 3, 2, 'hair');
        rect(19, 18 + bob, 2, 2, 'outline'); rect(27, 18 + bob, 2, 2, 'outline');
        rect(23, 21 + bob, 3, 1, 'shade');
      } else if (direction === 'SE') {
        rect(22, 14 + bob, 11, 8, 'skin'); rect(29, 17 + bob, 2, 2, 'outline');
        rect(32, 18 + bob, 2, 2, 'skin');
      } else if (direction === 'E') {
        rect(27, 14 + bob, 7, 8, 'skin'); rect(31, 16 + bob, 2, 2, 'outline');
        rect(34, 18 + bob, 2, 2, 'skin');
      } else if (direction === 'NE') {
        rect(31, 15 + bob, 3, 7, 'shade'); rect(20, 24 + bob, 8, 7, 'clothLight');
      } else {
        rect(20, 24 + bob, 8, 7, 'clothLight'); rect(19, 19 + bob, 11, 3, 'hairLight');
      }
    }
  }
  const destination = resolve(root, 'public', clip.file);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, encodeRgba(width, height, pixels));
  console.log(`${clip.file}: ${width}×${height}, ${clip.frames} quadros × ${manifest.directions.length} direções-base`);
}
