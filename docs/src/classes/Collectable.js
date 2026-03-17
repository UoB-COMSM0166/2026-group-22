class Collectable extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.shouldRespawn = false;
    this.hoverOffset = 0;
    this.floatSpeed = 0.1;
    this.floatAmplitude = 5;

    this.respawnTimer = 180; // Default 3 seconds (change in subclasses if needed)
    this.currentRespawnTimer = 0;
  }

  // Common logic for all floating items
  update(player) {
    if (this.active) {
      // 1. Floating animation
      this.hoverOffset = sin(frameCount * this.floatSpeed) * this.floatAmplitude;

      // 2. Collision check
      if (this.intersects(player)) {
        this.onCollect(player);
        this.active = false; // "Despawn"
        this.currentRespawnTimer = 0; // Reset the clock the moment it's grabbed
      }
    } else {
      // 3. Counting down to respawn
      this.currentRespawnTimer++;

      if (this.currentRespawnTimer >= this.respawnTimer) {
        this.respawn();
      }
    }
  }

  respawn() {
    this.active = true;
    this.currentRespawnTimer = 0;
  }

  // ABSTRACT METHOD: Subclasses define what happens when picked up
  onCollect(player) {
    throw new Error("Subclasses must implement onCollect()");
  }
}