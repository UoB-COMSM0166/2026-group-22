class Collectable extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);

    this.isInhaleable = false;
    this.isTouchCollectable = true;

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

      const ab = player.abilities;
      if (this.isInhaleable && ab.isInhaling) {
        let d = dist(this.x, this.y, player.x, player.y);

        if (d < ab.inhaleRange) {
          // Physics: Attraction
          this.x = lerp(this.x, player.x, 0.15);
          this.y = lerp(this.y, player.y, 0.15);

          // Collection: Mouth threshold
          if (d < 25) {
            this.onCollect(player);
            this.currentRespawnTimer = 0;
          }
        }
      }

      // 2. Collision check
      if (this.isTouchCollectable && this.intersects(player)) {
        this.onCollect(player);
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