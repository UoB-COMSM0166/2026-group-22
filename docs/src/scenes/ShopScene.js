// src/scenes/ShopScene.js
class ShopScene extends BaseScene {
  constructor() {
    super();
    this.bgImg = null;
    this.modalOpen = false;
    this.tf = null;
    this.inventorySlots = []; // To track hitboxes for clicking

    // UI Layout Constants
    this.INV_MAX = 6;
    this.INV_OFFSET_X = 0.05;
    this.INV_OFFSET_Y = 0.12;
  }

  onEnter() {
    gameState.load();
    gameState.selectedItemId = null;
    this.modalOpen = false;
    this.bgImg = assets.getImg('shop_bg');
  }

  draw() {
    background(0);
    this.tf = this.getContainTransform(this.bgImg);
    if (this.bgImg) image(this.bgImg, this.tf.dx, this.tf.dy, this.tf.dw, this.tf.dh);

    this.drawHeader();
    this.drawShelf();
    this.drawInventoryBar();
    this.drawInfoPanel();
    if (this.modalOpen) this.drawBuyModal();

    // Navigation Hint from original ShopUI
    push();
    const pad = this.tf.dw * 0.02;
    textAlign(LEFT, BOTTOM);
    textSize(Math.max(14, this.tf.dh * 0.028));
    fill(255, 180);
    text("Press ESC to return", this.tf.dx + pad, this.tf.dy + this.tf.dh - pad);
    pop();
  }

  /* =============================
     UI DRAWING METHODS (REFINED)
     ============================= */

  drawHeader() {
    push();
    fill(0, 0, 0, 180);
    rect(20, 20, 180, 50, 10);
    fill(255, 215, 0);
    textAlign(LEFT, CENTER);
    textSize(22);
    text(`$ ${gameState.coins}`, 40, 45);
    pop();
  }

  drawShelf() {
    for (const slot of CONFIG.SHOP.SLOTS) {
      if (gameState.isOwned(slot.itemId)) continue;

      const r = this.slotToScreen(slot);
      const over = this.inRect(mouseX, mouseY, r);

      push();
      noStroke();
      fill(0, 0, 0, over ? 120 : 90);
      rect(r.x, r.y, r.w, r.h, 14);

      // Border styling from original ShopShelf
      strokeWeight(3);
      if (gameState.selectedItemId === slot.itemId) {
        stroke(255, 200, 0); // Golden highlight
      } else if (over) {
        stroke(255);
      } else {
        stroke(160, 160, 160, 120);
      }
      noFill();
      rect(r.x, r.y, r.w, r.h, 14);

      const item = gameState.getItemData(slot.itemId);
      if (item) this.drawIcon(assets.getImg(item.iconKey), r, 0.8);
      pop();
    }
  }

  drawInventoryBar() {
    const pad = this.tf.dw * 0.03;
    const barH = this.tf.dh * 0.14;
    const barX = this.tf.dx + pad + this.tf.dw * this.INV_OFFSET_X;
    const barY = this.tf.dy + this.tf.dh - pad - barH - this.tf.dh * this.INV_OFFSET_Y;
    const barW = this.tf.dw - pad * 2;

    push();
    fill(0, 0, 0, 150);
    rect(barX, barY, barW, barH, 18);

    const slotSize = barH * 0.65;
    const gap = slotSize * 0.2;
    const startX = barX + (barW * 0.1);

    this.inventorySlots = [];

    for (let i = 0; i < this.INV_MAX; i++) {
      const itemId = gameState.ownedItemIds[i] || null;
      const r = { x: startX + i * (slotSize + gap), y: barY + (barH - slotSize) / 2, w: slotSize, h: slotSize, itemId };
      this.inventorySlots.push(r);

      const over = this.inRect(mouseX, mouseY, r);
      fill(255, 255, 255, over ? 40 : 20);
      noStroke();
      rect(r.x, r.y, r.w, r.h, 12);

      // Equip Highlight
      if (itemId && gameState.equippedWeaponId === itemId) {
        stroke(255, 215, 0);
        strokeWeight(3);
      } else {
        stroke(255, 50);
        strokeWeight(1);
      }
      noFill();
      rect(r.x, r.y, r.w, r.h, 12);

      if (itemId) {
        const item = gameState.getItemData(itemId);
        if (item) this.drawIcon(assets.getImg(item.iconKey), r, 0.75);
      }
    }
    pop();
  }

