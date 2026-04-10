// src/classes/Bow.js
class Bow extends Collectable {
  constructor(x, y) {
    super(x, y, 40, 40);

    // --- Skill Persistence ---
    this.duration = 999999;
    this.respawnTimer = 300;        // 5 seconds
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.abilities.setSkill(CONFIG.SKILLS.BOW, this.duration);
    this.active = false;
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