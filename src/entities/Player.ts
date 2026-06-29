import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';
import type { PlayerState } from '../game/types';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private playerState: PlayerState = 'small';
  private isCrouching = false;
  private canJump = true;
  private isInvincible = false;
  private fireCooldown = 0;
  private facingRight = true;
  private jumpHeld = false;
  private jumpHeldTime = 0;
  private readonly MAX_JUMP_BOOST_TIME = 180;
  private keys: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key; w: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key; space: Phaser.Input.Keyboard.Key } | null = null;
  prevY: number = 0;
  justStomped: boolean = false;
  isDying: boolean = false;
  isOnFlag: boolean = false;
  isThrowing: boolean = false;
  isSliding: boolean = false;
  private throwTimer: number = 0;
  private readonly THROW_DURATION = 200; // ms for throw animation
  private slideTimer: number = 0;
  private readonly SLIDE_DURATION = 300; // ms for landing slide
  private wasInAir: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'mario_small_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(false, false, false, false);
    this.updateBodySize();
  }

  setKeys(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const keyboard = this.scene.input.keyboard!;
    this.keys = {
      left: cursors.left!,
      right: cursors.right!,
      up: cursors.up!,
      down: cursors.down!,
      a: keyboard.addKey('A'),
      d: keyboard.addKey('D'),
      w: keyboard.addKey('W'),
      s: keyboard.addKey('S'),
      space: keyboard.addKey('SPACE')
    };
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, time: number) {
    this.prevY = this.y;

    if (this.fireCooldown > 0) {
      this.fireCooldown -= this.scene.game.loop.delta;
    }

    if (this.throwTimer > 0) {
      this.throwTimer -= this.scene.game.loop.delta;
      if (this.throwTimer <= 0) {
        this.isThrowing = false;
      }
    }

    if (this.isInvincible) {
      this.setAlpha(Math.floor(time / 100) % 2 === 0 ? 1 : 0.5);
    } else {
      this.setAlpha(1);
    }

    const speed = GAME_CONFIG.PLAYER_SPEED;
    let velocityX = 0;
    let movingLeft = false;
    let movingRight = false;

    if (this.keys) {
      movingLeft = this.keys.left.isDown || this.keys.a.isDown;
      movingRight = this.keys.right.isDown || this.keys.d.isDown;
    }

    if (movingLeft) {
      velocityX = -speed;
      this.facingRight = false;
      this.setFlipX(true);
    } else if (movingRight) {
      velocityX = speed;
      this.facingRight = true;
      this.setFlipX(false);
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    const halfWidth = body.width / 2;
    const atLeftEdge = this.x - halfWidth <= 0;
    
    if (atLeftEdge && velocityX < 0) {
      velocityX = 0;
      this.x = halfWidth;
    }

    const isOnGround = this.body?.blocked.down || this.body?.touching.down;

    // Detect landing slide (big/fire mario landing from air)
    if (this.playerState !== 'small') {
      if (!isOnGround) {
        this.wasInAir = true;
      } else if (this.wasInAir && this.body!.velocity.y >= 0) {
        // Just landed from air - trigger slide
        this.wasInAir = false;
        this.isSliding = true;
        this.slideTimer = this.SLIDE_DURATION;
        // Reduce horizontal velocity on landing (braking feel)
        this.setVelocityX(this.body!.velocity.x * 0.3);
      }
    }

    if (this.slideTimer > 0) {
      this.slideTimer -= this.scene.game.loop.delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    this.isCrouching = false;
    if (this.playerState !== 'small' && isOnGround) {
      let pressingDown = false;
      if (this.keys) {
        pressingDown = this.keys.down.isDown || this.keys.s.isDown;
      }
      if (pressingDown) {
        this.isCrouching = true;
        velocityX = 0;
      }
    }

    this.setVelocityX(velocityX);

    let jumpKey = false;
    if (this.keys) {
      jumpKey = this.keys.up.isDown || this.keys.w.isDown || this.keys.space.isDown;
    }

    if (jumpKey && isOnGround && this.canJump && !this.isCrouching) {
      this.setVelocityY(GAME_CONFIG.PLAYER_JUMP);
      this.canJump = false;
      this.jumpHeld = true;
      this.jumpHeldTime = 0;
    }

    if (jumpKey && this.jumpHeld) {
      this.jumpHeldTime += this.scene.game.loop.delta;
      if (this.jumpHeldTime < this.MAX_JUMP_BOOST_TIME && this.body!.velocity.y < 0) {
        this.setVelocityY(this.body!.velocity.y - 10);
      }
    }

    if (!jumpKey) {
      this.canJump = true;
      this.jumpHeld = false;
      this.jumpHeldTime = 0;
    }

    this.playAnimation(velocityX, isOnGround);
    this.setFlipX(!this.facingRight);
    this.updateBodySize();
  }

  private playAnimation(velocityX: number, isOnGround: boolean) {
    // Throw animation takes priority (fire state only)
    if (this.isThrowing) {
      if (this.playerState === 'fire') {
        this.setTexture('mario_fire_throw');
      }
      return;
    }

    // Landing slide animation (big/fire mario)
    if (this.isSliding && isOnGround) {
      if (this.playerState === 'big') {
        this.setTexture('mario_big_slide');
      } else if (this.playerState === 'fire') {
        this.setTexture('mario_fire_slide');
      }
      return;
    }

    // Flag pole sliding
    if (this.isOnFlag) {
      if (this.playerState === 'small') {
        this.setTexture('mario_small_idle');
      } else if (this.playerState === 'big') {
        this.setTexture('mario_big_flag');
      } else {
        this.setTexture('mario_fire_flag');
      }
      return;
    }

    if (!isOnGround) {
      if (this.playerState === 'small') {
        this.setTexture('mario_small_jump');
      } else if (this.playerState === 'big') {
        this.setTexture('mario_big_jump');
      } else {
        this.setTexture('mario_fire_jump');
      }
      return;
    }

    if (this.isCrouching) {
      if (this.playerState === 'big') {
        this.setTexture('mario_big_crouch');
      } else if (this.playerState === 'fire') {
        this.setTexture('mario_fire_crouch');
      }
      return;
    }

    if (Math.abs(velocityX) > 0) {
      if (this.playerState === 'small') {
        this.play('mario_small_walk', true);
      } else if (this.playerState === 'big') {
        this.play('mario_big_walk', true);
      } else {
        this.play('mario_fire_walk', true);
      }
    } else {
      this.stop();
      if (this.playerState === 'small') {
        this.setTexture('mario_small_idle');
      } else if (this.playerState === 'big') {
        this.setTexture('mario_big_idle');
      } else {
        this.setTexture('mario_fire_idle');
      }
    }
  }

  private updateBodySize() {
    if (this.playerState === 'small') {
      this.setBodySize(24, 28);
      this.setOffset(4, 4);
    } else if (this.isCrouching) {
      this.setBodySize(28, 28);
      this.setOffset(10, 36);
    } else {
      this.setBodySize(24, 56);
      this.setOffset(12, 8);
    }
  }

  getState(): PlayerState {
    return this.playerState;
  }

  setState(state: PlayerState) {
    this.playerState = state;
    this.updateBodySize();
  }

  grow() {
    if (this.playerState === 'small') {
      this.playerState = 'big';
      this.setY(this.y - 32);
    } else if (this.playerState === 'big') {
      this.playerState = 'fire';
    }
    this.updateBodySize();
  }

  shrink() {
    if (this.playerState === 'fire') {
      this.playerState = 'big';
    } else if (this.playerState === 'big') {
      this.playerState = 'small';
      this.setY(this.y + 32);
    }
    this.updateBodySize();
    this.makeInvincible(2000);
  }

  makeInvincible(duration: number) {
    this.isInvincible = true;
    this.scene.time.delayedCall(duration, () => {
      this.isInvincible = false;
      this.setAlpha(1);
    });
  }

  isPlayerInvincible(): boolean {
    return this.isInvincible;
  }

  canFire(): boolean {
    return this.playerState === 'fire' && this.fireCooldown <= 0;
  }

  fire(): { x: number; y: number; direction: number } | null {
    if (this.canFire()) {
      this.fireCooldown = 300;
      this.isThrowing = true;
      this.throwTimer = this.THROW_DURATION;
      
      const body = this.body as Phaser.Physics.Arcade.Body;
      
      if (this.facingRight && (body.blocked.right || body.touching.right)) {
        this.isThrowing = false;
        return null;
      }
      if (!this.facingRight && (body.blocked.left || body.touching.left)) {
        this.isThrowing = false;
        return null;
      }
      
      const halfBodyWidth = body.width / 2;
      const fireballOffset = halfBodyWidth + 16;
      return {
        x: this.x + (this.facingRight ? fireballOffset : -fireballOffset),
        y: this.y + 10,
        direction: this.facingRight ? 1 : -1
      };
    }
    return null;
  }

  isFacingRight(): boolean {
    return this.facingRight;
  }

  getIsCrouching(): boolean {
    return this.isCrouching;
  }

  die() {
    this.isDying = true;
    this.setVelocity(0, 0);
    this.body!.enable = false;

    if (this.playerState === 'big') {
      this.setTexture('mario_big_death');
    } else if (this.playerState === 'fire') {
      this.setTexture('mario_fire_death');
    } else {
      this.setTexture('mario_small_jump'); // small mario uses jump pose for death
    }

    this.scene.tweens.add({
      targets: this,
      y: this.y - 80,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          y: this.scene.scale.height + 100,
          duration: 1200,
          ease: 'Power1'
        });
      }
    });
  }

  setOnFlag(onFlag: boolean) {
    this.isOnFlag = onFlag;
  }

  getIsOnFlag(): boolean {
    return this.isOnFlag;
  }
}
