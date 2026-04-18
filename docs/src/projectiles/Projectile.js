class Projectile extends GameObject {
  constructor(x, y, w, h, vx, vy) {
    super(x, y, w, h);
    this.vx = vx;
    this.vy = vy;

    this.startX = x;
    this.startY = y;
    this.maxRange = 1000;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    let distanceTraveled = dist(this.startX, this.startY, this.x, this.y);

    if (distanceTraveled > this.maxRange) {
      this.active = false;
    }
  }
}