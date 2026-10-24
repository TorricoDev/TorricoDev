import Phaser from 'phaser';
import './styles.css';
import { integerScale } from './core/pixel-scale.js';
import { BootScene } from './scenes/BootScene.js';
import { TestRoomScene } from './scenes/TestRoomScene.js';
import { AnimationLabScene } from './scenes/AnimationLabScene.js';

const isLab = new URLSearchParams(location.search).get('view') === 'animations';
document.querySelector('#room-view').hidden = isLab;
document.querySelector('#animation-lab').hidden = !isLab;
document.querySelector(`[data-view="${isLab ? 'animations' : 'room'}"]`).setAttribute('aria-current', 'page');
if (isLab) {
  document.title = 'Relíquias da Ruína · Laboratório de animações';
  document.querySelector('#view-subtitle').textContent = 'Laboratório de animações';
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: isLab ? 'lab-game' : 'game',
  width: 320, height: 180,
  backgroundColor: '#15262b',
  pixelArt: true,
  roundPixels: true,
  render: { antialias: false, antialiasGL: false, pixelArt: true, roundPixels: true },
  scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.NO_CENTER },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scene: [new BootScene(isLab ? 'AnimationLab' : 'TestRoom'), TestRoomScene, AnimationLabScene],
});

const viewport = document.querySelector('#game-viewport');
function resize() {
  if (isLab) return; // The laboratory's manual integer zoom is independent.
  const scale = integerScale(viewport.clientWidth, viewport.clientHeight);
  // setZoom changes CSS display size only; the logical camera remains 320×180.
  game.scale.setZoom(scale);
}
const observer = new ResizeObserver(resize);
observer.observe(viewport);
game.events.once(Phaser.Core.Events.READY, resize);
game.events.once(Phaser.Core.Events.DESTROY, () => observer.disconnect());

if (import.meta.hot) import.meta.hot.dispose(() => game.destroy(true));
