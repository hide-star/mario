import Phaser from 'phaser';
import { COLORS } from '../game/config';

export class AssetGenerator {
  static generateAll(scene: Phaser.Scene) {
    this.generateMario(scene);
    this.generateGoomba(scene);
    this.generateTiles(scene);
    this.generateCoin(scene);
    this.generateMushroom(scene);
    this.generateFireFlower(scene);
    this.generateFireball(scene);
    this.generateCloud(scene);
    this.generateHill(scene);
    this.generateKoopa(scene);
    this.generateBoss(scene);
    this.generateFlag(scene);
    this.generatePalace(scene);
  }

  static generateMario(scene: Phaser.Scene) {
    const textures = [
      { key: 'mario_small_idle', w: 32, h: 32 },
      { key: 'mario_small_run1', w: 32, h: 32 },
      { key: 'mario_small_run2', w: 32, h: 32 },
      { key: 'mario_small_run3', w: 32, h: 32 },
      { key: 'mario_small_jump', w: 32, h: 32 },
      { key: 'mario_big_idle', w: 32, h: 64 },
      { key: 'mario_big_run1', w: 32, h: 64 },
      { key: 'mario_big_run2', w: 32, h: 64 },
      { key: 'mario_big_run3', w: 32, h: 64 },
      { key: 'mario_big_jump', w: 32, h: 64 },
      { key: 'mario_big_crouch', w: 32, h: 64 },
      { key: 'mario_fire_idle', w: 32, h: 64 },
      { key: 'mario_fire_run1', w: 32, h: 64 }
    ];

    textures.forEach(t => {
      const g = scene.add.graphics();
      
      if (t.key.includes('small')) {
        this.drawSmallMario(g, t.key);
      } else if (t.key.includes('big')) {
        this.drawBigMario(g, t.key);
      } else if (t.key.includes('fire')) {
        this.drawFireMario(g, t.key);
      }

      g.generateTexture(t.key, t.w, t.h);
      g.destroy();
    });
  }

  static drawSmallMario(g: Phaser.GameObjects.Graphics, key: string) {
    const px = 2;
    const isRun = key.includes('run');
    const isJump = key.includes('jump');
    const frame = isRun ? parseInt(key.slice(-1)) : 1;
    const shoeColor = COLORS.marioBrown;

    g.fillStyle(COLORS.marioRed);
    g.fillRect(6 * px, 0, 10 * px, 3 * px);
    g.fillRect(4 * px, 3 * px, 14 * px, 2 * px);

    g.fillStyle(COLORS.marioSkin);
    g.fillRect(4 * px, 5 * px, 14 * px, 4 * px);
    g.fillStyle(COLORS.marioBrown);
    g.fillRect(4 * px, 5 * px, 3 * px, 3 * px);
    g.fillRect(15 * px, 5 * px, 3 * px, 3 * px);
    g.fillStyle(0x000000);
    g.fillRect(9 * px, 6 * px, 2 * px, 2 * px);
    g.fillRect(12 * px, 6 * px, 2 * px, 2 * px);
    g.fillStyle(COLORS.marioBrown);
    g.fillRect(10 * px, 8 * px, 4 * px, 1 * px);

    g.fillStyle(COLORS.marioRed);
    g.fillRect(4 * px, 9 * px, 14 * px, 5 * px);
    g.fillStyle(COLORS.marioBlue);
    g.fillRect(5 * px, 11 * px, 12 * px, 3 * px);

    g.fillStyle(COLORS.marioBlue);
    g.fillRect(5 * px, 14 * px, 5 * px, 2 * px);
    g.fillRect(12 * px, 14 * px, 5 * px, 2 * px);

    g.fillStyle(shoeColor);
    const shoeY = 16;
    const shoeH = 2;
    const leftShoeX = 4;
    const rightShoeX = 14;
    const shoeW = 6;

    if (isJump) {
      g.fillRect(leftShoeX * px, (shoeY - 1) * px, shoeW * px, (shoeH + 1) * px);
      g.fillRect(rightShoeX * px, (shoeY - 1) * px, shoeW * px, (shoeH + 1) * px);
    } else if (isRun && frame === 1) {
      g.fillRect((leftShoeX - 1) * px, shoeY * px, shoeW * px, shoeH * px);
      g.fillRect((rightShoeX + 1) * px, (shoeY - 1) * px, shoeW * px, (shoeH + 1) * px);
    } else if (isRun && frame === 2) {
      g.fillRect((leftShoeX + 1) * px, shoeY * px, (shoeW - 2) * px, shoeH * px);
      g.fillRect((rightShoeX - 1) * px, shoeY * px, (shoeW - 2) * px, shoeH * px);
    } else if (isRun && frame === 3) {
      g.fillRect(leftShoeX * px, (shoeY - 1) * px, shoeW * px, (shoeH + 1) * px);
      g.fillRect(rightShoeX * px, shoeY * px, shoeW * px, shoeH * px);
    } else {
      g.fillRect(leftShoeX * px, shoeY * px, shoeW * px, shoeH * px);
      g.fillRect(rightShoeX * px, shoeY * px, shoeW * px, shoeH * px);
    }
  }

