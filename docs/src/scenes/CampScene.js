// src/scenes/CampScene.js
class Hotspot {
  constructor(id, label, x, y, w, h, onClick) {
    this.id = id; this.label = label;
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.onClick = onClick;
  }
  contains(ix, iy) {
    return ix >= this.x && ix <= this.x + this.w && iy >= this.y && iy <= this.y + this.h;
  }
}

class CampScene extends BaseScene {
  constructor() {
    super();
    this.showHotspots = false;
    this.muted = false;
    this.view = null;

    this.assets = {
      settings: assets.getImg('icon_set'),
      sound: assets.getImg('icon_snd')
    };

    this.uiButtons = [
      { id: "sound", icon: 'sound', idx: 0, action: () => this.muted = !this.muted },
      { id: "settings", icon: 'settings', idx: 1, action: () => sceneManager.switch("settings") },
    ];

    this.dialogue = new DialogueManager(CONFIG.CAMP.DIALOGUE);
  }

  preload() {
    const viewData = CONFIG.CAMP.VIEWS[0];
    this.view = {
      ...viewData,
      img: assets.getImg(viewData.imgKey),
      hotspots: viewData.hotspots.map(h =>
        new Hotspot(h.id, h.label, h.x, h.y, h.w, h.h, () => this.handleAction(h.action, h.val))
      )
    };
  }

  onEnter() {
    if (!gameState.campIntroDone) {
      this.dialogue.start();
      gameState.campIntroDone = true;
      gameState.save();
    }
  }

  draw() {
    background(0);
    const tf = this.getContainTransform(this.view.img);
    image(this.view.img, tf.dx, tf.dy, tf.dw, tf.dh);

    if (this.dialogue.isActive) {
      this.dialogue.update(); // Even if empty, keeps the pattern clean
      this.dialogue.draw(tf, this);
      cursor(this.inRect(mouseX, mouseY, this.dialogue.nextBtnRect) ? HAND : ARROW);
      return;
    }

    this.renderInteractions(tf);
    this.renderUI(tf);
  }

  renderInteractions(tf) {
    const imgPt = this.screenToImage(mouseX, mouseY, tf);
    const hovered = imgPt ? this.view.hotspots.find(hs => hs.contains(imgPt.x, imgPt.y)) : null;

    if (hovered && hovered.id?.startsWith("door")) {
      this.drawTooltip(hovered.label);
    }

    if (this.showHotspots) this.drawHotspotsOverlay(tf);
    cursor(hovered ? HAND : ARROW);
  }

  renderUI(tf) {
    this.uiButtons.forEach(btn => {
      const r = this.getTopRightIconRect(tf, btn.idx);
      this.drawIconImage(this.assets[btn.icon], r, btn.id === 'settings' ? 0.88 : 0.92);

      // Unified Hover Logic
      if (this.inRect(mouseX, mouseY, r)) cursor(HAND);
    });
  }

  handleAction(action, val) {
    if (action === "shop") sceneManager.switch("shop");
    if (action === "board") sceneManager.switch("board");
    if (action === "door") this.enterDoor(val);
  }

  mousePressed() {
    const tf = this.getContainTransform(this.view.img);

    if (this.dialogue.isActive) {
      if (this.inRect(mouseX, mouseY, this.dialogue.nextBtnRect)) this.dialogue.advance();
      if (this.inRect(mouseX, mouseY, this.dialogue.skipBtnRect)) this.dialogue.skip();
      return;
    }

    // UI Clicks
    for (const btn of this.uiButtons) {
      const r = this.getTopRightIconRect(tf, btn.idx);
      if (this.inRect(mouseX, mouseY, r)) {
        btn.action();
        return; // Stop checking once a button is clicked
      }
    }

    // Hotspot Clicks
    const imgPt = this.screenToImage(mouseX, mouseY, tf);
    if (imgPt) {
      const hit = this.view.hotspots.find(hs => hs.contains(imgPt.x, imgPt.y));
      hit?.onClick();
    }
  }

  keyPressed() {
    if (key === "h" || key === "H") this.showHotspots = !this.showHotspots;
    if (key === "Escape") this.picking = null;

    if (this.dialogue.isActive) {
      if (keyCode === ENTER || key === " ") this.dialogue.advance();
      if (key === "s" || key === "S") this.dialogue.skip();
      return;
    }
  }

  /* =============================
     Scene Logic
     ============================= */

  toggleMute() {
    this.muted = !this.muted;
    console.log("MUTED:", this.muted);
  }

  enterDoor(n) {
    const level = sceneManager.scenes["level"];
    if (level && level.buildLevel) {
      level.buildLevel(n);
      sceneManager.switch("level");
    }
  }

  /* =============================
     Drawing Helpers (UI Overlays)
     ============================= */

  drawTooltip(label) {
    push();
    textSize(22); textAlign(CENTER, CENTER);
    const x = constrain(mouseX, 20, width - 20);
    const y = constrain(mouseY - 28, 20, height - 20);
    stroke(0, 180); strokeWeight(6); fill(255);
    text(label, x, y);
    pop();
  }

  drawIconImage(img, r, scaleFactor = 1.0) {
    const over = this.inRect(mouseX, mouseY, r);
    push();
    imageMode(CENTER);
    const s = (over ? 1.06 : 1.0) * scaleFactor;
    image(img, r.x + r.w / 2, r.y + r.h / 2, r.w * s, r.h * s);
    pop();
  }

  screenToImage(mx, my, tf) {
    if (mx < tf.dx || mx > tf.dx + tf.dw || my < tf.dy || my > tf.dy + tf.dh) return null;
    return {
      x: ((mx - tf.dx) / tf.dw) * tf.iw,
      y: ((my - tf.dy) / tf.dh) * tf.ih
    };
  }

  getTopRightIconRect(tf, indexFromRight) {
    const s = tf.dw * 0.06, pad = tf.dw * 0.01;
    return { x: tf.dx + tf.dw - pad - s - indexFromRight * (s + pad), y: tf.dy + pad, w: s, h: s };
  }

  drawHotspotsOverlay(tf) {
    push();
    stroke(0, 255, 0); strokeWeight(2); noFill();
    for (const hs of this.view.hotspots) {
      const x = tf.dx + (hs.x / tf.iw) * tf.dw;
      const y = tf.dy + (hs.y / tf.ih) * tf.dh;
      rect(x, y, (hs.w / tf.iw) * tf.dw, (hs.h / tf.ih) * tf.dh);
    }
    pop();
  }
}