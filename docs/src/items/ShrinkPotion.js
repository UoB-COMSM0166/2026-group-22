class ShrinkPotion extends Collectable {
  constructor(x, y) {
    super(x, y, 35, 55);

    this.img = assets.getImg("shrink_potion");

    this.boostTimer = 300;
    this.respawnTimer = 120;
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.abilities.setSkill(CONFIG.SKILLS.SHRINK, this.boostTimer);
    this.active = false;
  }

  show() {
    if (!this.active) return;

    push();
    translate(this.x, this.y + this.hoverOffset);

    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}