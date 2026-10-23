import Phaser from 'phaser';
import traveler from '../assets/traveler.json' with { type: 'json' };
import { validateManifest } from '../core/animation-contract.js';
import { registerAnimations } from '../animation/AnimationDriver.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    validateManifest(traveler);
    this.load.on('loaderror', file => {
      this.failed = true;
      document.querySelector('#loading-message').textContent = `Falha ao carregar ${file.key}. Consulte o console.`;
      console.error('Asset não carregado:', file.src);
    });
    for (const [action, animation] of Object.entries(traveler.animations)) {
      this.load.spritesheet(`${traveler.id}:${action}`, `${import.meta.env.BASE_URL}${animation.file}`, { frameWidth: traveler.cell[0], frameHeight: traveler.cell[1] });
    }
  }

  create() {
    if (this.failed) return;
    registerAnimations(this, traveler);
    this.scene.start('TestRoom', { manifest: traveler });
  }
}
