// src/projectiles/Slash.js

class Slash extends Projectile {
  constructor(x, y, vx, vy, w, h, damage, img) {
    super(x, y, w, h, vx, vy);

    this.damage = damage;
    this.img = img;
    
    // Calculate initial angle based on velocity
    this.angle = atan2(this.vy, this.vx);
  }

  show() {
    if (!this.img) return;

    push();
    translate(this.x, this.y);
    rotate(this.angle + PI);
    
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}