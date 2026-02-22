class Entity extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    
    // Physical state
    this.velX = 0;
    this.velY = 0;
    this.gravity = 0.2;
    this.speed = 3;
    this.hp = 100;

    // Abstract enforcement (prevents 'new Entity()')
    if (new.target === Entity) {
      throw new TypeError("Cannot construct Entity instances directly.");
    }
  }

  // Common physics logic for all moving things
  applyGravity() {
    this.velY += this.gravity;
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

  // Note: We don't implement show() or update() here.
  // We leave those for Player.js or Enemy.js to define!
}