// title.js — Title screen with alpha-accurate Start button (NO Loading hang)

let titleBgImg;
let startBtnImg;

function titlePreload() {
  // ✅ use your real filenames
  titleBgImg = loadImage("assets/title_cover.png");
  startBtnImg = loadImage("assets/btn_start.png");
}

function titleSetup() {
  if (startBtnImg && startBtnImg.width > 0) {
    startBtnImg.loadPixels();
  }
}

function titleDraw() {
  background(0);

  const tf = getContainTransform(titleBgImg);
  image(titleBgImg, tf.dx, tf.dy, tf.dw, tf.dh);

  const btnR = getStartBtnRect(tf);
  image(startBtnImg, btnR.x, btnR.y, btnR.w, btnR.h);

  const over = hitTestAlpha(startBtnImg, btnR, mouseX, mouseY, 20);
  cursor(over ? HAND : ARROW);
}

function titleMousePressed() {
  const tf = getContainTransform(titleBgImg);
  const btnR = getStartBtnRect(tf);

  if (hitTestAlpha(startBtnImg, btnR, mouseX, mouseY, 20)) {
    switchScene("select");
  }
}

function titleKeyPressed() {
  if (keyCode === ENTER) switchScene("select");
}

// -------------------- Button rect --------------------
function getStartBtnRect(tf) {
  // width relative to image area
  const w = tf.dw * 0.24; // 0.20~0.28 adjust
  const ar = startBtnImg.width / startBtnImg.height;
  const h = w / ar;

  const x = tf.dx + (tf.dw - w) / 2;
  const y = tf.dy + tf.dh * 0.78; // 0.74~0.84 adjust
  return { x, y, w, h };
}

// -------------------- Alpha hit test --------------------
function hitTestAlpha(img, r, mx, my, alphaThreshold = 20) {
  if (!img || !img.pixels || img.pixels.length === 0) return false;
  if (!inRect(mx, my, r)) return false;

  const u = (mx - r.x) / r.w;
  const v = (my - r.y) / r.h;

  const ix = Math.floor(u * img.width);
  const iy = Math.floor(v * img.height);

  if (ix < 0 || ix >= img.width || iy < 0 || iy >= img.height) return false;

  // pixels already loaded in titleSetup()
  const idx = (iy * img.width + ix) * 4;
  const a = img.pixels[idx + 3];
  return a > alphaThreshold;
}

// -------------------- Shared helpers --------------------
function getContainTransform(img) {
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

  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  return { dx, dy, dw, dh, iw: img.width, ih: img.height };
}

function inRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

