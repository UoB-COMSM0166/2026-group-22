class BossScene extends GameplayScene {
  constructor() {
    super();
    this.player = null;
    this.boss = null;
    this.world = null;
    this.bossProjectiles = [];
    this.statsBar = new StatsBar();

    this.isEnding = false;
    this.victoryTriggered = false;
  }

  onEnter(data) {
    const { bossType, arenaData, levelAssets } = data;

    this.isEnding = false;
    this.victoryTriggered = false;
    this.exitPromptActive = false;

    this.player = sceneManager.player;
    this.currentBossType = bossType;
    this.arenaData = arenaData;
    this.levelAssets = levelAssets;

    sceneManager.currentScene = this;

    this.world = new World(this.player, this.arenaData, this.levelAssets);

    const bossMap = {
      'regular': Boss,
      'summoner': SummonerBoss,
      'crusher': CrusherBoss
    };

    const startX = this.world.width - 120;
    const startY = this.world.height - 300;

    const m = CONFIG.DIFFICULTY_PRESETS[gameState.difficulty || "EASY"];
    const base = arenaData.bossConfig;

    const scaledBossConfig = {
      ...base,
      maxHp: base.maxHp * m.hp,
      damage: base.damage * m.damage,
      speed: base.speed * m.speed
    };

    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(startX, startY, this.levelAssets.bossSprites, scaledBossConfig);

    this.applyCanvasMode();

    this.player.x = 100;
    this.player.y = this.CANVAS_H - 150;
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.hp = 100;
    this.player.active = true;
    this.player.invincibilityTimer = 0;

    this.bossProjectiles = [];
  }

  onExit() {
    super.onExit();

    this.bossProjectiles = [];
    if (this.world) this.world.playerBullets = [];
  }

  update() {
    if (!this.player || !this.world || this.victoryTriggered || this.exitPromptActive) return;

    if (this.player.hp <= 0) {
      this.resetScene();
      return;
    }

    this.world.update();

    let attack = this.boss.update();
    if (attack) this.bossProjectiles.push(attack);

    for (let platform of this.world.platforms) {
      platform.resolve(this.boss, this.world);
    }

    InteractionManager.updateProjectiles(this.bossProjectiles);
    if (this.boss.minionBullets) {
      InteractionManager.updateProjectiles(this.boss.minionBullets);
    }

    this.checkCollisions();

    if (this.boss.hp <= 0 && !this.victoryTriggered && !this.isEnding) {
      this.isEnding = true;
      setTimeout(() => {
        this.victoryTriggered = true;
        this.isEnding = false;
      }, 2000);
    }
  }

  checkCollisions() {
    InteractionManager.handleCombat(this.player, [this.boss], this.world.playerBullets);
    InteractionManager.resolveHitGroup(this.bossProjectiles, this.player, (bullet, p) => {
      p.takeDamage(bullet.damage);
    });

    if (this.boss.minions) {
      InteractionManager.handleCombat(this.player, this.boss.minions, this.world.playerBullets);
      InteractionManager.resolveHitGroup(this.boss.minionBullets, this.player, (bullet, p) => {
        p.takeDamage(bullet.damage);
      });
    }
  }

  draw() {
    this.update();
    this.world.show();

    push();
    translate(-this.world.cameraX, -this.world.cameraY);
    this.boss.show();
    for (let b of this.bossProjectiles) b.show();
    pop();

    this.drawUI();
    this.drawSystemUI(null, true);

    if (this.victoryTriggered) {
      this.drawVictoryPopup();
    }
  }

  drawUI() {
    this.statsBar.drawBossHealth(this.boss);
    this.statsBar.draw(this.player, gameState.coins, false);
  }

  drawVictoryPopup() {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    const w = 400;
    const h = 220;
    const x = width / 2 - w / 2;
    const y = height / 2 - h / 2;

    push();
    fill(20, 10, 40, 240);
    stroke(0, 255, 255);
    strokeWeight(4);
    rect(x, y, w, h, 15);

    noStroke();
    fill(255);
    textFont(assets.getFont());
    textAlign(CENTER, TOP);
    textSize(42);
    text("VICTORY", width / 2, y + 40);

    textSize(20);
    fill(0, 255, 255);
    text("TRIAL COMPLETE", width / 2, y + 90);
    pop();

    const btnW = 120;
    const btnH = 45;
    const btnRect = {
      x: width / 2 - btnW / 2,
      y: y + h - 70,
      w: btnW,
      h: btnH
    };

    this.drawModalButton(btnRect, "OK", true, () => {
      this.exitToCamp();
    });

    cursor("default");
    if (this.inRect(mouseX, mouseY, btnRect)) cursor("pointer");
  }

  exitToCamp() {
    this.playerBullets = [];
    this.bossProjectiles = [];
    sceneManager.switch("camp");
  }

  mousePressed() {
    if (this.handleSystemClick()) return;
    if (this.isInputBlocked) return;
  }

  keyPressed() {
    if (this.handleExitInput()) return;

    if (this.player && !this.exitPromptActive) {
      this.player.handleKeyPress();
    }
  }

  resetScene() {
    this.onEnter({
      bossType: this.currentBossType,
      arenaData: this.arenaData,
      levelAssets: this.levelAssets
    });

    this.victoryTriggered = false;
  }
}