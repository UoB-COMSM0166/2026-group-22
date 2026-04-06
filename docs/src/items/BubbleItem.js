class BubbleItem extends Collectable {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.boostTimer = 300;
    this.respawnTimer = 120;
    this.shouldRespawn = true;
  }

  // Refills the player's air
  onCollect(player) {
    player.bubbleActivated = true;
    player.bubbleCount = 3;
    player.bubbleStepTimer = player.bubbleStepMax;
    player.bubbleDamageCooldown = 0;
  }

  // --- STATIC LOGIC (The "Brain" of the Bubble System) ---

  /**
   * Handles the countdown and drowning damage
   */
  static updateSurvival(player) {
    if (!player.bubbleMode) return;
    // before having the first bubble
    if (!player.bubbleActivated) return;

    if (player.bubbleCount > 0) {
      player.bubbleStepTimer--;

      if (player.bubbleStepTimer <= 0) {
        player.bubbleCount--;
        player.bubbleStepTimer = (player.bubbleCount > 0) ? player.bubbleStepMax : 0;
      }
    } else {
      // losing blood when having no bubble
      if (player.bubbleDamageCooldown > 0) {
        player.bubbleDamageCooldown--;
      } else {
        player.hp = max(0, player.hp - 5);
        player.bubbleDamageCooldown = 60;
      }
    }
}

  /**
   * Draws the bubbles floating above Kirby's head
   */
  static drawUI(player) {
    if (!player.bubbleMode || player.bubbleCount <= 0) return;

    push();
    for (let i = 0; i < player.bubbleCount; i++) {
      fill(180, 220, 255, 200);
      stroke(255);
      strokeWeight(2);
      // Offset so bubbles are centered above Kirby
      let xPos = player.x - (10 * (player.bubbleCount - 1)) + (i * 20);
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
