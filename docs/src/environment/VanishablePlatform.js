class VanishablePlatform extends Platform {
  constructor(x, y, w, h, img) {
    super(x, y, w, h, img);
    this.originalColor = [200, 100, 100];
    this.color = [...this.originalColor, 255];

    this.isTouched = false;
    this.timer = 15;
    this.respawnTimer = 60;
    this.active = true;
  }

  update() {
    if (this.isTouched && this.active) {
      this.timer--;

      this.color[3] = map(this.timer, 0, 60, 0, 255);

      if (this.timer <= 0) {
        this.active = false;
        this.isTouched = false;
        this.timer = 15;
      }
    }

    if (!this.active) {
      this.respawnTimer--;

      if (this.respawnTimer <= 0) this.reset();
    }
  }

  reset() {
    this.active = true;
    this.respawnTimer = 60;
    this.color[3] = 255;
  }

  show() {
    if (!this.active) return;

    push();
    rectMode(CENTER);
    stroke(0, this.color[3]);
    strokeWeight(2);
    fill(this.color[0], this.color[1], this.color[2], this.color[3]);
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}