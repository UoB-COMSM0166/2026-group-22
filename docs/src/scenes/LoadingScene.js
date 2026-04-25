class LoadingScene extends BaseScene {
  constructor(bootImg) {
    super();
    this.bootImg = bootImg;
    this.initializedGame = false;
  }

  draw() {
    background(0);

    const tf = this.getContainTransform(this.bootImg);
    if (this.bootImg) {
      image(this.bootImg, tf.dx, tf.dy, tf.dw, tf.dh);
    }

    const progress = assets.getProgress();
    this.drawLoadingUI(progress, tf);

    if (progress >= 1.0 && !this.initializedGame) {
      this.initializedGame = true;
      sceneManager.initGameScenes();
      setTimeout(() => sceneManager.switch("title"), 500);
    }
  }

  drawLoadingUI(progress, tf) {
    const barW = tf.dw * 0.5;
    const x = width / 2 - barW / 2;
    const y = tf.dy + tf.dh * 0.85;

    push();
    fill(40, 200);
    noStroke();
    rect(x, y, barW, 10, 5);

    fill(0, 255, 200);
    rect(x, y, barW * progress, 10, 5);

    textAlign(CENTER, TOP);
    fill(255);
    textSize(Math.max(14, tf.dh * 0.03));
    text(`INITIALIZING SYSTEMS: ${Math.floor(progress * 100)}%`, width / 2, y + 25);
    pop();
  }
}