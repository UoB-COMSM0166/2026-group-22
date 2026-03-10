// ShopInventoryBar.js
// Draw fixed inventory cells and handle inventory hit test

class ShopInventoryBar {
  constructor(ui) {
    this.ui = ui;
    this.slots = [];
  }

  getBarRect(tf) {
    const pad = tf.dw * 0.03;
    const barH = tf.dh * 0.14;

    const x = tf.dx + pad + tf.dw * INVENTORY_OFFSET_X;
    const y = tf.dy + tf.dh - pad - barH - tf.dh * INVENTORY_OFFSET_Y;

    const w = tf.dw - pad * 2;
    const h = barH;
    return { x, y, w, h };
  }

  draw(tf, state) {
    let hoveredItemId = null;
    this.slots = [];

    const bar = this.getBarRect(tf);

    push();
    noStroke();
    fill(0, 0, 0, 120);
    rect(bar.x, bar.y, bar.w, bar.h, 18);

    fill(255, 210);
    textAlign(LEFT, CENTER);
    textSize(Math.max(12, Math.floor(bar.h * 0.22)));
    text("Inventory", bar.x + bar.w * 0.03, bar.y + bar.h * 0.22);

    const ownedIds = state.getOwnedItemIds();

    const slotSize = bar.h * 0.62;
    const gap = slotSize * 0.22;
    const startX = bar.x + bar.w * 0.22;
    const cy = bar.y + bar.h * 0.60;

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++) {
      const itemId = ownedIds[i] || null;

      const r = {
        x: startX + i * (slotSize + gap),
        y: cy - slotSize / 2,
        w: slotSize,
        h: slotSize,
        itemId,
      };
      this.slots.push(r);

      const over = this.ui.inRect(mouseX, mouseY, r);
      if (over && itemId) hoveredItemId = itemId;

      push();
      noStroke();
      fill(255, 255, 255, over ? 28 : 18);
      rect(r.x, r.y, r.w, r.h, 14);

      if (itemId && state.equippedWeaponId === itemId) {
        stroke(255, 220, 0, 220);
        strokeWeight(3);
      } else {
        stroke(255, 255, 255, 90);
        strokeWeight(2);
      }
      noFill();
      rect(r.x + 2, r.y + 2, r.w - 4, r.h - 4, 12);

      if (itemId) {
        const item = state.getItem(itemId);
        const icon = item ? this.ui.assets.getIconByKey(item.iconKey) : null;
        this.ui.drawIconFit(icon, r, 0.78);
      }

      pop();
    }

    pop();
    return hoveredItemId;
  }

  hitTest(mx, my) {
    for (const r of this.slots) {
      if (r.itemId && this.ui.inRect(mx, my, r)) return r.itemId;
    }
    return null;
  }

  getItemRect(itemId) {
    for (const r of this.slots) {
      if (r.itemId === itemId) return r;
    }
    return null;
  }
}
