import Phaser from 'phaser';

export default class FireFlower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fireFlower');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setSize(28, 28);
    this.setOffset(2, 2);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.scene.tweens.add({
      targets: this,
      y: y - 32,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // 弹出动画完成后启用重力
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
      }
    });
  }

  collect() {
    this.destroy();
  }
}
