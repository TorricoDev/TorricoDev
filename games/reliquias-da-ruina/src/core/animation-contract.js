import { DIRECTIONS } from './directions.js';

export const CELL_SIZES = Object.freeze({ body: [48, 48], weapon: [64, 64], effect: [64, 64], tile: [16, 16] });

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

export function validateManifest(manifest) {
  requireValue(manifest.schemaVersion === 1, 'schemaVersion deve ser 1');
  requireValue(typeof manifest.id === 'string' && /^[a-z][a-z0-9-]*$/.test(manifest.id), 'id inválido');
  const expectedCell = CELL_SIZES[manifest.category];
  requireValue(expectedCell && manifest.cell?.length === 2 && manifest.cell.every((v, i) => v === expectedCell[i]), 'Célula incompatível com categoria');
  requireValue(['binary', 'graded'].includes(manifest.alphaMode) && (manifest.category !== 'body' || manifest.alphaMode === 'binary'), 'alphaMode inválido para categoria');
  requireValue(manifest.footAnchor?.length === 2 && manifest.footAnchor.every((v, i) => Number.isInteger(v) && v >= 0 && v < manifest.cell[i]), 'footAnchor inválido');
  requireValue(Array.isArray(manifest.directions) && manifest.directions.length > 0 && manifest.directions.length <= 8, 'Direções ausentes');
  requireValue(new Set(manifest.directions).size === manifest.directions.length && manifest.directions.every(d => DIRECTIONS.includes(d)), 'Direções inválidas ou repetidas');
  const mirrors = manifest.mirrors ?? {};
  const validMirrors = { NW: 'NE', W: 'E', SW: 'SE', NE: 'NW', E: 'W', SE: 'SW' };
  for (const [target, source] of Object.entries(mirrors)) {
    requireValue(manifest.mirrorSafe === true, 'Espelhamento exige mirrorSafe');
    requireValue(!manifest.directions.includes(target) && manifest.directions.includes(source) && validMirrors[target] === source, 'Espelhamento horizontal inválido ou encadeado');
    requireValue(manifest.footAnchor[0] === manifest.cell[0] / 2, 'Espelhamento exige pivô horizontal central');
  }
  requireValue(DIRECTIONS.every(d => manifest.directions.includes(d) || mirrors[d]), 'Manifest deve resolver as oito direções');
  requireValue(manifest.animations && Object.keys(manifest.animations).length > 0, 'Animações ausentes');
  for (const [action, animation] of Object.entries(manifest.animations)) {
    requireValue(/^[a-z][a-z0-9-]*$/.test(action), 'Nome de ação inválido');
    requireValue(Number.isInteger(animation.frames) && animation.frames > 0, `${action}: frames inválidos`);
    requireValue(Number.isFinite(animation.fps) && animation.fps > 0 && animation.fps <= 60, `${action}: FPS inválido`);
    requireValue(typeof animation.loop === 'boolean', `${action}: loop deve ser booleano`);
    requireValue(typeof animation.file === 'string' && /^assets\/[a-zA-Z0-9/_-]+\.png$/.test(animation.file), `${action}: arquivo PNG inválido`);
  }
  requireValue(Number.isInteger(manifest.baselineY) && manifest.baselineY >= 0 && manifest.baselineY < manifest.cell[1], 'baselineY inválido');
  requireValue(manifest.category !== 'body' || manifest.footAnchor[1] === manifest.baselineY + 1, 'Pivô vertical deve acompanhar a base dos pés');
  return manifest;
}

export function resolveAnimation(manifest, action, direction) {
  const animation = manifest.animations[action];
  if (!animation) throw new Error(`Ação desconhecida: ${action}`);
  const source = manifest.mirrors?.[direction] ?? direction;
  const row = manifest.directions.indexOf(source);
  if (row < 0) throw new Error(`Direção desconhecida: ${direction}`);
  return {
    key: `${manifest.id}:${action}:${source}`,
    texture: `${manifest.id}:${action}`,
    start: row * animation.frames,
    end: (row + 1) * animation.frames - 1,
    flipX: source !== direction,
    fps: animation.fps,
    repeat: animation.loop ? -1 : 0,
  };
}
