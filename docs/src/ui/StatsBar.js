class StatsBar {
  constructor() {
    this.margin = 70;
    this.y = 30;

    this.heartSpacing = 26;
    this.heartSize = 24;

    this.weaponSize = 40;
  }

  draw(player, coins, showCoins = true, unsaveCoins = 0) {
    this.drawHearts(player.hp, player.maxHp);

    if (showCoins) this.drawCoins(coins, unsaveCoins);

    this.drawDifficulty(gameState.difficulty);

    this.drawEquippedWeapon();
  }

  drawDifficulty(difficulty) {
    if (!difficulty) return;

    push();
    textAlign(RIGHT, CENTER);
    textFont(assets.getFont());
    textSize(18);

    const isHard = (difficulty === "DIFFICULT");
    if (isHard) {
      fill(255, 80, 80, 200);
    } else {
      fill(80, 255, 200, 200);
    }

    text(difficulty, width - this.margin, this.y);
    pop();
  }

  drawEquippedWeapon(x = 40, y = this.y + 60, tf = null) {
    const weaponId = gameState.equippedWeaponId;
    if (!weaponId) return;

    const itemData = gameState.getItemData(weaponId);
    if (!itemData) return;

    const icon = assets.getImg(itemData.id);
    if (!icon) return;

    const baseSize = tf ? tf.dw * 0.06 : this.weaponSize;
    const labelSize = tf ? Math.max(12, tf.dh * 0.025) : 12;

    const aspect = icon.width / icon.height;
    let dw = baseSize;
    let dh = baseSize;

    if (aspect > 1) {
      dh = baseSize / aspect;
    } else {
      dw = baseSize * aspect;
    }

    push();
    imageMode(CENTER);
    rectMode(CENTER);

    const pad = tf ? tf.dw * 0.012 : 10;
    noStroke();
    fill(0, 120);
    rect(x, y, dw + pad, dh + pad, 8);

    stroke(255, 40);
    strokeWeight(1);
    noFill();
    rect(x, y, dw + pad, dh + pad, 8);

    image(icon, x, y, dw, dh);

    textAlign(LEFT, CENTER);
    textSize(labelSize);
    fill(255, 180);
    text("EQUIPPED", x + (dw / 2) + (tf ? tf.dw * 0.015 : 12), y);
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

  drawCoins(amount, unsavedAmount = 0, x = this.margin, y = this.y + 28, tf = null) {
    const tSize = tf ? Math.max(22, tf.dh * 0.04) : 22;

    push();
    textAlign(LEFT, CENTER);
    textFont('sans-serif');
    textSize(tSize);

    fill(255, 215, 0);
    let coinText = `$ ${amount}`;
    text(coinText, x, y);

    if (unsavedAmount > 0) {
      let offset = textWidth(coinText) + 10;
      fill(200, 255, 100, 200);
      textSize(tSize * 0.8);
      text(`(+${unsavedAmount})`, x + offset, y);
    }
    pop();
  }

  drawBossHealth(boss) {
    if (!boss || !boss.active || boss.hp <= 0) return;

    push();
    let barW = 400;
    let barH = 20;
    let x = width / 2 - barW / 2;
    let y = this.y - barH / 2;

    let hpW = map(constrain(boss.hp, 0, boss.maxHp), 0, boss.maxHp, 0, barW);

    rectMode(CORNER);

    fill(40, 200);
    noStroke();
    rect(x, y, barW, barH, 5);

    fill(255, 0, 50);
    rect(x, y, hpW, barH, 5);

    stroke(255, 50);
    strokeWeight(2);
    noFill();
    rect(x, y, barW, barH, 5);
    pop();
  }
}