// src/classes/ShrinkPotion.js
class ShrinkPotion extends Collectable {
  constructor(x, y) {
    super(x, y, 35, 35);
    this.shrinkRatio = 0.5; // 体型缩小一半
    this.boostTimer = 300;  // 持续时间（帧数）
    this.respawnTimer = 120; // 2秒后重新出现
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.hasSkill = true;
    player.currentSkill = "SHRINK"; // 标记当前技能为缩小

    // 改变玩家的碰撞箱和图片宽高
    player.w *= this.shrinkRatio;
    player.h *= this.shrinkRatio;

    // 设定技能持续时间
    player.skillTimer = this.boostTimer;
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