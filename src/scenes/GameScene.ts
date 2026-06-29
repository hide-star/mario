import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';
import type { GameState } from '../game/types';
import Player from '../entities/Player';
import Goomba from '../entities/Goomba';
import Koopa from '../entities/Koopa';
import Coin from '../entities/Coin';
import Mushroom from '../entities/Mushroom';
import FireFlower from '../entities/FireFlower';
import Fireball from '../entities/Fireball';
import Boss from '../entities/Boss';
import HUD from '../ui/HUD';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private questionBlocks!: Phaser.Physics.Arcade.StaticGroup;
  private pipes!: Phaser.Physics.Arcade.StaticGroup;
  private goombas!: Phaser.Physics.Arcade.Group;
  private koopas!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.Group;
  private mushrooms!: Phaser.Physics.Arcade.Group;
  private fireFlowers!: Phaser.Physics.Arcade.Group;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private boss!: Boss | null;
  private hud!: HUD;
  private gameState: GameState;
  private levelWidth: number = 195;
  private isBossLevel: boolean = false;
  private goalReached: boolean = false;
  private enteringPalace: boolean = false;
  private pole!: Phaser.GameObjects.Rectangle;
  private flag!: Phaser.GameObjects.Image;
  private palace!: Phaser.GameObjects.Image;
  private goalX!: number;
  private palaceX!: number;
  constructor() {
    super('GameScene');
    this.gameState = {
      score: 0,
      coins: 0,
      lives: 3,
      level: 1,
      world: 1,
      playerState: 'small',
      isPaused: false,
      isGameOver: false,
      isVictory: false
    };
  }

  create() {
    this.cameras.main.setBackgroundColor(GAME_CONFIG.BG_COLOR);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.physics.world.gravity.y = GAME_CONFIG.GRAVITY;
    this.physics.world.setBounds(0, 0, this.levelWidth * GAME_CONFIG.TILE_SIZE, GAME_CONFIG.HEIGHT);

    this.createBackground();
    this.createLevel();
    this.createPlayer();
    this.createCollisions();

    this.hud = new HUD(this);
    this.hud.update(this.gameState);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setFollowOffset(-200, 0);
    this.cameras.main.setBounds(0, 0, this.levelWidth * GAME_CONFIG.TILE_SIZE, GAME_CONFIG.HEIGHT);

    this.input.keyboard!.on('keydown-J', () => this.fireFireball());
    this.input.keyboard!.on('keydown-SHIFT', () => this.fireFireball());
  }

  private createBackground() {
    const levelPixelWidth = this.levelWidth * GAME_CONFIG.TILE_SIZE;
    const groundY = GAME_CONFIG.HEIGHT - GAME_CONFIG.TILE_SIZE;

    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, levelPixelWidth);
      const y = Phaser.Math.Between(20, 150);
      const cloud = this.add.image(x, y, 'cloud').setAlpha(0.8);
      cloud.setScrollFactor(0.2);
    }

    const hillTexture = this.textures.get('hill');
    if (hillTexture && hillTexture.key !== '__MISSING') {
      const hillHeight = 300;
      // 山脉往下偏移，让地面挡住底部的蓝色天空
      const hillTile = this.add.tileSprite(0, groundY - hillHeight + 60, levelPixelWidth * 1.5, hillHeight, 'hill');
      hillTile.setOrigin(0, 0);
      hillTile.setScrollFactor(0.4);
    }
  }

  private createLevel() {
    this.platforms = this.physics.add.staticGroup();
    this.bricks = this.physics.add.staticGroup();
    this.questionBlocks = this.physics.add.staticGroup();
    this.pipes = this.physics.add.staticGroup();
    this.coins = this.physics.add.group({ allowGravity: false });
    this.goombas = this.physics.add.group();
    this.koopas = this.physics.add.group();
    this.mushrooms = this.physics.add.group({ allowGravity: true });
    this.fireFlowers = this.physics.add.group({ allowGravity: false });
    this.fireballs = this.physics.add.group();
    this.boss = null;

    const groundY = GAME_CONFIG.HEIGHT - GAME_CONFIG.TILE_SIZE;

    for (let x = 0; x < this.levelWidth; x++) {
      if (x >= 20 && x <= 22) continue;
      if (x >= 50 && x <= 53) continue;
      if (x >= 70 && x <= 71) continue;
      if (x >= 100 && x <= 103) continue;
      if (x >= 130 && x <= 132) continue;
      if (x >= 150 && x <= 151) continue;
      const tile = this.platforms.create(x * GAME_CONFIG.TILE_SIZE, groundY, 'tile_ground');
      tile.setOrigin(0, 0);
      tile.refreshBody();
    }

    // 终点前 9 级阶梯，左低右高金字塔形，实心，右边离旗杆约3格
    // 从左到右：第1列1块高，第2列2块高...第9列9块高
    const stairStartX = 159;
    for (let col = 0; col < 9; col++) {
      const brickCount = col + 1;
      const x = (stairStartX + col) * GAME_CONFIG.TILE_SIZE;
      for (let row = 0; row < brickCount; row++) {
        const y = groundY - (row + 1) * GAME_CONFIG.TILE_SIZE;
        const brick = this.platforms.create(x, y, 'tile_brick');
        brick.setOrigin(0, 0);
        brick.refreshBody();
      }
    }

    const brickPositions = [
      { x: 28, y: 9 }, { x: 29, y: 9 }, { x: 30, y: 9 },
      { x: 40, y: 9 }, { x: 41, y: 9 },
      { x: 60, y: 9 }, { x: 61, y: 9 }, { x: 62, y: 9 }, { x: 63, y: 9 },
      { x: 80, y: 9 }, { x: 81, y: 9 },
      { x: 90, y: 9 }, { x: 91, y: 9 }, { x: 92, y: 9 },
      { x: 110, y: 9 }, { x: 111, y: 9 },
      { x: 120, y: 9 }, { x: 121, y: 9 }, { x: 122, y: 9 },
      { x: 140, y: 9 }, { x: 141, y: 9 },
    ];

    brickPositions.forEach(pos => {
      const brick = this.bricks.create(pos.x * GAME_CONFIG.TILE_SIZE, GAME_CONFIG.HEIGHT - pos.y * GAME_CONFIG.TILE_SIZE, 'tile_brick');
      brick.setOrigin(0, 0);
      brick.refreshBody();
      brick.setData('type', 'brick');
    });

    const questionPositions = [
      { x: 27, y: 9, item: 'coin' },
      { x: 31, y: 9, item: 'mushroom' },
      { x: 42, y: 9, item: 'coin' },
      { x: 65, y: 9, item: 'fireFlower' },
      { x: 75, y: 9, item: 'coin' },
      { x: 85, y: 9, item: 'mushroom' },
      { x: 95, y: 9, item: 'coin' },
      { x: 105, y: 9, item: 'mushroom' },
      { x: 115, y: 9, item: 'fireFlower' },
      { x: 125, y: 9, item: 'coin' },
      { x: 135, y: 9, item: 'mushroom' },
    ];

    questionPositions.forEach(pos => {
      const qb = this.questionBlocks.create(pos.x * GAME_CONFIG.TILE_SIZE, GAME_CONFIG.HEIGHT - pos.y * GAME_CONFIG.TILE_SIZE, 'tile_question');
      qb.setOrigin(0, 0);
      qb.refreshBody();
      qb.setData('used', false);
      qb.setData('item', pos.item);
    });

    const pipePositions = [
      { x: 35, height: 2 },
      { x: 55, height: 3 },
      { x: 78, height: 2 },
      { x: 99, height: 3 },
      { x: 125, height: 2 },
      { x: 145, height: 3 },
    ];

    pipePositions.forEach(pos => {
      for (let h = 0; h < pos.height; h++) {
        const pipe = this.pipes.create(pos.x * GAME_CONFIG.TILE_SIZE, groundY - (h + 1) * GAME_CONFIG.TILE_SIZE, 'tile_pipe');
        pipe.setOrigin(0, 0);
        pipe.refreshBody();
      }
    });

    const coinPositions = [
      { x: 15, y: 6 }, { x: 16, y: 6 }, { x: 17, y: 6 },
      { x: 45, y: 7 }, { x: 46, y: 7 },
      { x: 68, y: 6 }, { x: 69, y: 6 }, { x: 70, y: 6 },
      { x: 88, y: 7 }, { x: 89, y: 7 },
      { x: 105, y: 6 }, { x: 106, y: 6 }, { x: 107, y: 6 },
      { x: 112, y: 7 }, { x: 113, y: 7 },
      { x: 128, y: 6 }, { x: 129, y: 6 },
      { x: 145, y: 7 }, { x: 146, y: 7 },
    ];

    coinPositions.forEach(pos => {
      const coin = new Coin(this, pos.x * GAME_CONFIG.TILE_SIZE + 16, GAME_CONFIG.HEIGHT - pos.y * GAME_CONFIG.TILE_SIZE + 46);
      this.coins.add(coin);
    });

    const goombaPositions = [
      { x: 25, y: 1 }, { x: 45, y: 1 }, { x: 60, y: 1 },
      { x: 72, y: 1 }, { x: 85, y: 1 }, { x: 95, y: 1 },
      { x: 110, y: 1 }, { x: 115, y: 1 },
      { x: 128, y: 1 }, { x: 135, y: 1 },
      { x: 148, y: 1 },
    ];

    goombaPositions.forEach(pos => {
      const goomba = new Goomba(this, pos.x * GAME_CONFIG.TILE_SIZE + 16, groundY - pos.y * GAME_CONFIG.TILE_SIZE);
      this.goombas.add(goomba);
    });

    const koopaPositions = [
      { x: 58, y: 1 }, { x: 80, y: 1 },
      { x: 105, y: 1 }, { x: 140, y: 1 },
    ];

    koopaPositions.forEach(pos => {
      const koopa = new Koopa(this, pos.x * GAME_CONFIG.TILE_SIZE + 16, groundY - pos.y * GAME_CONFIG.TILE_SIZE - 16);
      this.koopas.add(koopa);
    });

    const bossX = 150;
    this.boss = new Boss(this, bossX * GAME_CONFIG.TILE_SIZE, groundY - 60);
    this.isBossLevel = true;

    this.goalX = 177 * GAME_CONFIG.TILE_SIZE;
    const poleHeight = 340;
    this.pole = this.add.rectangle(this.goalX, groundY - poleHeight / 2, 4, poleHeight, 0x228B22);
    this.physics.add.existing(this.pole, true);
    this.pole.setData('isGoal', true);

    this.flag = this.add.image(this.goalX + 2, groundY - poleHeight, 'flag');
    this.flag.setOrigin(0, 0);

    this.palaceX = 185 * GAME_CONFIG.TILE_SIZE;
    this.palace = this.add.image(this.palaceX, groundY, 'palace');
    this.palace.setOrigin(0, 1);
  }

  private createPlayer() {
    const groundY = GAME_CONFIG.HEIGHT - GAME_CONFIG.TILE_SIZE;
    this.player = new Player(this, 3 * GAME_CONFIG.TILE_SIZE, groundY - 32);
    this.player.setKeys(this.cursors);
  }

  private createCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.bricks, this.hitBrick, undefined, this);
    this.physics.add.collider(this.player, this.questionBlocks, this.hitQuestionBlock, undefined, this);
    this.physics.add.collider(this.player, this.pipes);

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this);
    this.physics.add.overlap(this.player, this.mushrooms, this.collectMushroom, undefined, this);
    this.physics.add.overlap(this.player, this.fireFlowers, this.collectFireFlower, undefined, this);
    this.physics.add.overlap(this.player, this.pole, this.reachGoal, undefined, this);

    this.physics.add.collider(this.goombas, this.platforms);
    this.physics.add.collider(this.goombas, this.pipes);
    this.physics.add.collider(this.goombas, this.bricks);
    this.physics.add.collider(this.koopas, this.platforms);
    this.physics.add.collider(this.koopas, this.pipes);
    this.physics.add.collider(this.koopas, this.bricks);

    this.physics.add.overlap(this.player, this.goombas, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.koopas, this.hitEnemy, undefined, this);

    this.physics.add.collider(this.mushrooms, this.platforms);
    this.physics.add.collider(this.mushrooms, this.pipes);
    this.physics.add.collider(this.mushrooms, this.bricks);
    this.physics.add.collider(this.mushrooms, this.questionBlocks);
    this.physics.add.collider(this.fireballs, this.platforms, this.fireballHitGround, undefined, this);
    this.physics.add.collider(this.fireballs, this.bricks, this.fireballHitWall, undefined, this);
    this.physics.add.collider(this.fireballs, this.pipes, this.fireballHitWall, undefined, this);
    this.physics.add.collider(this.fireballs, this.questionBlocks, this.fireballHitWall, undefined, this);

    this.physics.add.overlap(this.fireballs, this.goombas, this.fireballHitEnemy, undefined, this);
    this.physics.add.overlap(this.fireballs, this.koopas, this.fireballHitEnemy, undefined, this);

    this.physics.add.overlap(this.koopas, this.goombas, this.shellHitEnemy, undefined, this);
    this.physics.add.overlap(this.koopas, this.koopas, this.shellHitEnemy, undefined, this);

    if (this.boss) {
      this.physics.add.collider(this.boss, this.platforms);
      this.physics.add.collider(this.player, this.boss, this.hitBoss, undefined, this);
      this.physics.add.overlap(this.fireballs, this.boss, this.fireballHitBoss, undefined, this);
    }
  }

  private hitBrick(player: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject) {
    const p = player as Player;
    const b = brick as Phaser.Physics.Arcade.Sprite;

    if (p.body.touching.up && b.body.touching.down) {
      if (p.getState() !== 'small') {
        this.tweens.add({
          targets: b,
          y: b.y - 8,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            b.destroy();
          }
        });
        this.addScore(50);
      } else {
        this.tweens.add({
          targets: b,
          y: b.y - 4,
          duration: 100,
          yoyo: true
        });
      }
    }
  }

  private hitQuestionBlock(player: Phaser.GameObjects.GameObject, block: Phaser.GameObjects.GameObject) {
    const p = player as Player;
    const b = block as Phaser.Physics.Arcade.Sprite;

    if (p.body.touching.up && b.body.touching.down) {
      const used = b.getData('used');
      if (used) return;

      b.setData('used', true);
      b.setTexture('tile_used');

      this.tweens.add({
        targets: b,
        y: b.y - 8,
        duration: 100,
        yoyo: true
      });

      const item = b.getData('item');
      const spawnX = b.x + GAME_CONFIG.TILE_SIZE / 2;
      const spawnY = b.y - GAME_CONFIG.TILE_SIZE + 20;

      if (item === 'coin') {
        const coin = new Coin(this, spawnX, spawnY - 10);
        coin.body!.setAllowGravity(false);
        this.tweens.add({
          targets: coin,
          y: spawnY - 60,
          duration: 300,
          ease: 'Quad.easeOut',
          onComplete: () => {
            coin.destroy();
            this.addCoin();
            this.addScore(200);
          }
        });
      } else if (item === 'mushroom') {
        const mushroom = new Mushroom(this, spawnX, spawnY);
        this.mushrooms.add(mushroom);
      } else if (item === 'fireFlower') {
        if (p.getState() === 'small') {
          const mushroom = new Mushroom(this, spawnX, spawnY);
          this.mushrooms.add(mushroom);
        } else {
          const flower = new FireFlower(this, spawnX, spawnY);
          this.fireFlowers.add(flower);
        }
      }
    }
  }

  private collectCoin(player: Phaser.GameObjects.GameObject, coin: Phaser.GameObjects.GameObject) {
    const c = coin as Coin;
    c.collect();
    this.addCoin();
    this.addScore(100);
  }

  private collectMushroom(player: Phaser.GameObjects.GameObject, mushroom: Phaser.GameObjects.GameObject) {
    const p = player as Player;
    const m = mushroom as Mushroom;
    m.collect();
    p.grow();
    this.gameState.playerState = p.getState();
    this.addScore(1000);
  }

  private collectFireFlower(player: Phaser.GameObjects.GameObject, flower: Phaser.GameObjects.GameObject) {
    const p = player as Player;
    const f = flower as FireFlower;
    f.collect();
    p.grow();
    this.gameState.playerState = p.getState();
    this.addScore(1000);
  }

  private hitEnemy(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    const p = player as Player;
    const e = enemy as Goomba | Koopa;

    if (p.isPlayerInvincible() || p.isDying) return;

    // 判断玩家是否从上方踩到敌人
    const pBody = p.body as Phaser.Physics.Arcade.Body;
    const eBody = e.body as Phaser.Physics.Arcade.Body;
    // 玩家底部在敌人上半部分（敌人顶部往下1/3高度内），且玩家在向下移动
    const stompThreshold = eBody.height * 0.4;
    const stomped = pBody.velocity.y >= 0 && pBody.bottom <= eBody.top + stompThreshold;

    if (e instanceof Goomba) {
      if (stomped) {
        if (p.justStomped) return;
        p.justStomped = true;
        this.time.delayedCall(100, () => { p.justStomped = false; });

        e.stomp();
        p.setVelocityY(-200);
        this.addScore(100);
      } else {
        this.playerHurt();
      }
      return;
    }

    if (e instanceof Koopa) {
      const isShell = e.getIsShell();
      const isMoving = e.getIsMoving();

      // 如果龟壳是被玩家或另一个龟壳踢飞的，忽略碰撞
      if (isShell && isMoving && (e.isKickedBy(p) || e.isKickedBy(enemy))) {
        return;
      }

      if (stomped) {
        if (p.justStomped) return;
        p.justStomped = true;
        this.time.delayedCall(100, () => { p.justStomped = false; });

        e.stomp();
        p.setVelocityY(-200);
        if (!isShell || isMoving) {
          this.addScore(100);
        }
      } else {
        // 非上方碰撞
        if (!isShell || (isMoving && !e.isKickCooldown())) {
          // 普通 Koopa 或自然滑动的龟壳会伤到玩家
          this.playerHurt();
        } else {
          // 静止龟壳从侧面碰到是安全的，将其朝玩家前方踢飞
          const pushDirection = p.x < enemy.x ? 1 : -1;
          e.kick(pushDirection, p);
          p.setVelocityY(-100);
          p.setVelocityX(pushDirection * 150);
        }
      }
    }
  }

  private hitBoss(player: Phaser.GameObjects.GameObject, boss: Phaser.GameObjects.GameObject) {
    const p = player as Player;
    const b = boss as Boss;

    if (p.isPlayerInvincible() || p.isDying) return;

    const playerBottom = p.y + p.body.height / 2;

    if (p.y > p.prevY && playerBottom < b.y + 8) {
      if (p.justStomped) return;

      p.justStomped = true;
      this.time.delayedCall(100, () => { p.justStomped = false; });

      const defeated = b.hit();
      p.setVelocityY(-300);
      this.addScore(500);
      if (defeated) {
        this.bossDefeated();
      }
    } else {
      this.playerHurt();
    }
  }

  private fireballHitEnemy(fireball: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    const f = fireball as Fireball;
    const e = enemy as Goomba | Koopa;

    if (f.getIsExploding()) return;

    f.explode();
    if (e instanceof Goomba) {
      e.kill();
    } else {
      e.kill();
    }
    this.addScore(200);
  }

  private shellHitEnemy(shell: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    const s = shell as Koopa;
    const e = enemy as Goomba | Koopa;

    if (!s.getIsShell() || !s.getIsMoving()) return;
    if (e instanceof Koopa && e === s) return;

    if (e instanceof Goomba) {
      if (e.getIsDead()) return;
      e.kill();
      this.addScore(200);
    } else if (e instanceof Koopa) {
      if (e.getIsShell() && !e.getIsMoving()) {
        // 静止龟壳被撞飞，朝撞击方向滑动
        e.kick(s.getDirection(), s);
        this.addScore(100);
      } else {
        e.kill();
        this.addScore(200);
      }
    }
  }

  private fireballHitBoss(fireball: Phaser.GameObjects.GameObject, boss: Phaser.GameObjects.GameObject) {
    const f = fireball as Fireball;
    const b = boss as Boss;

    if (f.getIsExploding()) return;

    f.explode();
    const defeated = b.hit();
    this.addScore(200);
    if (defeated) {
      this.bossDefeated();
    }
  }

  private fireballHitGround(fireball: Phaser.GameObjects.GameObject, ground: Phaser.GameObjects.GameObject) {
    const f = fireball as Fireball;
    if (f.getIsExploding()) return;

    const body = f.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.down || body.touching.down) {
    } else if (body.blocked.left || body.blocked.right || body.touching.left || body.touching.right) {
      f.explode();
    }
  }

  private fireballHitWall(fireball: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) {
    const f = fireball as Fireball;
    if (f.getIsExploding()) return;
    
    const body = f.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.blocked.right || body.touching.left || body.touching.right) {
      f.explode();
    }
  }

  private playerHurt() {
    if (this.player.isPlayerInvincible()) return;

    const state = this.player.getState();
    if (state === 'small') {
      this.playerDie();
    } else {
      this.player.shrink();
      this.gameState.playerState = this.player.getState();
    }
  }

  private playerDie() {
    if (this.player.isDying) return;
    this.player.isDying = true;

    this.gameState.lives--;
    this.hud.update(this.gameState);

    if (this.player.body) {
      (this.player.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    this.player.setVelocity(0, 0);
    this.player.setFlipY(true);

    this.physics.pause();

    this.tweens.add({
      targets: this.player,
      y: this.player.y - 80,
      duration: 300,
      ease: 'Quad.easeOut',
      yoyo: false,
      onComplete: () => {
        this.tweens.add({
          targets: this.player,
          y: this.player.y + 300,
          duration: 800,
          ease: 'Quad.easeIn'
        });
      }
    });

    this.time.delayedCall(1500, () => {
      if (this.gameState.lives > 0) {
        this.scene.restart();
      } else {
        this.scene.start('GameOverScene', { victory: false, score: this.gameState.score });
      }
    });
  }

  private bossDefeated() {
    this.gameState.isVictory = true;
    this.addScore(5000);
    this.physics.pause();

    this.time.delayedCall(2000, () => {
      this.scene.start('GameOverScene', { victory: true, score: this.gameState.score });
    });
  }

  private reachGoal(player: Phaser.GameObjects.GameObject, pole: Phaser.GameObjects.GameObject) {
    if (this.goalReached) return;
    this.goalReached = true;

    this.addScore(1000);

    const groundY = GAME_CONFIG.HEIGHT - GAME_CONFIG.TILE_SIZE;
    const slideDownTime = 1500;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    // 停止玩家物理运动
    this.player.setVelocity(0, 0);
    if (playerBody) {
      playerBody.enable = false;
    }

    // 计算玩家滑到底部后的正确位置
    // 玩家的y是中心点，所以底部 = y + body.height/2
    // 地面顶部是 groundY，所以玩家的y应该 = groundY - body.height/2
    const bodyHeight = playerBody ? playerBody.height : 32;
    const targetY = groundY - bodyHeight / 2;

    // 玩家从当前位置滑到杆底（地面上）
    this.tweens.add({
      targets: this.player,
      y: targetY,
      x: this.goalX,
      duration: slideDownTime,
      ease: 'Linear',
      onComplete: () => {
        if (playerBody) {
          playerBody.enable = true;
          // 确保玩家在地面上
          this.player.setY(groundY - bodyHeight / 2);
        }
        this.player.setVelocityX(80);
      }
    });

    // 旗子下降动画（降到地面上方）
    const flagTargetY = groundY - 32;
    this.tweens.add({
      targets: this.flag,
      y: flagTargetY,
      duration: slideDownTime,
      ease: 'Linear'
    });
  }

  private checkEnterPalace() {
    if (!this.goalReached || this.enteringPalace) return;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (!playerBody) return;

    // 宫殿门在 palace 纹理中的位置：x=68..92，y=144..200（纹理尺寸 160x200）
    const doorCenterX = this.palaceX + 80;
    const onGround = playerBody.blocked.down || playerBody.touching.down;

    // 必须走到门中心附近（水平 ±16 像素）且在地面上
    if (Math.abs(this.player.x - doorCenterX) <= 16 && onGround) {
      this.enterPalace();
    }
  }

  private enterPalace() {
    if (this.enteringPalace) return;
    this.enteringPalace = true;

    this.gameState.isVictory = true;
    this.addScore(5000);

    const doorCenterX = this.palaceX + 80;
    const doorCenterY = this.palace.y - 36;

    // 停止玩家当前移动，然后自动走进门并消失
    this.player.setVelocity(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).enable = false;

    this.tweens.add({
      targets: this.player,
      x: doorCenterX,
      y: doorCenterY,
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        this.tweens.add({
          targets: this.player,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.scene.start('GameOverScene', { victory: true, score: this.gameState.score });
          }
        });
      }
    });
  }

  private fireFireball() {
    const fireData = this.player.fire();
    if (fireData) {
      const fireball = new Fireball(this, fireData.x, fireData.y, fireData.direction);
      this.fireballs.add(fireball);
      fireball.setVelocityX(300 * fireData.direction);
      fireball.setVelocityY(-100);

      const hitPipe = this.physics.overlap(fireball, this.pipes);
      const hitBrick = this.physics.overlap(fireball, this.bricks);
      const hitQuestion = this.physics.overlap(fireball, this.questionBlocks);
      const hitPlatform = this.physics.overlap(fireball, this.platforms);
      if (hitPipe || hitBrick || hitQuestion || hitPlatform) {
        fireball.explode();
      }
    }
  }

  private addCoin() {
    this.gameState.coins++;
    if (this.gameState.coins >= 100) {
      this.gameState.coins -= 100;
      this.gameState.lives++;
    }
    this.hud.update(this.gameState);
  }

  private addScore(points: number) {
    this.gameState.score += points;
    this.hud.update(this.gameState);
  }

  update(time: number, delta: number) {
    if (this.gameState.isGameOver || this.gameState.isVictory) return;

    this.player.update(this.cursors, time);

    this.goombas.getChildren().forEach(goomba => {
      (goomba as Goomba).update(time);
    });

    this.koopas.getChildren().forEach(koopa => {
      (koopa as Koopa).update();
    });

    this.mushrooms.getChildren().forEach(mushroom => {
      (mushroom as Mushroom).update();
    });

    if (this.boss && this.boss.active) {
      this.boss.update(time);
    }

    this.checkEnterPalace();

    const groundY = GAME_CONFIG.HEIGHT - GAME_CONFIG.TILE_SIZE;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody && !this.player.isDying) {
      const playerBottom = this.player.y + playerBody.height;
      const deathY = GAME_CONFIG.HEIGHT + 50;
      if (playerBottom > deathY) {
        this.playerDie();
      }
    }
  }
}
