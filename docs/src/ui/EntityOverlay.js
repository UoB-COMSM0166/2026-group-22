// src/ui/EntityOverlay.js
class EntityOverlay {
  /**
   * Main entry point for drawing all UI attached to an entity.
   * Called within the World's camera translation block.
   */
  static draw(entity) {
    if (!entity || !entity.active) return;

    // 1. Elements ABOVE the head (Oxygen Bubbles)
    if (entity instanceof Player && entity.bubbleMode) {
      this.drawBubbles(entity);
    }

    // 2. Elements BELOW the feet (Bow Charge Bar)
    if (entity instanceof Player && entity.abilities && entity.abilities.isCharging) {
      this.drawChargeBar(entity);
    }
  }

  static drawBubbles(player) {
    const ab = player.abilities;
    if (ab.bubbleCount <= 0) return;

    push();
    for (let i = 0; i < ab.bubbleCount; i++) {
      fill(180, 220, 255, 200);
      stroke(255);
      strokeWeight(2);
      // Offset math to center bubbles above Kirby's head
      let xPos = player.x - (10 * (ab.bubbleCount - 1)) + (i * 20);
      let yPos = player.y - player.h / 2 - 25;
      ellipse(xPos, yPos, 12, 12);
    }
    pop();
  }

  /**
   * Draws a small charge progress bar below Kirby when aiming the bow
   */
  static drawChargeBar(player) {
    push();
    const ab = player.abilities;
    const barW = 40;
    // Map the current bow charge (max 25) to the bar width
    const chargeWidth = map(ab.bowCharge, 0, 25, 0, barW);

    // Position 10 pixels below Kirby's collision box
    let x = player.x - barW / 2;
    let y = player.y + player.h / 2 + 10;

    // Draw background
    fill(0, 150);
    noStroke();
    rect(x, y, barW, 6, 2);

    // Draw fill (Yellow/Orange)
    fill(255, 215, 0);
    rect(x, y, chargeWidth, 6, 2);
    pop();
  }
}