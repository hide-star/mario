import Phaser from 'phaser';

export default class Koopa extends Phaser.Physics.Arcade.Sprite {
  private isShell = false;
  private isMoving = false;
  private speed = 40;
  private shellSpeed = 200;
  private direction: number = -1;
  private kickCooldown = 0; // 刚被玩家踢飞后的无敌时间(ms)，此期间不会伤到玩家
  private lastKicker: Phaser.GameObjects.GameObject | null = null; // 记录踢龟壳的玩家

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
    super(scene, x, y, 'koopa_walk1');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false);
    this.setVelocityX(-this.speed);
    this.setSize(28, 36);
    this.setOffset(2, 12);
    this.play('koopa_walk');
  }

  update() {
    if (this.kickCooldown > 0) {
      this.kickCooldown -= this.scene.game.loop.delta;
      if (this.kickCooldown < 0) this.kickCooldown = 0;
    }

    if (this.isShell && this.isMoving) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body.blocked.left || body.touching.left) {
        this.direction = 1;
      } else if (body.blocked.right || body.touching.right) {
        this.direction = -1;
      }
      // 龟壳不检查前方地面，允许掉进坑里
      // 每帧持续应用速度，避免被物理组 add 时的默认值(0)重置后不再移动
      this.setVelocityX(this.direction * this.shellSpeed);
      return;
    }

    if (!this.isShell) {
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
      this.setVelocityX(this.direction * this.speed);
    }
  }

  stomp(): boolean {
    if (!this.isShell) {
      this.isShell = true;
      this.isMoving = false;
      this.setTexture('koopa_shell');
      this.setSize(28, 20);
      this.setOffset(2, 12);
      this.setVelocityX(0);
      this.stop();
      return false;
    } else if (!this.isMoving) {
      this.isMoving = true;
      this.setVelocityX(this.direction * this.shellSpeed);
      this.kickCooldown = 0;
      this.lastKicker = null; // 重置踢龟者记录
      return false;
    }
    // 已经在移动的龟壳被踩中，停止移动
    this.isMoving = false;
    this.setVelocityX(0);
    return true;
  }

  kick(direction: number, kicker?: Phaser.GameObjects.GameObject) {
    this.isShell = true;
    this.isMoving = true;
    this.direction = direction > 0 ? 1 : -1;
    this.setTexture('koopa_shell');
    this.setSize(28, 20);
    this.setOffset(2, 12);
    this.setVelocityX(this.direction * this.shellSpeed);
    this.kickCooldown = 150; // 150ms 内不会伤到踢它的玩家
    this.lastKicker = kicker || null;
  }

  setDirection(dir: number) {
    this.direction = dir > 0 ? 1 : -1;
  }

  isKickCooldown(): boolean {
    return this.kickCooldown > 0;
  }

  // 检查玩家是否是踢龟壳的那个人，是的话忽略碰撞
  isKickedBy(player: Phaser.GameObjects.GameObject): boolean {
    return this.lastKicker === player;
  }

  kill() {
    this.setVelocityY(-300);
    this.setFlipY(true);
    this.body!.enable = false;
    this.scene.time.delayedCall(1000, () => this.destroy());
  }

  getIsShell(): boolean {
    return this.isShell;
  }

  getIsMoving(): boolean {
    return this.isMoving;
  }

  getDirection(): number {
    return this.direction;
  }
}
