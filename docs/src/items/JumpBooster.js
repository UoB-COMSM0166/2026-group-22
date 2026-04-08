// src/classes/JumpBooster.js
class JumpBooster extends Collectable {
  constructor(x, y) {
    super(x, y, 35, 35);

    this.isInhaleable = true;
    this.isTouchCollectable = false;

    this.boostTimer = 300;
    this.respawnTimer = 120;
    this.shouldRespawn = true;
  }

  onCollect(player) {
    player.abilities.setSkill(CONFIG.SKILLS.JUMP, this.boostTimer);
    this.active = false;
  }

  show() {
    if (!this.active) return;

    push();
    translate(this.x, this.y + this.hoverOffset);

    // Draw a "Booster" Star
    fill(255, 255, 0); // Bright Yellow
    stroke(255, 150, 0); // Orange outline
    strokeWeight(3);

    // Draw a star shape
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5 - HALF_PI;
      let x = cos(angle) * 15;
      let y = sin(angle) * 15;
      vertex(x, y);
      angle += TWO_PI / 10;
      x = cos(angle) * 7;
      y = sin(angle) * 7;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}