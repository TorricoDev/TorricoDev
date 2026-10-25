export const DIRECTIONS = Object.freeze(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']);

export function normalizeMovement(x, y) {
  const length = Math.hypot(x, y);
  return length > 0 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
}

export function inputVector(keys) {
  return normalizeMovement(
    Number(Boolean(keys.right)) - Number(Boolean(keys.left)),
    Number(Boolean(keys.down)) - Number(Boolean(keys.up)),
  );
}

// Screen coordinates: +Y points south. Idle keeps the last valid direction.
export function facingFromVector(x, y, previous = 'S') {
  if (x === 0 && y === 0) return previous;
  const octant = Math.round(Math.atan2(y, x) / (Math.PI / 4));
  return DIRECTIONS[((octant + 2) % 8 + 8) % 8];
}

export function locomotionState(movement, previousFacing = 'S') {
  return {
    action: movement.x === 0 && movement.y === 0 ? 'idle' : 'move',
    facing: facingFromVector(movement.x, movement.y, previousFacing),
  };
}
