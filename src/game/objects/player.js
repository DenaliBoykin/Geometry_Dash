import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(40, 40);
    this.body.setOffset(4, 4);

    this.alive = true;
    this.rotationSpeed = 8;
  }

  jump(force = 700) {
    if (!this.alive) return;

    if (this.body.blocked.down || this.body.touching.down) {
      this.setVelocityY(-force);
      return true;
    }

    return false;
  }

  die() {
    this.alive = false;
    this.setTint(0xff4d4d);
    this.setVelocity(0, 0);
    this.body.enable = false;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.alive) return;

    if (this.body.blocked.down || this.body.touching.down) {
      this.rotation = 0;
    } else {
      this.angle += this.rotationSpeed;
    }
  }
}
