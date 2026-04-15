class Enemy extends Entity {
  constructor(x, y, sprites, config) {
    super(x, y, config.width, config.height, config.maxHp, config.speed);

    this.maxHp = config.maxHp;
    
    this.anim = new AnimationManager(this, sprites);

    this.visualW = config.visualW;
    this.visualH = config.visualH;
    this.visualAlignment = config.visualAlignment;

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
    this.invincibilityTimer = 10;
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

    let state = 'idle';
    if (this.invincibilityTimer > 0) state = 'hurt';
    else if (Math.abs(this.velX) > 0.1) state = 'walk';

    this.anim.update(state);
    // direction 1 is right, -1 is left. scale(-1, 1) flips it.
    this.anim.draw(this.x, this.y, this.direction === -1, this.visualW, this.visualH, this.visualAlignment);
  }
}