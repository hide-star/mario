import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';

export default class MenuScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;

  constructor() {
    super('MenuScene');
  }

  create() {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = GAME_CONFIG.HEIGHT / 2;

    this.add.image(200, 100, 'cloud').setAlpha(0.8);
    this.add.image(600, 80, 'cloud').setAlpha(0.8);
    this.add.image(400, 120, 'cloud').setAlpha(0.6);

    this.add.image(100, GAME_CONFIG.HEIGHT - 64, 'hill').setOrigin(0, 1);
    this.add.image(600, GAME_CONFIG.HEIGHT - 64, 'hill').setOrigin(0, 1);

    this.titleText = this.add.text(centerX, centerY - 80, 'SUPER MARIO', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#e52521',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 30, '经典像素冒险', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.startButton = this.add.text(centerX, centerY + 30, '开始游戏 [ENTER]', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#ffffff',
      backgroundColor: '#e52521',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.startButton.on('pointerdown', () => {
      this.startGame();
    });

    this.startButton.on('pointerover', () => {
      this.startButton.setScale(1.1);
    });

    this.startButton.on('pointerout', () => {
      this.startButton.setScale(1);
    });

    this.add.text(centerX, centerY + 90, '操作说明：', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 115, '← → 或 A/D 移动    ↑/W/空格 跳跃    J/Shift 发射火球', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#dddddd'
    }).setOrigin(0.5);

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.startGame();
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.startGame();
    });

    this.tweens.add({
      targets: this.titleText,
      y: centerY - 75,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private startGame() {
    this.scene.start('GameScene');
  }
}
