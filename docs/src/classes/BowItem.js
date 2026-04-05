// src/classes/BowItem.js
class BowItem extends Collectable {
  constructor(x, y) {
    super(x, y, 40, 40);
    
    // --- Skill Persistence ---
    this.shouldRespawn = true;      // If Kirby loses the skill, the item comes back
    this.respawnTimer = 300;        // 5 seconds
  }

  onCollect(player) {
    // Standard skill activation
    player.hasSkill = true;
    player.currentSkill = CONFIG.SKILLS.BOW;
    
    // UI Feedback
    console.log("Skill Acquired: Bow & Arrow");
  }

  show() {
    if (!this.active) return;
    
    push();
    translate(this.x, this.y + this.hoverOffset);
    
    // 1. Draw Bow Body
    stroke(139, 69, 19); 
    strokeWeight(3);
    noFill();
    arc(0, 0, 30, 40, HALF_PI, -HALF_PI); 
    
    // 2. Draw String
    stroke(200);
    strokeWeight(1);
    line(-5, -20, -5, 20); 
    
    // 3. Visual Polish: Add a tiny "ready" arrow inside the bow
    stroke(255, 200, 0);
    line(-10, 0, 10, 0);
    fill(255, 200, 0);
    noStroke();
    triangle(10, -3, 10, 3, 15, 0);
    
    pop();
  }
}