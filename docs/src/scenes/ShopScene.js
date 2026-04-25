class ShopScene extends BaseScene {
  constructor() {
    super();
    this.bgImg = null;
    this.modalOpen = false;
    this.tf = null;
    this.inventorySlots = [];

    this.INV_MAX = 5;
  }

  onEnter() {
    gameState.load();
    gameState.selectedItemId = null;
    this.modalOpen = false;
    this.bgImg = assets.getImg('shop_bg');
    this.tf = this.getContainTransform(this.bgImg);
  }

  draw() {
    background(0);

    this.tf = this.getContainTransform(this.bgImg);
    if (this.bgImg) image(this.bgImg, this.tf.dx, this.tf.dy, this.tf.dw, this.tf.dh);

    this.drawHeader();
    this.drawShelf();
    this.drawInventoryBar();
    this.drawInfoPanel();
    this.drawSystemUI(this.tf);
    if (this.modalOpen) this.drawBuyModal();

    push();
    const pad = this.tf.dw * 0.02;
    textAlign(LEFT, BOTTOM);
    textSize(Math.max(14, this.tf.dh * 0.028));
    fill(255, 180);
    text("Press ESC to return", this.tf.dx + pad, this.tf.dy + this.tf.dh - pad);
    pop();
  }

  drawHeader() {
    const pad = this.tf.dw * 0.02;
    const hX = this.tf.dx + pad;
    const hY = this.tf.dy + pad;

    push();
    fill(255, 215, 0);
    textAlign(LEFT, CENTER);
    textSize(22);
    text(`$ ${gameState.coins}`, hX + 20, hY + 25);
    pop();
  }

  drawShelf() {
    for (const slot of CONFIG.SHOP.SLOTS) {
      if (gameState.isOwned(slot.itemId)) continue;

      const r = this.slotToScreen(slot);
      const isSelected = (gameState.selectedItemId === slot.itemId);

      this.drawItemSlot(r, slot.itemId, isSelected);
    }
  }

  drawInventoryBar() {
    const pad = this.tf.dw * 0.03;
    const barW = this.tf.dw * 0.8;
    const barH = this.tf.dh * 0.14;
    const barX = this.tf.dx + (this.tf.dw - barW) / 2;
    const barY = this.tf.dy + this.tf.dh - pad - barH - this.tf.dh * 0.12;

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

      const isSelected = (itemId !== null && gameState.selectedItemId === itemId);
      const isEquipped = (itemId !== null && gameState.equippedWeaponId === itemId);

      this.drawItemSlot(r, itemId, isSelected, isEquipped);
    }
  }

  drawInfoPanel() {
    const itemId = gameState.selectedItemId;
    const item = gameState.getItemData(itemId);
    if (!itemId || !item || this.modalOpen) return;

    const anchor = this.getItemAnchor(itemId);
    if (!anchor) return;

    const p = this.getInfoPanelRect(anchor);

    push();
    fill(0, 0, 0, 220);
    rect(p.x, p.y, p.w, p.h, 16);

    fill(255);
    textFont(assets.getFont());
    textAlign(LEFT, TOP);
    const pad = this.tf.dw * 0.02;
    textSize(Math.max(20, Math.floor(p.h * 0.12)));
    text(item.name.toUpperCase(), p.x + pad, p.y + pad);

    textFont('sans-serif');
    textSize(Math.max(13, Math.floor(p.h * 0.08)));
    fill(210);

    const isOwned = gameState.isOwned(itemId);
    const lines = [...item.desc, "", isOwned ? "STATUS: Owned" : `PRICE: ${item.price} coins`];

    let yy = p.y + pad + Math.max(22, p.h * 0.18);
    const lineLeading = Math.max(16, p.h * 0.1);

    for (const s of lines) {
      text(s, p.x + pad, yy, p.w - pad * 2);
      yy += lineLeading;
    }

    const btnH = Math.max(32, p.h * 0.18);
    const btnY = p.y + p.h - btnH - pad;
    const btnW = p.w - pad * 2;

    if (isOwned) {
      const isEquipped = gameState.equippedWeaponId === itemId;

      this.drawModalButton(
        { x: p.x + pad, y: btnY, w: btnW, h: btnH },
        isEquipped ? "EQUIPPED" : "EQUIP",
        !isEquipped,
        () => gameState.equipWeapon(itemId)
      );

    } else {
      this.drawModalButton(
        { x: p.x + pad, y: btnY, w: btnW, h: btnH },
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

  getItemAnchor(itemId) {
    if (gameState.isOwned(itemId)) {
      return this.inventorySlots.find(s => s.itemId === itemId) || null;
    }
    const slot = CONFIG.SHOP.SLOTS.find(s => s.itemId === itemId);
    return slot ? this.slotToScreen(slot) : null;
  }

  mousePressed() {
    if (this.modalOpen) return;
    if (this.handleSystemClick()) return;
    if (this.isInputBlocked) return;

    let hitItem = false;

    for (const slot of CONFIG.SHOP.SLOTS) {
      if (!gameState.isOwned(slot.itemId) && this.inRect(mouseX, mouseY, this.slotToScreen(slot))) {
        gameState.selectedItemId = slot.itemId;
        hitItem = true;
        return;
      }
    }

    for (const slot of this.inventorySlots) {
      if (slot.itemId && this.inRect(mouseX, mouseY, slot)) {
        gameState.selectedItemId = slot.itemId;
        hitItem = true;
        return;
      }
    }

    if (!hitItem && gameState.selectedItemId) {
      const anchor = this.getItemAnchor(gameState.selectedItemId);
      const p = this.getInfoPanelRect(anchor);

      if (!this.inRect(mouseX, mouseY, p)) {
        gameState.selectedItemId = null;
      }
    }
  }

  getInfoPanelRect(anchor) {
    const w = this.tf.dw * 0.30;
    const h = this.tf.dh * 0.34;
    const pad = this.tf.dw * 0.02;

    let x = anchor.x + anchor.w + 12;
    let y = anchor.y - h * 0.15;

    if (x + w > this.tf.dx + this.tf.dw) x = anchor.x - 12 - w;
    x = constrain(x, this.tf.dx + pad, this.tf.dx + this.tf.dw - pad - w);
    y = constrain(y, this.tf.dy + pad, this.tf.dy + this.tf.dh - pad - h);

    return { x, y, w, h };
  }

  keyPressed() {
    if (this.handleExitInput()) return;
  }

  slotToScreen(slot) {
    return {
      x: this.tf.dx + slot.rx * this.tf.dw,
      y: this.tf.dy + slot.ry * this.tf.dh,
      w: slot.rw * this.tf.dw,
      h: slot.rh * this.tf.dh,
    };
  }

  drawItemSlot(r, itemId, isSelected, isEquipped = false) {
    const over = this.inRect(mouseX, mouseY, r);

    push();
    noStroke();
    fill(0, 0, 0, over ? 120 : 90);
    rect(r.x, r.y, r.w, r.h, 14);

    strokeWeight(3);
    if (isSelected) stroke(255, 200, 0);
    else if (isEquipped) stroke(0, 255, 200);
    else if (over) stroke(255);
    else stroke(160, 160, 160, 120);

    noFill();
    rect(r.x, r.y, r.w, r.h, 14);

    const item = gameState.getItemData(itemId);
    if (item) this.drawIcon(assets.getImg(item.id), r, 0.75);
    pop();
  }
}