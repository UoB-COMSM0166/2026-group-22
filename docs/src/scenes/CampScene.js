// src/scenes/CampScene.js

// Keep Hotspot as a helper class outside or as a property
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

class CampScene {
  constructor() {
    this.viewIndex = 0;
    this.showHotspots = false;
    this.picking = null;
    this.muted = false;

    this.views = [];
    this.assets = {
      arrowRight: null,
      arrowLeft: null,
      settings: null,
      sound: null
    };

    // Dialogue State
    this.dialogueActive = false;
    this.dialogueIndex = 0;
    this.nextBtnRect = null;

    this.INTRO_DIALOGUE = [
      "Signal connecting...",
      "Handshake complete.",
      "Welcome to the Isle.\nFour doors.\nFour rules.\nOne escape.",
      "The island does not sleep.\nIt watches.\nIt listens.",
      "The doors are not portals.\nThey are tests.",
      "Each door leads to a trial.\nEach trial rewrites you.",
      "Choose a path.\nBut understand this:",
      "Once you enter,\nyou will not return unchanged.",
      "Failure is not death.\nIt is memory.",
      "The fire is safe.\nFor now.",
      "When the doors awaken,\nthe rules begin.",
      "Proceed."
    ];
  }

  preload() {
    const imgTwoDoors  = loadImage("assets/camp_B.png");
    const imgFourDoors = loadImage("assets/camp_A.png");
    this.assets.arrowRight = loadImage("assets/arrow_right_transparent.png");
    this.assets.arrowLeft  = loadImage("assets/arrow_left_transparent.png");
    this.assets.settings   = loadImage("assets/icon_settings.png");
    this.assets.sound      = loadImage("assets/icon_sound.png");

    // Initialize views after images are requested
    this.views = [
      {
        name: "4 Doors",
        img: imgFourDoors,
        hotspots: [
          new Hotspot("shop",  "Camp Shop",  183, 286, 230, 250, () => this.openShop()),
          new Hotspot("board", "Board",      427, 473, 213, 148, () => this.openBoard()),
          new Hotspot("door1", "Door 1",     613, 308, 132, 127, () => this.enterDoor(1)),
          new Hotspot("door2", "Door 2",     788, 311, 113, 127, () => this.enterDoor(2)),
          new Hotspot("door3", "Door 3",     961, 314, 103, 127, () => this.enterDoor(3)),
          new Hotspot("door4", "Door 4",     1134, 311, 116, 146, () => this.enterDoor(4)),
        ],
      },
      {
        name: "2 Doors",
        img: imgTwoDoors,
        hotspots: [
          new Hotspot("shop",  "Camp Shop",  183, 286, 230, 250, () => this.openShop()),
          new Hotspot("board", "Board",      362, 521, 194, 84,  () => this.openBoard()),
          new Hotspot("door5", "Door 5",     583, 354, 178, 186, () => this.enterDoor(5)),
          new Hotspot("door6", "Door 6",     1002, 354, 173, 197, () => this.enterDoor(6)),
        ],
      },
    ];
  }

  onEnter() {
    if (window.GameState && window.GameState.campIntroDone) {
      this.dialogueActive = false;
      return;
    }
    this.dialogueActive = true;
    this.dialogueIndex = 0;
    if (window.GameState) window.GameState.campIntroDone = true;
  }