  static drawBigMario(g: Phaser.GameObjects.Graphics, key: string) {
    const px = 2;
    const isCrouch = key.includes('crouch');
    const isJump = key.includes('jump');
    const isRun = key.includes('run');
    const frame = isRun ? parseInt(key.slice(-1)) : 1;
    const shoeColor = COLORS.marioBrown;
    const skinColor = COLORS.marioSkin;
    const shoeW = 5;
    const shoeH = 3;

    if (isCrouch) {
      const startY = 16;

      g.fillStyle(COLORS.marioRed);
      g.fillRect(5 * px, startY, 10 * px, 3 * px);
      g.fillRect(3 * px, startY + 3 * px, 14 * px, 2 * px);

      g.fillStyle(skinColor);
      g.fillRect(3 * px, startY + 5 * px, 14 * px, 5 * px);
      g.fillStyle(COLORS.marioBrown);
      g.fillRect(3 * px, startY + 5 * px, 3 * px, 3 * px);
      g.fillRect(14 * px, startY + 5 * px, 3 * px, 3 * px);
      g.fillStyle(0x000000);
      g.fillRect(8 * px, startY + 6 * px, 2 * px, 2 * px);
      g.fillRect(11 * px, startY + 6 * px, 2 * px, 2 * px);
      g.fillStyle(COLORS.marioBrown);
      g.fillRect(9 * px, startY + 8 * px, 3 * px, 1 * px);

      g.fillStyle(COLORS.marioRed);
      g.fillRect(2 * px, startY + 10 * px, 16 * px, 8 * px);
      g.fillStyle(COLORS.marioBlue);
      g.fillRect(3 * px, startY + 14 * px, 14 * px, 5 * px);

      g.fillStyle(COLORS.marioBlue);
      g.fillRect(4 * px, startY + 19 * px, 5 * px, 4 * px);
      g.fillRect(11 * px, startY + 19 * px, 5 * px, 4 * px);

      g.fillStyle(shoeColor);
      g.fillRect(3 * px, startY + 22 * px, shoeW * px, shoeH * px);
      g.fillRect(12 * px, startY + 22 * px, shoeW * px, shoeH * px);
    } else {
      g.fillStyle(COLORS.marioRed);
      g.fillRect(5 * px, 0, 10 * px, 3 * px);
      g.fillRect(3 * px, 3 * px, 14 * px, 2 * px);

      g.fillStyle(skinColor);
      g.fillRect(3 * px, 5 * px, 14 * px, 6 * px);
      g.fillStyle(COLORS.marioBrown);
      g.fillRect(3 * px, 5 * px, 3 * px, 3 * px);
      g.fillRect(14 * px, 5 * px, 3 * px, 3 * px);
      g.fillStyle(0x000000);
      g.fillRect(8 * px, 6 * px, 2 * px, 2 * px);
      g.fillRect(11 * px, 6 * px, 2 * px, 2 * px);
      g.fillStyle(COLORS.marioBrown);
      g.fillRect(9 * px, 9 * px, 3 * px, 1 * px);

      g.fillStyle(COLORS.marioRed);
      g.fillRect(2 * px, 11 * px, 16 * px, 10 * px);
      g.fillStyle(COLORS.marioBlue);
      g.fillRect(3 * px, 16 * px, 14 * px, 6 * px);

      let leftArmY = 22;
      let rightArmY = 22;
      let leftLegY = 22;
      let rightLegY = 22;
      let leftArmH = 6;
      let rightArmH = 6;
      let leftLegH = 6;
      let rightLegH = 6;
      let leftShoeX = 3;
      let rightShoeX = 12;

      if (isJump) {
        leftArmY = 20;
        rightArmY = 24;
        leftLegY = 20;
        rightLegY = 24;
        leftArmH = 8;
        rightArmH = 4;
        leftLegH = 8;
        rightLegH = 4;
        leftShoeX = 2;
        rightShoeX = 14;
      } else if (isRun && frame === 1) {
        leftArmY = 18;
        rightArmY = 24;
        leftLegY = 22;
        rightLegY = 26;
        leftArmH = 8;
        rightArmH = 4;
        leftLegH = 6;
        rightLegH = 2;
        leftShoeX = 2;
        rightShoeX = 14;
      } else if (isRun && frame === 2) {
        leftArmY = 21;
        rightArmY = 21;
        leftLegY = 21;
        rightLegY = 21;
        leftArmH = 6;
        rightArmH = 6;
        leftLegH = 6;
        rightLegH = 6;
        leftShoeX = 4;
        rightShoeX = 11;
      } else if (isRun && frame === 3) {
        leftArmY = 24;
        rightArmY = 18;
        leftLegY = 26;
        rightLegY = 20;
        leftArmH = 4;
        rightArmH = 8;
        leftLegH = 2;
        rightLegH = 8;
        leftShoeX = 14;
        rightShoeX = 2;
      }

      g.fillStyle(COLORS.marioBlue);
      g.fillRect(3 * px, leftLegY * px, 5 * px, leftLegH * px);
      g.fillRect(12 * px, rightLegY * px, 5 * px, rightLegH * px);
      g.fillRect(2 * px, leftArmY * px, 4 * px, leftArmH * px);
      g.fillRect(14 * px, rightArmY * px, 4 * px, rightArmH * px);

      const baseShoeY = 28;

      g.fillStyle(shoeColor);
      g.fillRect(leftShoeX * px, baseShoeY * px, shoeW * px, shoeH * px);
      g.fillRect(rightShoeX * px, baseShoeY * px, shoeW * px, shoeH * px);
    }
  }

