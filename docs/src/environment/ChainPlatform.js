class ChainPlatform extends Platform {
  constructor(x, y, w, h, img, targetY) {
    super(x, y, w, h, img);
    
    this.targetY = targetY; 
    this.state = 'IDLE';
    
    this.velY = 0;
    this.dropSpeed = 10; 
    this.chainHeight = 400;
  }

  resolve(entity, world) {
    if (this.state === 'DROPPING') return false;

    if (this.state === 'IDLE') {
      const actualTop = this.y - this.h / 2;
      if (entity.y + entity.h / 2 < actualTop) return false;
    }

    return super.resolve(entity, world);
  }

  getBounds() {
    let bounds = super.getBounds();
    if (this.state === 'IDLE') {
      bounds.top -= this.chainHeight; 
    }
    return bounds;
  }

  triggerBreak() {
    if (this.state === 'IDLE') {
      this.state = 'DROPPING';
      console.log("Chain broken! Platform dropping...");
    }
  }

  update() {
    super.update();
    
    this.velY = 0;

    if (this.state === 'DROPPING') {
      if (this.y < this.targetY) {
        this.y += this.dropSpeed;
        this.velY = this.dropSpeed;
      } else {
        this.y = this.targetY;
        this.state = 'SETTLED';
        this.velY = 0;
      }
    }
  }

  show() {
    this.drawChains();
    super.show(); 
  }

  drawChains() {
    push();
    stroke(100);
    strokeWeight(4);
    
    let startX = this.x - this.w / 2 + 15;
    let endX = this.x + this.w / 2 - 15;

    if (this.state === 'IDLE') {
      line(startX, this.y, startX, this.y - this.chainHeight);
      line(endX, this.y, endX, this.y - this.chainHeight);

      fill(255, 50, 50);
      noStroke();
      ellipse(this.x, this.y - this.h / 2 - 15, 25, 25);
      fill(255);
      ellipse(this.x, this.y - this.h / 2 - 15, 10, 10);
    } else {
      line(startX, this.y, startX, this.y - 20);
      line(endX, this.y, endX, this.y - 15);
    }
    pop();
  }
}