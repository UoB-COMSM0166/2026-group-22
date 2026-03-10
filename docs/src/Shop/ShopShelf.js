// ShopShelf.js
// Draw shelf items and handle shelf hit test

class ShopShelf {
  constructor(ui) {
    this.ui = ui;
  }

  draw(tf, state, selectedItemId) {
    let hovered = null;

    for (const slot of SHOP_SLOTS) {
      if (state.isOwned(slot.itemId)) continue;

      const r = this.ui.slotRectToScreen(tf, slot);
      const over = this.ui.inRect(mouseX, mouseY, r);
      if (over) hovered = slot.itemId;

      push();
      noStroke();
      fill(0, 0, 0, over ? 120 : 90);
      rect(r.x, r.y, r.w, r.h, 14);

      strokeWeight(3);
      if (selectedItemId === slot.itemId) stroke(255);
      else if (over) stroke(220);
      else stroke(160, 160, 160, 120);
      noFill();
      rect(r.x, r.y, r.w, r.h, 14);

      const item = state.getItem(slot.itemId);
      const icon = item ? this.ui.assets.getIconByKey(item.iconKey) : null;
      this.ui.drawIconFit(icon, r, 0.80);

      pop();
    }

    return hovered;
  }

  hitTest(tf, mx, my, state) {
    for (const slot of SHOP_SLOTS) {
      if (state.isOwned(slot.itemId)) continue;

      const r = this.ui.slotRectToScreen(tf, slot);
      if (this.ui.inRect(mx, my, r)) return slot.itemId;
    }
    return null;
  }
}
