export const TEST_ROOM = Object.freeze({
  id: 'forgotten-courtyard',
  bounds: { x: 16, y: 32, width: 288, height: 128 },
  spawn: { x: 160, y: 116 },
  obstacles: [
    { x: 72, y: 65, width: 24, height: 20, kind: 'pillar' },
    { x: 224, y: 65, width: 24, height: 20, kind: 'pillar' },
    { x: 72, y: 126, width: 28, height: 16, kind: 'stone' },
    { x: 224, y: 126, width: 28, height: 16, kind: 'stone' },
    { x: 160, y: 56, width: 32, height: 18, kind: 'altar' },
  ],
});

export const PLAYER_BODY = Object.freeze({ width: 12, height: 8, offsetX: 18, offsetY: 32 });
export const PLAYER_SPEED = 72;
