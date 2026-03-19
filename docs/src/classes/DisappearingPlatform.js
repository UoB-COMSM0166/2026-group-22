class DisappearingPlatform extends Platform {
  constructor(x, y, w, h) {
    super(x, y, w, h);

    this.color = [180, 140, 90];
    this.triggered = false;
    this.vanishTimer = 0;
    this.respawnTimer = 0;

    this.vanishDelay = 15;
    this.respawnDelay = 120;
  }

  triggerVanish() {
    if (!this.active) return;
    if (this.triggered) return;

    this.triggered = true;
    this.vanishTimer = this.vanishDelay;
  }

  update() {
    if (this.triggered && this.active) {
      this.vanishTimer--;

      if (this.vanishTimer <= 0) {
        this.active = false;
        this.respawnTimer = this.respawnDelay;
      }
    }

    if (!this.active) {
      this.respawnTimer--;

      if (this.respawnTimer <= 0) {
        this.active = true;
        this.triggered = false;
        this.vanishTimer = 0;
      }
    }
  }

  show() {
    if (!this.active) return;

    rectMode(CENTER);
    stroke(0);
    strokeWeight(2);

    if (this.triggered && frameCount % 10 < 5) {
      fill(220, 140, 140);
    } else {
      fill(this.color);
    }

    rect(this.x, this.y, this.w, this.h);
    noStroke();
  }
}