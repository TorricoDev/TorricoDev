import test from 'node:test';
import assert from 'node:assert/strict';
import { DIRECTIONS, normalizeMovement, inputVector, facingFromVector, locomotionState } from '../src/core/directions.js';
import { integerScale } from '../src/core/pixel-scale.js';
import { PLAYER_BODY, TEST_ROOM } from '../src/rooms/test-room.js';

const vectors = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
test('all eight directions preserve the same speed', () => {
  vectors.forEach(([x, y], index) => {
    const movement = normalizeMovement(x, y);
    assert.ok(Math.abs(Math.hypot(movement.x, movement.y) - 1) < 1e-12);
    assert.equal(facingFromVector(movement.x, movement.y), DIRECTIONS[index]);
  });
});
test('idle retains facing, with south as the initial direction', () => {
  assert.deepEqual(locomotionState({ x: 0, y: 0 }, 'NW'), { action: 'idle', facing: 'NW' });
  assert.equal(facingFromVector(0, 0), 'S');
  assert.deepEqual(locomotionState({ x: 1, y: -1 }, 'S'), { action: 'move', facing: 'NE' });
});
test('opposite keys cancel without NaN', () => {
  assert.deepEqual(inputVector({ up: true, down: true, left: true, right: true }), { x: 0, y: 0 });
  assert.deepEqual(inputVector({ up: true, down: true, right: true }), { x: 1, y: 0 });
  assert.deepEqual(inputVector({}), { x: 0, y: 0 });
});
test('near-horizontal vectors are visually quantized without changing the movement vector', () => {
  assert.equal(facingFromVector(10, -1), 'E');
  assert.equal(facingFromVector(-10, -1), 'W');
  assert.equal(facingFromVector(1, -10), 'N');
});
test('viewport scaling always uses whole pixels, including undersized viewports', () => {
  assert.equal(integerScale(960, 540), 3);
  assert.equal(integerScale(1000, 500), 2);
  assert.equal(integerScale(319, 179), 1);
  assert.equal(integerScale(0, 0), 1);
});
test('room spawn and every static obstacle fit inside room bounds', () => {
  const { bounds: b, spawn: s, obstacles } = TEST_ROOM;
  const left = s.x - PLAYER_BODY.width / 2, top = s.y - PLAYER_BODY.height;
  assert.ok(left >= b.x && top >= b.y && left + PLAYER_BODY.width <= b.x + b.width && s.y <= b.y + b.height);
  for (const o of obstacles) {
    assert.ok(o.x - o.width / 2 >= b.x && o.x + o.width / 2 <= b.x + b.width);
    assert.ok(o.y - o.height / 2 >= b.y && o.y + o.height / 2 <= b.y + b.height);
    const overlaps = left < o.x + o.width / 2 && left + PLAYER_BODY.width > o.x - o.width / 2 && top < o.y + o.height / 2 && s.y > o.y - o.height / 2;
    assert.equal(overlaps, false, 'Spawn must not overlap a collider');
  }
});
