class BaseScene {
  constructor() {
    this.canvasActive = false;
    this.exitPromptActive = false;

    this.controls = new SystemControls(this);
  }

  inRect(px, py, r) {
    if (!r) return false;
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  getContainTransform(img) {
    if (!img) return { dx: 0, dy: 0, dw: width, dh: height };
    const canvasAspect = width / height;
    const imgAspect = img.width / img.height;
    let dw, dh;
    if (imgAspect > canvasAspect) {
      dw = width; dh = width / imgAspect;
    } else {
      dh = height; dw = height * imgAspect;
    }
    return { dx: (width - dw) / 2, dy: (height - dh) / 2, dw, dh, iw: img.width, ih: img.height };
  }

  drawIcon(img, rect, scale) {
    if (!img) return;
    const s = Math.min(rect.w * scale / img.width, rect.h * scale / img.height);
    push();
    imageMode(CENTER);
    image(img, rect.x + rect.w / 2, rect.y + rect.h / 2, img.width * s, img.height * s);
    pop();
  }

  drawModalButton(r, label, enabled, onClick) {
    const hover = this.inRect(mouseX, mouseY, r);

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

    if (enabled && hover && mouseIsPressed) {
      onClick();
      mouseIsPressed = false;
    }
  }

  drawSystemUI(tf = null, warnLoss = false, target = "camp") {
    this.controls.draw(tf);
    this.drawExitPrompt(target, warnLoss);
  }

  handleSystemClick() {
    return this.controls.handleClick();
  }

  drawExitPrompt(targetScene = "camp", warnLoss = false) {
    if (!this.exitPromptActive) return;

    if (!warnLoss) {
      this.exitPromptActive = false;
      sceneManager.switch(targetScene);
      return;
    }

    push();
    fill(0, 180);
    rect(0, 0, width, height);

    const w = 350;
    const h = warnLoss ? 200 : 160;
    const x = width / 2 - w / 2;
    const y = height / 2 - h / 2;

    fill(30, 30, 35, 240);
    stroke(255, 50);
    rect(x, y, w, h, 15);

    noStroke();
    textAlign(CENTER, CENTER);

    fill(255);
    textSize(18);
    const mainTextY = warnLoss ? y + h * 0.28 : y + h * 0.35;
    text("ARE YOU SURE YOU\nWANT TO EXIT?", width / 2, mainTextY);

    fill(255, 80, 80);
    textSize(13);
    text("WARNING: UNSAVED COINS WILL BE LOST!", width / 2, y + h * 0.52);

    const btnW = 100;
    const btnH = 40;
    const btnY = y + h - 55;

    this.drawModalButton(
      { x: width / 2 - btnW - 10, y: btnY, w: btnW, h: btnH },
      "YES", true,
      () => {
        this.exitPromptActive = false;
        sceneManager.switch(targetScene); //
      }
    );

    this.drawModalButton(
      { x: width / 2 + 10, y: btnY, w: btnW, h: btnH },
      "NO", true,
      () => this.exitPromptActive = false
    );
    pop();
  }

  handleExitInput() {
    if (keyCode === ESCAPE) {
      this.exitPromptActive = !this.exitPromptActive;
      return true;
    }
    return false;
  }

  get isInputBlocked() {
    return this.exitPromptActive || (sceneManager.instructions && sceneManager.instructions.isActive);
  }

  onEnter(data) {
    this.exitPromptActive = false;
  }

  onExit() {
    if (this.canvasActive) {
      resizeCanvas(windowWidth, windowHeight);
      this.canvasActive = false;
    }
  }

  update() { }
  draw() { }
  mousePressed() { }
  keyPressed() { }
}