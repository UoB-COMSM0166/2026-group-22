// src/classes/VanishablePlatform.js
class VanishablePlatform extends Platform {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.originalColor = [200, 100, 100]; // Pink/Red warning color
    this.color = [...this.originalColor, 255]; // [R, G, B, Alpha]
    
    this.isTouched = false;
    this.timer = 15;          // 1 second to stay before vanishing
    this.respawnTimer = 60; 
    this.active = true;       // master switch for physics/drawing
  }

  update() {
    // STATE 1: Player is standing on it, countdown to vanish
    if (this.isTouched && this.active) {
      this.timer--;
      
      // Visual feedback: Fade out
      this.color[3] = map(this.timer, 0, 60, 0, 255); 

      if (this.timer <= 0) {
        this.active = false;
        this.isTouched = false;
        this.timer = 15; // Reset timer for next time
      }
    }

    // STATE 2: Platform is gone, counting down to respawn
    if (!this.active) {
      this.respawnTimer--;

      if (this.respawnTimer <= 0) {
        this.reset();
      }
    }
  }

  reset() {
    this.active = true;
    this.respawnTimer = 60; // Reset to 5 seconds
    this.color[3] = 255;     // Fully visible
  }

  show() {
    if (!this.active) return; // Completely invisible while inactive
    
    push();
    rectMode(CENTER);
    stroke(0, this.color[3]);
    strokeWeight(2);
    fill(this.color[0], this.color[1], this.color[2], this.color[3]);
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}