  static drawFireMario(g: Phaser.GameObjects.Graphics, key: string) {
    const px = 2;
    const isRun = key.includes('run');
    const isJump = key.includes('jump');
    const frame = isRun ? parseInt(key.slice(-1)) : 1;
    const shoeColor = COLORS.marioBrown;
    const shoeW = 5;
    const shoeH = 3;

    // 帽子（白色）
    g.fillStyle(COLORS.fireFlower);
    g.fillRect(5 * px, 0, 10 * px, 3 * px);
    g.fillRect(3 * px, 3 * px, 14 * px, 2 * px);

    // 脸部
    g.fillStyle(COLORS.marioSkin);
    g.fillRect(3 * px, 5 * px, 14 * px, 6 * px);
    g.fillStyle(COLORS.marioBrown);
    g.fillRect(3 * px, 5 * px, 3 * px, 3 * px);
    g.fillRect(14 * px, 5 * px, 3 * px, 3 * px);
    g.fillStyle(0x000000);
    g.fillRect(8 * px, 6 * px, 2 * px, 2 * px);
    g.fillRect(11 * px, 6 * px, 2 * px, 2 * px);
    g.fillStyle(COLORS.marioBrown);
    g.fillRect(9 * px, 9 * px, 3 * px, 1 * px);

    // 身体（白色）
    g.fillStyle(COLORS.fireFlower);
    g.fillRect(2 * px, 11 * px, 16 * px, 10 * px);
    // 白色纽扣
    g.fillStyle(0xffffff);
    g.fillRect(8 * px, 16 * px, 2 * px, 2 * px);
    g.fillRect(11 * px, 16 * px, 2 * px, 2 * px);

    // 腿和手臂（白色）
    let leftArmY = 22;
    let rightArmY = 22;
    let leftLegY = 22;
    let rightLegY = 22;
    let leftArmH = 6;
    let rightArmH = 6;
    let leftLegH = 6;
    let rightLegH = 6;
    let leftShoeX = 3;
    let rightShoeX = 12;

    if (isJump) {
      leftArmY = 20;
      rightArmY = 24;
      leftLegY = 20;
      rightLegY = 24;
      leftArmH = 8;
      rightArmH = 4;
      leftLegH = 8;
      rightLegH = 4;
      leftShoeX = 2;
      rightShoeX = 14;
    } else if (isRun && frame === 1) {
      leftArmY = 18;
      rightArmY = 24;
      leftLegY = 22;
      rightLegY = 26;
      leftArmH = 8;
      rightArmH = 4;
      leftLegH = 6;
      rightLegH = 2;
      leftShoeX = 2;
      rightShoeX = 14;
    } else if (isRun && frame === 2) {
      leftArmY = 21;
      rightArmY = 21;
      leftLegY = 21;
      rightLegY = 21;
      leftArmH = 6;
      rightArmH = 6;
      leftLegH = 6;
      rightLegH = 6;
      leftShoeX = 4;
      rightShoeX = 11;
    } else if (isRun && frame === 3) {
      leftArmY = 24;
      rightArmY = 18;
      leftLegY = 26;
      rightLegY = 20;
      leftArmH = 4;
      rightArmH = 8;
      leftLegH = 2;
      rightLegH = 8;
      leftShoeX = 14;
      rightShoeX = 2;
    }

    g.fillStyle(COLORS.fireFlower);
    g.fillRect(3 * px, leftLegY * px, 5 * px, leftLegH * px);
    g.fillRect(12 * px, rightLegY * px, 5 * px, rightLegH * px);
    g.fillRect(2 * px, leftArmY * px, 4 * px, leftArmH * px);
    g.fillRect(14 * px, rightArmY * px, 4 * px, rightArmH * px);

    const baseShoeY = 28;

    g.fillStyle(shoeColor);
    g.fillRect(leftShoeX * px, baseShoeY * px, shoeW * px, shoeH * px);
    g.fillRect(rightShoeX * px, baseShoeY * px, shoeW * px, shoeH * px);
  }

