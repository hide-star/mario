# 项目长期记忆 — 超级玛丽游戏 (mario)

## 技术栈
- Phaser 3 (^3.70.0) + Vite 5 + TypeScript
- 纯代码生成的像素美术（AssetGenerator 用 Graphics 生成纹理，无外部图片资源）
- 场景：BootScene(生成资源+动画) → MenuScene → GameScene → GameOverScene

## 启动方式
- `npm run dev`（vite，端口 5173，自动打开浏览器）

## 关键经验
- **Phaser Arcade Physics Group 陷阱**：`physics.add.group()` 创建的组，`group.add(sprite)` 时会通过
  `createCallbackHandler` 应用 `defaults`（含 `setVelocityX:0`/`setVelocityY:0`），会把 sprite 在构造函数
  里设置的初始速度清零。解决：要么在 add 之后设置速度，要么在 update 中每帧持续 setVelocity。
  已确认源码：`node_modules/phaser/src/physics/arcade/PhysicsGroup.js` 的 createCallbackHandler。

## 项目结构
- src/entities/: Player, Goomba, Koopa, Boss, Coin, Mushroom, FireFlower, Fireball
- src/scenes/: BootScene, MenuScene, GameScene, GameOverScene
- src/game/: Game, config, types
- src/ui/: HUD
- src/utils/: AssetGenerator
