// src/classes/ChainPlatform.js
class ChainPlatform extends Platform {
  constructor(x, y, w, h, img, targetY) {
    super(x, y, w, h, img); // Reuses your tiling logic!
    
    this.targetY = targetY; 
    this.state = 'IDLE'; // IDLE, DROPPING, SETTLED
    
    this.velY = 0;
    this.dropSpeed = 10; 
    this.chainHeight = 400; // How high the "hitbox" for the chain goes
  }

  resolve(entity, world) {
    if (this.state === 'DROPPING') return false;

    if (this.state === 'IDLE') {
      const actualTop = this.y - this.h / 2;
      if (entity.y + entity.h / 2 < actualTop) return false;
    }

    return super.resolve(entity, world);
  }

  // --- COORDINATE SYSTEM ---
  // We extend the top of the hitbox so bullets can hit the "invisible" chain
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
    super.update(); // Keep any base logic
    
    this.velY = 0; // Reset velocity each frame

    if (this.state === 'DROPPING') {
      // Move toward the target ground level
      if (this.y < this.targetY) {
        this.y += this.dropSpeed;
        this.velY = this.dropSpeed; // Important for Kirby's physics!
      } else {
        this.y = this.targetY;
        this.state = 'SETTLED';
        this.velY = 0;
      }
    }
  }

  show() {
    // 1. Draw the Chains and Target UI
    this.drawChains();

    // 2. Use the parent Platform's tiling logic for the body
    // This ensures it uses your 20x20 photo squares perfectly
    super.show(); 
  }

  drawChains() {
    push();
    stroke(100);
    strokeWeight(4);
    
    let startX = this.x - this.w / 2 + 15;
    let endX = this.x + this.w / 2 - 15;

    if (this.state === 'IDLE') {
      // Draw chains going up into the "ceiling"
      line(startX, this.y, startX, this.y - this.chainHeight);
      line(endX, this.y, endX, this.y - this.chainHeight);

      // Draw the "Target" Lock
      fill(255, 50, 50);
      noStroke();
      ellipse(this.x, this.y - this.h / 2 - 15, 25, 25);
      fill(255);
      ellipse(this.x, this.y - this.h / 2 - 15, 10, 10);
    } else {
      // Draw broken chain bits for visual juice
      line(startX, this.y, startX, this.y - 20);
      line(endX, this.y, endX, this.y - 15);
    }
    pop();
  }
}