  static generateGoomba(scene: Phaser.Scene) {
    const textures = [
      { key: 'goomba_walk1', w: 32, h: 32 },
      { key: 'goomba_walk2', w: 32, h: 32 },
      { key: 'goomba_dead', w: 32, h: 32 }
    ];

    textures.forEach(t => {
      const g = scene.add.graphics();
      const px = 2;

      if (t.key.includes('dead')) {
        g.fillStyle(COLORS.goombaBrown);
        g.fillRect(3 * px, 10 * px, 26, 4 * px);
        g.fillStyle(0x000000);
        g.fillRect(6 * px, 11 * px, 2 * px, 2 * px);
        g.fillRect(16 * px, 11 * px, 2 * px, 2 * px);
        g.fillStyle(COLORS.goombaDark);
        g.fillRect(2 * px, 14 * px, 6 * px, 2 * px);
        g.fillRect(24 * px, 14 * px, 6 * px, 2 * px);
      } else {
        const frame = t.key.includes('walk1') ? 1 : 2;

        g.fillStyle(COLORS.goombaDark);
        g.fillRect(4 * px, 0, 24, 10 * px);
        g.fillStyle(COLORS.goombaBrown);
        g.fillRect(3 * px, 2 * px, 26, 10 * px);

        g.fillStyle(0xffffff);
        g.fillRect(6 * px, 4 * px, 5 * px, 5 * px);
        g.fillRect(17 * px, 4 * px, 5 * px, 5 * px);
        g.fillStyle(0x000000);
        g.fillRect(8 * px, 6 * px, 2 * px, 2 * px);
        g.fillRect(19 * px, 6 * px, 2 * px, 2 * px);

        g.fillStyle(COLORS.goombaDark);
        g.fillRect(5 * px, 12 * px, 22, 4 * px);

        if (frame === 1) {
          g.fillRect(3 * px, 14 * px, 6 * px, 4 * px);
          g.fillRect(23 * px, 14 * px, 6 * px, 4 * px);
        } else {
          g.fillRect(5 * px, 14 * px, 6 * px, 4 * px);
          g.fillRect(21 * px, 14 * px, 6 * px, 4 * px);
        }
      }

      g.generateTexture(t.key, t.w, t.h);
      g.destroy();
    });
  }

