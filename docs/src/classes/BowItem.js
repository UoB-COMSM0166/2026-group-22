// src/classes/BowItem.js
class BowItem extends Collectable {
  constructor(x, y) {
    super(x, y, 40, 40);
  }

  onCollect(player) {
    player.hasSkill = true;
    player.currentSkill = CONFIG.SKILLS.BOW;
    console.log("获得弓箭！按 J 键蓄力/发射抛物线箭矢");
  }

  show() {
    if (!this.active) return;
    push();
    translate(this.x, this.y + this.hoverOffset);
    stroke(139, 69, 19); // 棕色弓身
    strokeWeight(3);
    noFill();
    arc(0, 0, 30, 40, HALF_PI, -HALF_PI); // 画一个简单的弓形
    stroke(200);
    line(-5, -20, -5, 20); // 弦
    pop();
  }
}