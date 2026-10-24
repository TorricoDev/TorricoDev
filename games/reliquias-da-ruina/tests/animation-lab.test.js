import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { labCellGeometry, stepFrameIndex, validateLabZoom } from '../src/core/animation-lab.js';
import { PLAYER_BODY } from '../src/rooms/test-room.js';

const manifest = JSON.parse(await readFile(new URL('../src/assets/traveler.json', import.meta.url)));

test('frame stepping wraps in both directions, including single-frame clips', () => {
  assert.equal(stepFrameIndex(0, -1, 4), 3);
  assert.equal(stepFrameIndex(3, 1, 4), 0);
  assert.equal(stepFrameIndex(2, 9, 4), 3);
  assert.equal(stepFrameIndex(0, -7, 1), 0);
});
test('frame stepping rejects invalid indices and frame counts', () => {
  for (const args of [[0, 1, 0], [-1, 1, 4], [4, 1, 4], [1.5, 1, 4], [0, 0.5, 4], [0, 1, Infinity]]) {
    assert.throws(() => stepFrameIndex(...args));
  }
});
test('manual zoom permits exactly the eight integer scales', () => {
  for (let zoom = 1; zoom <= 8; zoom++) assert.equal(validateLabZoom(zoom), zoom);
  for (const zoom of [0, 9, 1.5, NaN, Infinity, '3']) assert.throws(() => validateLabZoom(zoom));
});
test('all eight cells fit the 320×180 gallery and preserve source anchors/collider geometry', () => {
  const snapshot = structuredClone(manifest);
  const pivots = new Set();
  for (let index = 0; index < 8; index++) {
    const cell = labCellGeometry(manifest, index, PLAYER_BODY);
    assert.ok(cell.x >= 0 && cell.x + cell.width <= 320);
    assert.ok(cell.y >= 0 && cell.y + cell.height <= 180);
    assert.equal(cell.pivot.x - cell.x, 24);
    assert.equal(cell.pivot.y - cell.y, 40);
    assert.equal(cell.baseline - cell.y, 39);
    assert.deepEqual(cell.hitbox, { x: cell.x + 18, y: cell.y + 32, width: 12, height: 8 });
    assert.equal(cell.hitbox.y + cell.hitbox.height, cell.pivot.y);
    pivots.add(`${cell.pivot.x},${cell.pivot.y}`);
  }
  assert.equal(pivots.size, 8);
  assert.deepEqual(manifest, snapshot);
});
test('missing body profile remains explicit and invalid gallery indices fail', () => {
  assert.equal(labCellGeometry(manifest, 0).hitbox, null);
  for (const index of [-1, 8, 0.5, NaN]) assert.throws(() => labCellGeometry(manifest, index));
});
