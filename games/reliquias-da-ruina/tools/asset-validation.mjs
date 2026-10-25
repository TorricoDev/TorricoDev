import { validateManifest } from '../src/core/animation-contract.js';

export function validateSheet(manifest, action, image) {
  validateManifest(manifest);
  const animation = manifest.animations[action];
  if (!animation) throw new Error(`Ação desconhecida: ${action}`);
  const [cw, ch] = manifest.cell;
  if (image.width !== cw * animation.frames || image.height !== ch * manifest.directions.length) throw new Error(`${action}: dimensões incompatíveis com manifest`);
  if (image.data.length !== image.width * image.height * 4) throw new Error(`${action}: buffer RGBA inválido`);
  for (let row = 0; row < manifest.directions.length; row++) {
    for (let frame = 0; frame < animation.frames; frame++) {
      let baseline = -1, transparent = false;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const alpha = image.data[((row * ch + y) * image.width + frame * cw + x) * 4 + 3];
        if (!alpha) { transparent = true; continue; }
        if (manifest.alphaMode === 'binary' && alpha !== 255) throw new Error(`${action}/${row}/${frame}: alpha intermediário`);
        if (x === 0 || y === 0 || x === cw - 1 || y === ch - 1) throw new Error(`${action}/${row}/${frame}: arte tocando borda da célula`);
        baseline = Math.max(baseline, y);
      }
      if (!transparent || baseline < 0) throw new Error(`${action}/${row}/${frame}: célula opaca ou vazia`);
      if (manifest.category === 'body' && baseline !== manifest.baselineY) throw new Error(`${action}/${row}/${frame}: pés desalinhados (${baseline} != ${manifest.baselineY})`);
    }
  }
  return { action, frames: animation.frames * manifest.directions.length, width: image.width, height: image.height };
}
