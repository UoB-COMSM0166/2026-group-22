/**
 * Checkpoint Class
 * Inherits from GameObject to use basic spatial properties (x, y, w, h)
 * and the intersects() method for collision detection.
 */
class Checkpoint extends GameObject {
  constructor(x, y) {
    // Standard size for a flag/trigger zone
    // x, y, width, height
    super(x, y - 20, 40, 40); 
    
    // State management
    this.isReached = false;
  }

  /**
   * update(player)
   * Checks if the player has touched the checkpoint for the first time.
   * Returns true only at the moment of impact to signal the World class.
   */
  update(player) {
    if (!this.isReached && this.intersects(player)) {
      this.isReached = true;
      return true; // Signal to the World to update spawn points
    }
    return false;
  }

  /**
   * show()
   * Handles the visual representation of the checkpoint.
   * Changes color from Red to Green when reached.
   */
  show() {
    push();
    translate(this.x, this.y + this.h/2);
    rectMode(CENTER);
    noStroke();

    // 1. The Flagpole
    fill(80); // Dark grey
    rect(0, -this.h/2, 6, this.h); 
    
    // 2. The Flag (Triangle)
    // Red if locked, Green if reached
    if (this.isReached) {
      fill(50, 205, 50); // Lime Green
    } else {
      fill(200, 0, 0);   // Dark Red
    }
    
    // Draw the flag attached to the pole
    // triangle(x1, y1, x2, y2, x3, y3)
    triangle(3, -this.h, 3, -this.h + 20, 25, -this.h + 10);
    
    pop();
  }
}