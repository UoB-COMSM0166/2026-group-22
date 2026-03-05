class Coin extends GameObject {
  constructor(x, y) {
    // Coins are usually small (30x30)
    super(x, y, 30, 30);
    this.value = 10;
    this.hoverOffset = 0;
  }

  // Implementation of the abstract update() method
  update(player) {
    if (!this.active) return;

    // 1. Make the coin float up and down slightly
    this.hoverOffset = sin(frameCount * 0.1) * 5;

    // 2. Check for collection
    if (this.intersects(player)) {
      this.collect(player);
    }
  }

  collect(player) {
    this.active = false;
    console.log("💰 Coin collected! +10 points");
    // You can add player.score += this.value here later
  }

  // Implementation of the abstract show() method
  show() {
    if (!this.active) return;

    push();
    // Apply the floating hover effect to the drawing position
    translate(this.x, this.y + this.hoverOffset);
    
    // Draw a gold coin
    stroke(184, 134, 11); // Dark Goldenrod outline
    strokeWeight(2);
    fill(255, 215, 0);    // Gold
    ellipse(0, 0, this.w, this.h);
    
    // Draw a small shining detail in the middle
    noStroke();
    fill(255, 255, 255, 150);
    rectMode(CENTER);
    rect(-5, -5, 4, 10);
    pop();
  }
}