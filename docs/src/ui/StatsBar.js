// src/classes/StatsBar.js
class StatsBar {
  constructor() {
    this.margin = 30;
    this.y = 40;
    this.heartSpacing = 30;
    this.heartSize = 30;

    this.weaponX = this.margin + 5 * this.heartSpacing + 10;
    this.weaponSize = 24;
  }

  // We pass in the data the StatsBar needs to "know" about
  draw(player, coins, showCoins = true) {
    this.drawHearts(player.hp, player.maxHp);
    if (showCoins) this.drawCoins(coins);

    this.drawEquippedWeapon();
  }

  drawEquippedWeapon() {
    const weaponId = gameState.equippedWeaponId;
    if (!weaponId) return;

    const itemData = gameState.getItemData(weaponId);
    if (!itemData || !itemData.iconKey) return;

    const icon = assets.getImg(itemData.iconKey);
    if (!icon) return;

    push();
    imageMode(CENTER);

    // Optional: Draw a subtle "backing" circle so the icon pops
    noStroke();
    fill(255, 50); // Very faint white glow
    ellipse(this.weaponX, this.y, this.weaponSize + 8);

    // Draw the weapon photo
    image(icon, this.weaponX, this.y, this.weaponSize, this.weaponSize);
    pop();
  }

  drawHearts(hp, maxHp) {
    const maxHearts = 5;
    const hpPerHeart = maxHp / maxHearts;
    const emptyHeart = assets.getImg('empty_heart');
    const fullHeart = assets.getImg('full_heart');
    const halfHeart = assets.getImg('half_heart');

    for (let i = 0; i < maxHearts; i++) {
      let x = this.margin + i * this.heartSpacing;
      let heartValue = hp - (i * hpPerHeart);

      this.renderHeart(x, this.y, emptyHeart);

      if (heartValue >= hpPerHeart) {
        this.renderHeart(x, this.y, fullHeart);
      }
      else if (heartValue >= hpPerHeart * 0.75) {
        this.renderHeart(x, this.y, fullHeart, 150);
      }
      else if (heartValue >= hpPerHeart * 0.5) {
        this.renderHeart(x, this.y, halfHeart);
      }
      else if (heartValue >= hpPerHeart * 0.25) {
        this.renderHeart(x, this.y, halfHeart, 150);
      }
    }
  }

  renderHeart(x, y, img, alpha = 255) {
    push();
    imageMode(CENTER);

    if (img) {
      tint(255, alpha);
      image(img, x, y, this.heartSize, this.heartSize);
    }
    pop();
  }

  drawCoins(amount) {
    push();
    fill(255, 215, 0);
    textSize(22);
    textAlign(LEFT, TOP);
    text(`$ ${amount}`, this.margin, this.y + 20);
    pop();
  }

  drawBossHealth(boss) {
    if (!boss || !boss.active || boss.hp <= 0) return;

    push();
    let barW = 400;
    // Calculate health width based on boss HP
    let hpW = map(max(0, boss.hp), 0, boss.maxHp, 0, barW);

    rectMode(CORNER);
    // Background bar
    fill(40, 200);
    rect(width / 2 - barW / 2, 30, barW, 15, 5);

    // Health fill (Red)
    fill(255, 0, 50);
    rect(width / 2 - barW / 2, 30, hpW, 15, 5);
    pop();
  }
}