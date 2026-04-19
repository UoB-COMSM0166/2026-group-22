class VanishablePlatform extends Platform {
  constructor(x, y, w, h, img) {
    super(x, y, w, h, img);
    this.alpha = 255;

    this.isTouched = false;
    this.timer = 20;
    this.respawnTimer = 60;
    this.active = true;
  }

  update() {
    if (this.isTouched && this.active) {
      this.timer--;

      this.alpha = map(this.timer, 0, 20, 0, 255);

      if (this.timer <= 0) {
        this.active = false;
        this.isTouched = false;
      }
    }

    if (!this.active) {
      this.respawnTimer--;
      if (this.respawnTimer <= 0) this.reset();
    }
  }

  reset() {
    this.active = true;
    this.timer = 20;
    this.respawnTimer = 60;
    this.alpha = 255;
  }

  show() {
    if (!this.active) return;

    push();

    let offsetX = 0;
    if (this.isTouched) {
      const shakeIntensity = map(this.timer, 20, 0, 1, 5);
      offsetX = sin(frameCount * 0.8) * shakeIntensity;
    }

    translate(offsetX, 0);

    tint(255, this.alpha);

    super.show();
    pop();
  }
}