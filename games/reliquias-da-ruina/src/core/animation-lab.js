export function stepFrameIndex(index, delta, count) {
  if (!Number.isInteger(count) || count < 1 || !Number.isInteger(index) || index < 0 || index >= count || !Number.isInteger(delta)) {
    throw new Error('Quadro ou deslocamento inválido');
  }
  return ((index + delta) % count + count) % count;
}

export function validateLabZoom(value) {
  if (!Number.isInteger(value) || value < 1 || value > 8) throw new Error('Zoom deve ser inteiro entre 1 e 8');
  return value;
}

export function labCellGeometry(manifest, index, hitbox = null) {
  if (!Number.isInteger(index) || index < 0 || index > 7) throw new Error('Índice de direção inválido');
  const [width, height] = manifest.cell;
  const x = index % 4 * 80 + (80 - width) / 2;
  const y = Math.floor(index / 4) * 90 + 24;
  return {
    x, y, width, height,
    pivot: { x: x + manifest.footAnchor[0], y: y + manifest.footAnchor[1] },
    baseline: y + manifest.baselineY,
    hitbox: hitbox ? { x: x + hitbox.offsetX, y: y + hitbox.offsetY, width: hitbox.width, height: hitbox.height } : null,
  };
}
