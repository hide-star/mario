import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';

interface GameOverData {
  victory: boolean;
  score: number;
}

export default class GameOverScene extends Phaser.Scene {
  private victory: boolean = false;
  private score: number = 0;

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverData) {
    this.victory = data.victory;
    this.score = data.score;
  }

  create() {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = GAME_CONFIG.HEIGHT / 2;

    this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, 0x000000, 0.7).setOrigin(0, 0);

    const titleText = this.victory ? '🎉 恭喜通关！' : 'GAME OVER';
    const titleColor = this.victory ? '#ffd700' : '#e52521';

    this.add.text(centerX, centerY - 80, titleText, {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: titleColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 20, `最终分数: ${this.score}`, {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    const restartButton = this.add.text(centerX, centerY + 40, '重新开始 [ENTER]', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#ffffff',
      backgroundColor: '#00a800',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const menuButton = this.add.text(centerX, centerY + 100, '返回主菜单 [ESC]', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#dddddd'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    restartButton.on('pointerover', () => {
      restartButton.setScale(1.1);
    });

    restartButton.on('pointerout', () => {
      restartButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    menuButton.on('pointerover', () => {
      menuButton.setColor('#ffffff');
    });

    menuButton.on('pointerout', () => {
      menuButton.setColor('#dddddd');
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });

    if (this.victory) {
      this.tweens.add({
        targets: this.add.text(centerX, centerY - 130, '★', {
          fontSize: '36px',
          color: '#ffd700'
        }).setOrigin(0.5),
        scale: 1.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
}
