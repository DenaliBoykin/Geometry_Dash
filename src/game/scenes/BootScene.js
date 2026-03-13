import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.createTextures();
  }

  create() {
    this.scene.start("MenuScene");
  }

  createTextures() {
    const g = this.add.graphics();

    // Player
    g.clear();
    g.fillStyle(0x22c55e, 1);
    g.fillRect(0, 0, 48, 48);
    g.lineStyle(4, 0x0f172a, 1);
    g.strokeRect(2, 2, 44, 44);
    g.generateTexture("player", 48, 48);

    // Ground block
    g.clear();
    g.fillStyle(0x334155, 1);
    g.fillRect(0, 0, 64, 64);
    g.lineStyle(3, 0x64748b, 1);
    g.strokeRect(0, 0, 64, 64);
    g.generateTexture("ground", 64, 64);

    // Obstacle block
    g.clear();
    g.fillStyle(0xef4444, 1);
    g.fillRect(0, 0, 50, 50);
    g.lineStyle(3, 0x7f1d1d, 1);
    g.strokeRect(0, 0, 50, 50);
    g.generateTexture("blockObstacle", 50, 50);

    // Spike
    g.clear();
    g.fillStyle(0xf97316, 1);
    g.beginPath();
    g.moveTo(0, 48);
    g.lineTo(24, 0);
    g.lineTo(48, 48);
    g.closePath();
    g.fillPath();
    g.lineStyle(2, 0x7c2d12, 1);
    g.strokePath();
    g.generateTexture("spike", 48, 48);

    // Background stripe
    g.clear();
    g.fillStyle(0x1e293b, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x0b1220, 0.35);
    for (let i = 0; i < GAME_WIDTH; i += 80) {
      g.fillRect(i, 0, 40, GAME_HEIGHT);
    }
    g.generateTexture("bg", GAME_WIDTH, GAME_HEIGHT);

    g.destroy();
  }
}
