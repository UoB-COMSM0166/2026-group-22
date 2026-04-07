class Enemy extends Entity {
  constructor(x, y, w, h, hp, speed, sprites) {
    super(x, y, w, h, hp, speed);

    this.sprites = sprites;

    this.direction = 1; // 1 for Right, -1 for Left
    this.velX = this.speed;
    this.invincibilityTimer = 0;

    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 10;
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

    let currentSprite;

    // 1. Determine which sprite to use
    if (this.invincibilityTimer > 0) {
      // Show Hurt Sprite
      currentSprite = this.sprites.hurt;
    } else if (Math.abs(this.velX) > 0.1) {
      // Show Walking Animation (Cycle between index 0 and 1)
      this.animationTimer++;
      if (this.animationTimer >= this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 2;
        this.animationTimer = 0;
      }
      currentSprite = this.sprites.walk[this.animationFrame];
    } else {
      // Show Idle Sprite
      currentSprite = this.sprites.idle;
    }

    // 2. Draw the sprite
    if (currentSprite) {
      push();
      translate(this.x, this.y);

      // Flip the sprite based on direction
      // We use scale(-1, 1) if moving left. 
      // Note: If your original image faces Right, use this.direction.
      // If your original image faces Left, use -this.direction.
      scale(this.direction, 1);

      imageMode(CENTER);
      image(currentSprite, 0, 0, this.w, this.h);
      pop();
    }
  }
}