  draw() {
    background(0);

    const v = this.views[this.viewIndex];
    const tf = this.getContainTransform(v.img);
    image(v.img, tf.dx, tf.dy, tf.dw, tf.dh);

    let shouldPointer = false;

    if (this.dialogueActive) {
      this.drawDialogueOverlay(tf);
      if (this.nextBtnRect && this.inRect(mouseX, mouseY, this.nextBtnRect)) shouldPointer = true;
      cursor(shouldPointer ? HAND : ARROW);
      return;
    }

    // Hover Hotspots
    const imgPt = this.screenToImage(mouseX, mouseY, tf);
    let hovered = null;
    if (imgPt) {
      for (const hs of v.hotspots) {
        if (hs.contains(imgPt.x, imgPt.y)) { hovered = hs; break; }
      }
    }
    if (hovered) shouldPointer = true;

    // UI Rects
    const settingsR = this.getTopRightIconRect(tf, 1);
    const soundR    = this.getTopRightIconRect(tf, 0);

    if (this.inRect(mouseX, mouseY, settingsR)) shouldPointer = true;
    if (this.inRect(mouseX, mouseY, soundR)) shouldPointer = true;

    let nextArrowR = (this.viewIndex === 0) ? this.getTopRightIconRect(tf, 2) : null;
    let backArrowR = (this.viewIndex === 1) ? this.getTopLeftArrowRect(tf) : null;
    
    if (nextArrowR && this.inRect(mouseX, mouseY, nextArrowR)) shouldPointer = true;
    if (backArrowR && this.inRect(mouseX, mouseY, backArrowR)) shouldPointer = true;

    // Draw Icons
    if (nextArrowR) this.drawIconImage(this.assets.arrowRight, nextArrowR);
    if (backArrowR) this.drawIconImage(this.assets.arrowLeft, backArrowR);
    this.drawIconImage(this.assets.settings, settingsR, 0.88);
    this.drawIconImage(this.assets.sound, soundR, 0.92);

    if (hovered && hovered.id && hovered.id.startsWith("door")) {
      this.drawTooltip(hovered.label);
    }

    if (this.showHotspots) this.drawHotspotsOverlay(v, tf);

    cursor(shouldPointer ? HAND : ARROW);
  }

  mousePressed() {
    const v = this.views[this.viewIndex];
    const tf = this.getContainTransform(v.img);

    if (this.dialogueActive) {
      if (this.nextBtnRect && this.inRect(mouseX, mouseY, this.nextBtnRect)) {
        this.advanceDialogue();
      }
      return;
    }

    const settingsR = this.getTopRightIconRect(tf, 1);
    const soundR    = this.getTopRightIconRect(tf, 0);

    if (this.viewIndex === 0) {
      const nextR = this.getTopRightIconRect(tf, 2);
      if (this.inRect(mouseX, mouseY, nextR)) { this.viewIndex = 1; return; }
    } else {
      const backR = this.getTopLeftArrowRect(tf);
      if (this.inRect(mouseX, mouseY, backR)) { this.viewIndex = 0; return; }
    }

    if (this.inRect(mouseX, mouseY, settingsR)) { this.openSettings(); return; }
    if (this.inRect(mouseX, mouseY, soundR)) { this.toggleMute(); return; }

    const imgPt = this.screenToImage(mouseX, mouseY, tf);
    if (!imgPt) return;

    // Debugging picker
    if (keyIsDown(SHIFT)) {
      this.handlePicking(imgPt);
      return;
    }

    for (const hs of v.hotspots) {
      if (hs.contains(imgPt.x, imgPt.y)) { hs.onClick?.(); return; }
    }
  }

  keyPressed() {
    if (key === "h" || key === "H") this.showHotspots = !this.showHotspots;
    if (key === "Escape") this.picking = null;

    if (this.dialogueActive && (keyCode === ENTER || key === " ")) {
      this.advanceDialogue();
    }
  }

  /* =============================
     Scene Logic
     ============================= */

  advanceDialogue() {
    this.dialogueIndex++;
    if (this.dialogueIndex >= this.INTRO_DIALOGUE.length) {
      this.dialogueActive = false;
    }
  }

  openShop()      { sceneManager.switch("shop"); }
  openBoard()     { sceneManager.switch("board"); }
  openSettings()  { sceneManager.switch("settings"); }

  toggleMute() {
    this.muted = !this.muted;
    console.log("MUTED:", this.muted);
  }

  enterDoor(n) {
    if (n === 1) {
      const level = sceneManager.scenes["level"];
      if (level && level.buildLevel) {
        level.buildLevel(1);
        sceneManager.switch("level");
      }
    } else {
      console.log(`Door ${n} not implemented yet.`);
    }
  }

