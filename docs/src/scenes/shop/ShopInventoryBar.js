class ShopInventoryBar {
  constructor() {
    this.ui = ShopUI;
    this.state = shopState;
    this.slots = [];
  }

  draw() {
    if (!shopAssets.bgImg || shopAssets.bgImg.width === 0) return;
    const tf = this.ui.getContainTransform(shopAssets.bgImg);
    const bar = this.getBarRect(tf);
    const ownedIds = this.state.getOwnedItemIds();
    this.slots = []; 

    push();
    noStroke();
    fill(0, 0, 0, 150);
    rect(bar.x, bar.y, bar.w, bar.h, 18);

    const slotSize = bar.h * 0.65;
    const gap = slotSize * 0.2;
    const startX = bar.x + (bar.w * 0.1); 

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++) {
      const itemId = ownedIds[i] || null;
      const r = {
        x: startX + i * (slotSize + gap),
        y: bar.y + (bar.h - slotSize) / 2,
        w: slotSize,
        h: slotSize,
        itemId
      };
      this.slots.push(r);
      const over = this.ui.inRect(mouseX, mouseY, r);
      fill(255, 255, 255, over ? 40 : 20);
      rect(r.x, r.y, r.w, r.h, 12);

      if (itemId && this.state.equippedWeaponId === itemId) {
        stroke(255, 215, 0); 
        strokeWeight(3);
      } else {
        stroke(255, 50);
        strokeWeight(1);
      }
      noFill();
      rect(r.x, r.y, r.w, r.h, 12);

      if (itemId) {
        const item = this.state.getItem(itemId);
        const icon = shopAssets.getIconByKey(item.iconKey);
        this.ui.drawIconFit(icon, r, 0.75);
      }
    }
    pop();
  }

  handleMouse() {
    for (const slot of this.slots) {
      if (slot.itemId && this.ui.inRect(mouseX, mouseY, slot)) {
        this.state.selectedItemId = slot.itemId;
        return true;
      }
    }
    return false;
  }

  getBarRect(tf) {
    const pad = tf.dw * 0.03;
    const barH = tf.dh * 0.14;
    const x = tf.dx + pad + tf.dw * INVENTORY_OFFSET_X;
    const y = tf.dy + tf.dh - pad - barH - tf.dh * INVENTORY_OFFSET_Y;
    return { x, y, w: tf.dw - pad * 2, h: barH };
  }

  // Added helper for ShopUI positioning
  getItemRect(itemId) {
    return this.slots.find(s => s.itemId === itemId) || null;
  }
}