import { resolveAnimation, validateManifest } from '../core/animation-contract.js';
import { stepFrameIndex } from '../core/animation-lab.js';

export function registerAnimations(scene, manifest) {
  validateManifest(manifest);
  for (const action of Object.keys(manifest.animations)) {
    for (const direction of manifest.directions) {
      const clip = resolveAnimation(manifest, action, direction);
      if (!scene.anims.exists(clip.key)) {
        scene.anims.create({ key: clip.key, frames: scene.anims.generateFrameNumbers(clip.texture, { start: clip.start, end: clip.end }), frameRate: clip.fps, repeat: clip.repeat });
      }
    }
  }
}

export class AnimationDriver {
  constructor(sprite, manifest) { this.sprite = sprite; this.manifest = manifest; }

  play(action, facing) {
    const clip = resolveAnimation(this.manifest, action, facing);
    this.sprite.setFlipX(clip.flipX);
    // ignoreIfPlaying keeps a held key from restarting the animation every frame.
    this.sprite.play(clip.key, true);
  }

  get frameIndex() { return (this.sprite.anims.currentFrame?.index ?? 1) - 1; }

  pause() { this.sprite.anims.pause(); }

  resume() {
    const state = this.sprite.anims;
    state.resume();
    if (!state.isPlaying && state.currentAnim) state.restart();
  }

  setTimeScale(multiplier) {
    if (!Number.isFinite(multiplier) || multiplier <= 0) throw new Error('Velocidade deve ser positiva');
    // Instance-local playback speed; never mutate the shared animation/manifest.
    this.sprite.anims.timeScale = multiplier;
  }

  setFrame(index) {
    const frames = this.sprite.anims.currentAnim?.frames;
    if (!frames || !Number.isInteger(index) || index < 0 || index >= frames.length) throw new Error('Quadro inválido');
    this.sprite.anims.pause(frames[index]);
  }

  step(delta = 1) {
    const count = this.sprite.anims.currentAnim.frames.length;
    this.setFrame(stepFrameIndex(this.frameIndex, delta, count));
  }
}
