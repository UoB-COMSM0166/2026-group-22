// ShopInfoPanel.js
// Draw item info panel and handle info panel button hit test

class ShopInfoPanel {
  constructor(ui) {
    this.ui = ui;
    this.equipBtnRect = null;
    this.sellBtnRect = null;
  }

  draw(tf, anchor, itemId, state) {
    const item = state.getItem(itemId);
    if (!item) return;

    this.equipBtnRect = null;
    this.sellBtnRect = null;

    push();

    const pad = tf.dw * 0.02;
    const w = tf.dw * 0.28;
    const h = tf.dh * 0.26;

    let x = anchor.x + anchor.w + pad;
    let y = anchor.y - h * 0.15;

    if (x + w > tf.dx + tf.dw) x = anchor.x - pad - w;

    x = constrain(x, tf.dx + pad, tf.dx + tf.dw - pad - w);
    y = constrain(y, tf.dy + pad, tf.dy + tf.dh - pad - h);

    noStroke();
    fill(0, 0, 0, 150);
    rect(x, y, w, h, 16);

    fill(255);
    textAlign(LEFT, TOP);
    textSize(Math.max(16, Math.floor(h * 0.14)));
    text(item.name, x + pad * 0.7, y + pad * 0.5);

    textSize(Math.max(12, Math.floor(h * 0.10)));
    fill(230);

    const lines = [
      ...item.desc,
      "",
      state.isOwned(itemId) ? "Status: Owned" : `Price: ${item.price} coins`,
      `Your coins: ${state.coins}`,
    ];

    const lineH = Math.max(14, Math.floor(h * 0.11));
    let yy = y + pad * 0.5 + lineH * 1.6;
    for (const s of lines) {
      text(s, x + pad * 0.7, yy);
      yy += lineH;
    }

    if (state.isOwned(itemId)) {
      const btnH = h * 0.14;
      const btnW = w * 0.38;
      const gap = w * 0.06;

      const by = y + h * 0.82;
      const bx1 = x + (w - (btnW * 2 + gap)) / 2;
      const bx2 = bx1 + btnW + gap;

      this.equipBtnRect = { x: bx1, y: by, w: btnW, h: btnH };
      this.sellBtnRect = { x: bx2, y: by, w: btnW, h: btnH };

      const isEquipped = state.equippedWeaponId === itemId;

      this.ui.drawModalButton(
        this.equipBtnRect,
        isEquipped ? "EQUIPPED" : "EQUIP",
        this.ui.inRect(mouseX, mouseY, this.equipBtnRect),
        !isEquipped
      );

      this.ui.drawModalButton(
        this.sellBtnRect,
        "SELL",
        this.ui.inRect(mouseX, mouseY, this.sellBtnRect),
        true
      );
    }

    pop();
  }

  hitTest(mx, my) {
    if (this.equipBtnRect && this.ui.inRect(mx, my, this.equipBtnRect)) return "equip";
    if (this.sellBtnRect && this.ui.inRect(mx, my, this.sellBtnRect)) return "sell";
    return null;
  }
}
