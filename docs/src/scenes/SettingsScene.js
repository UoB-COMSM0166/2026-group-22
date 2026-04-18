class SettingsScene extends BaseScene {
  constructor() {
    super();
    this.resetBtnRect = { x: 0, y: 0, w: 200, h: 50 };
  }

  onEnter() {
    console.log("Entering Settings...");
  }

  draw() {
    background(0);
    textAlign(CENTER, CENTER);

    fill(255);
    textSize(32);
    textFont(assets.getFont());
    text("SETTINGS", width / 2, height / 2 - 100);

    this.resetBtnRect.x = width / 2 - this.resetBtnRect.w / 2;
    this.resetBtnRect.y = height / 2 - this.resetBtnRect.h / 2;

    const isOver = this.inRect(mouseX, mouseY, this.resetBtnRect);

    stroke(255, 50);
    fill(isOver ? [150, 0, 0] : [100, 0, 0]); // Dark red normally, brighter on hover
    rect(this.resetBtnRect.x, this.resetBtnRect.y, this.resetBtnRect.w, this.resetBtnRect.h, 10);

    noStroke();
    fill(255);
    textSize(20);
    textFont('sans-serif');
    text("RESET ALL DATA", width / 2, height / 2);

    fill(150);
    textSize(14);
    text("(Warning: This deletes all coins and progress)", width / 2, height / 2 + 40);

    fill(200);
    text("Press ESC to return to Camp", width / 2, height / 2 + 100);

    cursor(isOver ? HAND : ARROW);
  }

  mousePressed() {
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
      sceneManager.switch("camp");
    }
  }
}