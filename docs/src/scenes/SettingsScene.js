class SettingsScene extends BaseScene {
  constructor() {
    super();

    this.resetBtnRect = { x: 0, y: 0, w: 200, h: 50 };
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

    textAlign(CENTER, CENTER);
    textFont(assets.getFont());
    fill(255);
    textSize(36);
    text("SETTINGS", width / 2, height / 2 - 120);

    this.resetBtnRect.x = width / 2 - this.resetBtnRect.w / 2;
    this.resetBtnRect.y = height / 2 - this.resetBtnRect.h / 2;

    textFont('sans-serif');

    this.drawModalButton(this.resetBtnRect, "RESET ALL DATA", true, () => {
      if (confirm("Are you sure you want to delete all save data?")) {
        gameState.resetRun();
        sceneManager.switch("title");
      }
    });

    noStroke();
    fill(150);
    textSize(14);
    text("(Warning: This deletes all coins and progress)", width / 2, height / 2 + 45);
    fill(200, 150);
    text(`Press ESC to return to ${this.returnTo.toUpperCase()}`, width / 2, height / 2 + 120);

    const tf = { dx: 0, dy: 0, dw: width, dh: height };
    this.drawSystemUI(tf, false, this.returnTo);
  }

  mousePressed() {
    this.handleSystemClick();
  }

  keyPressed() {
    this.handleExitInput();
  }
}