import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const basePath = 'assets/sprites';

    // Mario sprites (raw, high-res)
    this.load.image('raw_mario_idle', `${basePath}/mario/mario.jpg`);
    this.load.image('raw_mario_walk_right', `${basePath}/mario/mario_walk_right.jpg`);
    this.load.image('raw_mario_walk_left', `${basePath}/mario/mario_walk_left.jpg`);
    this.load.image('raw_mario_run_right', `${basePath}/mario/mario_run_right.jpg`);
    this.load.image('raw_mario_run_left', `${basePath}/mario/mario_run_left.jpg`);
    this.load.image('raw_mario_jump', `${basePath}/mario/mario_jump.jpg`);
    this.load.image('raw_mario_death', `${basePath}/mario/mario_death.jpg`);
    this.load.image('raw_mario_big', `${basePath}/mario/mario_big.jpg`);
    this.load.image('raw_mario_crouch', `${basePath}/mario/mario_crouch.jpg`);
    this.load.image('raw_mario_fire', `${basePath}/mario/mario_fire.jpg`);
    this.load.image('raw_mario_fire_big', `${basePath}/mario/mario_fire_big.jpg`);
    this.load.image('raw_mario_fire_walk_right', `${basePath}/mario/mario_fire_walk_right.jpg`);
    this.load.image('raw_mario_fire_walk_left', `${basePath}/mario/mario_fire_walk_left.jpg`);
    this.load.image('raw_mario_fire_run_right', `${basePath}/mario/mario_fire_run_right.jpg`);
    this.load.image('raw_mario_fire_run_left', `${basePath}/mario/mario_fire_run_left.jpg`);
    this.load.image('raw_mario_fire_jump', `${basePath}/mario/mario_fire_jump.jpg`);
    this.load.image('raw_mario_fire_crouch', `${basePath}/mario/mario_fire_crouch.jpg`);

    // Big Mario - full action variants (v2, vibrant modern)
    this.load.image('raw_big_idle', `${basePath}/mario/v2_big_idle.jpg`);
    this.load.image('raw_big_walk1', `${basePath}/mario/v2_big_walk1.jpg`);
    this.load.image('raw_big_walk2', `${basePath}/mario/v2_big_walk2.jpg`);
    this.load.image('raw_big_walk3', `${basePath}/mario/v2_big_walk3.jpg`);
    this.load.image('raw_big_jump', `${basePath}/mario/v2_big_jump.jpg`);
    this.load.image('raw_big_crouch', `${basePath}/mario/v2_big_crouch.jpg`);
    this.load.image('raw_big_death', `${basePath}/mario/v2_big_death.jpg`);
    this.load.image('raw_big_flag', `${basePath}/mario/v2_big_flag.jpg`);
    this.load.image('raw_big_throw', `${basePath}/mario/v2_big_throw.jpg`);
    this.load.image('raw_big_slide', `${basePath}/mario/v2_big_slide.jpg`);

    // Fire Mario - full action variants (v2, vibrant modern)
    this.load.image('raw_fire_idle', `${basePath}/mario/v2_fire_idle.jpg`);
    this.load.image('raw_fire_walk1', `${basePath}/mario/v2_fire_walk1.jpg`);
    this.load.image('raw_fire_walk2', `${basePath}/mario/v2_fire_walk2.jpg`);
    this.load.image('raw_fire_walk3', `${basePath}/mario/v2_fire_walk3.jpg`);
    this.load.image('raw_fire_jump_v2', `${basePath}/mario/v2_fire_jump.jpg`);
    this.load.image('raw_fire_crouch_v2', `${basePath}/mario/v2_fire_crouch.jpg`);
    this.load.image('raw_fire_death', `${basePath}/mario/v2_fire_death_alt.jpg`);
    this.load.image('raw_fire_flag', `${basePath}/mario/v2_fire_flag.jpg`);
    this.load.image('raw_fire_throw', `${basePath}/mario/v2_fire_throw.jpg`);
    this.load.image('raw_fire_slide', `${basePath}/mario/v2_fire_slide.jpg`);

    // Goomba sprites
    this.load.image('raw_goomba_walk', `${basePath}/goomba/goomba_walk.jpg`);
    this.load.image('raw_goomba_idle', `${basePath}/goomba/goomba.jpg`);
    this.load.image('raw_goomba_dead', `${basePath}/goomba/goomba_dead.jpg`);
    this.load.image('raw_goomba_stomped', `${basePath}/goomba/goomba_stomped.jpg`);

    // Koopa sprites
    this.load.image('raw_koopa_walk_right', `${basePath}/koopa/koopa_walk_right.jpg`);
    this.load.image('raw_koopa_walk_left', `${basePath}/koopa/koopa_walk_left.jpg`);
    this.load.image('raw_koopa_shell', `${basePath}/koopa/koopa_shell.jpg`);

    // Tiles
    this.load.image('raw_tile_ground', `${basePath}/ground/ground.jpg`);
    this.load.image('raw_tile_brick', `${basePath}/brick_block/brick_block.jpg`);
    this.load.image('raw_tile_question', `${basePath}/question_block/question_block.jpg`);
    this.load.image('raw_tile_used', `${basePath}/question_block/question_block_empty.jpg`);
    this.load.image('raw_tile_pipe', `${basePath}/pipe/pipe.jpg`);

    // Items
    this.load.image('raw_coin', `${basePath}/coin/coin.jpg`);
    this.load.image('raw_mushroom', `${basePath}/mushroom/mushroom.jpg`);
    this.load.image('raw_fireFlower', `${basePath}/fireflower/fireflower.jpg`);
    this.load.image('raw_fireball', `${basePath}/fireball/fireball.jpg`);

    // Background
    this.load.image('raw_cloud', `${basePath}/cloud/cloud.jpg`);
    this.load.image('raw_hill', `${basePath}/mountain/mountain_bg.png`);

    // Boss
    this.load.image('raw_boss', `${basePath}/bowser/bowser.jpg`);

    // Goal
    this.load.image('raw_flag', `${basePath}/flagpole/flagpole.jpg`);
    this.load.image('raw_palace', `${basePath}/castle/castle.jpg`);
  }

  private detectBackgroundColors(imageData: ImageData, width: number, height: number): { r: number; g: number; b: number }[] {
    const data = imageData.data;
    const samplePoints: { r: number; g: number; b: number }[] = [];
    const step = Math.max(1, Math.floor(Math.min(width, height) / 20));

    for (let x = 0; x < width; x += step) {
      const idx = (x) * 4;
      samplePoints.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
      const idx2 = (height - 1) * width * 4 + x * 4;
      samplePoints.push({ r: data[idx2], g: data[idx2 + 1], b: data[idx2 + 2] });
    }
    for (let y = 0; y < height; y += step) {
      const idx = y * width * 4;
      samplePoints.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
      const idx2 = y * width * 4 + (width - 1) * 4;
      samplePoints.push({ r: data[idx2], g: data[idx2 + 1], b: data[idx2 + 2] });
    }

    const colorCounts: Map<string, { r: number; g: number; b: number; count: number }> = new Map();
    for (const c of samplePoints) {
      const key = `${Math.round(c.r / 10) * 10},${Math.round(c.g / 10) * 10},${Math.round(c.b / 10) * 10}`;
      if (colorCounts.has(key)) {
        colorCounts.get(key)!.count++;
      } else {
        colorCounts.set(key, { r: c.r, g: c.g, b: c.b, count: 1 });
      }
    }

    const sorted = Array.from(colorCounts.values()).sort((a, b) => b.count - a.count);
    const bgColors: { r: number; g: number; b: number }[] = [];
    const minCount = samplePoints.length * 0.05;

    for (const c of sorted) {
      if (c.count >= minCount) {
        bgColors.push({ r: c.r, g: c.g, b: c.b });
      }
      if (bgColors.length >= 5) break;
    }

    if (bgColors.length === 0) {
      bgColors.push({ r: 255, g: 255, b: 255 });
    }

    return bgColors;
  }

  private createBackgroundTexture(srcKey: string, dstKey: string, targetH: number) {
    const texture = this.textures.get(srcKey);
    if (!texture || texture.key === '__MISSING') {
      console.warn(`Texture ${srcKey} not found`);
      return;
    }

    const src = texture.getSourceImage() as HTMLImageElement;
    if (!src || !src.width || !src.height) {
      console.warn(`Source image for ${srcKey} not ready`);
      return;
    }

    try {
      const scale = targetH / src.height;
      const targetW = Math.floor(src.width * scale);

      const canvasTexture = this.textures.createCanvas(dstKey, targetW, targetH);
      if (!canvasTexture) {
        console.warn(`Failed to create canvas texture for ${dstKey}`);
        return;
      }

      const ctx = canvasTexture.getContext();
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.drawImage(src, 0, 0, targetW, targetH);

      canvasTexture.refresh();
    } catch (e) {
      console.error(`Error creating background texture ${dstKey}:`, e);
    }
  }

  private getContentBounds(imageData: ImageData, width: number, height: number): { left: number; right: number; top: number; bottom: number } {
    const data = imageData.data;
    let left = width, right = 0, top = height, bottom = 0;
    let found = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 10) {
          found = true;
          if (x < left) left = x;
          if (x > right) right = x;
          if (y < top) top = y;
          if (y > bottom) bottom = y;
        }
      }
    }

    if (!found) {
      return { left: 0, right: width - 1, top: 0, bottom: height - 1 };
    }

    return { left, right, top, bottom };
  }

  private createScaledTexture(srcKey: string, dstKey: string, targetW: number, targetH: number, mode: 'contain' | 'stretch' | 'cover' = 'contain', valign: 'top' | 'bottom' | 'middle' = 'bottom') {
    const texture = this.textures.get(srcKey);
    if (!texture || texture.key === '__MISSING') {
      console.warn(`Texture ${srcKey} not found`);
      return;
    }

    const src = texture.getSourceImage() as HTMLImageElement;
    if (!src || !src.width || !src.height) {
      console.warn(`Source image for ${srcKey} not ready`);
      return;
    }

    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = src.width;
      tempCanvas.height = src.height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(src, 0, 0);

      const imageData = tempCtx.getImageData(0, 0, src.width, src.height);
      const data = imageData.data;

      const bgColors = this.detectBackgroundColors(imageData, src.width, src.height);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        let isBg = false;
        for (const bg of bgColors) {
          const dr = Math.abs(r - bg.r);
          const dg = Math.abs(g - bg.g);
          const db = Math.abs(b - bg.b);
          if (dr < 15 && dg < 15 && db < 15) {
            isBg = true;
            break;
          }
        }

        if (isBg) {
          data[i + 3] = 0;
        }
      }

      tempCtx.putImageData(imageData, 0, 0);

      const bounds = this.getContentBounds(imageData, src.width, src.height);
      const contentW = bounds.right - bounds.left + 1;
      const contentH = bounds.bottom - bounds.top + 1;

      const canvasTexture = this.textures.createCanvas(dstKey, targetW, targetH);
      if (!canvasTexture) {
        console.warn(`Failed to create canvas texture for ${dstKey}`);
        return;
      }

      const ctx = canvasTexture.getContext();
      let drawW, drawH, offsetX, offsetY;
      let sx = bounds.left;
      let sy = bounds.top;
      let sWidth = contentW;
      let sHeight = contentH;

      if (mode === 'stretch') {
        drawW = targetW;
        drawH = targetH;
        offsetX = 0;
        offsetY = 0;
        sx = 0;
        sy = 0;
        sWidth = src.width;
        sHeight = src.height;
      } else if (mode === 'cover') {
        const scale = Math.max(targetW / contentW, targetH / contentH);
        drawW = contentW * scale;
        drawH = contentH * scale;
        offsetX = (targetW - drawW) / 2;
        if (valign === 'top') {
          offsetY = 0;
        } else if (valign === 'middle') {
          offsetY = (targetH - drawH) / 2;
        } else {
          offsetY = targetH - drawH;
        }
      } else {
        const scale = Math.min(targetW / contentW, targetH / contentH);
        drawW = contentW * scale;
        drawH = contentH * scale;
        offsetX = (targetW - drawW) / 2;
        if (valign === 'top') {
          offsetY = 0;
        } else if (valign === 'middle') {
          offsetY = (targetH - drawH) / 2;
        } else {
          offsetY = targetH - drawH;
        }
      }

      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.drawImage(tempCanvas, sx, sy, sWidth, sHeight, offsetX, offsetY, drawW, drawH);

      canvasTexture.refresh();
    } catch (e) {
      console.error(`Error creating scaled texture ${dstKey}:`, e);
    }
  }

  create() {
    const TILE = GAME_CONFIG.TILE_SIZE;

    // Create all scaled textures
    // Small Mario
    this.createScaledTexture('raw_mario_idle', 'mario_small_idle', TILE, TILE);
    this.createScaledTexture('raw_mario_walk_right', 'mario_small_run1', TILE, TILE);
    this.createScaledTexture('raw_mario_walk_left', 'mario_small_run2', TILE, TILE);
    this.createScaledTexture('raw_mario_run_right', 'mario_small_run3', TILE, TILE);
    this.createScaledTexture('raw_mario_jump', 'mario_small_jump', TILE, TILE);

    // Big Mario (full action variants, 48x64)
    this.createScaledTexture('raw_big_idle', 'mario_big_idle', 48, 64);
    this.createScaledTexture('raw_big_walk1', 'mario_big_run1', 48, 64);
    this.createScaledTexture('raw_big_walk2', 'mario_big_run2', 48, 64);
    this.createScaledTexture('raw_big_walk3', 'mario_big_run3', 48, 64);
    this.createScaledTexture('raw_big_jump', 'mario_big_jump', 48, 64);
    this.createScaledTexture('raw_big_crouch', 'mario_big_crouch', 48, 32);
    this.createScaledTexture('raw_big_death', 'mario_big_death', 48, 64);
    this.createScaledTexture('raw_big_flag', 'mario_big_flag', 48, 64);
    this.createScaledTexture('raw_big_throw', 'mario_big_throw', 48, 64);
    this.createScaledTexture('raw_big_slide', 'mario_big_slide', 48, 64);

    // Fire Mario (full action variants, 48x64)
    this.createScaledTexture('raw_fire_idle', 'mario_fire_idle', 48, 64);
    this.createScaledTexture('raw_fire_walk1', 'mario_fire_run1', 48, 64);
    this.createScaledTexture('raw_fire_walk2', 'mario_fire_run2', 48, 64);
    this.createScaledTexture('raw_fire_walk3', 'mario_fire_run3', 48, 64);
    this.createScaledTexture('raw_fire_jump_v2', 'mario_fire_jump', 48, 64);
    this.createScaledTexture('raw_fire_crouch_v2', 'mario_fire_crouch', 48, 32);
    this.createScaledTexture('raw_fire_death', 'mario_fire_death', 48, 64);
    this.createScaledTexture('raw_fire_flag', 'mario_fire_flag', 48, 64);
    this.createScaledTexture('raw_fire_throw', 'mario_fire_throw', 48, 64);
    this.createScaledTexture('raw_fire_slide', 'mario_fire_slide', 48, 64);

    // Goomba
    this.createScaledTexture('raw_goomba_walk', 'goomba_walk1', TILE, TILE);
    this.createScaledTexture('raw_goomba_idle', 'goomba_walk2', TILE, TILE);
    this.createScaledTexture('raw_goomba_stomped', 'goomba_dead', TILE, TILE);

    // Koopa
    this.createScaledTexture('raw_koopa_walk_right', 'koopa_walk1', TILE, TILE * 1.5);
    this.createScaledTexture('raw_koopa_walk_left', 'koopa_walk2', TILE, TILE * 1.5);
    this.createScaledTexture('raw_koopa_shell', 'koopa_shell', TILE, TILE);

    // Tiles
    this.createScaledTexture('raw_tile_ground', 'tile_ground', TILE, TILE, 'cover', 'top');
    this.createScaledTexture('raw_tile_brick', 'tile_brick', TILE, TILE);
    this.createScaledTexture('raw_tile_question', 'tile_question', TILE, TILE);
    this.createScaledTexture('raw_tile_used', 'tile_used', TILE, TILE);
    this.createScaledTexture('raw_tile_pipe', 'tile_pipe', TILE, TILE);

    // Items
    this.createScaledTexture('raw_coin', 'coin1', 24, 24);
    this.createScaledTexture('raw_coin', 'coin2', 24, 24);
    this.createScaledTexture('raw_coin', 'coin3', 24, 24);
    this.createScaledTexture('raw_coin', 'coin4', 24, 24);
    this.createScaledTexture('raw_mushroom', 'mushroom', TILE, TILE);
    this.createScaledTexture('raw_fireFlower', 'fireFlower', TILE, TILE);
    this.createScaledTexture('raw_fireball', 'fireball1', 16, 16);
    this.createScaledTexture('raw_fireball', 'fireball2', 16, 16);

    // Background
    this.createScaledTexture('raw_cloud', 'cloud', 128, 64);
    this.createBackgroundTexture('raw_hill', 'hill', 300);

    // Boss
    this.createScaledTexture('raw_boss', 'boss', TILE * 2, TILE * 2);

    // Goal
    this.createScaledTexture('raw_flag', 'flag', 40, 80);
    this.createScaledTexture('raw_palace', 'palace', 160, 200);

    // Animations
    this.anims.create({
      key: 'mario_small_walk',
      frames: [
        { key: 'mario_small_run1' },
        { key: 'mario_small_run2' },
        { key: 'mario_small_run3' }
      ],
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'mario_big_walk',
      frames: [
        { key: 'mario_big_run1' },
        { key: 'mario_big_run2' },
        { key: 'mario_big_run3' }
      ],
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'mario_fire_walk',
      frames: [
        { key: 'mario_fire_run1' },
        { key: 'mario_fire_run2' },
        { key: 'mario_fire_run3' }
      ],
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'goomba_walk',
      frames: [
        { key: 'goomba_walk1' },
        { key: 'goomba_walk2' }
      ],
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'koopa_walk',
      frames: [
        { key: 'koopa_walk1' },
        { key: 'koopa_walk2' }
      ],
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'coin_spin',
      frames: [
        { key: 'coin1' },
        { key: 'coin2' },
        { key: 'coin3' },
        { key: 'coin4' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'fireball_spin',
      frames: [
        { key: 'fireball1' },
        { key: 'fireball2' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.scene.start('MenuScene');
  }
}
