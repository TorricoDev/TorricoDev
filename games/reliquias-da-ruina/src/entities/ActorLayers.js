export class ActorLayers {
  constructor(scene, body) {
    this.body = body;
    this.shadow = scene.add.ellipse(body.x, body.y - 2, 21, 7, 0x102328, 0.6);
    // Attachment slots: no weapon behavior or attack effects in stage 0.
    this.weapon = scene.add.container();
    this.effects = scene.add.container();
  }

  sync(facing) {
    const { body } = this;
    const x = Math.round(body.x), y = Math.round(body.y);
    this.shadow.setPosition(x, y - 2).setDepth(body.y - 0.2);
    body.setDepth(body.y);
    this.weapon.setPosition(x, y).setDepth(body.y + (facing.startsWith('N') ? -0.1 : 0.1));
    this.effects.setPosition(x, y).setDepth(body.y + 0.2);
  }
}
