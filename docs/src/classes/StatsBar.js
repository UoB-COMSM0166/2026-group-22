// src/classes/StatsBar.js
class StatsBar {
  constructor() {
    this.margin = 20;
    this.y = 75; 
    this.heartSpacing = 30;
  }

  // We pass in the data the StatsBar needs to "know" about
  draw(player, coins, showCoins = true) {
    this.drawHearts(player.hp);
    if (showCoins) this.drawCoins(coins);
  }

  drawHearts(hp) {
    const maxHearts = 5;
    const hpPerHeart = 100 / maxHearts;

    for (let i = 0; i < maxHearts; i++) {
      let x = this.margin + i * this.heartSpacing;
      let heartFill = constrain(hp - (i * hpPerHeart), 0, hpPerHeart);
      this.renderHeart(x, this.y, heartFill / hpPerHeart);
    }
  }

  renderHeart(x, y, percent) {
    push();
    translate(x, y);
    // Draw empty heart background
    fill(50, 150); 
    this.heartShape(15);
    // Draw red heart fill
    if (percent > 0) {
      fill(255, 50, 80);
      this.heartShape(15 * percent);
    }
    pop();
  }

  heartShape(size) {
    beginShape();
    // Start at the bottom point
    vertex(0, size);
    // Left curve
    bezierVertex(-size * 1.5, -size * 0.5, -size * 0.5, -size * 1.5, 0, -size * 0.5);
    // Right curve
    bezierVertex(size * 0.5, -size * 1.5, size * 1.5, -size * 0.5, 0, size);
    endShape(CLOSE);
  }

  drawCoins(amount) {
    push();
    fill(255, 215, 0);
    textSize(22);
    textAlign(LEFT, TOP);
    text(`$ ${amount}`, this.margin, this.y + 20);
    pop();
  }
}