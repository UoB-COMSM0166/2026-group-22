// src/scenes/BossScene.js
class BossScene extends GameplayScene {
  constructor() {
    super();
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.world = null;
    this.bossProjectiles = [];
    this.statsBar = new StatsBar();

    this.victoryTriggered = false;
  }

  onEnter(data) {
    const { bossType, arenaData, levelAssets } = data;

    this.player = sceneManager.player;
    this.currentBossType = bossType;
    this.arenaData = arenaData;
    this.levelAssets = levelAssets;
    // 1. Tell the global manager this is the active scene
    // This allows the Boss/Minions to find playerBullets
    sceneManager.currentScene = this;

    this.world = new World(this.player, this.arenaData, this.levelAssets);

    const bossMap = {
      'regular': Boss,
      'summoner': SummonerBoss,
      'crusher': CrusherBoss
    };

    // 1. Dynamic Boss Creation
    const startX = this.world.width - 120;
    const startY = this.world.height - 300;

    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(startX, startY, this.levelAssets.bossSprites, arenaData.bossConfig);

    this.applyCanvasMode();

    // 2. Setup Player for flight mode
    // We use the global player instance but reset their position
    this.player.x = 100;
    this.player.y = this.CANVAS_H - 150;
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.hp = 100;               // Restore HP to stop the reset loop
    this.player.active = true;           // Reactivate the entity
    this.player.invincibilityTimer = 0; // Stop the flashing immediately

    this.bossProjectiles = [];
  }

  update() {
    if (!this.player || !this.world || this.victoryTriggered) return;

    if (this.player.hp <= 0) {
      this.resetScene();
      return; // Stop the rest of the update for this frame
    }

    this.world.update();

    // Update Boss and catch attacks
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

    // If Boss dies, return to camp or go to victory screen
    if (this.boss.hp <= 0 && !this.victoryTriggered) {
      this.victoryTriggered = true;
    }
  }

  checkCollisions() {
    InteractionManager.handleCombat(this.player, [this.boss], this.world.playerBullets);

    InteractionManager.resolveHitGroup(this.bossProjectiles, this.player, (bullet, p) => {
      // Calculate knockback direction
      const dir = (p.x < bullet.x) ? -1 : 1;
      p.takeDamage(bullet.damage, dir);
    });

    // 4. REUSE: Minion interactions
    if (this.boss.minions) {
      // Handles playerBullets hitting minions AND minions touching player
      InteractionManager.handleCombat(this.player, this.boss.minions, this.world.playerBullets);

      // Handles minion bullets hitting player
      InteractionManager.resolveHitGroup(this.boss.minionBullets, this.player, (bullet, p) => {
        const dir = (p.x < bullet.x) ? -1 : 1;
        p.takeDamage(bullet.damage, dir);
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

    if (this.victoryTriggered) {
      this.drawVictoryPopup();
    }
  }

  drawUI() {
    this.statsBar.drawBossHealth(this.boss);
    this.statsBar.draw(this.player, gameState.coins, false);
  }

  drawVictoryPopup() {
    // 1. Dim the background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // 2. Main Panel
    const w = 400;
    const h = 220;
    const x = width / 2 - w / 2;
    const y = height / 2 - h / 2;

    push();
    // Use colors from your cover art (Deep Purple/Neon Blue)
    fill(20, 10, 40, 240);
    stroke(0, 255, 255); // Neon cyan border
    strokeWeight(4);
    rect(x, y, w, h, 15);

    // 3. Title Text
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

    // 4. "OK" Button using BaseScene helper
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
    // Clear projectiles before switching
    this.playerBullets = [];
    this.bossProjectiles = [];
    sceneManager.switch("camp");
  }

  keyPressed() {
    if (keyCode === ESCAPE) {
      // Clean up state before leaving
      this.playerBullets = [];
      this.bossProjectiles = [];

      sceneManager.switch("camp");
    }

    if (this.player) {
      this.player.handleKeyPress();
    }
  }

  resetScene() {
    this.onEnter({
      bossType: this.currentBossType,
      arenaData: this.arenaData,
      levelAssets: this.levelAssets
    });

    // Optional: If you used an 'isVictoryTriggered' flag, reset it too
    this.isVictoryTriggered = false;
  }
}