import Phaser from 'phaser';
import type { GameState } from '../game/types';

export default class HUD {
  private scene: Phaser.Scene;
  private scoreText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private worldText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    };

    this.scoreText = this.scene.add.text(20, 15, 'MARIO\n000000', style).setScrollFactor(0);

    this.coinsText = this.scene.add.text(200, 15, '×00', style).setScrollFactor(0);

    this.worldText = this.scene.add.text(380, 15, 'WORLD\n1-1', style).setScrollFactor(0);
    this.worldText.setOrigin(0.5, 0);

    this.livesText = this.scene.add.text(750, 15, 'LIVES\n3', style).setScrollFactor(0);
    this.livesText.setOrigin(1, 0);
  }

  update(state: GameState) {
    this.scoreText.setText(`MARIO\n${state.score.toString().padStart(6, '0')}`);
    this.coinsText.setText(`×${state.coins.toString().padStart(2, '0')}`);
    this.livesText.setText(`LIVES\n${state.lives}`);
    this.worldText.setText(`WORLD\n${state.world}-${state.level}`);
  }

  destroy() {
    this.scoreText.destroy();
    this.coinsText.destroy();
    this.livesText.destroy();
    this.worldText.destroy();
  }
}
