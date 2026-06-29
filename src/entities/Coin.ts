import Phaser from 'phaser';

export default class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin1');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setSize(20, 20);
    this.setOffset(2, 2);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.play('coin_spin');
  }

  collect() {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 30,
      alpha: 0,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
