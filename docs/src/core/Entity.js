class Entity extends GameObject {
  constructor(x, y, w, h, hp, speed) {
    super(x, y, w, h);

    this.hp = hp;
    this.speed = speed;

    // Physical state
    this.velX = 0;
    this.velY = 0;
    this.gravity = CONFIG.WORLD.GRAVITY;

    // Abstract enforcement (prevents 'new Entity()')
    if (new.target === Entity) {
      throw new TypeError("Cannot construct Entity instances directly.");
    }
  }

  // Common physics logic for all moving things
  applyPhysics() {
    this.velY += this.gravity;

    this.x += this.velX;
    this.y += this.velY;
  }

  // Simple collision check against a generic object
  // (We use your GameObject's intersects method here)
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

  // Note: We don't implement show() or update() here.
  // We leave those for Player.js or Enemy.js to define!
}