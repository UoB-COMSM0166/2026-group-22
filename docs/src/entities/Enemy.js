class Enemy extends Entity {
  constructor(x, y, sprites, config) {
    super(x, y, config.width, config.height, config.maxHp, config.speed);

    this.maxHp = config.maxHp;
    this.damage = config.damage;

    this.anim = new AnimationManager(this, sprites);

    this.visualW = config.visualW;
    this.visualH = config.visualH;
    this.visualAlignment = config.visualAlignment;

    this.direction = 1;
    this.velX = this.speed;
    this.invincibilityTimer = 0;
  }

  update(platforms) {
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;

    this.velX = this.speed * this.direction;
    this.applyPhysics();
    this.checkPlatformEdges(platforms);

    if (this.hp <= 0) this.die();
  }

  takeDamage(amount) {
    if (this.invincibilityTimer > 0) return;

    this.hp -= amount;
    this.invincibilityTimer = 4;
  }

  checkPlatformEdges(platforms) {
    let pBounds

    for (let platform of platforms) {
      if (this.intersects(platform)) {
        pBounds = platform.getBounds();
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
    this.anim.draw(this.x, this.y, this.direction === -1, this.visualW, this.visualH, this.visualAlignment);
  }
}