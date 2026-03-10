// ShopUI.js
// Compose UI components and provide shared helpers

class ShopUI {
  constructor(assets) {
    this.assets = assets;

    this.shelf = new ShopShelf(this);
    this.inventoryBar = new ShopInventoryBar(this);
    this.infoPanel = new ShopInfoPanel(this);
    this.buyModal = new ShopBuyModel(this);

    this.closeRect = null;
  }

  getContainTransform(img) {
    const cw = width;
    const ch = height;
    const iw = img.width;
    const ih = img.height;

    const s = Math.min(cw / iw, ch / ih);
    const dw = iw * s;
    const dh = ih * s;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    return { dx, dy, dw, dh, s };
  }

  inRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  slotRectToScreen(tf, slot) {
    return {
      x: tf.dx + slot.rx * tf.dw,
      y: tf.dy + slot.ry * tf.dh,
      w: slot.rw * tf.dw,
      h: slot.rh * tf.dh,
    };
  }

  drawIconFit(img, rect, scale = 0.78) {
    if (!img) return;

    const padW = rect.w * (1 - scale) * 0.5;
    const padH = rect.h * (1 - scale) * 0.5;
    const maxW = rect.w - padW * 2;
    const maxH = rect.h - padH * 2;

    const iw = img.width;
    const ih = img.height;
    if (!iw || !ih) return;

    const s = Math.min(maxW / iw, maxH / ih);
    const dw = iw * s;
    const dh = ih * s;

    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;

    push();
    imageMode(CENTER);
    image(img, cx, cy, dw, dh);
    pop();
  }

  drawModalButton(r, label, hover, enabled) {
    push();
    noStroke();

    const alpha = enabled ? (hover ? 210 : 170) : 90;
    fill(255, 255, 255, alpha * 0.15);
    rect(r.x, r.y, r.w, r.h, 12);

    stroke(255, enabled ? (hover ? 255 : 180) : 90);
    strokeWeight(2);
    noFill();
    rect(r.x, r.y, r.w, r.h, 12);

    noStroke();
    fill(255, enabled ? 255 : 120);
    textAlign(CENTER, CENTER);
    textSize(Math.max(12, Math.floor(r.h * 0.55)));
    text(label, r.x + r.w / 2, r.y + r.h / 2);

    pop();
  }

  drawCoins(tf, coins) {
    push();

    const pad = tf.dw * 0.02;
    const x = tf.dx + pad;
    const y = tf.dy + pad;

    noStroke();
    fill(0, 0, 0, 140);
    rect(x, y, tf.dw * 0.16, tf.dh * 0.06, 12);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(Math.max(14, Math.floor(tf.dh * 0.03)));
    text(`Coins: ${coins}`, x + pad * 0.6, y + tf.dh * 0.03);

    pop();
  }

  getCloseRect(tf) {
    return {
      x: tf.dx + tf.dw - tf.dw * 0.05,
      y: tf.dy + tf.dh * 0.02,
      w: tf.dw * 0.035,
      h: tf.dw * 0.035,
    };
  }

  drawClose(tf) {
    const r = this.getCloseRect(tf);
    this.closeRect = r;

    const over = this.inRect(mouseX, mouseY, r);
    if (over) cursor("pointer");

    push();
    stroke(255, 200);
    strokeWeight(3);
    line(r.x, r.y, r.x + r.w, r.y + r.h);
    line(r.x + r.w, r.y, r.x, r.y + r.h);
    pop();
  }

  isCloseClicked(tf, mx, my) {
    return this.inRect(mx, my, this.getCloseRect(tf));
  }

  drawActionHint(tf, selectedItemId) {
    push();

    const pad = tf.dw * 0.02;
    const x = tf.dx + pad;
    const yEsc = tf.dy + tf.dh - pad;

    const size = Math.max(14, Math.floor(tf.dh * 0.024));
    textAlign(LEFT, BOTTOM);
    textSize(size);
    noStroke();
    fill(255, 200);

    const hint = selectedItemId ? "Click buttons to equip / sell" : "Click to buy";
    text(hint, x, yEsc - size * 1.25);

    pop();
  }

  drawEscHint(tf) {
    push();

    const pad = tf.dw * 0.02;
    const x = tf.dx + pad;
    const y = tf.dy + tf.dh - pad;

    textAlign(LEFT, BOTTOM);
    textSize(Math.max(14, Math.floor(tf.dh * 0.028)));
    noStroke();
    fill(255, 220);
    text("Press Esc to return", x, y);

    pop();
  }

  getItemAnchorRect(tf, itemId, state) {
    if (state.isOwned(itemId)) {
      return this.inventoryBar.getItemRect(itemId);
    }

    const slot = SHOP_SLOTS.find((s) => s.itemId === itemId);
    if (!slot) return null;
    return this.slotRectToScreen(tf, slot);
  }
}