  /* =============================
     Drawing Helpers (UI Overlays)
     ============================= */

  drawDialogueOverlay(tf) {
    const pad = tf.dw * 0.03;
    const barH = tf.dh * 0.20;
    const x = tf.dx + pad;
    const y = tf.dy + tf.dh - pad - barH;
    const w = tf.dw - pad * 2;
    const h = barH;

    push();
    fill(0, 0, 0, 170);
    rect(x, y, w, h, 18);

    const msg = this.INTRO_DIALOGUE[Math.min(this.dialogueIndex, this.INTRO_DIALOGUE.length - 1)];
    const f = window.Assets?.plasdripFont;

    if (f) textFont(f);
    textAlign(CENTER, CENTER);
    textSize(Math.floor(h * 0.26));
    fill(170, 10, 10, 240);
    stroke(0); strokeWeight(6);
    text(msg, x + w / 2, y + h / 2);

    // Next Button
    const btnW = tf.dw * 0.10;
    const btnH = tf.dh * 0.075;
    const bx = tf.dx + tf.dw - pad - btnW;
    const by = tf.dy + tf.dh * 0.42;
    this.nextBtnRect = { x: bx, y: by, w: btnW, h: btnH };

    const over = this.inRect(mouseX, mouseY, this.nextBtnRect);
    fill(255, 255, 255, over ? 95 : 70);
    rect(bx, by, btnW, btnH, 12);
    
    fill(255); textSize(Math.floor(btnH * 0.48));
    text("NEXT", bx + btnW / 2, by + btnH / 2 + 2);
    pop();
  }

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

  /* =============================
     Coordinate & Layout Helpers
     ============================= */

  getContainTransform(img) {
    const canvasAspect = width / height;
    const imgAspect = img.width / img.height;
    let dw, dh;
    if (imgAspect > canvasAspect) { dw = width; dh = width / imgAspect; }
    else { dh = height; dw = height * imgAspect; }
    return { dx: (width - dw) / 2, dy: (height - dh) / 2, dw, dh, iw: img.width, ih: img.height };
  }

  screenToImage(mx, my, tf) {
    if (mx < tf.dx || mx > tf.dx + tf.dw || my < tf.dy || my > tf.dy + tf.dh) return null;
    return {
      x: ((mx - tf.dx) / tf.dw) * tf.iw,
      y: ((my - tf.dy) / tf.dh) * tf.ih
    };
  }

  inRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  getTopRightIconRect(tf, indexFromRight) {
    const s = tf.dw * 0.06, pad = tf.dw * 0.01;
    return { x: tf.dx + tf.dw - pad - s - indexFromRight * (s + pad), y: tf.dy + pad, w: s, h: s };
  }

  getTopLeftArrowRect(tf) {
    const s = tf.dw * 0.063, pad = tf.dw * 0.01;
    return { x: tf.dx + pad, y: tf.dy + pad, w: s, h: s };
  }

  handlePicking(pt) {
    if (!this.picking) {
      this.picking = { x: pt.x, y: pt.y };
      console.log("Pick start:", this.picking);
    } else {
      const x1 = Math.min(this.picking.x, pt.x);
      const y1 = Math.min(this.picking.y, pt.y);
      const x2 = Math.max(this.picking.x, pt.x);
      const y2 = Math.max(this.picking.y, pt.y);
      console.log(`RECT => x:${x1|0}, y:${y1|0}, w:${(x2-x1)|0}, h:${(y2-y1)|0}`);
      this.picking = null;
    }
  }

  drawHotspotsOverlay(v, tf) {
    push();
    stroke(0, 255, 0); strokeWeight(2); noFill();
    for (const hs of v.hotspots) {
      const x = tf.dx + (hs.x / tf.iw) * tf.dw;
      const y = tf.dy + (hs.y / tf.ih) * tf.dh;
      rect(x, y, (hs.w / tf.iw) * tf.dw, (hs.h / tf.ih) * tf.dh);
    }
    pop();
  }
}