// src/scenes/TitleScene.js
class TitleScene {
  constructor() {
    this.bgImg = assets.getImg('title_bg');
    this.startBtnImg = assets.getImg('start_btn');
    this.btnRect = { x: 0, y: 0, w: 0, h: 0 };
  }

  // Use this for the logic usually found in p5's preload()
  preload() {
  }

  // One-time setup when the scene is first created
  setup() {
    if (this.startBtnImg && this.startBtnImg.width > 0) {
      this.startBtnImg.loadPixels();
    }
  }

  // Called by your SceneManager every frame
  draw() {
    background(0);

    const tf = this.getContainTransform(this.bgImg);
    image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    this.btnRect = this.getStartBtnRect(tf);
    image(this.startBtnImg, this.btnRect.x, this.btnRect.y, this.btnRect.w, this.btnRect.h);

    const over = this.hitTestAlpha(this.startBtnImg, this.btnRect, mouseX, mouseY, 20);
    cursor(over ? HAND : ARROW);
  }

  // Input handling
  mousePressed() {
    if (this.hitTestAlpha(this.startBtnImg, this.btnRect, mouseX, mouseY, 20)) {
      // Assuming your manager uses this method to switch scenes
      sceneManager.switch("select"); 
    }
  }

  keyPressed() {
    if (keyCode === ENTER) {
      sceneManager.switch("select");
    }
  }

  // --- Helpers moved to Class Methods ---

  getStartBtnRect(tf) {
    const w = tf.dw * 0.24; 
    const ar = this.startBtnImg.width / this.startBtnImg.height;
    const h = w / ar;
    const x = tf.dx + (tf.dw - w) / 2;
    const y = tf.dy + tf.dh * 0.78; 
    return { x, y, w, h };
  }

  hitTestAlpha(img, r, mx, my, alphaThreshold = 20) {
    if (!img || !img.pixels || img.pixels.length === 0) return false;
    if (!this.inRect(mx, my, r)) return false;

    const u = (mx - r.x) / r.w;
    const v = (my - r.y) / r.h;
    const ix = Math.floor(u * img.width);
    const iy = Math.floor(v * img.height);

    if (ix < 0 || ix >= img.width || iy < 0 || iy >= img.height) return false;

    const idx = (iy * img.width + ix) * 4;
    return img.pixels[idx + 3] > alphaThreshold;
  }

  getContainTransform(img) {
    const canvasAspect = width / height;
    const imgAspect = img.width / img.height;
    let dw, dh;

    if (imgAspect > canvasAspect) {
      dw = width;
      dh = width / imgAspect;
    } else {
      dh = height;
      dw = height * imgAspect;
    }

    return { 
      dx: (width - dw) / 2, 
      dy: (height - dh) / 2, 
      dw, dh 
    };
  }

  inRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }
}