class BaseScene {
  constructor() {
    this.canvasActive = false;
  }

  // --- Common Utilities
  inRect(px, py, r) {
    if (!r) return false;
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  getContainTransform(img) {
    if (!img) return { dx: 0, dy: 0, dw: width, dh: height };
    const canvasAspect = width / height;
    const imgAspect = img.width / img.height;
    let dw, dh;
    if (imgAspect > canvasAspect) {
      dw = width; dh = width / imgAspect;
    } else {
      dh = height; dw = height * imgAspect;
    }
    return { dx: (width - dw) / 2, dy: (height - dh) / 2, dw, dh, iw: img.width, ih: img.height };
  }

  drawIcon(img, rect, scale) {
    if (!img) return;
    const s = Math.min(rect.w * scale / img.width, rect.h * scale / img.height);
    push();
    imageMode(CENTER);
    image(img, rect.x + rect.w / 2, rect.y + rect.h / 2, img.width * s, img.height * s);
    pop();
  }

  drawModalButton(r, label, enabled, onClick) {
    const hover = this.inRect(mouseX, mouseY, r);
    push();
    const alpha = enabled ? (hover ? 200 : 140) : 60;
    noStroke(); fill(40, 40, 45, alpha);
    rect(r.x, r.y, r.w, r.h, 10);
    stroke(255, enabled ? (hover ? 255 : 150) : 50);
    strokeWeight(hover ? 3 : 1.5);
    noFill(); rect(r.x, r.y, r.w, r.h, 10);
    noStroke(); fill(enabled ? 255 : 100);
    textAlign(CENTER, CENTER); textSize(Math.max(12, r.h * 0.45));
    text(label, r.x + r.w / 2, r.y + r.h / 2);
    pop();

    if (enabled && hover && mouseIsPressed) {
      onClick();
      mouseIsPressed = false; // Prevent multiple triggers
    }
  }

  onEnter(data) { }
  onExit() {
    if (this.canvasActive) {
      resizeCanvas(windowWidth, windowHeight);
      this.canvasActive = false;
    }
  }
  update() { }
  draw() { }
  mousePressed() { }
  keyPressed() { }
}