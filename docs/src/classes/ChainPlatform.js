// src/classes/ChainPlatform.js
class ChainPlatform extends Platform {
  constructor(x, y, w, h, targetY) {
    super(x, y, w, h);
    this.targetY = targetY; 
    this.state = 'IDLE';    // IDLE(悬挂待击), DROPPING(下坠), SETTLED(落地)
    
    this.velX = 0; 
    this.velY = 0;
  }

  // 【神级优化】：当锁链完好时，把碰撞框向上无限拉长！
  // 这样玩家射出的子弹只要经过平台上方，打中“锁链”部分，就能触发断裂！
  getBounds() {
    let bounds = super.getBounds();
    if (this.state === 'IDLE') {
      bounds.top = -1000; 
    }
    return bounds;
  }

  // 被子弹击中时调用
  triggerBreak() {
    if (this.state === 'IDLE') {
      this.state = 'DROPPING';
    }
  }

  update() {
    let oldY = this.y;
    this.velY = 0;

    if (this.state === 'DROPPING') {
      let fallSpeed = 15; // 下落速度极快
      this.y += fallSpeed;

      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.state = 'SETTLED';
      }
      this.velY = this.y - oldY; 
    }
  }

  show() {
    push();
    rectMode(CENTER);

    // 绘制锁链
    strokeWeight(4);
    stroke(120);
    if (this.state === 'IDLE') {
      // 完好的锁链向上延伸
      line(this.x - this.w / 2 + 15, this.y, this.x - this.w / 2 + 15, -1000);
      line(this.x + this.w / 2 - 15, this.y, this.x + this.w / 2 - 15, -1000);
      
      // 【视觉提示】：红色的靶心锁头
      noStroke();
      fill(255, 50, 50);
      ellipse(this.x, this.y - this.h / 2 - 10, 24, 24);
      fill(255);
      ellipse(this.x, this.y - this.h / 2 - 10, 10, 10);
    } else {
      // 断裂的锁链残片
      line(this.x - this.w / 2 + 15, this.y, this.x - this.w / 2 + 15, this.y - 40);
      line(this.x + this.w / 2 - 15, this.y, this.x + this.w / 2 - 15, this.y - 30);
    }

    // 绘制平台主体
    stroke(0);
    strokeWeight(2);
    fill(this.state === 'SETTLED' ? 100 : 180, 100, 40); 
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}