  drawInfoPanel() {
    const itemId = gameState.selectedItemId;
    const item = gameState.getItemData(itemId);
    if (!itemId || !item || this.modalOpen) return;

    // Anchor math to float next to items
    const anchor = this.getItemAnchor(itemId);
    if (!anchor) return;

    push();
    const pad = this.tf.dw * 0.02;
    const w = this.tf.dw * 0.30;
    const h = this.tf.dh * 0.34;

    let x = anchor.x + anchor.w + 12;
    let y = anchor.y - h * 0.15;

    // Boundary constraints
    if (x + w > this.tf.dx + this.tf.dw) x = anchor.x - 12 - w;
    x = constrain(x, this.tf.dx + pad, this.tf.dx + this.tf.dw - pad - w);
    y = constrain(y, this.tf.dy + pad, this.tf.dy + this.tf.dh - pad - h);

    fill(0, 0, 0, 220);
    rect(x, y, w, h, 16);

    // Title with custom font
    fill(255);
    textFont(assets.getFont());
    textAlign(LEFT, TOP);
    textSize(Math.max(20, Math.floor(h * 0.12)));
    text(item.name.toUpperCase(), x + pad, y + pad);

    textFont('sans-serif');
    textSize(Math.max(13, Math.floor(h * 0.08)));
    fill(210);

    const isOwned = gameState.isOwned(itemId);
    const lines = [...item.desc, "", isOwned ? "STATUS: Owned" : `PRICE: ${item.price} coins`];

    let yy = y + pad + Math.max(22, h * 0.18);
    const lineLeading = Math.max(16, h * 0.1);

    for (const s of lines) {
      text(s, x + pad, yy, w - pad * 2);
      yy += lineLeading;
    }

    const btnH = Math.max(32, h * 0.18);
    const btnY = y + h - btnH - pad; // Anchor to bottom minus padding
    const btnW = (w - pad * 3) / 2;

    if (isOwned) {
      const isEquipped = gameState.equippedWeaponId === itemId;

      // EQUIP/EQUIPPED Button
      this.drawModalButton(
        { x: x + pad, y: btnY, w: btnW, h: btnH },
        isEquipped ? "EQUIPPED" : "EQUIP",
        !isEquipped,
        () => gameState.equipWeapon(itemId)
      );

      // SELL Button
      this.drawModalButton(
        { x: x + pad + btnW + pad, y: btnY, w: btnW, h: btnH },
        "SELL",
        true,
        () => {
          gameState.sellItem(itemId);
          if (!gameState.isOwned(itemId)) gameState.selectedItemId = null;
        }
      );
    } else {
      // BUY Button (Full Width)
      this.drawModalButton(
        { x: x + pad, y: btnY, w: w - pad * 2, h: btnH },
        `BUY FOR ${item.price}`,
        gameState.coins >= item.price,
        () => this.modalOpen = true
      );
    }
    pop();
  }

  drawBuyModal() {
    const item = gameState.getItemData(gameState.selectedItemId);
    if (!item) return;

    fill(0, 0, 0, 180); rect(0, 0, width, height);

    const boxW = Math.min(this.tf.dw * 0.55, 560);
    const boxH = Math.min(this.tf.dh * 0.32, 260);
    const x = width / 2 - boxW / 2, y = height / 2 - boxH / 2;

    fill(25, 25, 28, 245);
    stroke(255, 255, 255, 40);
    rect(x, y, boxW, boxH, 18);

    textAlign(CENTER, CENTER);
    noStroke(); fill(255);
    textFont(assets.getFont());
    textSize(Math.max(22, Math.floor(boxH * 0.16)));
    text("PURCHASE ITEM?", width / 2, y + boxH * 0.22);

    textFont('sans-serif'); fill(220);
    textSize(Math.max(16, Math.floor(boxH * 0.11)));
    text(`${item.name} — ${item.price} coins`, width / 2, y + boxH * 0.46);

    const btnW = boxW * 0.35, btnH = boxH * 0.20;
    this.drawModalButton({ x: width / 2 - btnW - 10, y: y + boxH * 0.7, w: btnW, h: btnH }, "BUY", gameState.coins >= item.price, () => {
      if (gameState.purchaseItem(item.id)) this.modalOpen = false;
    });
    this.drawModalButton({ x: width / 2 + 10, y: y + boxH * 0.7, w: btnW, h: btnH }, "CANCEL", true, () => this.modalOpen = false);
  }

  /* =============================
     HELPERS & INPUT
     ============================= */

  drawModalButton(r, label, enabled, onClick) {
    const hover = this.inRect(mouseX, mouseY, r);
    push();
    const alpha = enabled ? (hover ? 200 : 140) : 60;
    noStroke(); fill(40, 40, 45, alpha);
    rect(r.x, r.y, r.w, r.h, 10);
    stroke(255, enabled ? (hover ? 255 : 150) : 50);
    strokeWeight(hover ? 3 : 1.5);
    noFill(); rect(r.x, r.y, r.w, r.h, 10);
    noStroke(); fill(enabled ? 255 : 100);
    textAlign(CENTER, CENTER); textSize(Math.max(12, r.h * 0.45));
    text(label, r.x + r.w / 2, r.y + r.h / 2);
    pop();

    if (enabled && hover && mouseIsPressed) {
      onClick();
      mouseIsPressed = false; // Prevent multiple triggers
    }
  }

  getItemAnchor(itemId) {
    if (gameState.isOwned(itemId)) {
      return this.inventorySlots.find(s => s.itemId === itemId) || null;
    }
    const slot = CONFIG.SHOP.SLOTS.find(s => s.itemId === itemId);
    return slot ? this.slotToScreen(slot) : null;
  }

  mousePressed() {
    if (this.modalOpen) return;

    // Check Shelf
    for (const slot of CONFIG.SHOP.SLOTS) {
      if (!gameState.isOwned(slot.itemId) && this.inRect(mouseX, mouseY, this.slotToScreen(slot))) {
        gameState.selectedItemId = slot.itemId;
        return;
      }
    }
    // Check Inventory
    for (const slot of this.inventorySlots) {
      if (slot.itemId && this.inRect(mouseX, mouseY, slot)) {
        gameState.selectedItemId = slot.itemId;
        return;
      }
    }
  }

  keyPressed() {
    if (keyCode === ESCAPE) sceneManager.switch("camp");
  }

  slotToScreen(slot) {
    return {
      x: this.tf.dx + slot.rx * this.tf.dw,
      y: this.tf.dy + slot.ry * this.tf.dh,
      w: slot.rw * this.tf.dw,
      h: slot.rh * this.tf.dh,
    };
  }

  drawIcon(img, rect, scale) {
    if (!img) return;
    const s = Math.min(rect.w * scale / img.width, rect.h * scale / img.height);
    push();
    imageMode(CENTER);
    image(img, rect.x + rect.w / 2, rect.y + rect.h / 2, img.width * s, img.height * s);
    pop();
  }
}