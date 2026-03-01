// campScreen.js 
let viewIndex = 0;
let showHotspots = false;
let picking = null;

let views = [];
let arrowRightImg, arrowLeftImg, settingsImg, soundImg;

class Hotspot {
  constructor(id, label, x, y, w, h, onClick) {
    this.id = id; this.label = label;
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.onClick = onClick;
  }
  contains(ix, iy) {
    return ix >= this.x && ix <= this.x + this.w && iy >= this.y && iy <= this.y + this.h;
  }
}

function campPreload() {
  const imgTwoDoors  = loadImage("assets/camp_B.png");
  const imgFourDoors = loadImage("assets/camp_A.png");
  arrowRightImg = loadImage("assets/arrow_right_transparent.png");
  arrowLeftImg  = loadImage("assets/arrow_left_transparent.png");
  settingsImg   = loadImage("assets/icon_settings.png");
  soundImg      = loadImage("assets/icon_sound.png");

  views = [
    {
      name: "4 Doors",
      img: imgFourDoors,
      hotspots: [
        new Hotspot("shop",  "Camp Shop",  183, 286, 230, 250, () => openShop()),
        new Hotspot("board", "Board",      427, 473, 213, 148, () => openBoard()),
        new Hotspot("door1", "Door 1",     613, 308, 132, 127, () => enterDoor(1)),
        new Hotspot("door2", "Door 2",     788, 311, 113, 127, () => enterDoor(2)),
        new Hotspot("door3", "Door 3",     961, 314, 103, 127, () => enterDoor(3)),
        new Hotspot("door4", "Door 4",     1134, 311, 116, 146, () => enterDoor(4)),
      ],
    },
    {
      name: "2 Doors",
      img: imgTwoDoors,
      hotspots: [
        new Hotspot("shop",  "Camp Shop",  183, 286, 230, 250, () => openShop()),
        new Hotspot("board", "Board",      362, 521, 194, 84,  () => openBoard()),
        new Hotspot("door5", "Door 5",     583, 354, 178, 186, () => enterDoor(5)),
        new Hotspot("door6", "Door 6",     1002, 354, 173, 197, () => enterDoor(6)),
      ],
    },
  ];
}

function campSetup() {
}

function campDraw() {
  background(0);

  const v = views[viewIndex];
  const tf = getContainTransform(v.img);

  image(v.img, tf.dx, tf.dy, tf.dw, tf.dh);

  cursor("default");

  // hover hotspots
  const imgPt = screenToImage(mouseX, mouseY, tf);
  let hovered = null;
  if (imgPt) {
    for (const hs of v.hotspots) {
      if (hs.contains(imgPt.x, imgPt.y)) { hovered = hs; break; }
    }
  }

  // UI rects
  const settingsR = getTopRightIconRect(tf, 1);
  const soundR    = getTopRightIconRect(tf, 0);

  let nextArrowR = null;
  let backArrowR = null;

  if (viewIndex === 0) nextArrowR = getTopRightIconRect(tf, 2); // screen1: next on right
  if (viewIndex === 1) backArrowR = getTopLeftArrowRect(tf);    // screen2: back on left

  // hover UI
  const overUI =
    inRect(mouseX, mouseY, settingsR) ||
    inRect(mouseX, mouseY, soundR) ||
    (nextArrowR && inRect(mouseX, mouseY, nextArrowR)) ||
    (backArrowR && inRect(mouseX, mouseY, backArrowR));

  if (hovered || overUI) cursor("pointer");

  // draw arrows + icons
  if (nextArrowR) drawIconImage(arrowRightImg, nextArrowR);
  if (backArrowR) drawIconImage(arrowLeftImg, backArrowR);
  drawIconImage(settingsImg, settingsR, 0.88);
  drawIconImage(soundImg, soundR, 0.92);

  // Only show tooltip for doors
  if (hovered && hovered.id && hovered.id.startsWith("door")) {
    drawTooltip(hovered.label);
  }

  if (showHotspots) drawHotspotsOverlay(v, tf);
}

