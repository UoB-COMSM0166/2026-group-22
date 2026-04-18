class Arrow extends Projectile {
  constructor(x, y, vx, vy) {
    super(x, y, 10, 10, vx, vy);

    this.gravity = 0.25;
    this.damage = 20;
    this.angle = 0;

    this.startX = x;
  }

  update() {
    this.vy += this.gravity;
    super.update();

    this.angle = Math.atan2(this.vy, this.vx);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    fill(255, 200, 0);
    noStroke();

    rectMode(CENTER);
    rect(0, 0, 20, 4);

    triangle(10, -5, 10, 5, 18, 0);
    pop();
  }
}