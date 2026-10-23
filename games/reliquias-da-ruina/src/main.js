import Phaser from 'phaser';
import './styles.css';
import { integerScale } from './core/pixel-scale.js';
import { BootScene } from './scenes/BootScene.js';
import { TestRoomScene } from './scenes/TestRoomScene.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 320, height: 180,
  backgroundColor: '#15262b',
  pixelArt: true,
  roundPixels: true,
  render: { antialias: false, antialiasGL: false, pixelArt: true, roundPixels: true },
  scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.NO_CENTER },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scene: [BootScene, TestRoomScene],
});

const viewport = document.querySelector('#game-viewport');
function resize() {
  const scale = integerScale(viewport.clientWidth, viewport.clientHeight);
  // setZoom changes CSS display size only; the logical camera remains 320×180.
  game.scale.setZoom(scale);
}
const observer = new ResizeObserver(resize);
observer.observe(viewport);
game.events.once(Phaser.Core.Events.READY, resize);
game.events.once(Phaser.Core.Events.DESTROY, () => observer.disconnect());

if (import.meta.hot) import.meta.hot.dispose(() => game.destroy(true));
