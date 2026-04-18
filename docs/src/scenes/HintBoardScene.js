class HintBoardScene extends BaseScene {
  constructor() {
    super();
    this.hints = [
      "Hint 1: Kirby can float by holding SPACE!",
      "Hint 2: Watch out for holes between platforms.",
      "Hint 3: Use Jump Boosters to reach higher areas.",
      "Hint 4: Collect coins to spend in the Camp Shop."
    ];
  }

  setup() { }

  onEnter() { }

  draw() {
    background(0, 0, 0, 200);

    const boardW = width * 0.8;
    const boardH = height * 0.7;
    const bx = (width - boardW) / 2;
    const by = (height - boardH) / 2;

    fill(60, 40, 20);
    rect(bx - 10, by - 10, boardW + 20, boardH + 20, 10);

    fill(245, 230, 200);
    rect(bx, by, boardW, boardH, 5);

    push();
    fill(40, 20, 0);
    textFont(assets.getFont());
    textAlign(CENTER, TOP);
    textSize(42);
    text("HINT BOARD", width / 2, by + 40);

    textAlign(LEFT, TOP);
    textSize(22);
    let startY = by + 120;
    for (let i = 0; i < this.hints.length; i++) {
      text(`${i + 1}. ${this.hints[i]}`, bx + 50, startY + (i * 45));
    }
    pop();

    textAlign(CENTER, BOTTOM);
    textSize(18);
    fill(100, 50, 0);
    text("Press ESC to return to Camp", width / 2, by + boardH - 30);

    cursor("default");
  }

  mousePressed() { }

  keyPressed() {
    if (keyCode === ESCAPE) {
      sceneManager.switch("camp");
    }
  }
}