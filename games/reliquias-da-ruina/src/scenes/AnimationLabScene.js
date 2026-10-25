import Phaser from 'phaser';
import { AnimationDriver } from '../animation/AnimationDriver.js';
import { resolveAnimation } from '../core/animation-contract.js';
import { DIRECTIONS } from '../core/directions.js';
import { labCellGeometry, validateLabZoom } from '../core/animation-lab.js';

const PALETTES = {
  dark: { base: 0x15262b, alternate: 0x15262b, ink: '#cbd8c1', grid: 0x52695e },
  light: { base: 0xe8e4d6, alternate: 0xe8e4d6, ink: '#263d35', grid: 0xaaa998 },
  checker: { base: 0xd1d8ca, alternate: 0xb3beb0, ink: '#263d35', grid: 0x82967e },
};

export class AnimationLabScene extends Phaser.Scene {
  constructor() { super('AnimationLab'); }

  create({ actors }) {
    this.actors = actors;
    this.playing = true;
    this.samples = [];
    this.background = this.add.graphics().setDepth(0);
    this.guides = this.add.graphics().setDepth(2);
    this.ui = Object.fromEntries(['actor', 'action', 'play', 'previous', 'next', 'frame', 'frame-label', 'speed', 'zoom', 'zoom-label', 'background', 'grid', 'pivot', 'baseline', 'hitbox', 'directions', 'cell', 'sheet', 'fps', 'frames', 'mirrors', 'alpha', 'body', 'status'].map(name => [name, document.querySelector(`#lab-${name}`)]));
    this.listeners = [];
    this.ui.actor.replaceChildren();
    for (const { manifest } of actors) this.ui.actor.add(new Option(manifest.id, manifest.id));
    this.bind('actor', 'change', () => this.selectActor(this.ui.actor.value));
    this.bind('action', 'change', () => this.selectAction(this.ui.action.value));
    this.bind('play', 'click', () => this.setPlaying(!this.playing));
    this.bind('previous', 'click', () => this.step(-1));
    this.bind('next', 'click', () => this.step(1));
    this.bind('frame', 'input', () => this.seek(Number(this.ui.frame.value)));
    this.bind('speed', 'change', () => {
      for (const { driver } of this.samples) driver.setTimeScale(Number(this.ui.speed.value));
      this.updateTelemetry();
    });
    this.bind('zoom', 'input', () => this.setZoom(Number(this.ui.zoom.value)));
    for (const name of ['background', 'grid', 'pivot', 'baseline', 'hitbox']) this.bind(name, 'change', () => this.drawGuides());
    this.selectActor(this.ui.actor.value);
    this.setZoom(Number(this.ui.zoom.value));
    document.querySelector('#lab-loading-message').hidden = true;
    this.game.canvas.setAttribute('aria-label', 'Galeria das oito direções de animação: N, NE, E, SE, S, SW, W, NW.');
    const listeners = this.listeners;
    const cleanup = () => { for (const remove of listeners) remove(); };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
  }

  bind(name, event, listener) {
    const element = this.ui[name];
    element.addEventListener(event, listener);
    this.listeners.push(() => element.removeEventListener(event, listener));
  }

  selectActor(id) {
    this.actor = this.actors.find(actor => actor.manifest.id === id);
    this.ui.action.replaceChildren();
    for (const action of Object.keys(this.actor.manifest.animations)) this.ui.action.add(new Option(action, action));
    this.selectAction(this.ui.action.value);
  }

