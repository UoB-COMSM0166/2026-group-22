// src/scenes/LevelScene.js
class LevelScene extends GameplayScene {
  constructor() {
    super();
    this.player = null;
    this.world = null;
    this.doorNumber = 1;
  }

  // Logic to run when the scene starts
  onEnter() {
    this.applyCanvasMode();
    // Build the world if it doesn't exist yet
    if (!this.world) this.buildLevel(this.doorNumber);
  }

  buildLevel(doorNumber) {
    this.doorNumber = doorNumber;
    const levelAssets = assets.getLevelAssets(doorNumber - 1);

    const charId = gameState.selectedCharacterId;
    const prefix = `char${charId}`;

    const playerSprites = {
      idle: assets.getImg(`${prefix}_idle`),
      walk: [
        assets.getImg(`${prefix}_walk1`),
        assets.getImg(`${prefix}_walk2`)
      ],
      jump: assets.getImg(`${prefix}_jump`),
      attack: assets.getImg(`${prefix}_attack`),
      inhale: assets.getImg(`${prefix}_skill`)
    };

    // Instantiate your physical objects
    this.player = new Player(playerSprites);
    sceneManager.player = this.player;

    this.world = new World(this.player, this.doorNumber, levelAssets);
  }

  draw() {
    if (!this.player || !this.world) {
      this.drawLoadingScreen();
      return;
    }

    // Standard game loop pattern: Update then Show
    this.world.update();
    this.world.show();
    this.drawUI();
  }

  drawLoadingScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Loading level...", width / 2, height / 2);
  }

  drawUI() {
    push();
    fill(255);
    textSize(16);
    textAlign(CENTER, TOP);
    text("A / D to Move | SPACE to Jump | ESC to Camp", width / 2, 16);
    pop();
  }

  keyPressed() {
    if (keyCode === ESCAPE) {
      sceneManager.switch("camp");
      return;
    }

    if (this.player) {
      this.player.handleKeyPress();
    }

    // Check for the 'B' key (Key Code 66)
    if (key === 'b' || key === 'B') {
      console.log("🛠️ Dev Mode: Jumping to Summoner Boss");
      // Switch to boss scene and tell it to load the 'summoner'
      sceneManager.switch('boss', {
        bossType: 'summoner',
        bgLayers: this.world.bgLayers,
        worldAssets: this.world.worldAssets
      });
    }

    // Optional: Add another key for the regular boss
    if (key === 'n' || key === 'N') {
      console.log("🛠️ Dev Mode: Jumping to Regular Boss");
      sceneManager.switch('boss', {
        bossType: 'regular',
        bgLayers: this.world.bgLayers,
        worldAssets: this.world.worldAssets
      });
    }
  }
}