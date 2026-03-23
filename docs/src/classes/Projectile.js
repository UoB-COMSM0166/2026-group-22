// src/entities/Projectile.js
class Projectile extends GameObject {
  constructor(x, y, w, h, vx, vy) {
    super(x, y, w, h);
    this.vx = vx; // Velocity X
    this.vy = vy; // Velocity Y
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Standard off-screen cleanup
    if (this.x < -100 || this.x > width + 100 ||
      this.y < -100 || this.y > height + 100) {
      this.active = false;
    }
  }
}