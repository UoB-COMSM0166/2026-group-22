class TitleScene extends BaseScene {
  constructor() {
    super();
    this.bgImg = assets.getImg('title_bg');
  }

  setup() { }

  draw() {
    background(0);

    const tf = this.getContainTransform(this.bgImg);
    image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    this.drawStartPrompt(tf);
    cursor(HAND);
  }

  drawStartPrompt(tf) {
    push();
    textAlign(CENTER, CENTER);
    textFont(assets.getFont());
    textSize(width * 0.04);

    let alpha = 150 + sin(frameCount * 0.1) * 100;

    fill(0, alpha * 0.5);
    text("CLICK ANYWHERE TO START", width / 2 + 2, tf.dy + tf.dh * 0.90 + 2);

    fill(255, alpha);
    text("CLICK ANYWHERE TO START", width / 2, tf.dy + tf.dh * 0.90);
    pop();
  }

  mousePressed() {
    sceneManager.switch("select");
  }

  keyPressed() {
    if (keyCode === ENTER) {
      sceneManager.switch("select");
    }
  }
}