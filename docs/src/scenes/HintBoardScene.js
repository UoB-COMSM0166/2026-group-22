class HintBoardScene extends BaseScene {
  constructor() {
    super();
    this.hints = [
      "Click the door to enter into different 4 levels.",
      "Use setting button to pause the game or reset your progress.",
      "Collect more coins and buy more powerful weapons to pass harder levels.",
      "You can only equip one weapon each time, and you can't change it within the level.",
      "Within the level, you will lose HP if you fall off the platforms, or get attacked by enemies, or bosses.",
      "Once you lose all your heart, you will be respawned at the start of the level.",
      "Power-up items with powerful skills are provided within levels to pass some challenging areas.",
      "At the end of each level, you will face various bosses, and you need to beat them",
      "You will NOT receive coins if you can't pass the boss fight."
    ];
    this.bgSnapshot = null;
    this.returnTo = "camp";
  }

  setup() { }

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
    }
    fill(0, 180);
    rect(0, 0, width, height);

    const tf = this.getContainTransform({ width: 1000, height: 750 });

    fill(45, 30, 15);
    rect(tf.dx - 8, tf.dy - 8, tf.dw + 16, tf.dh + 16, 12);
    fill(240, 225, 190);
    rect(tf.dx, tf.dy, tf.dw, tf.dh, 8);

    push();
    fill(60, 30, 0);
    textFont(assets.getFont());
    textAlign(CENTER, TOP);

    textSize(tf.dh * 0.07);
    text("HINT BOARD", width / 2, tf.dy + tf.dh * 0.05);

    textAlign(LEFT, TOP);
    const pad = tf.dw * 0.06;
    const wrapWidth = tf.dw - pad * 2;

    const contentAreaHeight = tf.dh * 0.65;
    const idealSize = tf.dh * 0.035;
    const constrainedSize = contentAreaHeight / (this.hints.length * 2.2);

    textSize(Math.min(idealSize, constrainedSize));
    textLeading(textSize() * 1.3);

    let currentY = tf.dy + tf.dh * 0.16;

    for (let i = 0; i < this.hints.length; i++) {
      const msg = `${i + 1}. ${this.hints[i]}`;
      text(msg, tf.dx + pad, currentY, wrapWidth);

      const charCount = msg.length;
      const charsPerLine = wrapWidth / (textSize() * 0.5);
      const estimatedLines = Math.ceil(charCount / charsPerLine);

      currentY += (estimatedLines * textLeading()) + (tf.dh * 0.015);
    }
    pop();

    this.drawSystemUI(tf, false, this.returnTo);
  }

  mousePressed() {
    if (this.handleSystemClick()) return;
  }

  keyPressed() {
    if (this.handleExitInput()) return;
  }
}