  selectAction(action) {
    this.action = action;
    for (const { sprite, label } of this.samples) { sprite.destroy(); label.destroy(); }
    this.ui.directions.replaceChildren();
    const { manifest, hitbox } = this.actor;
    this.samples = DIRECTIONS.map((direction, index) => {
      const geometry = labCellGeometry(manifest, index, hitbox);
      const sprite = this.add.sprite(geometry.pivot.x, geometry.pivot.y, `${manifest.id}:${action}`).setDepth(1);
      sprite.setOrigin(manifest.footAnchor[0] / manifest.cell[0], manifest.footAnchor[1] / manifest.cell[1]);
      const driver = new AnimationDriver(sprite, manifest);
      driver.play(action, direction);
      driver.setTimeScale(Number(this.ui.speed.value));
      driver.setFrame(0);
      if (this.playing) driver.resume();
      const label = this.add.text(index % 4 * 80 + 40, Math.floor(index / 4) * 90 + 9, direction, { fontFamily: 'monospace', fontSize: '8px' }).setOrigin(0.5, 0).setDepth(3);
      const readout = document.createElement('li');
      readout.dataset.direction = direction;
      const heading = document.createElement('strong');
      heading.textContent = direction;
      const source = document.createElement('span');
      source.textContent = manifest.mirrors?.[direction] ? `← ${manifest.mirrors[direction]} · espelhado` : 'base original';
      const frame = document.createElement('output');
      frame.setAttribute('aria-label', `Quadro ${direction}`);
      readout.append(heading, source, frame);
      this.ui.directions.append(readout);
      return { direction, sprite, driver, label, geometry, frame };
    });
    const clip = manifest.animations[action];
    this.ui.frame.max = clip.frames - 1;
    this.ui.cell.textContent = `${manifest.cell[0]} × ${manifest.cell[1]} px`;
    this.ui.sheet.textContent = `${manifest.cell[0] * clip.frames} × ${manifest.cell[1] * manifest.directions.length} px`;
    this.ui.frames.textContent = `${clip.frames} por direção · ${clip.loop ? 'loop' : 'uma vez'}`;
    this.ui.mirrors.textContent = Object.entries(manifest.mirrors ?? {}).map(([target, source]) => `${target} ← ${source}`).join(' · ') || 'Sem espelhamento';
    this.ui.alpha.textContent = manifest.alphaMode === 'binary' ? 'RGBA · alpha 0 / 255' : 'RGBA · alpha graduado';
    this.ui.body.textContent = hitbox ? `${hitbox.width} × ${hitbox.height} px · offset ${hitbox.offsetX}, ${hitbox.offsetY}` : 'Não configurada para este personagem';
    this.ui.hitbox.disabled = !hitbox;
    this.drawGuides();
    this.updateTelemetry();
  }

  setPlaying(value) {
    this.playing = value;
    for (const { driver } of this.samples) value ? driver.resume() : driver.pause();
    this.updateTelemetry();
  }

  seek(index) {
    this.playing = false;
    for (const { driver } of this.samples) driver.setFrame(index);
    this.updateTelemetry();
  }

  step(delta) {
    this.playing = false;
    for (const { driver } of this.samples) driver.step(delta);
    this.updateTelemetry();
  }

  setZoom(value) {
    this.game.scale.setZoom(validateLabZoom(value));
    this.ui['zoom-label'].textContent = `${value}×`;
  }

  drawGuides() {
    const palette = PALETTES[this.ui.background.value];
    const bg = this.background.clear();
    for (let y = 0; y < 180; y += 8) {
      for (let x = 0; x < 320; x += 8) bg.fillStyle((x / 8 + y / 8) % 2 ? palette.base : palette.alternate).fillRect(x, y, 8, 8);
    }
    const g = this.guides.clear();
    for (const { geometry: cell, label } of this.samples) {
      label.setColor(palette.ink);
      const { x, y, width, height, pivot, baseline, hitbox } = cell;
      if (this.ui.grid.checked) {
        g.lineStyle(1, palette.grid, 0.7).strokeRect(x, y, width, height);
        for (let step = 8; step < width; step += 8) g.lineBetween(x + step, y, x + step, y + height);
        for (let step = 8; step < height; step += 8) g.lineBetween(x, y + step, x + width, y + step);
      }
      if (this.ui.baseline.checked) g.fillStyle(0x249b91).fillRect(x, baseline, width, 1);
      if (this.ui.hitbox.checked && hitbox) g.lineStyle(1, 0xc18d28).strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
      if (this.ui.pivot.checked) g.fillStyle(0xe57252).fillRect(pivot.x - 2, pivot.y, 5, 1).fillRect(pivot.x, pivot.y - 2, 1, 5);
    }
  }

  updateTelemetry() {
    const manifest = this.actor.manifest;
    const animation = manifest.animations[this.action];
    this.ui.play.textContent = this.playing ? 'Pausar' : 'Reproduzir';
    this.ui.status.textContent = this.playing ? 'REPRODUZINDO' : 'PAUSADO';
    this.ui.fps.textContent = `${animation.fps} original · ${animation.fps * Number(this.ui.speed.value)} efetivo`;
    for (const { direction, driver, sprite, frame } of this.samples) {
      const clip = resolveAnimation(manifest, this.action, direction);
      frame.textContent = `${driver.frameIndex + 1} / ${animation.frames}`;
      frame.dataset.frameIndex = driver.frameIndex;
      frame.dataset.textureFrame = sprite.frame.name;
      frame.dataset.flipX = sprite.flipX;
      frame.dataset.animationKey = clip.key;
    }
    const index = this.samples[0].driver.frameIndex;
    this.ui.frame.value = index;
    this.ui['frame-label'].textContent = `${String(index + 1).padStart(2, '0')} / ${String(animation.frames).padStart(2, '0')}`;
  }

  update() {
    if (!this.samples?.length) return;
    if (this.playing && this.samples.every(({ sprite }) => !sprite.anims.isPlaying)) this.setPlaying(false);
    this.updateTelemetry();
  }
}
