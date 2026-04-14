// src/entities/CrusherBoss.js
class CrusherBoss extends Boss {
  constructor(x, y, sprites) {
    super(x, y, sprites);
    this.w = 180;
    this.h = 180;
    this.hp = 300; // Total HP
    this.maxHp = 300;
    
    // Movement logic
    this.moveSpeed = 2;
    this.direction = -1;
    this.leftBound = x - 700;
    this.rightBound = x;

    // Resistance: It takes only 10% damage from standard bullets
    this.armorMultiplier = 0.1; 
  }

  update() {
    if (!this.active || this.hp <= 0) return;

    // 1. Horizontal Patrolling
    this.x += this.direction * this.moveSpeed;
    if (this.x < this.leftBound || this.x > this.rightBound) {
      this.direction *= -1;
    }

    this.applyPhysics();

    // 2. Specialized Damage Check: Falling Platforms
    const world = sceneManager.currentScene.world;
    if (world) {
      this.checkCrushed(world.platforms);
    }

    // 3. Inherit basic hurt timer/flash logic
    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    return null;
  }

  /**
   * Checks if any ChainPlatform is currently falling on the boss
   */
  checkCrushed(platforms) {
    for (let p of platforms) {
      if (p instanceof ChainPlatform && p.state === 'DROPPING' && !this.isHurt) {
        // If the falling platform hits the boss
        if (this.intersects(p)) {
          this.applyCrushDamage(80); // Massive damage from environment
        }
      }
    }
  }

  applyCrushDamage(amount) {
    this.hp -= amount;
    this.isHurt = true;
    this.hurtTimer = 30; // Longer stun/flash for environmental hits
    if (window.shakeAmount !== undefined) window.shakeAmount = 25; // Bigger screen shake
  }

  // Override to show resistance to standard bullets
  takeDamage(amount) {
    const reducedAmount = amount * this.armorMultiplier;
    super.takeDamage(reducedAmount); // Calls Entity.takeDamage
  }

  show() {
    if (this.hp <= 0) {
      this.drawExplosion(); // From Boss.js
      return;
    }

    push();
    translate(this.x, this.y);
    
    // Draw Armor Plating (Visual hint of invulnerability)
    fill(this.isHurt ? [255, 0, 0] : [100, 100, 120]);
    stroke(50);
    strokeWeight(4);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 10);

    // Draw "Vulnerable" Top Head
    fill(200, 50, 50);
    ellipse(0, -this.h/2, 60, 40);

    pop();
  }
}