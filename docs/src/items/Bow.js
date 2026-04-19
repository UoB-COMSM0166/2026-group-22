class Bow extends Collectable {
  constructor(x, y) {
    super(x, y, 30, 50);

    this.img = assets.getImg('bow');

    this.duration = 999999;
    this.respawnTimer = 300;
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.abilities.setSkill(CONFIG.SKILLS.BOW, this.duration);
    this.active = false;
  }

  show() {
    if (!this.active) return;

    push();
    translate(this.x, this.y + this.hoverOffset);

    imageMode(CENTER);
    image(this.img, 0, 0, 50, this.h);
    pop();
  }
}