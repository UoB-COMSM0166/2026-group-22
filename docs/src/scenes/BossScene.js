// src/scenes/BossScene.js
class BossScene extends GameplayScene {
  constructor() {
    super();
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.world = null;
    this.bossBullets = [];
    this.statsBar = new StatsBar();
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

    this.bossBullets = [];
  }

  update() {
    if (!this.player || !this.world) return;

    if (this.player.hp <= 0) {
      this.resetScene();
      return; // Stop the rest of the update for this frame
    }

    this.world.update();

    // Update Boss and catch attacks
    let attack = this.boss.update();
    if (attack) {
      this.bossBullets.push(attack);
    }

    this.updateBossProjectiles();
    this.checkCollisions();

    // If Boss dies, return to camp or go to victory screen
    if (this.boss.hp <= 0) {
      setTimeout(() => sceneManager.switch("camp"), 2000);
    }
  }

  updateBossProjectiles() {
    // Only handle boss and minion bullets here
    const groups = [this.bossBullets];
    if (this.boss.minionBullets) groups.push(this.boss.minionBullets);

    groups.forEach(group => {
      for (let i = group.length - 1; i >= 0; i--) {
        group[i].update();
        if (!group[i].active) group.splice(i, 1);
      }
    });
  }

  // --- COLLISION LAYER ---
  checkCollisions() {
    // 6. FIX: Use this.world.playerBullets for boss hits
    this.resolveHitGroup(this.world.playerBullets, this.boss, (b, boss) => boss.takeDamage(b.damage));

    // Boss bullets hit player
    this.resolveHitGroup(this.bossBullets, this.player, (b, p) => p.hp -= b.damage);

    // Minion collisions
    if (this.boss.minions) {
      this.resolveHitGroup(this.boss.minions, this.player, (m, p) => {
        const dir = (p.x < m.x) ? -1 : 1;
        p.takeDamage(10, dir);
      });

      // Player Bullets (from World) vs Minions
      this.world.playerBullets.forEach((pb, i) => {
        this.boss.minions.some(m => {
          if (pb.intersects(m)) {
            m.takeDamage(pb.damage);
            pb.active = false;
            return true;
          }
        });
      });
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

    // Optional: If you used an 'isVictoryTriggered' flag, reset it too
    this.isVictoryTriggered = false;
  }
}