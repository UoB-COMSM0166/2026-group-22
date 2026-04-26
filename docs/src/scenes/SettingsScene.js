class SettingsScene extends BaseScene {
  constructor() {
    super();

    this.resetBtnRect = { x: 0, y: 0, w: 220, h: 55 };
    this.hintBtnRect = { x: 0, y: 0, w: 220, h: 55 };
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
    let tf;
    const isGameplay = (this.returnTo === "level" || this.returnTo === "boss");

    if (isGameplay) {
      const scale = Math.min(1, width / 800, height / 600);
      const dw = 800 * scale;
      const dh = 600 * scale;
      tf = { dx: (width - dw) / 2, dy: (height - dh) / 2, dw: dw, dh: dh };
    } else {
      tf = { dx: 0, dy: 0, dw: width, dh: height };
    }

    if (this.bgSnapshot) {
      push();
      imageMode(CENTER);
      if (isGameplay) {
        image(this.bgSnapshot, width / 2, height / 2, tf.dw, tf.dh);
      } else {
        const imgTf = this.getContainTransform(this.bgSnapshot);
        image(this.bgSnapshot, width / 2, height / 2, imgTf.dw, imgTf.dh);
      }
      pop();
    } else {
      background(0);
    }
    fill(0, 180);
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);
    textFont(assets.getFont());
    fill(255);
    textSize(isGameplay ? tf.dh * 0.07 : 36);

    const centerY = isGameplay ? tf.dy + tf.dh / 2 : height / 2;
    text("SETTINGS", width / 2, centerY - (isGameplay ? tf.dh * 0.25 : 120));

    const btnW = isGameplay ? tf.dw * 0.28 : 220;
    const btnH = isGameplay ? tf.dh * 0.08 : 55;

    this.hintBtnRect = { x: width / 2 - btnW / 2, y: centerY - btnH - 10, w: btnW, h: btnH };
    this.resetBtnRect = { x: width / 2 - btnW / 2, y: centerY + 10, w: btnW, h: btnH };

    textFont('sans-serif');

    this.drawModalButton(this.hintBtnRect, "HINT BOARD", true, () => {
      sceneManager.switch("board", {
        bg: this.bgSnapshot,
        returnTo: this.returnTo
      });
    });

    this.drawModalButton(this.resetBtnRect, "RESET ALL DATA", true, () => {
      if (confirm("Are you sure you want to delete all save data?")) {
        gameState.resetRun();
        sceneManager.switch("title");
      }
    });

    noStroke();
    fill(150);
    textSize(isGameplay ? tf.dh * 0.025 : 14);
    text("(Warning: This deletes all coins and progress)", width / 2, this.resetBtnRect.y + this.resetBtnRect.h + 20);
    fill(200, 150);
    text(`Press ESC to return to ${this.returnTo.toUpperCase()}`, width / 2, centerY + (isGameplay ? tf.dh * 0.35 : 120));

    this.drawSystemUI(tf, false, this.returnTo);
  }

  mousePressed() {
    this.handleSystemClick();
  }

  keyPressed() {
    this.handleExitInput();
  }
}