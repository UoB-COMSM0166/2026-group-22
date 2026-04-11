// src/scenes/CharacterSelectScene.js
class CharacterSelectScene extends BaseScene {
  constructor() {
    super();
    this.bgImg = assets.getImg('char_select_bg');
    this.popupOpen = false;
    this.pendingChar = null;

    // Static character data
    this.CHARACTERS = [
      { id: 1, name: "Ash", desc: "A silent survivor. Balanced stats." },
      { id: 2, name: "Iris", desc: "Quick hands, quicker feet." },
      // { id: 3, name: "Nyx", desc: "A cursed wanderer with dark gifts." },
      // { id: 4, name: "Orin", desc: "Strong body, stubborn will." },
      // { id: 5, name: "Vale", desc: "Calm mind. Deadly precision." },
    ];
  }

  onEnter() {
    // Reset state every time we navigate to this screen
    this.popupOpen = false;
    this.pendingChar = null;

    sceneManager.instructions.show("Select your character.");
  }

  draw() {
    background(0);
    const tf = this.getContainTransform(this.bgImg);
    image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    cursor("default");

    // 1) if popup open -> draw popup + hover logic
    if (this.popupOpen && this.pendingChar) {
      this.drawSelectPopup(tf, this.pendingChar);
      if (this.isMouseOverPopup(tf)) cursor("pointer");
      return;
    }

    // 2) normal state -> hover SELECT buttons
    const buttons = this.getSelectButtons(tf);
    let overAny = false;
    for (const b of buttons) {
      if (this.inRect(mouseX, mouseY, b.rect)) {
        overAny = true;
        break;
      }
    }
    if (overAny) cursor("pointer");
  }

  mousePressed() {
    const tf = this.getContainTransform(this.bgImg);

    if (this.popupOpen && this.pendingChar) {
      this.handlePopupClick(tf);
      return;
    }

    const buttons = this.getSelectButtons(tf);
    for (const b of buttons) {
      if (this.inRect(mouseX, mouseY, b.rect)) {
        this.pendingChar = this.CHARACTERS[b.index];
        this.popupOpen = true;
        return;
      }
    }
  }

  keyPressed() {
    if (key === "Escape") {
      if (this.popupOpen) {
        this.popupOpen = false;
        this.pendingChar = null;
      } else {
        sceneManager.switch("title");
      }
    }
  }

  /* =============================
     UI Logic & Drawing Methods
     ============================= */

  getSelectButtons(tf) {
    const btnW = tf.dw * 0.145; // Match the width of the painted button
    const btnH = tf.dh * 0.06;  // Match the height
    const btnY = tf.dy + tf.dh * 0.765; // Position vertically on the plate

    return [
      {
        index: 0, // Left Portal (Ash)
        rect: { x: tf.dx + tf.dw * 0.265, y: btnY, w: btnW, h: btnH }
      },
      {
        index: 1, // Right Portal (Iris)
        rect: { x: tf.dx + tf.dw * 0.595, y: btnY, w: btnW, h: btnH }
      }
    ];
  }

  getPopupRect(tf) {
    const w = tf.dw * 0.70;
    const h = tf.dh * 0.45;
    return {
      x: tf.dx + (tf.dw - w) / 2,
      y: tf.dy + (tf.dh - h) / 2,
      w, h
    };
  }

  getPopupButtons(p) {
    const btnW = p.w * 0.22;
    const btnH = p.h * 0.16;
    const gap = p.w * 0.04;
    const y = p.y + p.h - btnH - p.h * 0.08;

    return {
      confirm: { x: p.x + p.w / 2 - gap / 2 - btnW, y, w: btnW, h: btnH },
      cancel: { x: p.x + p.w / 2 + gap / 2, y, w: btnW, h: btnH }
    };
  }

  drawSelectPopup(tf, charObj) {
    const p = this.getPopupRect(tf);
    const { confirm, cancel } = this.getPopupButtons(p);

    push();
    fill(0, 0, 0, 170);
    rect(0, 0, width, height);

    fill(20, 20, 22, 230);
    rect(p.x, p.y, p.w, p.h, 18);

    // Right text area
    fill(255);
    textAlign(LEFT, TOP);
    textSize(28);
    text(charObj.name, p.x + p.w * 0.42, p.y + p.w * 0.05);

    textSize(18);
    fill(220);
    text(charObj.desc, p.x + p.w * 0.42, p.y + p.w * 0.05 + 42, p.w * 0.5);

    this.drawPopupButton(confirm, "CONFIRM");
    this.drawPopupButton(cancel, "CANCEL");
    pop();
  }

  drawPopupButton(r, label) {
    const over = this.inRect(mouseX, mouseY, r);
    push();
    fill(0, 0, 0, over ? 170 : 130);
    rect(r.x, r.y, r.w, r.h, 12);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(r.h * 0.38);
    text(label, r.x + r.w / 2, r.y + r.h / 2);
    pop();
  }

  isMouseOverPopup(tf) {
    const p = this.getPopupRect(tf);
    const { confirm, cancel } = this.getPopupButtons(p);
    return this.inRect(mouseX, mouseY, confirm) || this.inRect(mouseX, mouseY, cancel);
  }

  handlePopupClick(tf) {
    const p = this.getPopupRect(tf);
    const { confirm, cancel } = this.getPopupButtons(p);

    if (!this.inRect(mouseX, mouseY, p) || this.inRect(mouseX, mouseY, cancel)) {
      this.popupOpen = false;
      this.pendingChar = null;
      return;
    }

    if (this.inRect(mouseX, mouseY, confirm)) {
      gameState.setSelectedCharacter(this.pendingChar);
      this.popupOpen = false;
      this.pendingChar = null;
      sceneManager.switch("camp");
    }
  }
}