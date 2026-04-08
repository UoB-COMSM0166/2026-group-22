// src/ui/DialogueManager.js
class DialogueManager {
  constructor(lines) {
    this.lines = lines || [];
    this.currentIndex = 0;
    this.isActive = false;

    // UI Bounds (Calculated during draw)
    this.nextBtnRect = null;
    this.skipBtnRect = null;
  }

  start() {
    this.isActive = true;
    this.currentIndex = 0;
  }

  update() {}

  advance() {
    this.currentIndex++;
    if (this.currentIndex >= this.lines.length) {
      this.isActive = false;
    }
  }

  skip() {
    this.isActive = false;
  }

  draw(tf, scene) {
    if (!this.isActive) return;

    const pad = tf.dw * 0.03;
    const barH = tf.dh * 0.20;
    const x = tf.dx + pad, y = tf.dy + tf.dh - pad - barH, w = tf.dw - pad * 2, h = barH;

    push();
    fill(0, 0, 0, 170);
    rect(x, y, w, h, 18);

    // Display the full message instantly
    const fullMsg = this.lines[this.currentIndex] || "";

    const f = assets.getFont();
    if (f) textFont(f);
    textAlign(CENTER, CENTER);
    textSize(Math.floor(h * 0.26));
    fill(170, 10, 10, 240);
    stroke(0); 
    strokeWeight(6);
    text(fullMsg, x + w / 2, y + h / 2);

    // Button Logic
    const btnW = tf.dw * 0.10, btnH = tf.dh * 0.075;
    const bx = tf.dx + tf.dw - pad - btnW, by = tf.dy + tf.dh * 0.42;
    this.nextBtnRect = { x: bx, y: by, w: btnW, h: btnH };
    this.skipBtnRect = { x: bx - btnW - pad, y: by, w: btnW, h: btnH };

    this._drawBtn(this.nextBtnRect, "NEXT", [255, 255, 255], scene);
    this._drawBtn(this.skipBtnRect, "SKIP", [255, 170, 170], scene);
    pop();
  }

  _drawBtn(r, label, col, scene) {
    const over = scene.inRect(mouseX, mouseY, r);
    fill(...col, over ? 95 : 70);
    rect(r.x, r.y, r.w, r.h, 12);
    fill(255);
    textSize(Math.floor(r.h * 0.48));
    text(label, r.x + r.w / 2, r.y + r.h / 2 + 2);
  }
}