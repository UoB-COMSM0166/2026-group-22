// ShopUI.js
// UI rendering + hit testing only

class ShopUI {
  constructor(assets) {
    this.assets = assets;

    // Cached rects for clicks
    this.closeRect = null;
    this.infoBtnEquipR = null;
    this.infoBtnSellR = null;

    this.buyBtnR = null;
    this.buyCancelR = null;

    // Inventory slots each frame
    this.invSlots = [];
  }

  // ---------- geometry helpers ----------
  getContainTransform(img) {
    const cw = width, ch = height;
    const iw = img.width, ih = img.height;
    const s = Math.min(cw / iw, ch / ih);
    const dw = iw * s, dh = ih * s;
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

    const iw = img.width, ih = img.height;
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

  // ---------- top bar ----------
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
    const r = this.getCloseRect(tf);
    return this.inRect(mx, my, r);
  }

  // ---------- shelf (unowned only) ----------
  drawShelf(tf, state, selectedItemId) {
    let hovered = null;

    for (const slot of SHOP_SLOTS) {
      if (state.isOwned(slot.itemId)) continue;

      const r = this.slotRectToScreen(tf, slot);
      const over = this.inRect(mouseX, mouseY, r);
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

      // Icon
      const item = state.getItem(slot.itemId);
      const icon = item ? this.assets.getIconByKey(item.iconKey) : null;
      this.drawIconFit(icon, r, 0.80);

      pop();
    }

    return hovered;
  }

  hitTestShelf(tf, mx, my, state) {
    for (const slot of SHOP_SLOTS) {
      if (state.isOwned(slot.itemId)) continue;
      const r = this.slotRectToScreen(tf, slot);
      if (this.inRect(mx, my, r)) return slot.itemId;
    }
    return null;
  }

  // ---------- inventory bar (fixed cells) ----------
  getInventoryBarRect(tf) {
    const pad = tf.dw * 0.03;
    const barH = tf.dh * 0.14;

    const x = tf.dx + pad + tf.dw * INVENTORY_OFFSET_X;
    const y = tf.dy + tf.dh - pad - barH - tf.dh * INVENTORY_OFFSET_Y;

    const w = tf.dw - pad * 2;
    const h = barH;
    return { x, y, w, h };
  }

  drawInventoryBar(tf, state) {
    let hoveredItemId = null;
    this.invSlots = [];

    const bar = this.getInventoryBarRect(tf);

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
      this.invSlots.push(r);

      const over = this.inRect(mouseX, mouseY, r);
      if (over && itemId) hoveredItemId = itemId;

      // Cell
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
        const icon = item ? this.assets.getIconByKey(item.iconKey) : null;
        this.drawIconFit(icon, r, 0.78);
      }

      pop();
    }

    pop();
    return hoveredItemId;
  }

  hitTestInventory(mx, my) {
    for (const r of this.invSlots) {
      if (r.itemId && this.inRect(mx, my, r)) return r.itemId;
    }
    return null;
  }

  // ---------- hints ----------
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

  drawActionHint(tf, selectedItemId) {
    push();
    const pad = tf.dw * 0.02;
    const x = tf.dx + pad;
    const yEsc = tf.dy + tf.dh - pad;

    const size = Math.max(19, Math.floor(tf.dh * 0.024));
    textAlign(LEFT, BOTTOM);
    textSize(size);
    noStroke();
    fill(255, 200);

    const hint = selectedItemId ? "Click buttons to equip / sell" : "Click to buy";
    text(hint, x, yEsc - size * 1.25);

    pop();
  }

  // ---------- info panel (anchored) ----------
  getItemAnchorRect(tf, itemId, state) {
    if (state.isOwned(itemId)) {
      for (const r of this.invSlots) {
        if (r.itemId === itemId) return r;
      }
      return null;
    }
    const slot = SHOP_SLOTS.find((s) => s.itemId === itemId);
    if (!slot) return null;
    return this.slotRectToScreen(tf, slot);
  }

  drawInfoPanel(tf, anchor, itemId, state) {
    const item = state.getItem(itemId);
    if (!item) return;

    this.infoBtnEquipR = null;
    this.infoBtnSellR = null;

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

      this.infoBtnEquipR = { x: bx1, y: by, w: btnW, h: btnH };
      const isEquipped = state.equippedWeaponId === itemId;
      this.drawModalButton(this.infoBtnEquipR, isEquipped ? "EQUIPPED" : "EQUIP", this.inRect(mouseX, mouseY, this.infoBtnEquipR), !isEquipped);

      this.infoBtnSellR = { x: bx2, y: by, w: btnW, h: btnH };
      this.drawModalButton(this.infoBtnSellR, "SELL", this.inRect(mouseX, mouseY, this.infoBtnSellR), true);
    }

    pop();
  }

  hitTestInfoPanel(mx, my) {
    if (this.infoBtnEquipR && this.inRect(mx, my, this.infoBtnEquipR)) return "equip";
    if (this.infoBtnSellR && this.inRect(mx, my, this.infoBtnSellR)) return "sell";
    return null;
  }

  // ---------- buy modal ----------
  drawBuyModal(tf, itemId, state) {
    const item = state.getItem(itemId);
    if (!item) return;

    push();
    noStroke();
    fill(0, 0, 0, 170);
    rect(0, 0, width, height);

    const boxW = Math.min(tf.dw * 0.55, 560);
    const boxH = Math.min(tf.dh * 0.32, 260);
    const boxX = width / 2 - boxW / 2;
    const boxY = height / 2 - boxH / 2;

    fill(20, 20, 20, 235);
    rect(boxX, boxY, boxW, boxH, 18);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(Math.max(18, Math.floor(boxH * 0.16)));
    text("Purchase Item", boxX + boxW / 2, boxY + boxH * 0.22);

    fill(230);
    textSize(Math.max(14, Math.floor(boxH * 0.11)));
    text(`${item.name} — ${item.price} coins`, boxX + boxW / 2, boxY + boxH * 0.46);

    const afford = state.coins >= item.price;
    const tip = afford ? "Click BUY to confirm." : "Not enough coins.";
    fill(200);
    textSize(Math.max(12, Math.floor(boxH * 0.09)));
    text(tip, boxX + boxW / 2, boxY + boxH * 0.60);

    const btnW = boxW * 0.26;
    const btnH = boxH * 0.18;
    const gap = boxW * 0.06;

    this.buyBtnR = {
      x: boxX + boxW / 2 - gap / 2 - btnW,
      y: boxY + boxH * 0.72,
      w: btnW, h: btnH
    };
    this.buyCancelR = {
      x: boxX + boxW / 2 + gap / 2,
      y: boxY + boxH * 0.72,
      w: btnW, h: btnH
    };

    this.drawModalButton(this.buyBtnR, "BUY", this.inRect(mouseX, mouseY, this.buyBtnR), afford);
    this.drawModalButton(this.buyCancelR, "CANCEL", this.inRect(mouseX, mouseY, this.buyCancelR), true);

    pop();
  }

  hitTestBuyModal(mx, my) {
    if (this.buyBtnR && this.inRect(mx, my, this.buyBtnR)) return "buy";
    if (this.buyCancelR && this.inRect(mx, my, this.buyCancelR)) return "cancel";
    return "outside";
  }
}
