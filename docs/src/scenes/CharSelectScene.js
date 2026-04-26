class CharSelectScene extends BaseScene {
  constructor() {
    super();
    this.bgImg = assets.getImg('char_select_bg');
    this.btnImg = assets.getImg('select_btn');

    this.CHARACTERS = [
      { id: 1, name: "ASH", desc: "A silent survivor. Balanced stats.", side: 'left' },
      { id: 2, name: "IRIS", desc: "Quick hands, quicker feet.", side: 'right' },
    ];
  }

  draw() {
    background(20, 10, 5);
    const tf = this.getContainTransform(this.bgImg);
    image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    this.drawHeader(tf);
    this.drawJournalContent(tf);

    const buttons = this.getSelectButtons(tf);
    let overAny = false;
    for (const b of buttons) {
      if (this.inRect(mouseX, mouseY, b.rect)) {
        overAny = true;
        break;
      }
    }
    cursor(overAny ? "pointer" : "default");
    this.drawSystemUI(tf, false, "title");
  }

  drawHeader(tf) {
    push();
    const headerText = "SURVIVOR LOGS";
    const x = width / 2;
    const y = tf.dy + tf.dh * 0.065;

    textFont(assets.getFont());
    const size = tf.dh * 0.06;
    textSize(size);

    const tw = textWidth(headerText);
    const padding = 20;

    rectMode(CENTER);
    noStroke();
    fill(255, 250, 230, 150);

    rect(x, y + size / 2, tw + padding, size + padding, 10);

    textAlign(CENTER, TOP);
    fill(40, 20, 10, 220);
    text(headerText, x, y + 2.5);
    pop();
  }

  drawJournalContent(tf) {
    push();
    imageMode(CENTER);
    textAlign(LEFT, TOP);

    const lineSpacing = tf.dh * 0.043;
    textLeading(lineSpacing);

    this.CHARACTERS.forEach((char, i) => {
      const isLeft = char.side === 'left';

      const pageX = isLeft ? tf.dx + tf.dw * 0.195 : tf.dx + tf.dw * 0.611;
      const textX = isLeft ? tf.dx + tf.dw * 0.353 : tf.dx + tf.dw * 0.773;
      const centerY = isLeft ? tf.dy + tf.dh * 0.544 : tf.dy + tf.dh * 0.522;
      const charW = isLeft ? tf.dw * 0.13 : tf.dw * 0.15
      const charH = isLeft ? tf.dh * 0.38 : tf.dh * 0.42

      const portraitKey = `char${char.id}_bust`;
      const portrait = assets.getImg(portraitKey);
      if (portrait) {
        image(portrait, pageX, centerY, charW, charH);
      }

      fill(60, 30, 10);
      textFont('Georgia');

      textSize(tf.dh * 0.04);
      text(char.name, textX, tf.dy + tf.dh * 0.27);

      textSize(tf.dh * 0.024);
      text(char.desc, textX - 20, tf.dy + tf.dh * 0.33, tf.dw * 0.12);

      const btn = this.getSelectButtons(tf)[i].rect;
      const over = this.inRect(mouseX, mouseY, btn);
      const s = over ? 1.05 : 1.0;

      image(this.btnImg, btn.x + btn.w / 2, btn.y + btn.h / 2, btn.w * s, btn.h * s);
    });
    pop();
  }

  getSelectButtons(tf) {
    const btnW = tf.dw * 0.20;
    const btnH = tf.dh * 0.08;
    const btnY = tf.dy + tf.dh * 0.80;

    return [
      {
        index: 0,
        rect: { x: tf.dx + tf.dw * 0.20, y: btnY, w: btnW, h: btnH }
      },
      {
        index: 1,
        rect: { x: tf.dx + tf.dw * 0.60, y: btnY, w: btnW, h: btnH }
      }
    ];
  }

  mousePressed() {
    if (this.handleSystemClick()) return;
    const tf = this.getContainTransform(this.bgImg);
    const buttons = this.getSelectButtons(tf);

    for (const b of buttons) {
      if (this.inRect(mouseX, mouseY, b.rect)) {
        gameState.setSelectedCharacter(this.CHARACTERS[b.index]);
        sceneManager.switch("difficulty");
        return;
      }
    }
  }

  keyPressed() {
    if (this.handleExitInput()) return;
  }
}