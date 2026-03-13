import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";
import Player from "../objects/Player";

const GROUND_Y = GAME_HEIGHT - 92;
const SCROLL_SPEED = 320;
const START_X = 180;
const START_Y = GROUND_Y - 80;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.player = null;
    this.ground = null;
    this.obstacles = null;
    this.cursors = null;
    this.score = 0;
    this.bestScore = 0;
    this.distance = 0;
    this.isGameOver = false;
    this.spawnTimer = 0;
    this.spawnInterval = 1200;
  }

  create() {
    this.isGameOver = false;
    this.score = 0;
    this.distance = 0;
    this.spawnTimer = 0;

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg");

    this.createParallaxDecor();
    this.createGround();
    this.createPlayer();
    this.createObstacles();
    this.createUI();
    this.setupInput();
  }

  createParallaxDecor() {
    this.decor = this.add.group();

    for (let i = 0; i < 8; i++) {
      const rect = this.add.rectangle(
        150 + i * 140,
        Phaser.Math.Between(140, 320),
        Phaser.Math.Between(40, 90),
        Phaser.Math.Between(120, 220),
        0x1e293b,
        0.8
      );
      rect.speed = Phaser.Math.Between(40, 90);
      this.decor.add(rect);
    }
  }

  createGround() {
    this.ground = this.physics.add.staticGroup();

    for (let x = 0; x < GAME_WIDTH + 64; x += 64) {
      this.ground.create(x, GAME_HEIGHT - 32, "ground").setOrigin(0, 0);
    }

    const floor = this.add.rectangle(
      GAME_WIDTH / 2,
      GROUND_Y + 70,
      GAME_WIDTH,
      8,
      0x000000,
      0
    );
    this.physics.add.existing(floor, true);
    this.floorCollider = floor;
  }

  createPlayer() {
    this.player = new Player(this, START_X, START_Y);
    this.player.setBounce(0);
    this.player.setDepth(5);

    this.physics.add.collider(this.player, this.floorCollider);
  }

  createObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.handleDeath,
      null,
      this
    );
  }

  createUI() {
    this.scoreText = this.add
      .text(20, 20, "Score: 0", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.bestText = this.add
      .text(20, 56, "Best: 0", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#cbd5e1"
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.restartText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold"
      })
      .setOrigin(0.5)
      .setDepth(20);
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.input.on("pointerdown", () => {
      this.handlePress();
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      this.handlePress();
    });
  }

  handlePress() {
    if (this.isGameOver) {
      this.scene.restart();
      return;
    }

    this.player.jump(720);
  }

  spawnObstacle() {
    const patternRoll = Phaser.Math.Between(0, 100);
    const startX = GAME_WIDTH + 80;

    if (patternRoll < 55) {
      this.spawnSpike(startX, GROUND_Y + 4);
    } else if (patternRoll < 80) {
      this.spawnBlock(startX, GROUND_Y - 1);
    } else {
      this.spawnSpike(startX, GROUND_Y + 4);
      this.spawnSpike(startX + 52, GROUND_Y + 4);
    }

    if (this.score > 12 && patternRoll > 70) {
      this.spawnBlock(startX + 70, GROUND_Y - 50);
    }
  }

  spawnSpike(x, y) {
    const spike = this.obstacles.create(x, y, "spike");
    spike.setOrigin(0, 1);
    spike.body.setSize(40, 40);
    spike.body.setOffset(4, 6);
    spike.setVelocityX(-SCROLL_SPEED);
  }

  spawnBlock(x, y) {
    const block = this.obstacles.create(x, y, "blockObstacle");
    block.setOrigin(0, 1);
    block.body.setSize(50, 50);
    block.body.setOffset(0, 0);
    block.setVelocityX(-SCROLL_SPEED);
  }

  handleDeath() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.player.die();

    this.bestScore = Math.max(this.bestScore, this.score);

    this.restartText.setText(
      `Game Over\nScore: ${this.score}\nBest: ${this.bestScore}\n\nPress SPACE / CLICK / TAP to restart`
    );
  }

  update(_, delta) {
    this.updateDecor(delta);

    if (this.isGameOver) return;

    this.spawnTimer += delta;
    this.distance += (SCROLL_SPEED * delta) / 1000;

    const nextScore = Math.floor(this.distance / 10);
    if (nextScore !== this.score) {
      this.score = nextScore;
      this.scoreText.setText(`Score: ${this.score}`);
      this.bestText.setText(`Best: ${Math.max(this.bestScore, this.score)}`);
    }

    const dynamicInterval = Math.max(650, this.spawnInterval - this.score * 8);

    if (this.spawnTimer >= dynamicInterval) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    this.obstacles.children.each((obstacle) => {
      if (!obstacle) return;
      obstacle.x -= (SCROLL_SPEED * delta) / 1000;

      if (obstacle.getBounds().right < 0) {
        obstacle.destroy();
      }
    });

    if (this.player.y > GAME_HEIGHT + 100) {
      this.handleDeath();
    }
  }

  updateDecor(delta) {
    if (!this.decor) return;

    this.decor.getChildren().forEach((rect) => {
      rect.x -= (rect.speed * delta) / 1000;
      if (rect.x < -80) {
        rect.x = GAME_WIDTH + Phaser.Math.Between(40, 140);
        rect.y = Phaser.Math.Between(140, 320);
      }
    });
  }
}
 
