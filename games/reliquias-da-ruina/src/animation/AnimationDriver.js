import { resolveAnimation, validateManifest } from '../core/animation-contract.js';

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
}
