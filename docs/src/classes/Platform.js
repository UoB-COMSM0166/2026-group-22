// src/classes/Platform.js
class Platform extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.color = [100, 100, 100];
  }

  update() {
    // Static platforms don't need much logic, 
    // but you could add moving platform logic here later!
  }

  show() {
    rectMode(CENTER);
    stroke(0);        // Black outline for "Solid" look
    strokeWeight(2);
    fill(this.color); // Grey stone color
    rect(this.x, this.y, this.w, this.h);
    noStroke();
  }
}