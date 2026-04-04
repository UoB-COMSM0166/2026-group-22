class Enemy extends Entity {
  constructor(x, y, w, h, hp, speed) {
    super(x, y, w, h, hp, speed);

    this.direction = 1; // 1 for Right, -1 for Left
    this.velX = this.speed;

    this.invincibilityTimer = 0;
  }

  update(platforms) {
    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer--;
    }

    // 1. Basic Movement
    this.velX = this.speed * this.direction;

    // 2. Gravity and Movement
    this.applyPhysics();

    // 3. Platform Awareness (Patrol Logic)
    this.checkPlatformEdges(platforms);

    if (this.hp <= 0) {
      this.die();
    }
  }

  takeDamage(amount) {
    // If already in i-frames, ignore the hit
    if (this.invincibilityTimer > 0) return;

    this.hp -= amount;
    this.invincibilityTimer = 20;
  }

  checkPlatformEdges(platforms) {
    let pBounds

    for (let platform of platforms) {
      if (this.intersects(platform)) {
        pBounds = platform.getBounds();
        // If we are getting close to the left or right edge, turn around!
        // We check if the enemy's center is past the platform's edges
        if (this.x > pBounds.right - 10) {
          this.direction = -1;
        } else if (this.x < pBounds.left + 10) {
          this.direction = 1;
        }
      }
    }
  }

  die() {
    this.active = false;
  }

  show() {
    if (!this.active) return;

    if (this.invincibilityTimer > 0 && frameCount % 10 < 5) {
      return; // Don't draw the enemy for these frames
    }

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