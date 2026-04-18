class GameplayScene extends BaseScene {
  constructor() {
    super();
    this.CANVAS_W = CONFIG.WORLD.CANVAS_WIDTH;
    this.CANVAS_H = CONFIG.WORLD.CANVAS_HEIGHT;
  }

  applyCanvasMode() {
    resizeCanvas(this.CANVAS_W, this.CANVAS_H);
    const body = document.body;
    const c = document.querySelector("canvas");

    body.style.display = "flex";
    body.style.justifyContent = "center";
    body.style.alignItems = "center";
    body.style.background = "black";
    body.style.overflow = "hidden";

    if (c) {
      c.style.width = this.CANVAS_W + "px";
      c.style.height = this.CANVAS_H + "px";
    }

    this.canvasActive = true;
  }

  restoreFullCanvasMode() {
    const body = document.body;
    const c = document.querySelector("canvas");

    body.style.display = "block";
    body.style.background = "#111";
    body.style.overflow = "";

    if (c) {
      c.style.width = "";
      c.style.height = "";
    }

    resizeCanvas(windowWidth, windowHeight);
    this.canvasActive = false;
  }

  handleResize() {
    if (this.canvasActive) {
      this.applyCanvasMode();
    }
  }

  onEnter() { }
  onExit() { this.restoreFullCanvasMode(); }
  draw() { }
  keyPressed() { }
  mousePressed() { }
}