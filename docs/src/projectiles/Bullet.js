class Bullet extends Projectile {
  constructor(x, y, dir, config) {
    super(x, y - 12, config.width, config.height, config.speedX * dir, config.speedY);
    this.damage = config.damage;
    this.img = assets.getImg(config.id);

    this.angle = atan2(this.vy, this.vx);
  }

  update() {
    super.update();
  }

  show() {
    if (!this.active) return;

    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}