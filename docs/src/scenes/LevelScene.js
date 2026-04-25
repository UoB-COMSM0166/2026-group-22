class LevelScene extends GameplayScene {
  constructor() {
    super();
    this.player = null;
    this.world = null;
    this.doorNumber = 1;
  }

  onEnter() {
    this.applyCanvasMode();
    if (!this.world) this.buildLevel(this.doorNumber);
  }

  buildLevel(doorNumber) {
    this.doorNumber = doorNumber;
    const levelData = CONFIG.LEVELS[doorNumber - 1];
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

    this.player = new Player(playerSprites);
    sceneManager.player = this.player;

    this.world = new World(this.player, levelData, levelAssets);
  }

  draw() {
    if (!this.player || !this.world) {
      this.drawLoadingScreen();
      return;
    }

    this.world.update();
    this.world.show();
    this.drawUI();
    this.drawExitPrompt("camp", true);
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
    text("A / D to Move Left / Right | SPACE to Jump | ESC to Camp", width / 2, 30);
    text("J to Shoot | K to Collect Skill Items", width / 2, 60);
    pop();
  }

  keyPressed() {
    if (this.handleExitInput()) return;

    if (this.player) {
      this.player.handleKeyPress();
    }

    if (key === 'b' || key === 'B') {
      console.log("🛠️ Dev Mode: Jumping to Summoner Boss");
      sceneManager.switch('boss', {
        bossType: 'summoner',
        arenaData: this.world.levelData.bossArena,
        levelAssets: this.world.levelAssets
      });
    }

    if (key === 'n' || key === 'N') {
      console.log("🛠️ Dev Mode: Jumping to Regular Boss");
      sceneManager.switch('boss', {
        bossType: 'regular',
        arenaData: this.world.levelData.bossArena,
        levelAssets: this.world.levelAssets
      });
    }

    if (key === 'm' || key === 'M') {
      sceneManager.switch('boss', {
        bossType: 'crusher',
        arenaData: this.world.levelData.bossArena,
        levelAssets: this.world.levelAssets
      });
    }
  }
}