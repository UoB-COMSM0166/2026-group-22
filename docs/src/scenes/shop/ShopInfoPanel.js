class ShopInfoPanel {
  constructor() {
    this.ui = ShopUI;
    this.state = gameState;
    this.equipBtnRect = null;
    this.sellBtnRect = null;
  }

  draw() {
    const itemId = this.state.selectedItemId;
    if (!itemId) return;
    const item = this.state.getItemData(itemId);
    if (!item) return;

    const tf = this.ui.getContainTransform(assets.getImg('shop_bg'));
    const anchor = this.ui.getItemAnchorRect(tf, itemId, this.state);
    if (!anchor) return;

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
    fill(0, 0, 0, 220);
    rect(x, y, w, h, 16);

    fill(255);
    if (window.Assets?.plasdripFont) textFont(window.Assets.plasdripFont);
    textAlign(LEFT, TOP);
    textSize(Math.max(18, Math.floor(h * 0.14)));
    text(item.name.toUpperCase(), x + pad * 0.7, y + pad * 0.5);

    textFont('sans-serif');
    textSize(Math.max(12, Math.floor(h * 0.10)));
    fill(200);

    const isOwned = this.state.isOwned(itemId);
    const lines = [
      ...item.desc,
      "",
      isOwned ? "STATUS: Owned" : `PRICE: ${item.price} coins`,
      `WALLET: ${this.state.coins} coins`,
    ];

    const lineH = Math.max(14, Math.floor(h * 0.11));
    let yy = y + pad * 0.5 + lineH * 2.2;
    for (const s of lines) {
      text(s, x + pad * 0.7, yy);
      yy += lineH;
    }

    if (isOwned) {
      this.drawActionButtons(x, y, w, h, itemId, tf); // Added tf argument
    }
    pop();
  }

  drawActionButtons(x, y, w, h, itemId, tf) { // Added tf parameter
    const btnH = h * 0.18;
    const btnW = w * 0.40;
    const gap = w * 0.04;
    const by = y + h - btnH - (h * 0.08);
    const bx1 = x + (w - (btnW * 2 + gap)) / 2;
    const bx2 = bx1 + btnW + gap;

    this.equipBtnRect = { x: bx1, y: by, w: btnW, h: btnH };
    this.sellBtnRect = { x: bx2, y: by, w: btnW, h: btnH };

    const isEquipped = this.state.equippedWeaponId === itemId;
    this.ui.drawModalButton(this.equipBtnRect, isEquipped ? "EQUIPPED" : "EQUIP", this.ui.inRect(mouseX, mouseY, this.equipBtnRect), !isEquipped);
    this.ui.drawModalButton(this.sellBtnRect, "SELL", this.ui.inRect(mouseX, mouseY, this.sellBtnRect), true);
  }

  handleMouse() {
    if (!this.state.selectedItemId) return false;
    if (this.equipBtnRect && this.ui.inRect(mouseX, mouseY, this.equipBtnRect)) {
      this.state.equipWeapon(this.state.selectedItemId);
      return true;
    }
    if (this.sellBtnRect && this.ui.inRect(mouseX, mouseY, this.sellBtnRect)) {
      this.state.sellItem(this.state.selectedItemId);
      if (!this.state.isOwned(this.state.selectedItemId)) this.state.selectedItemId = null;
      return true;
    }
    return false;
  }
}