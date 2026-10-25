import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateManifest, resolveAnimation } from '../src/core/animation-contract.js';
import { DIRECTIONS } from '../src/core/directions.js';

const manifest = JSON.parse(await readFile(new URL('../src/assets/traveler.json', import.meta.url), 'utf8'));
test('five original rows provide all eight directions using safe horizontal mirrors', () => {
  assert.equal(validateManifest(manifest), manifest);
  assert.equal(resolveAnimation(manifest, 'move', 'W').key, resolveAnimation(manifest, 'move', 'E').key);
  assert.equal(resolveAnimation(manifest, 'move', 'W').flipX, true);
  assert.equal(resolveAnimation(manifest, 'move', 'E').flipX, false);
  assert.equal(resolveAnimation(manifest, 'idle', 'NW').key, 'traveler-placeholder:idle:NE');
  for (const facing of DIRECTIONS) {
    for (const action of Object.keys(manifest.animations)) {
      const clip = resolveAnimation(manifest, action, facing);
      assert.ok(clip.start >= 0 && clip.end < manifest.directions.length * manifest.animations[action].frames);
      assert.equal(clip.end - clip.start + 1, manifest.animations[action].frames);
    }
  }
});
test('animation speed, repeat and frame range come from action data', () => {
  const changed = structuredClone(manifest);
  changed.animations.idle.fps = 7;
  changed.animations.idle.loop = false;
  const clip = resolveAnimation(changed, 'idle', 'S');
  assert.equal(clip.fps, 7); assert.equal(clip.repeat, 0);
  assert.equal(clip.start, 8); assert.equal(clip.end, 9);
});
test('eight original directions work without mirroring asymmetric art', () => {
  const changed = structuredClone(manifest);
  changed.directions = DIRECTIONS; changed.mirrors = {}; changed.mirrorSafe = false;
  validateManifest(changed);
  for (const direction of DIRECTIONS) assert.equal(resolveAnimation(changed, 'move', direction).flipX, false);
});
for (const [label, mutate] of [
  ['unsafe mirroring', m => { m.mirrorSafe = false; }],
  ['mirror chains', m => { m.mirrors.NW = 'W'; }],
  ['missing directions', m => { delete m.mirrors.W; }],
  ['duplicate directions', m => { m.directions.push('S'); }],
  ['off-center mirror anchor', m => { m.footAnchor[0] = 20; }],
  ['wrong cell category', m => { m.cell = [32, 32]; }],
  ['invalid FPS', m => { m.animations.move.fps = 0; }],
  ['invalid frame count', m => { m.animations.move.frames = 1.5; }],
  ['path traversal', m => { m.animations.move.file = '../private.png'; }],
  ['opaque body alpha policy', m => { m.alphaMode = 'graded'; }],
  ['wrong vertical pivot', m => { m.footAnchor[1] = 38; }],
]) {
  test(`manifest rejects ${label}`, () => {
    const changed = structuredClone(manifest); mutate(changed);
    assert.throws(() => validateManifest(changed));
  });
}
test('unknown states and orientations fail clearly', () => {
  assert.throws(() => resolveAnimation(manifest, 'attack', 'S'), /Ação desconhecida/);
  assert.throws(() => resolveAnimation(manifest, 'move', 'UP'), /Direção desconhecida/);
});
