class Checkpoint extends GameObject {
  constructor(x, y, frames) {
    super(x, y - 40, 40, 40);

    this.isReached = false;

    this.frames = frames;

    this.totalFrames = 4;
    this.currentFrame = 0;
    this.lastUpdate = 0;
    this.interval = 150;
  }

  update(player) {
    if (!this.isReached && this.intersects(player)) {
      this.isReached = true;
      return true;
    }

    if (millis() - this.lastUpdate >= this.interval) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.lastUpdate = millis();
    }

    return false;
  }

  show() {

    const img = this.frames[this.currentFrame];

    push();

    if (this.isReached) {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = "yellow";

      drawingContext.shadowBlur = 20 + sin(frameCount * 0.1) * 10;
    }

    if (img) {
      imageMode(CENTER);
      image(img, this.x, this.y, this.w, this.h);
    } else {
      // Fallback if images fail to load
      fill(this.isReached ? [255, 255, 0] : [200, 0, 0]);
      rectMode(CENTER);
      rect(this.x, this.y, this.w, this.h);
    }

    pop();
  }
}