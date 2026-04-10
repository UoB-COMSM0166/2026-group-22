// src/scenes/BossScene.js
class BossScene extends GameplayScene {
  constructor() {
    super();
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.world = null;
    this.bossProjectiles = [];
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

    const bossSprites = {
      idle: assets.getImg('boss_idle'),   // Make sure these keys exist in AssetManager
      attack: assets.getImg('boss_shoot'),
      slash: assets.getImg('boss_slash')
    };

    // 1. Dynamic Boss Creation
    const startX = this.world.width - 120;
    const startY = this.world.height - 300;

    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(startX, startY, bossSprites);

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
    if (!this.player || !this.world) return;

    if (this.player.hp <= 0) {
      this.resetScene();
      return; // Stop the rest of the update for this frame
    }

    this.world.update();

    // Update Boss and catch attacks
    let attack = this.boss.update();
    if (attack) this.bossProjectiles.push(attack);

    for (let platform of this.world.platforms) {
      InteractionManager.resolveSolid(this.boss, platform, this.world);
    }

    InteractionManager.updateProjectiles(this.bossProjectiles);
    if (this.boss.minionBullets) {
      InteractionManager.updateProjectiles(this.boss.minionBullets);
    }

    this.checkCollisions();

    // If Boss dies, return to camp or go to victory screen
    if (this.boss.hp <= 0) {
      setTimeout(() => sceneManager.switch("camp"), 2000);
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
  }

  drawUI() {
    this.statsBar.drawBossHealth(this.boss);
    this.statsBar.draw(this.player, gameState.coins, false);
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
      bgLayers: this.bgLayers,
      worldAssets: this.worldAssets
    });

    // Optional: If you used an 'isVictoryTriggered' flag, reset it too
    this.isVictoryTriggered = false;
  }
}