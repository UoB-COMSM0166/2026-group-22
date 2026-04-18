class Checkpoint extends GameObject {
  constructor(x, y) {
    super(x, y - 20, 40, 40);

    this.isReached = false;
  }

  update(player) {
    if (!this.isReached && this.intersects(player)) {
      this.isReached = true;
      return true;
    }
    return false;
  }

  show() {
    push();
    translate(this.x, this.y + this.h / 2);
    rectMode(CENTER);
    noStroke();

    fill(80);
    rect(0, -this.h / 2, 6, this.h);

    if (this.isReached) {
      fill(50, 205, 50);
    } else {
      fill(200, 0, 0);
    }

    triangle(3, -this.h, 3, -this.h + 20, 25, -this.h + 10);

    pop();
  }
}