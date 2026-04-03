// src/scenes/BossScene.js
class BossScene {
  constructor() {
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.world = null;
    this.playerBullets = [];
    this.bossBullets = [];
    this.canvasActive = false;

    this.statsBar = new StatsBar();

    this.CANVAS_W = CONFIG.WORLD.CANVAS_WIDTH;
    this.CANVAS_H = CONFIG.WORLD.CANVAS_HEIGHT;

    // Combat Settings
    this.shootCooldown = 15;
    this.currentCooldown = 0;
  }

  onEnter(data) {
    const { bossType, bgLayers, worldAssets } = data;

    this.player = sceneManager.player;
    this.currentBossType = bossType;
    this.bgLayers = bgLayers;
    this.worldAssets = worldAssets;
    // 1. Tell the global manager this is the active scene
    // This allows the Boss/Minions to find playerBullets
    sceneManager.currentScene = this;

    const arenaLevelIndex = 5;
    this.world = new World(this.player, arenaLevelIndex, this.bgLayers, this.worldAssets);

    const bossMap = {
      'summoner': SummonerBoss,
      'regular': Boss,
    };

    // 1. Dynamic Boss Creation
    const startX = this.world.width - 120;
    const startY = this.world.height - 150;

    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(startX, startY);

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

    // 3. Clear projectiles from previous attempts
    this.playerBullets = [];
    this.bossBullets = [];
  }

  onExit() {
    this.restoreFullCanvasMode();
  }

  update() {
    if (!this.player || !this.world) return;

    if (this.player.hp <= 0) {
      this.resetScene();
      return; // Stop the rest of the update for this frame
    }

    this.world.update();
    this.handlePlayerShooting();

    // Update Boss and catch attacks
    let attack = this.boss.update();
    if (attack) {
      this.bossBullets.push(attack);
    }

    this.updateProjectiles();
    this.checkCollisions();

    // If Boss dies, return to camp or go to victory screen
    if (this.boss.hp <= 0) {
      setTimeout(() => sceneManager.switch("camp"), 2000);
    }
  }

  handlePlayerShooting() {
    if (this.currentCooldown > 0) this.currentCooldown--;

    // "J" Key to shoot stars
    if (keyIsDown(74) && this.currentCooldown <= 0) {
      // Shoot in the direction player is facing
      let dir = this.player.isFacingLeft ? -1 : 1;
      let pb = new Bullet(
        this.player.x + (20 * dir),
        this.player.y,
        12 * dir, 0,     // Fast movement right
        15, 10,          // Size and damage
        color(255, 255, 0)
      );
      this.playerBullets.push(pb);
      this.currentCooldown = this.shootCooldown;
    }
  }

  updateProjectiles() {
    // Combine logic into a helper or keep loops separate for clarity
    const bulletGroups = [this.playerBullets, this.bossBullets];

    // Also clean up minion bullets if they exist
    if (this.boss.minionBullets) bulletGroups.push(this.boss.minionBullets);

    bulletGroups.forEach(group => {
      for (let i = group.length - 1; i >= 0; i--) {
        group[i].update();

        if (!group[i].active) { // Standardized cleanup flag
          group.splice(i, 1);
        }
      }
    });
  }

  // --- COLLISION LAYER ---
  checkCollisions() {
    // 4. Resolve hits using built-in AABB intersects method
    this.resolveHitGroup(this.playerBullets, this.boss, (b, boss) => boss.takeDamage(b.damage));
    this.resolveHitGroup(this.bossBullets, this.player, (b, p) => p.hp -= b.damage);

    // 5. Minion-Specific Logic (Guard Clause)
    if (this.boss.minions) {
      // Minion Body vs Player (Touch Damage)
      this.resolveHitGroup(this.boss.minions, this.player, (m, p) => {
        const dir = (p.x < m.x) ? -1 : 1;
        p.takeDamage(10, dir); //
      });

      // Player Bullets vs Minions
      this.playerBullets.forEach((pb, i) => {
        this.boss.minions.some(m => {
          if (pb.intersects(m)) {
            m.takeDamage(pb.damage);
            pb.active = false;
            this.playerBullets.splice(i, 1);
            return true;
          }
        });
      });

      // Minion Bullets vs Player
      if (this.boss.minionBullets) {
        this.resolveHitGroup(this.boss.minionBullets, this.player, (mb, p) => p.hp -= mb.damage);
      }
    }
  }

  /**
   * REUSABLE UTILITY: Professional many-to-one collision handler
   */
  resolveHitGroup(projectiles, target, onHit) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (projectiles[i].intersects(target)) {
        onHit(projectiles[i], target);
        projectiles[i].active = false; // Standardized cleanup
        projectiles.splice(i, 1);
      }
    }
  }

  draw() {
    this.update();

    this.world.show();

    push();
    translate(-this.world.cameraX, -this.world.cameraY);
    this.boss.show();
    for (let b of this.playerBullets) b.show();
    for (let b of this.bossBullets) b.show();
    pop();

    this.drawUI();
  }

  drawUI() {
    // 1. Boss Health Bar (Top)
    let barW = 400;
    let hpW = map(max(0, this.boss.hp), 0, this.boss.maxHp, 0, barW);
    fill(40, 200);
    rect(width / 2 - barW / 2, 30, barW, 15, 5);
    fill(255, 0, 50);
    rect(width / 2 - barW / 2, 30, hpW, 15, 5);

    this.statsBar.draw(this.player, shopState.coins, false);
  }

  keyPressed() {
    if (keyCode === ESCAPE) {
      // Clean up state before leaving
      this.playerBullets = [];
      this.bossBullets = [];

      sceneManager.switch("camp");
    }

    if (this.player) {
      this.player.handleKeyPress();
    }
  }

  resetScene() {
    this.onEnter({
      bossType: this.currentBossType,
      bgLayers: this.bgLayers,
      worldAssets: this.worldAssets
    });

    // 4. Reset shoot cooldown
    this.currentCooldown = 0;

    // Optional: If you used an 'isVictoryTriggered' flag, reset it too
    this.isVictoryTriggered = false;
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