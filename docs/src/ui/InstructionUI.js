class InstructionUI {
  constructor() {
    this.queue = [];
    this.current = null;
    this.isActive = false;
    this.targetRect = null;
    this.opacity = 0;
  }

  show(input, target = null) {
    if (Array.isArray(input)) {
      this.queue.push(...input);
    } else {
      this.queue.push({ msg: input, target });
    }

    if (!this.isActive) this.advance();
  }

  advance() {
    if (this.queue.length > 0) {
      this.current = this.queue.shift();
      this.isActive = true;
      this.opacity = 0;
    } else {
      this.hide();
    }
  }

  hide() {
    this.isActive = false;
    this.current = null;
    this.targetRect = null;
    this.queue = [];
  }

  getCurrentTarget() {
    return this.current ? this.current.target : null;
  }

  draw() {
    if (!this.isActive || !this.current) return;

    if (this.opacity < 255) this.opacity += 15;

    if (this.targetRect) {
      this.drawHighlight(this.targetRect);
    }

    this.drawBox();
  }

  drawHighlight(r) {
    push();
    noFill();
    stroke(255, 215, 0, this.opacity);
    strokeWeight(3 + sin(frameCount * 0.1) * 2);
    rect(r.x - 5, r.y - 5, r.w + 10, r.h + 10, 10);
    pop();
  }

  drawBox() {
    const w = width * 0.65;
    const padding = 20;
    const innerW = w - padding * 2;

    push();
    textFont(assets.getFont());
    textSize(20);
    textLeading(26);

    let words = this.current.msg.split(' ');
    let lineCount = 1;
    let currentLine = "";
    for (let i = 0; i < words.length; i++) {
      let testLine = currentLine + words[i] + " ";
      if (textWidth(testLine) > innerW && i > 0) {
        lineCount++;
        currentLine = words[i] + " ";
      } else {
        currentLine = testLine;
      }
    }

    const textHeight = lineCount * textLeading();
    const h = textHeight + (padding * 2);

    const x = (width - w) / 2;
    const y = (height * 0.92) - h;

    fill(0, 0, 0, 200 * (this.opacity / 255));
    stroke(255, 50 * (this.opacity / 255));
    rect(x, y, w, h, 12);

    textAlign(CENTER, CENTER);
    fill(255, this.opacity);
    noStroke();

    text(this.current.msg, x + padding, y, innerW, h);

    textSize(12);
    fill(200, 150 * (this.opacity / 255));
    text("(Press ENTER or click to dismiss)", x + w / 2, y + h + 15);
    pop();
  }
}