  static generateKoopa(scene: Phaser.Scene) {
    const textures = [
      { key: 'koopa_walk1', w: 32, h: 48 },
      { key: 'koopa_walk2', w: 32, h: 48 },
      { key: 'koopa_shell', w: 32, h: 32 }
    ];

    textures.forEach(t => {
      const g = scene.add.graphics();
      const px = 2;

      if (t.key.includes('shell')) {
        g.fillStyle(COLORS.marioGreen || 0x00a800);
        g.fillRect(2 * px, 4 * px, 28, 20);
        g.fillStyle(0x006400);
        g.fillRect(4 * px, 2 * px, 24, 4 * px);
        g.fillStyle(0x00a800);
        g.fillRect(6 * px, 8 * px, 4 * px, 4 * px);
        g.fillRect(16 * px, 8 * px, 4 * px, 4 * px);
      } else {
        g.fillStyle(0x00a800);
        g.fillRect(4 * px, 8 * px, 24, 24);
        g.fillStyle(0x006400);
        g.fillRect(6 * px, 6 * px, 20, 4 * px);
        g.fillStyle(0x90EE90);
        g.fillRect(8 * px, 12 * px, 4 * px, 4 * px);
        g.fillRect(16 * px, 12 * px, 4 * px, 4 * px);

        g.fillStyle(0xFFE4B5);
        g.fillRect(8 * px, 2 * px, 16, 8 * px);
        g.fillStyle(0x000000);
        g.fillRect(12 * px, 4 * px, 2 * px, 2 * px);

        g.fillStyle(0xFFE4B5);
        if (t.key.includes('walk1')) {
          g.fillRect(4 * px, 20 * px, 4 * px, 4 * px);
          g.fillRect(20 * px, 22 * px, 4 * px, 4 * px);
        } else {
          g.fillRect(6 * px, 22 * px, 4 * px, 4 * px);
          g.fillRect(22 * px, 20 * px, 4 * px, 4 * px);
        }
      }

      g.generateTexture(t.key, t.w, t.h);
      g.destroy();
    });
  }

