// src/scenes/LevelScene.js
class LevelScene {
  constructor() {
    this.player = null;
    this.world = null;
    this.doorNumber = 1;
    this.canvasActive = false;

    // Fixed dimensions for the Kirby demo style
    this.CANVAS_W = CONFIG.WORLD.CANVAS_WIDTH;
    this.CANVAS_H = CONFIG.WORLD.CANVAS_HEIGHT;

    this.assets = {
      idle: null,
      walk: null,
      jump: null,
    };

    this.worldAssets = {
      platformTile: null
    };

    this.bgLayers = {
      far: null,
      mid: null,
      front: null
    };
  }

  preload() {
    this.assets.idle = loadImage("./assets/kirby_idle.png");
    this.assets.walk = loadImage("./assets/kirby_move.png");
    this.assets.jump = loadImage("./assets/kirby_jump.png");
    this.worldAssets.platformTile = loadImage("./assets/platform_tile.png")

    this.levelBackgrounds = CONFIG.LEVELS.map(level => {
      if (!level.backgrounds) return null;

      return {
        far: loadImage(level.backgrounds.far),
        midBack: loadImage(level.backgrounds.midBack),
        midFront: loadImage(level.backgrounds.midFront),
        front: loadImage(level.backgrounds.front)
      };
    });
  }

  // Logic to run when the scene starts
  onEnter() {
    this.applyCanvasMode();

    // Build the world if it doesn't exist yet
    if (!this.world) {
      this.buildLevel(this.doorNumber);
    }
  }

  // New: Logic to run when leaving the scene
  onExit() {
    this.restoreFullCanvasMode();
  }

  buildLevel(doorNumber) {
    const data = CONFIG.LEVELS[doorNumber - 1];

    const preloadedBgs = this.levelBackgrounds[doorNumber - 1];
    // Safety fallback: if no backgrounds exist, provide nulls to avoid errors
    this.bgLayers = preloadedBgs || { far: null, midBack: null, midFront: null, front: null };

    this.doorNumber = doorNumber;
    const playerFrames = [this.assets.idle, this.assets.walk, this.assets.jump];

    // Instantiate your physical objects
    this.player = new Player(playerFrames);

    sceneManager.player = this.player;

    this.world = new World(this.player, this.doorNumber, this.bgLayers , this.worldAssets);

    console.log("[LevelScene] World built for door:", doorNumber);
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
        bgLayers: this.world.bgLayers
      });
    }

    // Optional: Add another key for the regular boss
    if (key === 'n' || key === 'N') {
      console.log("🛠️ Dev Mode: Jumping to Regular Boss");
      sceneManager.switch('boss', {
        bossType: 'regular',
        bgLayers: this.world.bgLayers
      });
    }
  }

  /* =============================
     DOM & Canvas Styling Methods
     ============================= */

  applyCanvasMode() {
    resizeCanvas(this.CANVAS_W, this.CANVAS_H);
    const body = document.body;
    const c = document.querySelector("canvas");

    body.style.display = "flex";
    body.style.justifyContent = "center";
    body.style.alignItems = "center";
    body.style.background = "black";
    body.style.overflow = "hidden";

    if (c) {
      c.style.width = this.CANVAS_W + "px";
      c.style.height = this.CANVAS_H + "px";
    }

    this.canvasActive = true;
  }

  restoreFullCanvasMode() {
    const body = document.body;
    const c = document.querySelector("canvas");

    body.style.display = "block";
    body.style.background = "#111";
    body.style.overflow = "";

    if (c) {
      c.style.width = "";
      c.style.height = "";
    }

    resizeCanvas(window.innerWidth, window.innerHeight);
    this.canvasActive = false;
  }

  handleResize() {
    if (this.canvasActive) {
      this.applyCanvasMode();
    }
  }
}