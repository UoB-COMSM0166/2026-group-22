class Entity extends GameObject {
  constructor(x, y, w, h, hp, speed) {
    super(x, y, w, h);

    this.hp = hp;
    this.speed = speed;

    this.velX = 0;
    this.velY = 0;
    this.gravity = CONFIG.WORLD.GRAVITY;

    if (new.target === Entity) {
      throw new TypeError("Cannot construct Entity instances directly.");
    }
  }

  applyPhysics() {
    this.velY += this.gravity;

    this.x += this.velX;
    this.y += this.velY;
  }

  checkCollision(other) {
    if (this.active && other.active) {
      return this.intersects(other);
    }
    return false;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
    }
  }
}