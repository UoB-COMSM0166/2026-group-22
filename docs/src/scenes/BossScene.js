// src/scenes/BossScene.js
class BossScene {
  constructor() {
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.playerBullets = [];
    this.bossBullets = [];

    this.statsBar = new StatsBar();

    // Combat Settings
    this.flySpeed = 6;
    this.shootCooldown = 10;
    this.currentCooldown = 0;
  }

  onEnter(bossType) {
    this.currentBossType = bossType;
    // 1. Tell the global manager this is the active scene
    // This allows the Boss/Minions to find playerBullets
    sceneManager.currentScene = this;

    const bossMap = {
      'summoner': SummonerBoss,
      'regular': Boss,
    };

    // 1. Dynamic Boss Creation
    const startX = width - 120;
    const startY = height / 2;

    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(startX, startY);

    // 2. Setup Player for flight mode
    // We use the global player instance but reset their position
    this.player = sceneManager.player;
    this.player.x = 100;
    this.player.y = height / 2;
    this.player.velX = 0;
    this.player.velY = 0;

    this.player.hp = 100;               // Restore HP to stop the reset loop
    this.player.active = true;           // Reactivate the entity
    this.player.invincibilityTimer = 0; // Stop the flashing immediately

    // 3. Clear projectiles from previous attempts
    this.playerBullets = [];
    this.bossBullets = [];
  }

  update() {
    if (this.player.hp <= 0) {
      this.resetScene();
      return; // Stop the rest of the update for this frame
    }
    this.handlePlayerMovement();
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

  handlePlayerMovement() {
    // WASD or Arrow Keys for 8-way flying movement
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.player.y -= this.flySpeed;
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.player.y += this.flySpeed;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.player.x -= this.flySpeed;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.player.x += this.flySpeed;

    // Keep player inside the screen boundaries
    this.player.x = constrain(this.player.x, 30, width - 30);
    this.player.y = constrain(this.player.y, 30, height - 30);
  }

  handlePlayerShooting() {
    if (this.currentCooldown > 0) this.currentCooldown--;

    // "J" Key to shoot stars
    if (keyIsDown(74) && this.currentCooldown <= 0) {
      let pb = new Bullet(
        this.player.x + 20,
        this.player.y,
        12, 0,           // Fast movement right
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
    // Dark Space/Boss Background
    background(20, 20, 60);

    this.boss.show();
    this.player.show();

    // Draw Player's stars using the class method
    for (let b of this.playerBullets) {
      b.show();
    }

    // Draw Boss bullets using the class method
    for (let b of this.bossBullets) {
      b.show();
    }

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

    // // 2. Player Health Bar (Bottom)
    // let pBarW = 200;
    // let pHpW = map(max(0, this.player.hp), 0, 100, 0, pBarW);
    // fill(40, 200);
    // rect(width / 2 - pBarW / 2, height - 30, pBarW, 12, 3);
    // fill(0, 255, 100);
    // rect(width / 2 - pBarW / 2, height - 30, pHpW, 12, 3);

    // fill(255);
    // textSize(12);
    // textAlign(CENTER);
    // text("KIRBY HP", width / 2, height - 35);
    this.statsBar.draw(this.player, shopState.coins, false);
  }

  keyPressed() {
    if (keyCode === ESCAPE) {
      // Clean up state before leaving
      this.playerBullets = [];
      this.bossBullets = [];

      sceneManager.switch("camp");
    }
  }

  resetScene() {
    this.onEnter(this.currentBossType);

    // 4. Reset shoot cooldown
    this.currentCooldown = 0;

    // Optional: If you used an 'isVictoryTriggered' flag, reset it too
    this.isVictoryTriggered = false;
  }
}