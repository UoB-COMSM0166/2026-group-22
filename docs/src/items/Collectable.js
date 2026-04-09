class Collectable extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);

    this.startX = x;
    this.startY = y;

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

      this.handleInhale(player);
      // 2. Collision check
      this.handleTouchCollect(player)
    } else {
      // 3. Counting down to respawn
      this.currentRespawnTimer++;

      if (this.currentRespawnTimer >= this.respawnTimer) {
        this.respawn();
      }
    }
  }

  handleInhale(player) {
    // Use the player helper we created earlier for consistency
    if (!this.isInhaleable || !player.isInhaling()) return;

    let d = dist(this.x, this.y, player.x, player.y);
    if (d < player.abilities.inhaleRange) {
      // Smoothly pull toward Kirby
      this.x = lerp(this.x, player.x, 0.15);
      this.y = lerp(this.y, player.y, 0.15);

      // Collect if close enough to mouth
      if (d < 25) {
        this.onCollect(player);
        this.currentRespawnTimer = 0;
      }
    }
  }

  handleTouchCollect(player) {
    if (this.isTouchCollectable && this.intersects(player)) {
      this.onCollect(player);
      this.currentRespawnTimer = 0; // Reset the clock the moment it's grabbed
    }
  }

  respawn() {
    this.x = this.startX;
    this.y = this.startY;

    this.active = true;
    this.currentRespawnTimer = 0;
  }

  // ABSTRACT METHOD: Subclasses define what happens when picked up
  onCollect(player) {
    throw new Error("Subclasses must implement onCollect()");
  }
}