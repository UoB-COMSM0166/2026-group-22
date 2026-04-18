class AnimationManager {
  constructor(entity, sprites, animationSpeed = 10) {
    this.entity = entity;
    this.sprites = sprites;
    this.animationSpeed = animationSpeed;

    this.frame = 0;
    this.timer = 0;
    this.currentState = 'idle';
    this.lastState = 'idle';
  }

  update(newState, loop = true) {
    this.currentState = newState;

    if (this.currentState !== this.lastState) {
      this.frame = 0;
      this.timer = 0;
      this.lastState = this.currentState;
    }

    const currentFrames = this.sprites[this.currentState];

    if (Array.isArray(currentFrames) && currentFrames.length > 1) {
      this.timer++;
      if (this.timer >= this.animationSpeed) {
        if (!loop && this.frame === currentFrames.length - 1) {
          return;
        }
        this.frame = (this.frame + 1) % currentFrames.length;
        this.timer = 0;
      }
    }
  }

  draw(x, y, flipX = false, visualW = null, visualH = null, alignment = 'center') {
    const currentFrames = this.sprites[this.currentState];
    if (!currentFrames) return;

    const img = Array.isArray(currentFrames) ? currentFrames[this.frame] : currentFrames;

    if (img) {
      push();
      translate(x, y);
      if (flipX) scale(-1, 1);
      imageMode(CENTER);

      const drawW = visualW || this.entity.w;
      const drawH = visualH || this.entity.h;

      let offsetY = 0;
      if (alignment === 'bottom') {
        offsetY = (this.entity.h / 2) - (drawH / 2);
      }


      image(img, 0, offsetY, drawW, drawH);
      pop();
    }

    if (true) {
      push();
      noFill();
      stroke(255, 0, 0);
      strokeWeight(2);
      rectMode(CENTER);

      rect(x, y, this.entity.w, this.entity.h);

      line(x - 5, y, x + 5, y);
      line(x, y - 5, x, y + 5);
      pop();
    }
  }
}