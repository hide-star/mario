export interface GameState {
  score: number;
  coins: number;
  lives: number;
  level: number;
  world: number;
  playerState: PlayerState;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
}

export type PlayerState = 'small' | 'big' | 'fire';

export type EnemyType = 'goomba' | 'koopa';

export type PowerUpType = 'mushroom' | 'fireFlower';

export type TileType = 'empty' | 'ground' | 'brick' | 'question' | 'pipe' | 'used';

export interface LevelData {
  width: number;
  height: number;
  tiles: number[][];
  enemies: Array<{ type: EnemyType; x: number; y: number }>;
  coins: Array<{ x: number; y: number }>;
  powerUps: Array<{ type: PowerUpType; x: number; y: number }>;
  playerStart: { x: number; y: number };
  goalX: number;
}