  static generateTiles(scene: Phaser.Scene) {
    const size = 32;
    const px = 2;

    const brickG = scene.add.graphics();
    brickG.fillStyle(COLORS.brick);
    brickG.fillRect(0, 0, size, size);
    brickG.fillStyle(COLORS.brickDark);
    for (let row = 0; row < 4; row++) {
      const offset = row % 2 === 0 ? 0 : 8;
      for (let col = 0; col < 3; col++) {
        brickG.fillRect(offset + col * 16, row * 8, 14, 1);
        brickG.fillRect(offset + col * 16, row * 8, 1, 7);
      }
    }
    brickG.generateTexture('tile_brick', size, size);
    brickG.destroy();

    const groundG = scene.add.graphics();
    groundG.fillStyle(COLORS.groundTop);
    groundG.fillRect(0, 0, size, 6);
    groundG.fillStyle(COLORS.ground);
    groundG.fillRect(0, 6, size, size - 6);
    groundG.fillStyle(0x8B4513);
    for (let i = 0; i < 8; i++) {
      groundG.fillRect(Math.random() * 28 + 2, Math.random() * 20 + 8, 2, 2);
    }
    groundG.generateTexture('tile_ground', size, size);
    groundG.destroy();

    const questionG = scene.add.graphics();
    questionG.fillStyle(COLORS.question);
    questionG.fillRect(0, 0, size, size);
    questionG.fillStyle(COLORS.questionDark);
    questionG.fillRect(0, 0, size, 2);
    questionG.fillRect(0, size - 2, size, 2);
    questionG.fillRect(0, 0, 2, size);
    questionG.fillRect(size - 2, 0, 2, size);
    questionG.fillStyle(0xffffff);
    questionG.fillRect(12, 6, 8, 2);
    questionG.fillRect(12, 6, 2, 8);
    questionG.fillRect(18, 10, 2, 6);
    questionG.fillRect(12, 14, 8, 2);
    questionG.fillRect(14, 20, 4, 4);
    questionG.generateTexture('tile_question', size, size);
    questionG.destroy();

    const usedG = scene.add.graphics();
    usedG.fillStyle(0x8B4513);
    usedG.fillRect(0, 0, size, size);
    usedG.fillStyle(0x654321);
    usedG.fillRect(0, 0, size, 2);
    usedG.fillRect(0, size - 2, size, 2);
    usedG.fillRect(0, 0, 2, size);
    usedG.fillRect(size - 2, 0, 2, size);
    usedG.generateTexture('tile_used', size, size);
    usedG.destroy();

    const pipeG = scene.add.graphics();
    pipeG.fillStyle(COLORS.pipe);
    pipeG.fillRect(4, 0, 24, size);
    pipeG.fillStyle(COLORS.pipeDark);
    pipeG.fillRect(4, 0, 4, size);
    pipeG.fillRect(24, 0, 4, size);
    pipeG.fillRect(0, 0, 32, 8);
    pipeG.fillStyle(COLORS.pipeDark);
    pipeG.fillRect(0, 0, 6, 8);
    pipeG.fillRect(26, 0, 6, 8);
    pipeG.generateTexture('tile_pipe', size, size);
    pipeG.destroy();
  }

  static generateCoin(scene: Phaser.Scene) {
    const textures = [
      { key: 'coin1', w: 24, h: 24 },
      { key: 'coin2', w: 24, h: 24 },
      { key: 'coin3', w: 24, h: 24 },
      { key: 'coin4', w: 24, h: 24 }
    ];

    textures.forEach(t => {
      const g = scene.add.graphics();
      const frame = parseInt(t.key.slice(-1));
      const width = [12, 10, 4, 10][frame - 1];

      g.fillStyle(COLORS.coinGold);
      g.fillEllipse(12, 12, width, 16);

      g.lineStyle(2, COLORS.coinDark);
      g.strokeEllipse(12, 12, width, 16);

      g.fillStyle(0xfff0a0);
      if (width >= 6) {
        g.fillEllipse(12 - width / 5, 10, width / 3, 4);
      }

      g.generateTexture(t.key, t.w, t.h);
      g.destroy();
    });
  }

  static generateMushroom(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    const px = 2;

    g.fillStyle(COLORS.mushroomRed);
    g.fillRect(2 * px, 0, 28, 12 * px);
    g.fillStyle(COLORS.mushroomWhite);
    g.fillRect(6 * px, 2 * px, 4 * px, 4 * px);
    g.fillRect(18 * px, 4 * px, 4 * px, 4 * px);
    g.fillRect(10 * px, 6 * px, 6 * px, 4 * px);

    g.fillStyle(0xFFE4B5);
    g.fillRect(6 * px, 12 * px, 20, 12 * px);
    g.fillStyle(0x000000);
    g.fillRect(9 * px, 14 * px, 2 * px, 2 * px);
    g.fillRect(18 * px, 14 * px, 2 * px, 2 * px);

    g.generateTexture('mushroom', 32, 32);
    g.destroy();
  }

  static generateFireFlower(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    const px = 2;

    g.fillStyle(COLORS.fireFlower);
    g.fillRect(6 * px, 0, 4 * px, 4 * px);
    g.fillRect(12 * px, 2 * px, 4 * px, 4 * px);
    g.fillRect(18 * px, 0, 4 * px, 4 * px);
    g.fillRect(4 * px, 4 * px, 24, 8 * px);
    g.fillStyle(0xffff00);
    g.fillRect(12 * px, 6 * px, 6 * px, 4 * px);

    g.fillStyle(COLORS.pipe);
    g.fillRect(10 * px, 12 * px, 12, 10 * px);

    g.fillStyle(COLORS.question);
    g.fillRect(6 * px, 22 * px, 20, 8 * px);

    g.generateTexture('fireFlower', 32, 32);
    g.destroy();
  }

