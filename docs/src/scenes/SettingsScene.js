class SettingsScene extends BaseScene {
  constructor() {
    super();
    this.resetBtnRect = { x: 0, y: 0, w: 200, h: 50 };

    const margin = 30;
    const s = 100; // Icon size
    this.backRect = { x: margin, y: margin, w: s, h: s };
    this.bgSnapshot = null;
    this.returnTo = "camp";
  }

  onEnter(data) {
    super.onEnter(data);
    if (data) {
      this.bgSnapshot = data.bg || null;
      this.returnTo = data.returnTo || "camp";
    }
  }

  draw() {
    if (this.bgSnapshot) {
      push();
      imageMode(CENTER);
      image(this.bgSnapshot, width / 2, height / 2);
      pop();
    } else {
      background(0);
    }

    fill(0, 180);
    rect(0, 0, width, height);

    this._drawBackArrow();

    textAlign(CENTER, CENTER);
    textFont(assets.getFont());

    fill(255);
    textSize(36);
    text("SETTINGS", width / 2, height / 2 - 120);

    this.resetBtnRect.x = width / 2 - this.resetBtnRect.w / 2;
    this.resetBtnRect.y = height / 2 - this.resetBtnRect.h / 2;

    const isOver = this.inRect(mouseX, mouseY, this.resetBtnRect);

    stroke(255, 50);
    fill(isOver ? [180, 20, 20, 220] : [120, 20, 20, 180]);
    rect(this.resetBtnRect.x, this.resetBtnRect.y, this.resetBtnRect.w, this.resetBtnRect.h, 10);

    noStroke();
    fill(255);
    textSize(20);
    textFont('sans-serif');
    text("RESET ALL DATA", width / 2, height / 2);

    fill(150);
    textSize(14);
    text("(Warning: This deletes all coins and progress)", width / 2, height / 2 + 40);

    fill(200, 150);
    text(`Press ESC to return to ${this.returnTo.toUpperCase()}`, width / 2, height / 2 + 120);

    cursor(isOver ? HAND : ARROW);
  }

  _drawBackArrow() {
    const img = assets.getImg('arrow_l');
    if (!img) return;

    const hovered = this.inRect(mouseX, mouseY, this.backRect);
    const clicking = hovered && mouseIsPressed;

    push();
    imageMode(CENTER);

    if (hovered) {
      cursor(HAND);
      tint(255, 255);
    } else {
      tint(255, 180);
    }

    let s = 1.0;
    if (clicking) s = 0.95;
    else if (hovered) s = 1.06;

    image(
      img,
      this.backRect.x + this.backRect.w / 2,
      this.backRect.y + this.backRect.h / 2,
      this.backRect.w * s,
      this.backRect.h * s
    );
    pop();
  }

  mousePressed() {
    if (this.inRect(mouseX, mouseY, this.backRect)) {
      sceneManager.switch(this.returnTo);
      return;
    }

    if (this.inRect(mouseX, mouseY, this.resetBtnRect)) {
      if (confirm("Are you sure you want to delete all save data?")) {
        gameState.resetRun();
        console.log("Data Reset complete.");
        sceneManager.switch("title");
      }
    }
  }

  keyPressed() {
    if (keyCode === ESCAPE) {
      sceneManager.switch(this.returnTo);
    }
  }
}