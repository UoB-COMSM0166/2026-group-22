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

    // Inventory
    const invHover = this.ui.drawInventoryBar(tf, this.state);
    if (invHover) cursor("pointer");

    // Shelf (unowned only)
    const shelfHover = this.ui.drawShelf(tf, this.state, this.selectedItemId);
    if (shelfHover) cursor("pointer");

    // Hints
    this.ui.drawActionHint(tf, this.selectedItemId);
    this.ui.drawEscHint(tf);

    // Info panel follows anchor (shelf if unowned, inv if owned)
    if (this.selectedItemId) {
      const anchor = this.ui.getItemAnchorRect(tf, this.selectedItemId, this.state);
      if (anchor) this.ui.drawInfoPanel(tf, anchor, this.selectedItemId, this.state);
    }

    // Buy modal
    if (this.showBuyModal && this.selectedItemId) {
      this.ui.drawBuyModal(tf, this.selectedItemId, this.state);
    }
  }

  mousePressed() {
    const tf = this.ui.getContainTransform(this.assets.bgImg);

    // 1) Buy modal
    if (this.showBuyModal && this.selectedItemId) {
      const hit = this.ui.hitTestBuyModal(mouseX, mouseY);
      if (hit === "buy") {
        const ok = this.state.buy(this.selectedItemId);
        if (ok) this.showBuyModal = false;
        return;
      }
      if (hit === "cancel" || hit === "outside") {
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
    const infoAction = this.ui.hitTestInfoPanel(mouseX, mouseY);
    if (infoAction && this.selectedItemId) {
      if (infoAction === "equip") this.state.equip(this.selectedItemId);
      if (infoAction === "sell") {
        this.state.sell(this.selectedItemId);
        if (!this.state.isOwned(this.selectedItemId)) this.selectedItemId = null;
      }
      return;
    }

    // 4) Inventory click -> select item (show info)
    const invHit = this.ui.hitTestInventory(mouseX, mouseY);
    if (invHit) {
      this.selectedItemId = invHit;
      this.showBuyModal = false;
      return;
    }

    // 5) Shelf click -> select + open buy modal
    const shelfHit = this.ui.hitTestShelf(tf, mouseX, mouseY, this.state);
    if (shelfHit) {
      this.selectedItemId = shelfHit;
      this.showBuyModal = true;
      return;
    }

    // 6) blank
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
