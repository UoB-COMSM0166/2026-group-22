// shop.js — shop scene
let shopBgImg;
let plasdripFont;

// dialogue timing
let dialogueStartMs = -1;
const DIALOGUE_SHOW_MS = 1400;
const DIALOGUE_FADE_MS = 1200;
const DIALOGUE_TOTAL_MS = DIALOGUE_SHOW_MS + DIALOGUE_FADE_MS;

// line-broken message
const SHOP_LINES = [
  "Welcome back, little hero,",
  "Spend your coins ... or spend your courage.",
];

function shopPreload() {
  shopBgImg = loadImage("assets/shop_bg.png");
  plasdripFont = loadFont("assets/plasdrip.ttf");
}

function shopSetup() {}

// call on every entry
function shopOnEnter() {
  dialogueStartMs = millis();
}

function shopDraw() {
  background(0);

  // 1) background
  const tf = getContainTransform(shopBgImg);
  image(shopBgImg, tf.dx, tf.dy, tf.dw, tf.dh);

  // 2) default cursor
  cursor("default");

  // 3) close X
  const closeR = getShopCloseRect(tf);
  const overClose = inRect(mouseX, mouseY, closeR);
  if (overClose) cursor("pointer");
  drawShopCloseX(closeR, overClose);

  // 4) bottom dialogue bar
  const a = getDialogueAlpha();
  if (a > 0) drawBottomDialogueCentered(tf, SHOP_LINES, a);
    // 5) Esc hint
  drawEscHint(tf);

}

function shopMousePressed() {
  const tf = getContainTransform(shopBgImg);
  const closeR = getShopCloseRect(tf);
  if (inRect(mouseX, mouseY, closeR)) {
    switchScene("camp");
    return;
  }
}

function shopKeyPressed() {
  if (key === "Escape") switchScene("camp");
}

// ============================
// Dialogue alpha (fade out)
// ============================
function getDialogueAlpha() {
  if (dialogueStartMs < 0) return 0;

  const t = millis() - dialogueStartMs;
  if (t < 0 || t >= DIALOGUE_TOTAL_MS) return 0;

  if (t <= DIALOGUE_SHOW_MS) return 255;

  const k = (t - DIALOGUE_SHOW_MS) / DIALOGUE_FADE_MS; // 0..1
  return Math.round(255 * (1 - k));
}

// ============================
// UI rects + draw
// ============================
function getShopCloseRect(tf) {
  const s = tf.dw * 0.045;
  const pad = tf.dw * 0.015;
  return { x: tf.dx + tf.dw - pad - s, y: tf.dy + pad, w: s, h: s };
}

function drawShopCloseX(r, hover) {
  push();
  noStroke();
  fill(0, 0, 0, hover ? 150 : 110);
  rect(r.x, r.y, r.w, r.h, r.w * 0.25);

  stroke(255, hover ? 255 : 220);
  strokeWeight(3);
  strokeCap(ROUND);

  const pad = r.w * 0.28;
  line(r.x + pad, r.y + pad, r.x + r.w - pad, r.y + r.h - pad);
  line(r.x + r.w - pad, r.y + pad, r.x + pad, r.y + r.h - pad);
  pop();
}

// ============================
// Bottom dialogue (NO portrait)
// ============================
function drawBottomDialogueCentered(tf, lines, alpha) {
  push();

  // bar inside IMAGE area
  const pad = tf.dw * 0.03;
  const barH = tf.dh * 0.15; // 
  const x = tf.dx + pad;
  const y = tf.dy + tf.dh - pad - barH;
  const w = tf.dw - pad * 2;
  const h = barH;

  // bar background
  noStroke();
  fill(0, 0, 0, Math.min(165, alpha));
  rect(x, y, w, h, 16);

  // font + color
  if (plasdripFont) textFont(plasdripFont);
  fill(200, 20, 20, alpha);     // 
  noStroke();
  textAlign(CENTER, CENTER);

  let size = Math.floor(h * 0.26);
  textSize(size);

  // make sure longest line fits
  const maxW = w * 0.90;
  while (Math.max(...lines.map(s => textWidth(s))) > maxW && size > 14) {
    size -= 1;
    textSize(size);
  }

  // line spacing
  const lineGap = size * 0.95;

  // vertically center the whole block
  const totalH = lineGap * (lines.length - 1);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const startY = cy - totalH / 2;

  // draw lines, each line centered
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cx, startY + i * lineGap);
  }

  pop();
}

// ============================
// small util
// ============================
function inRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function drawEscHint(tf) {
  push();

  // put ESC hint into the left-bottom corner
  const pad = tf.dw * 0.02;
  const x = tf.dx + pad;
  const y = tf.dy + tf.dh - pad;

  textAlign(LEFT, BOTTOM);
  textSize(Math.max(14, Math.floor(tf.dh * 0.028)));
  noStroke();
  fill(255, 220);
  text("Press Esc to return", x, y);

  pop();
}

