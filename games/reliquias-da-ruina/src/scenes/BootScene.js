import Phaser from 'phaser';
import { ACTORS } from '../assets/actor-catalog.js';
import { registerAnimations } from '../animation/AnimationDriver.js';

// Only the review build defines this map. Vite's regular asset URLs stay intact.
const embeddedAssets = import.meta.env.REVIEW_ASSETS ?? {};

export class BootScene extends Phaser.Scene {
  constructor(target = 'TestRoom') { super('Boot'); this.target = target; }

  preload() {
    this.load.on('loaderror', file => {
      this.failed = true;
      const message = this.target === 'AnimationLab' ? '#lab-loading-message' : '#loading-message';
      document.querySelector(message).textContent = `Falha ao carregar ${file.key}. Consulte o console.`;
      console.error('Asset não carregado:', file.src);
    });
    for (const { manifest } of ACTORS) {
      for (const [action, animation] of Object.entries(manifest.animations)) {
        const url = embeddedAssets[animation.file] ?? `${import.meta.env.BASE_URL}${animation.file}`;
        this.load.spritesheet(`${manifest.id}:${action}`, url, { frameWidth: manifest.cell[0], frameHeight: manifest.cell[1] });
      }
    }
  }

  create() {
    if (this.failed) return;
    for (const { manifest } of ACTORS) registerAnimations(this, manifest);
    const traveler = ACTORS.find(actor => actor.manifest.id === 'traveler-placeholder');
    this.scene.start(this.target, { actors: ACTORS, manifest: traveler.manifest });
  }
}
