class EntityOverlay {
  static draw(entity) {
    if (!entity || !entity.active) return;

    if (entity instanceof Player && entity.bubbleMode) {
      this.drawBubbles(entity);
    }

    if (entity instanceof Player && entity.abilities && entity.abilities.isCharging) {
      this.drawChargeBar(entity);
    }

    if (entity instanceof Enemy && entity.hp <= entity.maxHp) {
      this.drawEnemyHP(entity);
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

      let xPos = player.x - (10 * (ab.bubbleCount - 1)) + (i * 20);
      let yPos = player.y - player.h / 2 - 25;
      ellipse(xPos, yPos, 12, 12);
    }
    pop();
  }

  static drawChargeBar(player) {
    push();
    const ab = player.abilities;
    const barW = 40;
    const chargeWidth = map(ab.bowCharge, 0, 25, 0, barW);

    let x = player.x - barW / 2;
    let y = player.y + player.h / 2 + 10;

    fill(0, 150);
    noStroke();
    rect(x, y, barW, 6, 2);

    fill(255, 215, 0);
    rect(x, y, chargeWidth, 6, 2);
    pop();
  }

  static drawEnemyHP(enemy) {
    push();
    const barW = 40;
    const barH = 5;

    const hpWidth = map(enemy.hp, 0, enemy.maxHp, 0, barW);

    let x = enemy.x - barW / 2;
    let y = enemy.y - enemy.h / 2 - 15;

    noStroke();
    fill(50, 50, 50, 200);
    rect(x, y, barW, barH, 2);

    fill(100, 255, 100);
    rect(x, y, hpWidth, barH, 2);
    pop();
  }
}