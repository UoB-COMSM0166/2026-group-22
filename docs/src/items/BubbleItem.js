class BubbleItem extends Collectable {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.respawnTimer = 120;
    this.shouldRespawn = true;
  }

  // Refills the player's air
  onCollect(player) {
    player.abilities.activateBubble(3);
    this.active = false;
  }

  /**
   * Draws the bubbles floating above Kirby's head
   */
  static drawUI(player) {
    const ab = player.abilities;
    if (!player.bubbleMode || ab.bubbleCount <= 0) return;

    push();
    for (let i = 0; i < ab.bubbleCount; i++) {
      fill(180, 220, 255, 200);
      stroke(255);
      strokeWeight(2);
      // Offset so bubbles are centered above Kirby
      let xPos = player.x - (10 * (ab.bubbleCount - 1)) + (i * 20);
      let yPos = player.y - player.h / 2 - 25;
      ellipse(xPos, yPos, 12, 12);
    }
    pop();
  }

  show() {
    if (!this.active) return;

    push();
    fill(180, 220, 255, 220);
    stroke(255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.w, this.h);

    fill(255);
    noStroke();
    ellipse(this.x - 4, this.y - 4, 5, 5);
    pop();
  }
}
