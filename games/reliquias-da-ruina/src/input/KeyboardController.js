import Phaser from 'phaser';
import { inputVector } from '../core/directions.js';

export class KeyboardController {
  constructor(scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,F1,R,P,ESC');
  }

  read() {
    const k = this.keys;
    return inputVector({ up: k.W.isDown || k.UP.isDown, down: k.S.isDown || k.DOWN.isDown, left: k.A.isDown || k.LEFT.isDown, right: k.D.isDown || k.RIGHT.isDown });
  }

  pressed(key) { return Phaser.Input.Keyboard.JustDown(this.keys[key]); }
  clear() { this.scene.input.keyboard.resetKeys(); }
}
