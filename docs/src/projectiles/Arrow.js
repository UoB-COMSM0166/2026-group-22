// src/classes/Arrow.js
class Arrow extends Projectile {
  constructor(x, y, vx, vy) {
    // Pass everything to the Projectile parent
    super(x, y, 10, 10, vx, vy);
    
    this.gravity = 0.25; 
    this.damage = 20;    // Arrows usually do more damage than stars!
    this.angle = 0;
    
    // Track where it started to avoid the "canvas width" bug
    this.startX = x;
  }

  update() {
    // 1. Apply gravity to the vertical velocity
    this.vy += this.gravity; 
    
    // 2. Call Projectile.update() for the x/y movement
    super.update(); 
    
    // 3. Update the angle so the arrow "noses down" in a curve
    this.angle = Math.atan2(this.vy, this.vx);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle); // Rotate based on current flight path
    
    fill(255, 200, 0);
    noStroke();
    
    // Draw the arrow body
    rectMode(CENTER);
    rect(0, 0, 20, 4);
    
    // Draw the arrowhead (triangle)
    triangle(10, -5, 10, 5, 18, 0);
    pop();
  }
}