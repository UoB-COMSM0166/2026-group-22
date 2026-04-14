// src/core/AnimationManager.js
class AnimationManager {
  constructor(entity, sprites, animationSpeed = 10) {
    this.entity = entity;
    this.sprites = sprites; // { idle: [], walk: [], ... }
    this.animationSpeed = animationSpeed;

    this.frame = 0;
    this.timer = 0;
    this.currentState = 'idle';
    this.lastState = 'idle';
  }

  update(newState) {
    this.currentState = newState;

    // Reset frame if we switched states (e.g., from 'walk' to 'attack')
    if (this.currentState !== this.lastState) {
      this.frame = 0;
      this.timer = 0;
      this.lastState = this.currentState;
    }

    const currentFrames = this.sprites[this.currentState];

    // Only tick the animation if we have an array of frames
    if (Array.isArray(currentFrames) && currentFrames.length > 1) {
      this.timer++;
      if (this.timer >= this.animationSpeed) {
        this.frame = (this.frame + 1) % currentFrames.length;
        this.timer = 0;
      }
    }
  }

  draw(x, y, flipX = false, visualW = null, visualH = null, alignment = 'center') {
    const currentFrames = this.sprites[this.currentState];
    if (!currentFrames) return;

    // Handle both single images and arrays of frames
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

    if (false) {
      push();
      noFill();
      stroke(255, 0, 0); // Bright Red
      strokeWeight(2);
      rectMode(CENTER);
      // Draw using the physical hitbox (this.entity.w/h) not the visual sprite size
      rect(x, y, this.entity.w, this.entity.h);

      // Optional: Draw a small crosshair at the pivot point
      line(x - 5, y, x + 5, y);
      line(x, y - 5, x, y + 5);
      pop();
    }
  }
}