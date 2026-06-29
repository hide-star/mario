import Phaser from 'phaser';
import { GAME_CONFIG } from './config';
import BootScene from '../scenes/BootScene';
import MenuScene from '../scenes/MenuScene';
import GameScene from '../scenes/GameScene';
import GameOverScene from '../scenes/GameOverScene';

export class Game {
  private game: Phaser.Game;

  constructor(container: HTMLElement) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      parent: container,
      pixelArt: GAME_CONFIG.PIXEL_ART,
      backgroundColor: GAME_CONFIG.BG_COLOR,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: GAME_CONFIG.GRAVITY },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [BootScene, MenuScene, GameScene, GameOverScene]
    };

    this.game = new Phaser.Game(config);
  }

  destroy() {
    this.game.destroy(true);
  }
}
