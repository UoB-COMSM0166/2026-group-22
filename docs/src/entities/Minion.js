// src/entities/Minion.js
class Minion extends Entity {
  constructor(x, y) {
    // super(x, y, width, height, hp, speed)
    super(x, y, 24, 24, 1, 2.5);

    // Custom movement vectors
    this.vx = -this.speed;
    this.vy = random(-1.2, 1.2);

    // this.isDead = false;
    this.damage = 10;

    this.shootCooldown = 90;
    this.shootTimer = this.shootCooldown;
  }

  // We override the Entity update to handle unique "Flying/Homing" logic
  update() {
    // 1. Basic Movement
    this.x += this.vx;
    this.y += this.vy;

    // 2. Homing Logic: Gently follow the player's Y-position
    const player = sceneManager.player;
    if (player) {
      if (player.y < this.y) this.y -= 0.4;
      if (player.y > this.y) this.y += 0.4;
    }

    // 3. Countdown for shooting
    if (this.shootTimer > 0) this.shootTimer--;

    // 4. Self-Cleanup: Mark as dead if flies off-screen
    if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
      this.active = false;
    }
  }

  tryShoot() {
    const player = sceneManager.player;

    // Only shoot if player exists and cooldown is ready
    if (!player || this.shootTimer > 0) return null;

    this.shootTimer = this.shootCooldown;

    // Calculate direction towards player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    const bulletSpeed = 4;
    const vx = (dx / distance) * bulletSpeed;
    const vy = (dy / distance) * bulletSpeed;

    // Return a projectile object for the Boss to manage
    return new Bullet(
      this.x, 
      this.y, 
      vx, 
      vy, 
      10,                // Size
      8,                 // Damage
      color(255, 60, 60) // Minion Bullet Color (Red)
    );
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
    }
  }

  // Visuals (Now uses this.w from the Entity class)
  show() {
    push();
    translate(this.x, this.y);

    // Body (The little orange orb)
    fill(255, 160, 60);
    noStroke();
    ellipse(0, 0, this.w);

    // Eyes
    fill(255);
    ellipse(-5, -3, 5, 5);
    ellipse(5, -3, 5, 5);
    fill(60);
    ellipse(-5, -3, 2, 2);
    ellipse(5, -3, 2, 2);
    pop();
  }
}