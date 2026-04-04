class BubbleItem extends Collectable {
  constructor(x, y) {
    super(x, y, 24, 24);
  }

  update(player) {
    if (!this.active) return;

    if (this.intersects(player)) {
      player.activateBubble();
      this.active = false;
    }
  }

  show() {
    if (!this.active) return;

    push();
    fill(180, 220, 255, 220);
    stroke(255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.w, this.h);

    fill(255);
    noStroke();
    ellipse(this.x - 4, this.y - 4, 5, 5);
    pop();
  }
}
