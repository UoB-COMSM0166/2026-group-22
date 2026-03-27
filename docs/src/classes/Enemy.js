class Enemy extends Entity {
  constructor(x, y, w, h, hp, speed) {
    // We pass 0 for speed initially because we'll handle velocity in update
    super(x, y, w, h, hp, speed);
    
    this.direction = 1; // 1 for Right, -1 for Left
    this.velX = this.speed;
    this.active = true;
  }

  takeDamage(amount) {
    if (!this.active) return; // 如果已经死了，就不再受伤害

    this.hp -= amount;
    console.log("小怪剩余血量:", this.hp);

    // 受伤反馈（可选）：比如被子弹打中后稍微后退一点
    // this.x += (this.direction * -5); 

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.active = false;
    console.log("小怪被打死了！");
  }

  update(platforms) {
    // 1. Basic Movement
    this.velX = this.speed * this.direction;
    
    // 2. Gravity and Movement
    this.applyPhysics();

    // 3. Platform Awareness (Patrol Logic)
    this.checkPlatformEdges(platforms);
  }

  checkPlatformEdges(platforms) {
    let onPlatform = false;
    let myBounds = this.getBounds();

    for (let platform of platforms) {
      if (this.intersects(platform)) {
        onPlatform = true;
        let pBounds = platform.getBounds();

        // If we are getting close to the left or right edge, turn around!
        // We check if the enemy's center is past the platform's edges
        if (this.x > pBounds.right - 10) {
          this.direction = -1;
        } else if (this.x < pBounds.left + 10) {
          this.direction = 1;
        }
      }
    }

    // Optional: If for some reason they walk off a platform, 
    // you could make them turn around or just let them fall.
  }

  die() {
    this.active = false;
  }

  show() {
    if (!this.active) return;

    push();
    translate(this.x, this.y);
    
    // Simple Enemy Visual (Red box with "angry" eyes)
    rectMode(CENTER);
    fill(231, 76, 60); // Flat Red
    stroke(0);
    strokeWeight(2);
    rect(0, 0, this.w, this.h);

    // Eyes (Flipping based on direction)
    fill(255);
    let eyeOffset = 5 * this.direction;
    ellipse(eyeOffset + 5, -5, 8, 8); // Right eye
    ellipse(eyeOffset - 5, -5, 8, 8); // Left eye
    
    pop();
  }
}