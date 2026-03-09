// Shop.js
// Shop class only (scene controller)

class Shop {
  constructor(state, assets, ui) {
    this.state = state;
    this.assets = assets;
    this.ui = ui;

    this.selectedItemId = null;
    this.showBuyModal = false;
  }

  onEnter() {
    this.state.load();
    this.selectedItemId = null;
    this.showBuyModal = false;
  }

  draw() {
    background(0);

    const tf = this.ui.getContainTransform(this.assets.bgImg);
    image(this.assets.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    cursor("default");

    this.ui.drawClose(tf);
    this.ui.drawCoins(tf, this.state.coins);

    const invHover = this.ui.inventoryBar.draw(tf, this.state);
    const shelfHover = this.ui.shelf.draw(tf, this.state, this.selectedItemId);

    if (this.selectedItemId) {
      const anchor = this.ui.getItemAnchorRect(tf, this.selectedItemId, this.state);
      if (anchor) this.ui.infoPanel.draw(tf, anchor, this.selectedItemId, this.state);
    }

    if (this.showBuyModal && this.selectedItemId) {
      this.ui.buyModal.draw(tf, this.selectedItemId, this.state);
    }


    // Hints
    this.ui.drawActionHint(tf, this.selectedItemId);
    this.ui.drawEscHint(tf);
  }

mousePressed() {
  const tf = this.ui.getContainTransform(this.assets.bgImg);

  // 1) Buy modal
  if (this.showBuyModal && this.selectedItemId) {
    const modalHit = this.ui.buyModal.hitTest(mouseX, mouseY);

    if (modalHit === "buy") {
      const ok = this.state.buy(this.selectedItemId);
      if (ok) this.showBuyModal = false;
      return;
    }

    if (modalHit === "cancel" || modalHit === "outside") {
      this.showBuyModal = false;
      return;
    }
  }

  // 2) Close
  if (this.ui.isCloseClicked(tf, mouseX, mouseY)) {
    switchScene("camp");
    return;
  }

  // 3) Info panel buttons
  const infoAction = this.ui.infoPanel.hitTest(mouseX, mouseY);
  if (infoAction && this.selectedItemId) {
    if (infoAction === "equip") {
      this.state.equip(this.selectedItemId);
    }

    if (infoAction === "sell") {
      this.state.sell(this.selectedItemId);
      if (!this.state.isOwned(this.selectedItemId)) {
        this.selectedItemId = null;
      }
    }
    return;
  }

  // 4) Inventory click -> select item
  const invHit = this.ui.inventoryBar.hitTest(mouseX, mouseY);
  if (invHit) {
    this.selectedItemId = invHit;
    this.showBuyModal = false;
    return;
  }

  // 5) Shelf click -> select + open buy modal
  const shelfHit = this.ui.shelf.hitTest(tf, mouseX, mouseY, this.state);
  if (shelfHit) {
    this.selectedItemId = shelfHit;
    this.showBuyModal = true;
    return;
  }

  // 6) Blank area
  this.selectedItemId = null;
}


  keyPressed() {
    if (key === "Escape" || keyCode === ESCAPE) {
      if (this.showBuyModal) { this.showBuyModal = false; return; }
      if (this.selectedItemId) { this.selectedItemId = null; return; }
      switchScene("camp");
      return;
    }

    // Optional: reset shop
    if (key === "r" || key === "R") {
      this.state.reset();
      this.selectedItemId = null;
      this.showBuyModal = false;
    }
  }
}
