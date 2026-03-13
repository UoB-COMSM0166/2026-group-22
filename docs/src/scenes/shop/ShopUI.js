class ShopUI {
  // 1. Calculate the background scaling (Contain fit)
  static getContainTransform(img) {
    if (!img || img.width === 0) return { dx: 0, dy: 0, dw: width, dh: height, s: 1 };
    const s = Math.min(width / img.width, height / img.height);
    const dw = img.width * s;
    const dh = img.height * s;
    return {
      dx: (width - dw) / 2,
      dy: (height - dh) / 2,
      dw: dw,
      dh: dh,
      s: s
    };
  }

  // 2. Determine where the InfoPanel should "float" next to an item
  static getItemAnchorRect(tf, itemId, state) {
    // If owned, look for it in the inventory bar instance
    if (state.isOwned(itemId)) {
      const bar = sceneManager.currentScene.inventoryBar;
      return bar ? bar.getItemRect(itemId) : null;
    }
    // Otherwise, find its slot on the shelf
    const slot = SHOP_SLOTS.find((s) => s.itemId === itemId);
    return slot ? this.slotRectToScreen(tf, slot) : null;
  }

  // 3. Collision detection helper
  static inRect(px, py, r) {
    if (!r) return false;
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  // 4. Transform relative (0.0 - 1.0) coords to screen pixels
  static slotRectToScreen(tf, slot) {
    return {
      x: tf.dx + slot.rx * tf.dw,
      y: tf.dy + slot.ry * tf.dh,
      w: slot.rw * tf.dw,
      h: slot.rh * tf.dh,
    };
  }

  // 5. THE MISSING FUNCTION: Draw an icon scaled to fit a box
  static drawIconFit(img, rect, scale = 0.78) {
    if (!img) return;

    const maxW = rect.w * scale;
    const maxH = rect.h * scale;

    const s = Math.min(maxW / img.width, maxH / img.height);
    const dw = img.width * s;
    const dh = img.height * s;

    push();
    imageMode(CENTER);
    image(img, rect.x + rect.w / 2, rect.y + rect.h / 2, dw, dh);
    pop();
  }

  // 6. Styled button for Modals/Panels
  static drawModalButton(r, label, hover, enabled) {
    push();
    const alpha = enabled ? (hover ? 200 : 140) : 60;
    
    noStroke();
    fill(40, 40, 45, alpha);
    rect(r.x, r.y, r.w, r.h, 10);

    stroke(255, enabled ? (hover ? 255 : 150) : 50);
    strokeWeight(hover ? 3 : 1.5);
    noFill();
    rect(r.x, r.y, r.w, r.h, 10);

    noStroke();
    fill(enabled ? 255 : 100);
    textAlign(CENTER, CENTER);
    textSize(Math.max(12, r.h * 0.45));
    text(label, r.x + r.w / 2, r.y + r.h / 2);
    pop();
  }

  // 7. Coin balance display
  static drawHeader(coins) {
    push();
    fill(0, 0, 0, 180);
    rect(20, 20, 180, 50, 10);
    
    fill(255, 215, 0);
    textAlign(LEFT, CENTER);
    textSize(22);
    text(`$ ${coins}`, 40, 45);
    pop();
  }

  // 8. The "X" button
  static drawCloseButton(tf) {
    const size = tf.dw * 0.04;
    const r = {
      x: tf.dx + tf.dw - size - 20,
      y: tf.dy + 20,
      w: size,
      h: size
    };

    const over = this.inRect(mouseX, mouseY, r);
    push();
    stroke(over ? [255, 50, 50] : 255);
    strokeWeight(4);
    line(r.x, r.y, r.x + r.w, r.y + r.h);
    line(r.x + r.w, r.y, r.x, r.y + r.h);
    pop();
    
    return r;
  }

  // 9. Navigation Hint
  static drawEscHint(tf) {
    push();
    const pad = tf.dw * 0.02;
    textAlign(LEFT, BOTTOM);
    textSize(Math.max(14, tf.dh * 0.028));
    fill(255, 180);
    text("Press ESC to return", tf.dx + pad, tf.dy + tf.dh - pad);
    pop();
  }
}