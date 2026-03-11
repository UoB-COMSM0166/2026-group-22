// src/Shop/ShopBuyModel.js
class ShopBuyModel {
  constructor() {
    this.ui = ShopUI;
    this.state = shopState;
    
    this.isOpen = false;
    this.buyBtnRect = null;
    this.cancelBtnRect = null;
  }

  open() { this.isOpen = true; }
  close() { this.isOpen = false; }

  draw() {
    // Only proceed if an item is selected and the modal is open
    const itemId = this.state.selectedItemId;
    const item = this.state.getItem(itemId);
    if (!item || !this.isOpen) return;

    // Get the transform for scaling math
    const tf = this.ui.getContainTransform(shopAssets.bgImg);

    push();
    // 1. Full-screen dark overlay
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // 2. Modal Box Dimensions
    const boxW = Math.min(tf.dw * 0.55, 560);
    const boxH = Math.min(tf.dh * 0.32, 260);
    const boxX = width / 2 - boxW / 2;
    const boxY = height / 2 - boxH / 2;

    // 3. Main Panel
    fill(25, 25, 28, 245);
    stroke(255, 255, 255, 40);
    strokeWeight(1);
    rect(boxX, boxY, boxW, boxH, 18);

    // 4. Content Text
    textAlign(CENTER, CENTER);
    noStroke();
    
    // Title
    fill(255);
    if (window.Assets?.plasdripFont) textFont(window.Assets.plasdripFont);
    textSize(Math.max(22, Math.floor(boxH * 0.16)));
    text("PURCHASE ITEM?", boxX + boxW / 2, boxY + boxH * 0.22);

    // Item Details
    textFont('sans-serif');
    fill(220);
    textSize(Math.max(16, Math.floor(boxH * 0.11)));
    text(`${item.name} — ${item.price} coins`, boxX + boxW / 2, boxY + boxH * 0.46);

    // Affordability Logic
    const afford = this.state.coins >= item.price;
    const tip = afford ? "Confirm selection to proceed." : "Insufficient funds.";
    fill(afford ? 180 : [200, 50, 50]); 
    textSize(Math.max(13, Math.floor(boxH * 0.09)));
    text(tip, boxX + boxW / 2, boxY + boxH * 0.60);

    // 5. Button Layout
    const btnW = boxW * 0.30;
    const btnH = boxH * 0.20;
    const gap = boxW * 0.08;

    this.buyBtnRect = {
      x: boxX + boxW / 2 - gap / 2 - btnW,
      y: boxY + boxH * 0.72,
      w: btnW,
      h: btnH,
    };

    this.cancelBtnRect = {
      x: boxX + boxW / 2 + gap / 2,
      y: boxY + boxH * 0.72,
      w: btnW,
      h: btnH,
    };

    // 6. Render Buttons via ShopUI helper
    this.ui.drawModalButton(
      this.buyBtnRect,
      "BUY",
      this.ui.inRect(mouseX, mouseY, this.buyBtnRect),
      afford
    );

    this.ui.drawModalButton(
      this.cancelBtnRect,
      "CANCEL",
      this.ui.inRect(mouseX, mouseY, this.cancelBtnRect),
      true
    );

    pop();
  }

  handleMouse() {
    if (!this.isOpen) return false;

    // Check Buy Button
    if (this.buyBtnRect && this.ui.inRect(mouseX, mouseY, this.buyBtnRect)) {
      const ok = this.state.buy(this.state.selectedItemId);
      if (ok) {
        console.log("[Shop] Purchase successful!");
        this.close();
      }
      return true;
    }

    // Check Cancel Button
    if (this.cancelBtnRect && this.ui.inRect(mouseX, mouseY, this.cancelBtnRect)) {
      this.close();
      return true;
    }

    // Optional: Click outside box to close
    return true; // Return true to block clicks to layers underneath
  }
}