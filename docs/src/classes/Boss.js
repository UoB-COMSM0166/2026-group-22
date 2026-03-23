class Boss extends Entity {
  constructor(x, y) {
    // x, y, width, height, hp, speed
    super(x, y, 150, 200, 500, 0);
    this.maxHp = 500;
    this.isHurt = false;
    this.hurtTimer = 0;
    this.attackTimer = 0;
  }

  update() {
    // Floating motion
    this.y += Math.sin(frameCount * 0.05) * 2;

    // Damage state handling
    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    // Attack Logic
    this.attackTimer++;
    // Use a variable for attack speed so you can make him faster as HP drops!
    let attackRate = this.hp < 200 ? 30 : 60;

    if (this.attackTimer > attackRate && this.hp > 0) {
      this.attackTimer = 0;
      // TIP: Return a structured object that the Scene can easily manage
      return new Bullet(
        this.x - 50,                // Start slightly in front of boss
        this.y + random(-50, 50),    // Random height spread
        -8,                          // Velocity X (moving left)
        0,                           // Velocity Y
        25,                          // Size
        10,                          // Damage
        color(255, 100, 0)           // Orange color
      );
    }
    return null;
  }

  show() {
    if (this.hp <= 0) {
      this.drawExplosion(); // Add a "death" visual
      return;
    }

    if (this.hp <= 0) return;
    
    push();
    translate(this.x, this.y);

    // Feedback: Flash white or red when hit
    if (this.isHurt) {
      fill(255);
    } else {
      fill(150, 50, 250);
    }

    stroke(255);
    strokeWeight(4);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 20);

    // Eyes
    fill(255);
    let eyeH = map(this.hp, 0, this.maxHp, 5, 40);
    ellipse(-30, -40, 30, eyeH);
    ellipse(30, -40, 30, eyeH);
    pop();
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    this.isHurt = true;
    this.hurtTimer = 10;
    // Check if global shakeAmount exists before setting it
    if (window.shakeAmount !== undefined) window.shakeAmount = 10;
  }

  drawExplosion() {
    // Simple particle effect or expanding circle
    noStroke();
    fill(255, 200, 0, 150);
    ellipse(this.x, this.y, frameCount % 100 * 2);
  }
}