  static generateFireball(scene: Phaser.Scene) {
    const textures = [
      { key: 'fireball1', w: 16, h: 16 },
      { key: 'fireball2', w: 16, h: 16 }
    ];

    textures.forEach((t, idx) => {
      const g = scene.add.graphics();
      const frame = idx + 1;

      g.fillStyle(0xff0000);
      g.fillRect(6, 3, 4, 1);
      g.fillRect(4, 4, 8, 1);
      g.fillRect(3, 5, 10, 1);
      g.fillRect(2, 6, 12, 4);
      g.fillRect(3, 10, 10, 1);
      g.fillRect(4, 11, 8, 1);
      g.fillRect(6, 12, 4, 1);

      g.fillStyle(0xff8800);
      g.fillRect(6, 5, 4, 1);
      g.fillRect(4, 6, 8, 1);
      g.fillRect(4, 7, 8, 2);
      g.fillRect(4, 9, 8, 1);
      g.fillRect(6, 10, 4, 1);

      g.fillStyle(0xffff00);
      g.fillRect(6, 7, 4, 2);

      g.fillStyle(0xffffff);
      if (frame === 1) {
        g.fillRect(7, 6, 1, 1);
        g.fillRect(6, 7, 2, 1);
      } else {
        g.fillRect(7, 7, 2, 1);
        g.fillRect(7, 8, 1, 1);
      }

      g.generateTexture(t.key, t.w, t.h);
      g.destroy();
    });
  }

  static generateCloud(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.fillStyle(COLORS.cloud);
    g.fillRect(16, 8, 64, 24);
    g.fillRect(8, 16, 80, 16);
    g.fillRect(24, 4, 48, 8);
    g.generateTexture('cloud', 96, 40);
    g.destroy();
  }

  static generateHill(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.fillStyle(COLORS.hill);
    g.fillTriangle(0, 64, 64, 0, 128, 64);
    g.fillStyle(0x008000);
    g.fillTriangle(8, 64, 64, 10, 120, 64);
    g.generateTexture('hill', 128, 64);
    g.destroy();
  }

  static generateBoss(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    const px = 3;

    g.fillStyle(0x8B0000);
    g.fillRect(4 * px, 0, 16 * px, 6 * px);
    g.fillRect(2 * px, 4 * px, 20 * px, 4 * px);

    g.fillStyle(0xFFD700);
    g.fillRect(1 * px, 2 * px, 2 * px, 4 * px);
    g.fillRect(21 * px, 2 * px, 2 * px, 4 * px);

    g.fillStyle(0x228B22);
    g.fillRect(4 * px, 6 * px, 16 * px, 10 * px);
    g.fillStyle(0xffffff);
    g.fillRect(6 * px, 8 * px, 4 * px, 4 * px);
    g.fillRect(14 * px, 8 * px, 4 * px, 4 * px);
    g.fillStyle(0x000000);
    g.fillRect(8 * px, 9 * px, 2 * px, 2 * px);
    g.fillRect(16 * px, 9 * px, 2 * px, 2 * px);

    g.fillStyle(0x228B22);
    g.fillRect(2 * px, 10 * px, 2 * px, 4 * px);
    g.fillRect(20 * px, 10 * px, 2 * px, 4 * px);

    g.fillStyle(0xFFD700);
    g.fillRect(9 * px, 13 * px, 6 * px, 2 * px);

    g.fillStyle(0x228B22);
    g.fillRect(6 * px, 16 * px, 12 * px, 6 * px);

    g.fillStyle(0x8B4513);
    g.fillRect(4 * px, 20 * px, 4 * px, 4 * px);
    g.fillRect(16 * px, 20 * px, 4 * px, 4 * px);

    g.generateTexture('boss', 24 * px, 24 * px);
    g.destroy();
  }

