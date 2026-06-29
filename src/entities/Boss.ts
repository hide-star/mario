import Phaser from 'phaser';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  private health = 3;
  private speed = 60;
  private direction: number = -1;
  private isHit = false;
  private hitTimer = 0;
  private jumpTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setSize(56, 60);
    this.setOffset(8, 12);
    this.setVelocityX(-this.speed);
  }

  update(time: number) {
    if (this.isHit) {
      this.hitTimer -= this.scene.game.loop.delta;
      if (this.hitTimer <= 0) {
        this.isHit = false;
        this.setTint(0xffffff);
      }
    }

    this.jumpTimer -= this.scene.game.loop.delta;
    if (this.jumpTimer <= 0 && (this.body?.blocked.down || this.body?.touching.down)) {
      this.setVelocityY(-250);
      this.jumpTimer = Phaser.Math.Between(2000, 4000);
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.touching.left) {
      this.direction = 1;
      this.setVelocityX(this.speed);
      this.setFlipX(true);
    } else if (body.blocked.right || body.touching.right) {
      this.direction = -1;
      this.setVelocityX(-this.speed);
      this.setFlipX(false);
    }
  }

  hit(): boolean {
    if (this.isHit) return false;
    this.health--;
    this.isHit = true;
    this.hitTimer = 1000;
    this.setTint(0xff0000);

    if (this.health <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.setVelocityY(-400);
    this.setFlipY(true);
    this.body!.enable = false;
    this.scene.time.delayedCall(1500, () => this.destroy());
  }

  getHealth(): number {
    return this.health;
  }

  getDirection(): number {
    return this.direction;
  }

  getIsHit(): boolean {
    return this.isHit;
  }
}
