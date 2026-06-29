import Phaser from 'phaser';

export default class Goomba extends Phaser.Physics.Arcade.Sprite {
  private isDead = false;
  private deadTimer = 0;
  private speed = 50;
  private direction = -1;

  private checkGroundAhead(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const sensorX = this.x + this.direction * (body.width / 2 + 4);
    const sensorY = body.bottom + 4;
    const staticBodies = this.scene.physics.world.staticBodies;
    for (const b of staticBodies.getArray()) {
      if (sensorX >= b.left && sensorX <= b.right && sensorY >= b.top && sensorY <= b.bottom) {
        return true;
      }
    }
    return false;
  }
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'goomba_walk1');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setVelocityX(-this.speed);
    this.setSize(28, 24);
    this.setOffset(2, 8);
    this.play('goomba_walk');
  }

  update(time: number) {
    if (this.isDead) {
      this.deadTimer -= this.scene.game.loop.delta;
      if (this.deadTimer <= 0) {
        this.destroy();
      }
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.touching.left) {
      this.direction = 1;
    } else if (body.blocked.right || body.touching.right) {
      this.direction = -1;
    }
    // 走到平台边缘时转身，避免掉进坑里
    if ((body.blocked.down || body.touching.down) && !this.checkGroundAhead()) {
      this.direction *= -1;
    }
    // 每帧持续应用速度，避免被物理组 add 时的默认值(0)重置后不再移动
    this.setVelocityX(this.direction * this.speed);
  }

  stomp() {
    if (this.isDead) return;
    this.isDead = true;
    this.setTexture('goomba_dead');
    this.setVelocityX(0);
    this.body!.enable = false;
    this.deadTimer = 500;
  }

  kill() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocityY(-300);
    this.setFlipY(true);
    this.body!.enable = false;
    this.scene.time.delayedCall(1000, () => this.destroy());
  }

  getIsDead(): boolean {
    return this.isDead;
  }
}
