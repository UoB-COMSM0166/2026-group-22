// src/scenes/HintBoardScene.js
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

  preload() {
    // If you have a board background image, load it here
    // this.boardImg = loadImage("assets/board_bg.png");
  }

  setup() {
    // One-time setup
  }

  onEnter() {
    console.log("Reading the Hint Board...");
  }

  draw() {
    // Darken the background slightly so the board stands out
    background(0, 0, 0, 200);

    // Draw a simple board panel
    const boardW = width * 0.8;
    const boardH = height * 0.7;
    const bx = (width - boardW) / 2;
    const by = (height - boardH) / 2;

    // Board Frame
    fill(60, 40, 20); // Dark brown wood
    rect(bx - 10, by - 10, boardW + 20, boardH + 20, 10);

    // Paper Surface
    fill(245, 230, 200); // Old paper color
    rect(bx, by, boardW, boardH, 5);

    // Title
    push();
    fill(40, 20, 0);
    textFont(assets.getFont());
    textAlign(CENTER, TOP);
    textSize(42);
    text("HINT BOARD", width / 2, by + 40);

    // Draw Hints
    textAlign(LEFT, TOP);
    textSize(22);
    let startY = by + 120;
    for (let i = 0; i < this.hints.length; i++) {
      text(`${i + 1}. ${this.hints[i]}`, bx + 50, startY + (i * 45));
    }
    pop();

    // Footer
    textAlign(CENTER, BOTTOM);
    textSize(18);
    fill(100, 50, 0);
    text("Press ESC to return to Camp", width / 2, by + boardH - 30);

    cursor("default");
  }

  mousePressed() {
    // Maybe allow clicking a "Close" button later
  }

  keyPressed() {
    if (keyCode === ESCAPE) {
      sceneManager.switch("camp");
    }
  }
}