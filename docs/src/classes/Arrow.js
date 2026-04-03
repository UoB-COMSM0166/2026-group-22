// src/classes/Arrow.js
class Arrow extends Projectile {
  constructor(x, y, vx, vy) {
    super(x, y, 10, 10, vx, vy);
    this.gravity = 0.25; // 抛物线的关键：重力感
  }

  update() {
    this.vy += this.gravity; // 每一帧都受重力下掉
    super.update(); // 执行位移
    
    // 旋转箭头的朝向，使其始终指向飞行方向 (可选增强)
    this.angle = Math.atan2(this.vy, this.vx);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, 200, 0);
    // 画一个长条形的“箭”
    rectMode(CENTER);
    rect(0, 0, 20, 4);
    // 箭头
    triangle(10, -5, 10, 5, 18, 0);
    pop();
  }
}