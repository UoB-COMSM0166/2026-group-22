class JumpBooster extends Collectable {
  constructor(x, y) {
    super(x, y, 50, 35);

    this.img = assets.getImg('jump_booster');

    this.isInhaleable = true;
    this.isTouchCollectable = false;

    this.boostTimer = 300;
    this.respawnTimer = 120;
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.abilities.setSkill(CONFIG.SKILLS.JUMP, this.boostTimer);
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