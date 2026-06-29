import Phaser from 'phaser';

export default class Fireball extends Phaser.Physics.Arcade.Sprite {
  private speed = 300;
  private isExploding = false;
  private direction: number;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: number) {
    super(scene, x, y, 'fireball1');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.direction = direction;
    this.setBounce(0.4);
    this.setCollideWorldBounds(false);
    this.setSize(14, 14);
    this.setOffset(1, 1);
    this.setVelocityX(this.speed * direction);
    this.setVelocityY(-100);
    this.body.gravity.y = 400;
    this.play('fireball_spin');

    scene.time.delayedCall(10, () => {
      if (this.active && !this.isExploding) {
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.left || body.blocked.right || body.touching.left || body.touching.right) {
          this.explode();
        }
      }
    });
    
    scene.time.delayedCall(30, () => {
      if (this.active && !this.isExploding) {
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.left || body.blocked.right || body.touching.left || body.touching.right) {
          this.explode();
        }
      }
    });
  }

  explode() {
    if (this.isExploding) return;
    this.isExploding = true;
    this.setVelocityX(0);
    this.setVelocityY(0);

    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  getIsExploding(): boolean {
    return this.isExploding;
  }
}
