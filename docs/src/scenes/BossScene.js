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
    // 3. Polymorphic Update: Tell the bullets to handle their own movement
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      let b = this.playerBullets[i];
      b.update();
      if (!b.active) this.playerBullets.splice(i, 1);
    }

    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      let b = this.bossBullets[i];
      b.update();
      if (!b.active) this.bossBullets.splice(i, 1);
    }
  }

  checkCollisions() {
    // 4. Update collision math to use Bullet properties (.w instead of .size)
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      let b = this.playerBullets[i];
      if (dist(b.x, b.y, this.boss.x, this.boss.y) < 70) {
        this.boss.takeDamage(b.damage); // Use the bullet's actual damage
        this.playerBullets.splice(i, 1);
      }
    }

    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      let b = this.bossBullets[i];
      if (dist(b.x, b.y, this.player.x, this.player.y) < 30) {
        this.player.hp -= b.damage; // Use the bullet's actual damage
        this.bossBullets.splice(i, 1);
      }
    }

    // Guard Clause for Summoner Boss minions
    if (this.boss.minions && Array.isArray(this.boss.minions)) {
      for (let i = this.playerBullets.length - 1; i >= 0; i--) {
        let pb = this.playerBullets[i];
        for (let j = this.boss.minions.length - 1; j >= 0; j--) {
          let m = this.boss.minions[j];
          if (dist(pb.x, pb.y, m.x, m.y) < (m.w + pb.w) / 2) {
            m.takeDamage(pb.damage);
            this.playerBullets.splice(i, 1);
            break;
          }
        }
      }

      for (let i = this.boss.minions.length - 1; i >= 0; i--) {
        let m = this.boss.minions[i];
        if (dist(m.x, m.y, this.player.x, this.player.y) < 30) {
          const dir = (this.player.x < m.x) ? -1 : 1;
          this.player.takeDamage(10, dir);
          this.boss.minions.splice(i, 1);
        }
      }
    }

    // Minion Bullets
    if (this.boss.minionBullets) {
      for (let i = this.boss.minionBullets.length - 1; i >= 0; i--) {
        let mb = this.boss.minionBullets[i];
        if (dist(mb.x, mb.y, this.player.x, this.player.y) < 25) {
          this.player.hp -= mb.damage;
          this.boss.minionBullets.splice(i, 1);
        }
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