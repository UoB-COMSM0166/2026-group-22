// src/entities/Projectile.js
class Projectile extends GameObject {
  constructor(x, y, w, h, vx, vy) {
    super(x, y, w, h);
    this.vx = vx; // Velocity X
    this.vy = vy; // Velocity Y
  }

  // 建议的修改逻辑
update(cameraX) {
  this.x += this.vx;
  this.y += this.vy;

  // 只有当子弹离开“当前屏幕显示区域”太远时才销毁
  if (this.x < cameraX - 200 || this.x > cameraX + width + 200) {
    this.active = false;
  }
}
}