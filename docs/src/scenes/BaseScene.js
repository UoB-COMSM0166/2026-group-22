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