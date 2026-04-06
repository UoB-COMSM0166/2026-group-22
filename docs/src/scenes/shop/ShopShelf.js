// src/Shop/ShopShelf.js
class ShopShelf {
  constructor() {
    // Reference the global helpers directly
    this.ui = ShopUI;
    this.state = shopState;
  }

  // No need to pass variables anymore, the class knows where to look!
  draw() {
    // 1. Get the current transform for the background
    const tf = this.ui.getContainTransform(assets.getImg('shop_bg'));
    const selectedId = this.state.selectedItemId;

    for (const slot of SHOP_SLOTS) {
      // Don't show items Kirby already bought on the shelf
      if (this.state.isOwned(slot.itemId)) continue;

      const r = this.ui.slotRectToScreen(tf, slot);
      const over = this.ui.inRect(mouseX, mouseY, r);

      push();
      // Box styling
      noStroke();
      fill(0, 0, 0, over ? 120 : 90);
      rect(r.x, r.y, r.w, r.h, 14);

      // Border styling
      strokeWeight(3);
      if (selectedId === slot.itemId) {
        stroke(255, 200, 0); // Golden highlight for selection
      } else if (over) {
        stroke(255);
      } else {
        stroke(160, 160, 160, 120);
      }
      noFill();
      rect(r.x, r.y, r.w, r.h, 14);

      // Icon drawing
      const item = this.state.getItem(slot.itemId);
      const icon = item ? assets.getImg(item.iconKey) : null;
      if (icon) {
        this.ui.drawIconFit(icon, r, 0.80);
      }
      pop();
    }
  }

  // Renamed to handleMouse to match your ShopScene's mousePressed()
  handleMouse() {
    const tf = this.ui.getContainTransform(assets.getImg('shop_bg'));

    for (const slot of SHOP_SLOTS) {
      if (this.state.isOwned(slot.itemId)) continue;

      const r = this.ui.slotRectToScreen(tf, slot);
      if (this.ui.inRect(mouseX, mouseY, r)) {
        // Set the selection and open the buy modal
        this.state.selectedItemId = slot.itemId;
        
        // Access the BuyModel through the SceneManager's active scene
        // or a global reference if preferred.
        sceneManager.currentScene.buyModel.open();
        return true;
      }
    }
    return false;
  }
}