import Phaser from 'phaser';
import { AssetGenerator } from '../utils/AssetGenerator';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
  }

  create() {
    AssetGenerator.generateAll(this);
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
        { key: 'mario_fire_idle' },
        { key: 'mario_fire_run1' }
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
