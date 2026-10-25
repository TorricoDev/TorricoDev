import Phaser from 'phaser';
import { TEST_ROOM } from '../rooms/test-room.js';
import { Player } from '../entities/Player.js';
import { KeyboardController } from '../input/KeyboardController.js';

export class TestRoomScene extends Phaser.Scene {
  constructor() { super('TestRoom'); }

  create({ manifest }) {
    this.paused = false;
    this.debugVisible = false;
    this.keyboard = new KeyboardController(this);
    const { bounds, spawn, obstacles } = TEST_ROOM;
    this.physics.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    this.cameras.main.setScroll(0, 0).setRoundPixels(true);
    this.drawRoom();
    this.obstacles = this.physics.add.staticGroup();
    for (const obstacle of obstacles) {
      const zone = this.add.zone(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      this.physics.add.existing(zone, true);
      this.obstacles.add(zone);
      this.drawObstacle(obstacle);
    }
    this.player = new Player(this, manifest, spawn);
    this.physics.add.collider(this.player.sprite, this.obstacles);
    this.debug = this.add.graphics().setDepth(1000);
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.postUpdate, this);

    const pause = () => this.setPaused(!this.paused);
    const reset = () => this.resetPlayer();
    const blur = () => { this.keyboard.clear(); this.setPaused(true); };
    const pauseButton = document.querySelector('#pause-button');
    const resetButton = document.querySelector('#reset-button');
    pauseButton.addEventListener('click', pause);
    resetButton.addEventListener('click', reset);
    this.game.events.on(Phaser.Core.Events.BLUR, blur);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      pauseButton.removeEventListener('click', pause);
      resetButton.removeEventListener('click', reset);
      this.game.events.off(Phaser.Core.Events.BLUR, blur);
      this.events.off(Phaser.Scenes.Events.POST_UPDATE, this.postUpdate, this);
    });
    document.querySelector('#loading-message').hidden = true;
    const canvas = this.game.canvas;
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', 'Pátio de testes. Use WASD ou setas para mover. P pausa; R reinicia.');
    canvas.focus({ preventScroll: true });
  }

  drawRoom() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x15262b).fillRect(0, 0, 320, 180);
    g.fillStyle(0x344b47).fillRect(8, 22, 304, 146);
    g.fillStyle(0x789178).fillRect(8, 22, 304, 3);
    g.fillStyle(0x223838).fillRect(16, 32, 288, 128);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 18; col++) {
        const x = 16 + col * 16, y = 32 + row * 16;
        g.fillStyle((row * 7 + col * 3) % 5 ? 0x3c534a : 0x40594e).fillRect(x + 1, y + 1, 15, 15);
        g.fillStyle(0x496053).fillRect(x + 2, y + 1, 12, 1);
        if ((row * 11 + col * 7) % 13 === 0) g.fillStyle(0x729162).fillRect(x + 3, y + 3, 3, 2);
      }
    }
    // A closed arch is scenery; the room's physical bounds remain solid.
    g.fillStyle(0x172a2b).fillRect(142, 13, 36, 19);
    g.fillStyle(0x8c9a7b).fillRect(138, 17, 4, 15).fillRect(178, 17, 4, 15).fillRect(142, 13, 36, 4);
    g.fillStyle(0x665c49).fillRect(147, 20, 26, 12);
    for (let x = 150; x < 173; x += 6) g.fillStyle(0x2c3833).fillRect(x, 20, 2, 12);
    g.fillStyle(0x1d3030).fillRect(8, 160, 304, 8);
    g.fillStyle(0x677c65).fillRect(8, 160, 304, 2);
    for (const x of [25, 294]) {
      g.fillStyle(0x213531).fillRect(x - 3, 16, 6, 14);
      g.fillStyle(0xc4874f).fillRect(x - 2, 16, 4, 6);
      g.fillStyle(0xf3d48b).fillRect(x - 1, 16, 2, 3);
    }
    g.lineStyle(1, 0x5f7760, 0.55).strokeRect(144, 108, 32, 16);
    this.add.text(16, 7, 'BOSQUE / SALA 01', { fontFamily: 'monospace', fontSize: '7px', color: '#a7ba94' });
    this.add.text(222, 171, 'TESTE DE MOVIMENTO', { fontFamily: 'monospace', fontSize: '6px', color: '#829b8c' });
  }

  drawObstacle(o) {
    const x = o.x - o.width / 2, y = o.y - o.height / 2;
    const g = this.add.graphics().setDepth(o.y + o.height / 2);
    g.fillStyle(0x142d2b, 0.6).fillRect(x - 2, y + o.height - 2, o.width + 4, 6);
    g.fillStyle(0x334b46).fillRect(x, y, o.width, o.height);
    g.fillStyle(0x7e9074).fillRect(x, y - 10, o.width, 12);
    g.fillStyle(0xa1ac83).fillRect(x + 2, y - 10, o.width - 4, 2);
    g.fillStyle(0x566c56).fillRect(x + 2, y + 2, 3, o.height - 3);
    g.fillStyle(0x75915e).fillRect(x - 1, y - 4, 7, 4).fillRect(x + 2, y, 3, 6);
    if (o.kind === 'altar') {
      g.fillStyle(0x2e4340).fillRect(x + 9, y - 8, 14, 7);
      g.fillStyle(0x9bbf91).fillRect(x + 14, y - 7, 4, 5);
    }
  }

  setPaused(value) {
    this.paused = value;
    if (value) { this.physics.world.pause(); this.player.sprite.setVelocity(0, 0); }
    else { this.keyboard.clear(); this.physics.world.resume(); this.game.canvas.focus({ preventScroll: true }); }
    document.querySelector('#pause-button').innerHTML = `${value ? 'Continuar' : 'Pausar'} <kbd>P</kbd>`;
  }

  resetPlayer() { this.keyboard.clear(); this.player.reset(); }

  update() {
    if (this.keyboard.pressed('P') || this.keyboard.pressed('ESC')) this.setPaused(!this.paused);
    if (this.keyboard.pressed('R')) this.resetPlayer();
    if (this.keyboard.pressed('F1')) this.debugVisible = !this.debugVisible;
    this.player.update(this.keyboard.read(), this.paused);
  }

  postUpdate() {
    this.player.sync();
    const { sprite, action, facing } = this.player;
    document.querySelector('#player-state').textContent = action.toUpperCase();
    document.querySelector('#player-facing').textContent = facing;
    const position = document.querySelector('#player-position');
    position.textContent = `${Math.round(sprite.x)}, ${Math.round(sprite.y)}`;
    position.dataset.x = sprite.x.toFixed(3); position.dataset.y = sprite.y.toFixed(3);
    document.querySelector('#game-status').textContent = this.paused ? 'PAUSADO · P PARA CONTINUAR' : 'SALA ATIVA';
    this.debug.clear();
    if (this.debugVisible) {
      this.debug.lineStyle(1, 0xefd985, 0.9);
      const b = sprite.body;
      this.debug.strokeRect(Math.round(b.x), Math.round(b.y), b.width, b.height);
      for (const o of TEST_ROOM.obstacles) this.debug.strokeRect(o.x - o.width / 2, o.y - o.height / 2, o.width, o.height);
      const bounds = TEST_ROOM.bounds;
      this.debug.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }
}
