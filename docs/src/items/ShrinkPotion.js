// src/classes/ShrinkPotion.js
class ShrinkPotion extends Collectable {
  constructor(x, y) {
    super(x, y, 35, 35);

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

    // 绘制一个代表缩小的道具（比如蓝色的药水瓶或圆形）
    fill(100, 200, 255);
    stroke(0, 100, 200);
    strokeWeight(2);
    circle(0, 0, 20);

    pop();
  }
}