class Bullet extends Projectile {
  constructor(x, y, vx, vy, size, damage, bulletColor) {
    super(x, y, size, size, vx, vy);
    this.damage = damage;
    this.color = bulletColor;
  }

  update() {
    super.update();
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