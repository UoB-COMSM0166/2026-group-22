class CrusherBoss extends Boss {
  constructor(x, y, sprites, config) {
    super(x, y, sprites, config);
    this.hp = 300;
    this.maxHp = 300;

    this.moveSpeed = 2;
    this.direction = -1;
    this.leftBound = x - 700;
    this.rightBound = x;

    this.armorMultiplier = 0.1;
  }

  update() {
    if (!this.active || this.hp <= 0) return;

    this.x += this.direction * this.moveSpeed;
    if (this.x < this.leftBound || this.x > this.rightBound) {
      this.direction *= -1;
    }

    this.applyPhysics();

    const world = sceneManager.currentScene.world;
    if (world) {
      this.checkCrushed(world.platforms);
    }

    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    return null;
  }

  checkCrushed(platforms) {
    for (let p of platforms) {
      if (p instanceof ChainPlatform && p.state === 'DROPPING' && !this.isHurt) {
        if (this.intersects(p)) {
          this.applyCrushDamage(80);
        }
      }
    }
  }

  applyCrushDamage(amount) {
    this.hp -= amount;
    this.isHurt = true;
    this.hurtTimer = 30;
  }

  takeDamage(amount) {
    const reducedAmount = amount * this.armorMultiplier;
    super.takeDamage(reducedAmount);
  }

  show() {
    if (this.hp <= 0) {
      return;
    }

    push();
    translate(this.x, this.y);

    fill(this.isHurt ? [255, 0, 0] : [100, 100, 120]);
    stroke(50);
    strokeWeight(4);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 10);

    fill(200, 50, 50);
    ellipse(0, -this.h / 2, 60, 40);

    pop();
  }
}