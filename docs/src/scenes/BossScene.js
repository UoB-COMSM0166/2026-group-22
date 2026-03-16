// src/scenes/BossScene.js
class BossScene {
  constructor() {
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.playerBullets = [];
    this.bossBullets = [];

    // Combat Settings
    this.flySpeed = 6;
    this.shootCooldown = 10;
    this.currentCooldown = 0;
  }

  onEnter() {
    // 1. Initialize Boss at the right side of the screen
    this.boss = new Boss(width - 120, height / 2);

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
    this.handlePlayerMovement();
    this.handlePlayerShooting();

    // Update Boss and catch attacks
    let attack = this.boss.update();
    if (attack) {
      attack.speed = -8; // Ensure boss bullet moves left
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
      this.playerBullets.push({
        x: this.player.x + 20,
        y: this.player.y,
        speed: 12,
        size: 15
      });
      this.currentCooldown = this.shootCooldown;
    }
  }

  updateProjectiles() {
    // Move Player Bullets
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      let b = this.playerBullets[i];
      b.x += b.speed;
      if (b.x > width) this.playerBullets.splice(i, 1);
    }

    // Move Boss Bullets
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      let b = this.bossBullets[i];
      b.x += b.speed;
      if (b.x < 0) this.bossBullets.splice(i, 1);
    }
  }

  checkCollisions() {
    // 1. Player Bullets vs Boss
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      let b = this.playerBullets[i];
      if (dist(b.x, b.y, this.boss.x, this.boss.y) < 70) {
        this.boss.takeDamage(10);
        this.playerBullets.splice(i, 1);
      }
    }

    // 2. Boss Bullets vs Player
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      let b = this.bossBullets[i];
      if (dist(b.x, b.y, this.player.x, this.player.y) < 30) {
        this.player.hp -= 5;
        this.bossBullets.splice(i, 1);
      }
    }
  }

  draw() {
    this.update();
    // Dark Space/Boss Background
    background(20, 20, 60);

    this.boss.show();
    this.player.show();

    // Draw Projectiles
    fill(255, 255, 0); // Yellow Stars
    for (let b of this.playerBullets) ellipse(b.x, b.y, b.size);

    fill(255, 100, 0); // Orange Boss Bullets
    for (let b of this.bossBullets) ellipse(b.x, b.y, 25);

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

    // 2. Player Health Bar (Bottom)
    let pBarW = 200;
    let pHpW = map(max(0, this.player.hp), 0, 100, 0, pBarW);
    fill(40, 200);
    rect(width / 2 - pBarW / 2, height - 30, pBarW, 12, 3);
    fill(0, 255, 100);
    rect(width / 2 - pBarW / 2, height - 30, pHpW, 12, 3);

    fill(255);
    textSize(12);
    textAlign(CENTER);
    text("KIRBY HP", width / 2, height - 35);
  }
}