function campMousePressed() {
  const v = views[viewIndex];
  const tf = getContainTransform(v.img);

  const settingsR = getTopRightIconRect(tf, 1);
  const soundR    = getTopRightIconRect(tf, 0);

  // arrows
  if (viewIndex === 0) {
    const nextArrowR = getTopRightIconRect(tf, 2);
    if (inRect(mouseX, mouseY, nextArrowR)) { viewIndex = 1; return; }
  }
  if (viewIndex === 1) {
    const backArrowR = getTopLeftArrowRect(tf);
    if (inRect(mouseX, mouseY, backArrowR)) { viewIndex = 0; return; }
  }

  // settings / sound -> go to other scenes
  if (inRect(mouseX, mouseY, settingsR)) { openSettings(); return; }
  if (inRect(mouseX, mouseY, soundR)) { toggleMute(); return; }

  const imgPt = screenToImage(mouseX, mouseY, tf);
  if (!imgPt) return;

  // picking tool
  if (keyIsDown(SHIFT)) {
    if (!picking) {
      picking = { x: imgPt.x, y: imgPt.y };
      console.log("Pick start:", picking);
    } else {
      const x1 = Math.min(picking.x, imgPt.x);
      const y1 = Math.min(picking.y, imgPt.y);
      const x2 = Math.max(picking.x, imgPt.x);
      const y2 = Math.max(picking.y, imgPt.y);
      console.log(`RECT => x:${x1|0}, y:${y1|0}, w:${(x2-x1)|0}, h:${(y2-y1)|0}`);
      picking = null;
    }
    return;
  }

  // hotspots
  for (const hs of v.hotspots) {
    if (hs.contains(imgPt.x, imgPt.y)) { hs.onClick?.(); return; }
  }
}

function campKeyPressed() {
  if (key === "h" || key === "H") showHotspots = !showHotspots;
  if (key === "Escape") picking = null;
}

// ======= hooks (ONLY switch scene) =======
function openShop()      { switchScene("shop"); }
function openBoard()     { switchScene("board"); }
function openSettings()  { switchScene("settings"); }

let muted = false;
function toggleMute() {
  muted = !muted;
  console.log("MUTED:", muted);
}

// door -> teammate level
function enterDoor(n) {
  startLevel(n);
  switchScene("level");
}

// ======= helpers =======
function getContainTransform(img) {
  const canvasAspect = width / height;
  const imgAspect = img.width / img.height;
  let dw, dh;

  if (imgAspect > canvasAspect) { dw = width; dh = width / imgAspect; }
  else { dh = height; dw = height * imgAspect; }

  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  return { dx, dy, dw, dh, iw: img.width, ih: img.height };
}

function screenToImage(mx, my, tf) {
  if (mx < tf.dx || mx > tf.dx + tf.dw || my < tf.dy || my > tf.dy + tf.dh) return null;
  const ix = ((mx - tf.dx) / tf.dw) * tf.iw;
  const iy = ((my - tf.dy) / tf.dh) * tf.ih;
  if (ix < 0 || ix > tf.iw || iy < 0 || iy > tf.ih) return null;
  return { x: ix, y: iy };
}

function inRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function getIconSize(tf) { return tf.dw * 0.06; }
function getIconPad(tf)  { return tf.dw * 0.01; }

function getTopRightIconRect(tf, indexFromRight) {
  const s = getIconSize(tf), pad = getIconPad(tf);
  const x = tf.dx + tf.dw - pad - s - indexFromRight * (s + pad);
  const y = tf.dy + pad;
  return { x, y, w: s, h: s };
}

function getTopLeftArrowRect(tf) {
  const s = getIconSize(tf) * 1.05, pad = getIconPad(tf);
  return { x: tf.dx + pad, y: tf.dy + pad, w: s, h: s };
}

function drawIconImage(img, r, scaleFactor = 1.0) {
  const over = inRect(mouseX, mouseY, r);
  push();
  imageMode(CENTER);
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  const s = (over ? 1.06 : 1.0) * scaleFactor;
  image(img, cx, cy, r.w * s, r.h * s);
  pop();
}

function drawTooltip(label) {
  push();

  textSize(22);
  textAlign(CENTER, CENTER);

  // position near the mouse, but keep inside canvas
  const x = constrain(mouseX, 20, width - 20);
  const y = constrain(mouseY - 28, 20, height - 20);

  // outline so text is readable without a background box
  stroke(0, 0, 0, 180);
  strokeWeight(6);
  fill(255);
  text(label, x, y);

  pop();
}

function drawHotspotsOverlay(v, tf) {
  push();
  stroke(0, 255, 0); strokeWeight(2); noFill();
  for (const hs of v.hotspots) {
    const x = tf.dx + (hs.x / tf.iw) * tf.dw;
    const y = tf.dy + (hs.y / tf.ih) * tf.dh;
    const w = (hs.w / tf.iw) * tf.dw;
    const h = (hs.h / tf.ih) * tf.dh;
    rect(x, y, w, h);
    noStroke(); fill(0,255,0); textSize(14);
    text(hs.id, x + 6, y + 16);
    stroke(0,255,0); noFill();
  }
  pop();
}

function drawPickInfo() {
  push();
  noStroke();
  fill(0, 0, 0, 170);
  rect(12, height - 60, 560, 40, 10);
  fill(255);
  textSize(14);
  text("Picking: Shift+Click second corner to output RECT in console. (Esc to cancel)", 22, height - 35);
  pop();
}

