// src/entities/Projectile.js
class Projectile extends GameObject {
  constructor(x, y, w, h, vx, vy) {
    super(x, y, w, h);
    this.vx = vx; // Velocity X
    this.vy = vy; // Velocity Y

    this.startX = x;       // Record birth position
    this.startY = y;
    this.maxRange = 1000;  // Maximum travel distance in pixels
  }

  // 建议的修改逻辑
update(cameraX) {
  this.x += this.vx;
  this.y += this.vy;

    let distanceTraveled = dist(this.startX, this.startY, this.x, this.y);

    if (distanceTraveled > this.maxRange) {
      this.active = false;
    }
  }
}
