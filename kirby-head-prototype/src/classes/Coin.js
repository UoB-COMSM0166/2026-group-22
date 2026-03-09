class Coin extends Collectable {
  constructor(x, y) {
    super(x, y, 30, 30); // Pass dimensions to Item
  }

  onCollect(player) {
    console.log("💰 +10 Points!");
    // player.score += 10; 
  }

  show() {
    if (!this.active) return;
    push();
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