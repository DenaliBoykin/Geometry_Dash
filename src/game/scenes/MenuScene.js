import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "bg");

    this.add
      .text(GAME_WIDTH / 2, 150, "GEOMETRY DASH STYLE", {
        fontFamily: "Arial",
        fontSize: "40px",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 220, "Jump over spikes and blocks", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#cbd5e1"
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 300, "Press SPACE, CLICK, or TAP to start", {
        fontFamily: "Arial",
        fontSize: "26px",
        color: "#22c55e"
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 360, "Controls: SPACE / Left Click / Tap", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#94a3b8"
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });

    this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
