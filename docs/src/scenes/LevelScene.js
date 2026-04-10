// src/scenes/LevelScene.js
class LevelScene extends GameplayScene {
  constructor() {
    super();
    this.player = null;
    this.world = null;
    this.doorNumber = 1;
    this.bgLayers = {
      far: null,
      mid: null,
      front: null
    };
  }

  // Logic to run when the scene starts
  onEnter() {
    this.applyCanvasMode();
    // Build the world if it doesn't exist yet
    if (!this.world) this.buildLevel(this.doorNumber);
  }

  buildLevel(doorNumber) {
    // Safety fallback: if no backgrounds exist, provide nulls to avoid errors
    this.bgLayers = assets.getLevelBgs(doorNumber - 1);

    this.doorNumber = doorNumber;

    const playerSprites = {
      idle: assets.getImg('char1_idle'),
      walk: [assets.getImg('char1_walk1'), assets.getImg('char1_walk2')],
      jump: assets.getImg('char1_jump'),
      attack: assets.getImg('char1_attack'),
      inhale: assets.getImg('char1_skill')
    };

    // Instantiate your physical objects
    this.player = new Player(playerSprites);
    sceneManager.player = this.player;

    const worldAssets = {
      platformTile: assets.getImg('platform_tile')
    };

    this.world = new World(this.player, this.doorNumber, this.bgLayers, worldAssets);
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
  keyPressed() {
  console.log("scene keyPressed");

  if (this.world && this.world.player) {
    this.world.player.handleKeyPress();
  }
}
}