// src/scenes/CharacterSelectScene.js
class CharacterSelectScene extends BaseScene {
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
    background(20, 10, 5); // Dark wood-like background
    const tf = this.getContainTransform(this.bgImg);
    image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    this.drawHeader(tf);

    // Draw character info onto the journal pages
    this.drawJournalContent(tf);

    // Handle cursor logic for the brass buttons
    const buttons = this.getSelectButtons(tf);
    let overAny = false;
    for (const b of buttons) {
      if (this.inRect(mouseX, mouseY, b.rect)) {
        overAny = true;
        break;
      }
    }
    cursor(overAny ? "pointer" : "default");
  }

  drawHeader(tf) {
    push();
    const headerText = "SURVIVOR LOGS";
    const x = width / 2;
    const y = tf.dy + tf.dh * 0.065; // Lowered to paper area for visibility

    textFont(assets.getFont());
    const size = tf.dh * 0.06;
    textSize(size);

    // 1. Calculate dynamic box dimensions
    const tw = textWidth(headerText);
    const padding = 20;

    // 2. Draw half-transparent background
    rectMode(CENTER);
    noStroke();
    // Using a light cream color (R:255, G:250, B:230) at ~60% opacity (150)
    fill(255, 250, 230, 150);

    // Note: We offset the Y by size/2 because textAlign is TOP
    rect(x, y + size / 2, tw + padding, size + padding, 10);

    // 3. Draw the text on top
    textAlign(CENTER, TOP);
    fill(40, 20, 10, 220); // Dark brown ink
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

      // Horizontal anchors
      const pageX = isLeft ? tf.dx + tf.dw * 0.195 : tf.dx + tf.dw * 0.611;
      const textX = isLeft ? tf.dx + tf.dw * 0.353 : tf.dx + tf.dw * 0.773;
      const centerY = isLeft ? tf.dy + tf.dh * 0.544 : tf.dy + tf.dh * 0.522;
      const charW = isLeft ? tf.dw * 0.13 : tf.dw * 0.15
      const charH = isLeft ? tf.dh * 0.38 : tf.dh * 0.42

      // Draw Portrait
      const portraitKey = `char${char.id}_bust`;
      const portrait = assets.getImg(portraitKey);
      if (portrait) {
        image(portrait, pageX, centerY, charW, charH);
      }

      // Ink Style Text
      fill(60, 30, 10);
      textFont('Georgia');

      // 2. NAME ALIGNMENT
      // Nudged from 0.28 to 0.27 to sit flush on the first Introduction line
      textSize(tf.dh * 0.04);
      text(char.name, textX, tf.dy + tf.dh * 0.27);

      // 3. DESCRIPTION ALIGNMENT
      // Nudged from 0.38 to 0.355 to align with the third line of the page
      textSize(tf.dh * 0.024);
      text(char.desc, textX - 20, tf.dy + tf.dh * 0.33, tf.dw * 0.12);

      // Draw Buttons
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
        index: 0, // Ash (Left Page)
        rect: { x: tf.dx + tf.dw * 0.20, y: btnY, w: btnW, h: btnH }
      },
      {
        index: 1, // Iris (Right Page)
        rect: { x: tf.dx + tf.dw * 0.60, y: btnY, w: btnW, h: btnH }
      }
    ];
  }

  mousePressed() {
    const tf = this.getContainTransform(this.bgImg);
    const buttons = this.getSelectButtons(tf);

    for (const b of buttons) {
      if (this.inRect(mouseX, mouseY, b.rect)) {
        gameState.setSelectedCharacter(this.CHARACTERS[b.index]);
        sceneManager.switch("camp");
        return;
      }
    }
  }

  keyPressed() {
    if (key === "Escape") sceneManager.switch("title");
  }
}