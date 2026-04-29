class Bubble extends Collectable {
  constructor(x, y) {
    super(x, y, 30, 30);

    this.img = assets.getImg('bubble');

    this.respawnTimer = 120;
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.abilities.activateBubble(3);
    this.active = false;
  }

  show() {
    if (!this.active) return;

    push();
    translate(this.x, this.y + this.hoverOffset);

    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
    this.drawDebug();
  }
}
