import Phaser from 'phaser';

export default class Mushroom extends Phaser.Physics.Arcade.Sprite {
  private speed = 80;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mushroom');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setSize(28, 28);
    this.setOffset(2, 2);

    this.scene.tweens.add({
      targets: this,
      y: y - 32,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.setVelocityX(this.speed);
      }
    });
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.touching.left) {
      this.speed = Math.abs(this.speed);
    } else if (body.blocked.right || body.touching.right) {
      this.speed = -Math.abs(this.speed);
    }
    // 每帧持续应用速度，避免被物理组 add 时的默认值(0)重置后不再移动
    this.setVelocityX(this.speed);
  }

  collect() {
    this.destroy();
  }
}
