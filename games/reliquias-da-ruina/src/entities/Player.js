import { locomotionState } from '../core/directions.js';
import { AnimationDriver } from '../animation/AnimationDriver.js';
import { ActorLayers } from './ActorLayers.js';
import { PLAYER_BODY, PLAYER_SPEED } from '../rooms/test-room.js';

export class Player {
  constructor(scene, manifest, spawn) {
    this.spawn = spawn;
    this.facing = 'S';
    this.action = 'idle';
    this.sprite = scene.physics.add.sprite(spawn.x, spawn.y, `${manifest.id}:idle`);
    this.sprite.setOrigin(manifest.footAnchor[0] / manifest.cell[0], manifest.footAnchor[1] / manifest.cell[1]);
    this.sprite.body.setSize(PLAYER_BODY.width, PLAYER_BODY.height).setOffset(PLAYER_BODY.offsetX, PLAYER_BODY.offsetY);
    this.sprite.setCollideWorldBounds(true);
    this.animations = new AnimationDriver(this.sprite, manifest);
    this.layers = new ActorLayers(scene, this.sprite);
    this.animations.play(this.action, this.facing);
  }

  update(movement, paused) {
    const vector = paused ? { x: 0, y: 0 } : movement;
    this.sprite.setVelocity(vector.x * PLAYER_SPEED, vector.y * PLAYER_SPEED);
    if (paused) { this.sprite.anims.pause(); return; }
    this.sprite.anims.resume();
    const state = locomotionState(vector, this.facing);
    this.action = state.action;
    this.facing = state.facing;
    this.animations.play(this.action, this.facing);
  }

  sync() { this.layers.sync(this.facing); }

  reset() {
    const body = this.sprite.body;
    body.reset(this.spawn.x, this.spawn.y);
    // Phaser 3.90 reset() omits the custom offset until the next physics step.
    // Sync now (also while paused), without adding a postUpdate displacement.
    body.updateFromGameObject();
    body.prev.copy(body.position);
    body.prevFrame.copy(body.position);
    this.sprite.setVelocity(0, 0);
    this.action = 'idle'; this.facing = 'S';
    this.animations.play(this.action, this.facing);
    this.sync();
  }
}
