// src/entities/Bullet.js
class Bullet extends Projectile {
  constructor(x, y, vx, vy, size, damage, bulletColor) {
    // Pass size to both w and h of GameObject
    super(x, y, size, size, vx, vy);
    this.damage = damage;
    this.color = bulletColor;
  }

  show() {
    if (!this.active) return;
    push();
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.w);
    pop();
  }
}