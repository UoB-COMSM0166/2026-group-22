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

    this.respawnTimer = 180;
    this.currentRespawnTimer = 0;
  }

  update(player) {
    if (this.active) {
      this.hoverOffset = sin(frameCount * this.floatSpeed) * this.floatAmplitude;

      this.handleInhale(player);
      this.handleTouchCollect(player)
    } else {
      this.currentRespawnTimer++;

      if (this.currentRespawnTimer >= this.respawnTimer) {
        this.respawn();
      }
    }
  }

  handleInhale(player) {
    if (!this.isInhaleable || !player.isInhaling()) return;

    let d = dist(this.x, this.y, player.x, player.y);
    if (d < player.abilities.inhaleRange) {

      this.x = lerp(this.x, player.x, 0.15);
      this.y = lerp(this.y, player.y, 0.15);

      if (d < 25) {
        this.onCollect(player);
        this.currentRespawnTimer = 0;
      }
    }
  }

  handleTouchCollect(player) {
    if (this.isTouchCollectable && this.intersects(player)) {
      this.onCollect(player);
      this.currentRespawnTimer = 0;
    }
  }

  respawn() {
    this.x = this.startX;
    this.y = this.startY;

    this.active = true;
    this.currentRespawnTimer = 0;
  }

  onCollect(player) {
    throw new Error("Subclasses must implement onCollect()");
  }

  drawDebug() {
    if (false) {
      push();
      noFill();
      stroke(255, 0, 0);
      strokeWeight(2);
      rectMode(CENTER);

      rect(this.x, this.y + this.hoverOffset, this.w, this.h);

      line(this.x - 5, this.y + this.hoverOffset, this.x + 5, this.y + this.hoverOffset);
      line(this.x, this.y + this.hoverOffset - 5, this.x, this.y + this.hoverOffset + 5);
      pop();
    }
  }
}