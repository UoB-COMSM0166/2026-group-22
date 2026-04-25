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
    this.view = null;

    this.dialogue = new DialogueManager(CONFIG.CAMP.DIALOGUE);
    this.hintTriggered = false;
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
    super.onEnter()
    this.hintTriggered = false;

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
      this.dialogue.update();
      this.dialogue.draw(tf, this);
      cursor(this.inRect(mouseX, mouseY, this.dialogue.nextBtnRect) ? HAND : ARROW);
      return;
    }

    if (!gameState.campHintsDone && !this.hintTriggered) {
      this.showInstructions();
      this.hintTriggered = true;
    }

    if (sceneManager.instructions.isActive) {
      const target = sceneManager.instructions.getCurrentTarget();
      sceneManager.instructions.targetRect = this.hotspotToScreen(this.view.img, target);
    }

    this.renderInteractions(tf);
    this.drawSystemUI(tf, false, "difficulty");
  }

  showInstructions() {
    const d1 = this.view.hotspots.find(h => h.id === "door1");
    const d2 = this.view.hotspots.find(h => h.id === "door2");
    const shop = this.view.hotspots.find(h => h.id === "shop");
    const board = this.view.hotspots.find(h => h.id === "board");

    sceneManager.instructions.show([
      { msg: "Welcome! Step into Door 1 for your first trial.", target: d1 },
      { msg: "Door 2 is currently locked.", target: d2 },
      { msg: "Visit the shop to upgrade your gear.", target: shop },
      { msg: "Visit the hint board to see hints.", target: board }
    ]);
  }

  hotspotToScreen(img, hotspot) {
    if (!img || !hotspot) return null;

    const tf = this.getContainTransform(img);

    return {
      x: tf.dx + (hotspot.x / tf.iw) * tf.dw,
      y: tf.dy + (hotspot.y / tf.ih) * tf.dh,
      w: (hotspot.w / tf.iw) * tf.dw,
      h: (hotspot.h / tf.ih) * tf.dh
    };
  }

  renderInteractions(tf) {
    if (this.exitPromptActive || sceneManager.instructions.isActive) return;

    const imgPt = this.screenToImage(mouseX, mouseY, tf);
    const hovered = imgPt ? this.view.hotspots.find(hs => hs.contains(imgPt.x, imgPt.y)) : null;

    if (hovered && hovered.id?.startsWith("door")) {
      this.drawTooltip(hovered.label);
    }

    if (this.showHotspots) this.drawHotspotsOverlay(tf);

    if (hovered) {
      cursor(HAND);
    } else {
      const overBack = this.inRect(mouseX, mouseY, this.controls.backRect);
      const overSet = this.inRect(mouseX, mouseY, this.controls.settingsRect);

      if (!overBack && !overSet) {
        cursor(ARROW);
      }
    }
  }

  handleAction(action, val) {
    if (!gameState.campHintsDone) {
      gameState.campHintsDone = true;
      gameState.save();
    }

    if (action === "shop") sceneManager.switch("shop");
    if (action === "board") sceneManager.switch("board");
    if (action === "door") this.enterDoor(val);
  }

  mousePressed() {
    const tf = this.getContainTransform(this.view.img);

    if (this.handleSystemClick()) return;
    if (this.isInputBlocked) return;

    if (this.dialogue.isActive) {
      if (this.inRect(mouseX, mouseY, this.dialogue.nextBtnRect)) this.dialogue.advance();
      if (this.inRect(mouseX, mouseY, this.dialogue.skipBtnRect)) this.dialogue.skip();
      return;
    }

    const imgPt = this.screenToImage(mouseX, mouseY, tf);
    if (imgPt) {
      const hit = this.view.hotspots.find(hs => hs.contains(imgPt.x, imgPt.y));
      hit?.onClick();
    }
  }

  keyPressed() {
    if (this.handleExitInput()) {
      if (sceneManager.instructions.isActive) {
        sceneManager.instructions.hide();
      }
      return;
    }

    if (key === "h" || key === "H") this.showHotspots = !this.showHotspots;

    if (this.dialogue.isActive) {
      if (keyCode === ENTER || key === " ") this.dialogue.advance();
      if (key === "s" || key === "S") this.dialogue.skip();
      return;
    }
  }

  enterDoor(n) {
    const level = sceneManager.scenes["level"];
    if (level && level.buildLevel) {
      level.buildLevel(n);
      sceneManager.switch("level");
    }
  }

  drawTooltip(label) {
    push();
    textSize(22);
    textAlign(CENTER, CENTER);
    const x = constrain(mouseX, 20, width - 20);
    const y = constrain(mouseY - 28, 20, height - 20);
    stroke(0, 180); strokeWeight(6); fill(255);
    text(label, x, y);
    pop();
  }

  screenToImage(mx, my, tf) {
    if (mx < tf.dx || mx > tf.dx + tf.dw || my < tf.dy || my > tf.dy + tf.dh) return null;
    return {
      x: ((mx - tf.dx) / tf.dw) * tf.iw,
      y: ((my - tf.dy) / tf.dh) * tf.ih
    };
  }

  drawHotspotsOverlay(tf) {
    push();
    stroke(0, 255, 0);
    strokeWeight(2);
    noFill();
    for (const hs of this.view.hotspots) {
      const x = tf.dx + (hs.x / tf.iw) * tf.dw;
      const y = tf.dy + (hs.y / tf.ih) * tf.dh;
      rect(x, y, (hs.w / tf.iw) * tf.dw, (hs.h / tf.ih) * tf.dh);
    }
    pop();
  }
}