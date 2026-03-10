// ShopBuyModal.js
// Draw buy modal and handle modal hit test

class ShopBuyModel {
  constructor(ui) {
    this.ui = ui;
    this.buyBtnRect = null;
    this.cancelBtnRect = null;
  }

  draw(tf, itemId, state) {
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

  hitTest(mx, my) {
    if (this.buyBtnRect && this.ui.inRect(mx, my, this.buyBtnRect)) return "buy";
    if (this.cancelBtnRect && this.ui.inRect(mx, my, this.cancelBtnRect)) return "cancel";
    return "outside";
  }
}
