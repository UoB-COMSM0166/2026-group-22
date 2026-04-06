// src/entities/SummonerBoss.js
class SummonerBoss extends Boss {
  constructor(x, y) {
    // x, y, width, height, hp, speed
    super(x, y, 120, 120, 220, 0);

    // Internal "Management" arrays (replaced MinionManager)
    this.minions = [];
    this.minionBullets = [];

    this.spawnCooldown = 60; // One minion every second (at 60fps)
    this.spawnTimer = this.spawnCooldown;
    this.movePhase = 0;
  }

  update() {
    // 1. Move the Boss
    this.movePattern();

    // 2. Handle Spawning
    this.spawnTimer--;
    if (this.spawnTimer <= 0 && this.hp > 0) {
      this.spawnTimer = this.spawnCooldown;
      this.spawnMinion();
    }

    // 3. Update Minions
    // We loop backwards so we can safely splice (remove) dead minions
    for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i];
      m.update(); // Minion finds player via sceneManager inside its own class

      // Check if minion wants to shoot
      const bullet = m.tryShoot();
      if (bullet) {
        this.minionBullets.push(bullet);
      }

      // Remove if dead or off-screen
      if (!m.active) {
        this.minions.splice(i, 1);
      }
    }

    InteractionManager.updateProjectiles(this.minionBullets);

    // 5. Inherited "Hurt" logic from Boss.js
    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    return null; // This boss doesn't shoot main projectiles; the minions do
  }

  movePattern() {
    this.movePhase += 0.03;
    this.y += Math.sin(this.movePhase) * 1.5;
  }

  spawnMinion() {
    const offsetY = random(-60, 60);
    // Add directly to internal array
    this.minions.push(new Minion(this.x - 50, this.y + offsetY));
  }

  show() {
    // 1. Draw Minions and Bullets first
    for (const m of this.minions) {
      m.show();
    }

    // 2. Draw Bullets (Using the new Bullet show method)
    for (const b of this.minionBullets) {
      b.show(); // Handles its own color and size
    }

    if (this.hp <= 0) {
      this.drawExplosion(); // This function is inherited from Boss.js
      return; 
    }

    // 2. Draw the Boss Body
    push();
    translate(this.x, this.y);

    // Visual feedback for damage (Inherited from Boss.js)
    if (this.isHurt) {
      fill(255, 200, 200); // Flashing light red
    } else {
      fill(200, 80, 120); // Main pinkish-red color
    }

    stroke(255);
    strokeWeight(3);
    ellipse(0, 0, this.w, this.h);

    // Eyes and mouth (Friend's logic)
    fill(255);
    ellipse(-20, -10, 16, 16);
    ellipse(20, -10, 16, 16);
    fill(40);
    ellipse(-20, -10, 7, 7);
    ellipse(20, -10, 7, 7);
    fill(80);
    rectMode(CENTER);
    rect(0, 15, 40, 8, 4);
    pop();
  }
}