  static generateFlag(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    const px = 2;

    g.fillStyle(0x00a800);
    g.fillRect(0, 0, 2 * px, 40 * px);

    g.fillStyle(0xff0000);
    g.fillRect(2 * px, 2 * px, 16 * px, 12 * px);
    g.fillStyle(0xcc0000);
    g.fillRect(2 * px, 12 * px, 16 * px, 2 * px);
    g.fillStyle(0xffff00);
    g.fillRect(6 * px, 5 * px, 6 * px, 4 * px);

    g.fillStyle(0xffd700);
    g.fillRect(-1 * px, 0, 4 * px, 2 * px);

    g.generateTexture('flag', 20 * px, 40 * px);
    g.destroy();
  }

  static generatePalace(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    const px = 4;

    g.fillStyle(0xd4a373);
    g.fillRect(0, 30 * px, 40 * px, 20 * px);

    g.fillStyle(0xb08050);
    g.fillRect(0, 48 * px, 40 * px, 2 * px);
    for (let i = 0; i < 5; i++) {
      g.fillRect(i * 8 * px, 32 * px, 1 * px, 16 * px);
    }
    for (let i = 0; i < 3; i++) {
      g.fillRect(0, 36 * px + i * 6 * px, 40 * px, 1 * px);
    }

    g.fillStyle(0xc49464);
    g.fillRect(2 * px, 12 * px, 8 * px, 20 * px);
    g.fillRect(16 * px, 8 * px, 8 * px, 24 * px);
    g.fillRect(30 * px, 12 * px, 8 * px, 20 * px);

    g.fillStyle(0xa07040);
    g.fillRect(2 * px, 30 * px, 8 * px, 2 * px);
    g.fillRect(16 * px, 30 * px, 8 * px, 2 * px);
    g.fillRect(30 * px, 30 * px, 8 * px, 2 * px);

    g.fillStyle(0x8b4513);
    g.fillRect(3 * px, 12 * px, 3 * px, 18 * px);
    g.fillRect(17 * px, 8 * px, 3 * px, 22 * px);
    g.fillRect(31 * px, 12 * px, 3 * px, 18 * px);

    g.fillStyle(0x654321);
    g.fillRect(0 * px, 10 * px, 12 * px, 2 * px);
    g.fillRect(14 * px, 6 * px, 12 * px, 2 * px);
    g.fillRect(28 * px, 10 * px, 12 * px, 2 * px);

    g.fillStyle(0x8b0000);
    g.fillTriangle(6 * px, 12 * px, 0, 12 * px, 6 * px, 4 * px);
    g.fillTriangle(20 * px, 8 * px, 14 * px, 8 * px, 20 * px, 0);
    g.fillTriangle(34 * px, 12 * px, 28 * px, 12 * px, 34 * px, 4 * px);

    g.fillStyle(0x4a2c0a);
    g.fillRect(17 * px, 36 * px, 6 * px, 14 * px);
    g.fillStyle(0x2d1a06);
    g.fillRect(18 * px, 38 * px, 4 * px, 12 * px);
    g.fillStyle(0xffd700);
    g.fillRect(20 * px, 44 * px, 1 * px, 2 * px);

    g.fillStyle(0x4a2c0a);
    g.fillRect(4 * px, 20 * px, 4 * px, 6 * px);
    g.fillStyle(0x2d1a06);
    g.fillRect(5 * px, 21 * px, 2 * px, 5 * px);
    g.fillRect(32 * px, 20 * px, 4 * px, 6 * px);
    g.fillStyle(0x2d1a06);
    g.fillRect(33 * px, 21 * px, 2 * px, 5 * px);

    g.fillStyle(0x4a2c0a);
    g.fillRect(18 * px, 16 * px, 4 * px, 6 * px);
    g.fillStyle(0x2d1a06);
    g.fillRect(19 * px, 17 * px, 2 * px, 5 * px);

    g.fillStyle(0x00a800);
    g.fillRect(19 * px, -2 * px, 2 * px, 10 * px);
    g.fillStyle(0xff0000);
    g.fillRect(21 * px, 0, 6 * px, 4 * px);

    g.generateTexture('palace', 40 * px, 50 * px);
    g.destroy();
  }
}
