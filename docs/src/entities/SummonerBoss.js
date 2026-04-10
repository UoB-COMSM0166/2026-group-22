// src/entities/SummonerBoss.js
class SummonerBoss extends Boss {
  constructor(x, y) {
    super(x, y, 120, 120, 300, 0); 
 
    this.minions = [];
    this.minionBullets = [];

    this.spawnCooldown = 90; 
    this.spawnTimer = this.spawnCooldown;
    
    // 【新增】：Boss 飞行的中心锚点和相位参数
    this.movePhase = 0;
    this.startX = x; // 这个会被设为 width / 2
    this.startY = y; // 这个会被设为 height / 2
  }

   update() {
    this.movePattern();
 
    this.spawnTimer--;
    if (this.spawnTimer <= 0 && this.hp > 0) {
      this.spawnTimer = this.spawnCooldown;
      this.spawnMinion();
    }

     for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i];
      m.update(); 
      const bullet = m.tryShoot();
      if (bullet) this.minionBullets.push(bullet);

      if (!m.active) this.minions.splice(i, 1);
    }

    InteractionManager.updateProjectiles(this.minionBullets);

    // 5. Inherited "Hurt" logic from Boss.js
    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    return null; 
  }

  // 【核心修改】：华丽的屏幕中央 ∞ 字型浮空巡航！
  movePattern() {
    this.movePhase += 0.025; // 飞行速度
    
    // 在屏幕中央大范围游荡 (左右横跳 350 像素，上下浮动 150 像素)
    // 利用 sin(x) 和 sin(2x) 生成李萨如曲线 (Lissajous curve)，形似“∞”
    this.x = this.startX + Math.sin(this.movePhase) * 350;
    this.y = this.startY + Math.sin(this.movePhase * 2) * 150;
  }

  spawnMinion() {
    // 召唤小怪环绕在自己身边出现
    const offsetX = random(-100, 100);
    const offsetY = random(-100, 100);
    this.minions.push(new Minion(this.x + offsetX, this.y + offsetY));
  }

  show() {
    for (const m of this.minions) m.show();
    for (const b of this.minionBullets) b.show();

    if (this.hp <= 0) {
      this.drawExplosion(); 
      return; 
    }
 
    push();
    translate(this.x, this.y);
 
    if (this.isHurt) {
      fill(255, 200, 200); 
    } else {
      fill(148, 0, 211); 
    }

    stroke(255);
    strokeWeight(3);
    ellipse(0, 0, this.w, this.h);
 
    fill(255);
    ellipse(-20, -10, 16, 16);
    ellipse(20, -10, 16, 16);
    fill(40);
    ellipse(-20, -10, 7, 7);
    ellipse(20, -10, 7, 7);
    fill(80);
    rectMode(CENTER);
    rect(0, 15, 40, 8, 4);
    
    fill(255, 215, 0);
    triangle(-20, -60, 0, -80, 20, -60);
    pop();
  }
}