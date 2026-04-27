class DiffSelectScene extends BaseScene {
  constructor() {
    super();
    this.bgImg = assets.getImg('difficult_select_bg');
    this.easyImg = assets.getImg('easy_btn');
    this.diffImg = assets.getImg('difficult_btn');
  }

  draw() {
    background(0);
    const tf = this.getContainTransform(this.bgImg);
    image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    const buttons = this.getDifficultyButtons(tf);

    const overEasy = this.inRect(mouseX, mouseY, buttons.easy);
    const overDiff = this.inRect(mouseX, mouseY, buttons.difficult);

    const scaleEasy = overEasy ? 1.05 : 1.0;
    const scaleDiff = overDiff ? 1.05 : 1.0;

    this.drawIcon(this.easyImg, buttons.easy, scaleEasy); //
    this.drawIcon(this.diffImg, buttons.difficult, scaleDiff); //

    cursor((overEasy || overDiff) ? "pointer" : "default");
    this.drawSystemUI(tf, false, "select");
  }

  showInstructions() {
    sceneManager.instructions.show([
      { msg: "Select your challenge level." },
      { msg: "DIFFICULT mode increases boss HP and damage." },
      { msg: "Choose wisely; you cannot change this during the run." }
    ]);
  }

  getDifficultyButtons(tf) {
    const btnSize = tf.dw * 0.28;
    const centerY = tf.dy + tf.dh * 0.55;

    return {
      easy: {
        x: tf.dx + tf.dw * 0.32 - btnSize / 2,
        y: centerY - btnSize / 2,
        w: btnSize, h: btnSize
      },
      difficult: {
        x: tf.dx + tf.dw * 0.68 - btnSize / 2,
        y: centerY - btnSize / 2,
        w: btnSize, h: btnSize
      }
    };
  }

  mousePressed() {
    if (this.handleSystemClick()) return;
    const tf = this.getContainTransform(this.bgImg);
    const buttons = this.getDifficultyButtons(tf);

    if (this.inRect(mouseX, mouseY, buttons.easy)) {
      gameState.setDifficulty(CONFIG.DIFFICULTY.EASY);
      sceneManager.switch("camp");
    } else if (this.inRect(mouseX, mouseY, buttons.difficult)) {
      gameState.setDifficulty(CONFIG.DIFFICULTY.DIFFICULT);
      sceneManager.switch("camp");
    }
  }

  keyPressed() {
    super.keyPressed();
  }
}