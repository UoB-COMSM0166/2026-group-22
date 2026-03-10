// campScreen.js
let viewIndex = 0;
let showHotspots = false;
let picking = null;

let views = [];
let arrowRightImg, arrowLeftImg, settingsImg, soundImg;

// --- dialogue state ---
const CAMP_INTRO_DIALOGUE = [
  "Signal connecting...",
  "Handshake complete.",
  "Welcome to the Isle.\nFour doors.\nFour rules.\nOne escape.",
  "The island does not sleep.\nIt watches.\nIt listens.",
  "The doors are not portals.\nThey are tests.",
  "Each door leads to a trial.\nEach trial rewrites you.",
  "Choose a path.\nBut understand this:",
  "Once you enter,\nyou will not return unchanged.",
  "Failure is not death.\nIt is memory.",
  "The fire is safe.\nFor now.",
  "When the doors awaken,\nthe rules begin.",
  "Proceed."
];

let campDialogueActive = false;
let campDialogueIndex = 0;
let campNextBtnRect = null;

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

function campSetup() {}

function campOnEnter() {
  if (window.GameState && window.GameState.campIntroDone) {
    campDialogueActive = false;
    return;
  }
  campDialogueActive = true;
  campDialogueIndex = 0;
  if (window.GameState) window.GameState.campIntroDone = true;
}

function campDraw() {
  background(0);

  const v = views[viewIndex];
  const tf = getContainTransform(v.img);
  image(v.img, tf.dx, tf.dy, tf.dw, tf.dh);

  // cursor
  let shouldPointer = false;

  if (campDialogueActive) {
    drawCampDialogueOverlay(tf);
    if (campNextBtnRect && inRect(mouseX, mouseY, campNextBtnRect)) shouldPointer = true;
    cursor(shouldPointer ? HAND : ARROW);
    return;
  }

  // hover hotspots
  const imgPt = screenToImage(mouseX, mouseY, tf);
  let hovered = null;
  if (imgPt) {
    for (const hs of v.hotspots) {
      if (hs.contains(imgPt.x, imgPt.y)) { hovered = hs; break; }
    }
  }
  if (hovered) shouldPointer = true;

  // UI rects
  const settingsR = getTopRightIconRect(tf, 1);
  const soundR    = getTopRightIconRect(tf, 0);

  if (inRect(mouseX, mouseY, settingsR)) shouldPointer = true;
  if (inRect(mouseX, mouseY, soundR)) shouldPointer = true;

  let nextArrowR = null;
  let backArrowR = null;
  if (viewIndex === 0) nextArrowR = getTopRightIconRect(tf, 2);
  if (viewIndex === 1) backArrowR = getTopLeftArrowRect(tf);
  if (nextArrowR && inRect(mouseX, mouseY, nextArrowR)) shouldPointer = true;
  if (backArrowR && inRect(mouseX, mouseY, backArrowR)) shouldPointer = true;

  // draw icons
  if (nextArrowR) drawIconImage(arrowRightImg, nextArrowR);
  if (backArrowR) drawIconImage(arrowLeftImg, backArrowR);
  drawIconImage(settingsImg, settingsR, 0.88);
  drawIconImage(soundImg, soundR, 0.92);

  // Only show tooltip for doors
  if (hovered && hovered.id && hovered.id.startsWith("door")) drawTooltip(hovered.label);

  if (showHotspots) drawHotspotsOverlay(v, tf);

  cursor(shouldPointer ? HAND : ARROW);
}

function campMousePressed() {
  const v = views[viewIndex];
  const tf = getContainTransform(v.img);

  // dialogue click handling
  if (campDialogueActive) {
    if (campNextBtnRect && inRect(mouseX, mouseY, campNextBtnRect)) {
      campDialogueIndex++;
      if (campDialogueIndex >= CAMP_INTRO_DIALOGUE.length) {
        campDialogueActive = false;
      }
    }
    return;
  }

  // ===== original camp clicking (unchanged) =====
  const settingsR = getTopRightIconRect(tf, 1);
  const soundR    = getTopRightIconRect(tf, 0);

  if (viewIndex === 0) {
    const nextArrowR = getTopRightIconRect(tf, 2);
    if (inRect(mouseX, mouseY, nextArrowR)) { viewIndex = 1; return; }
  }
  if (viewIndex === 1) {
    const backArrowR = getTopLeftArrowRect(tf);
    if (inRect(mouseX, mouseY, backArrowR)) { viewIndex = 0; return; }
  }

  if (inRect(mouseX, mouseY, settingsR)) { openSettings(); return; }
  if (inRect(mouseX, mouseY, soundR)) { toggleMute(); return; }

  const imgPt = screenToImage(mouseX, mouseY, tf);
  if (!imgPt) return;

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

  for (const hs of v.hotspots) {
    if (hs.contains(imgPt.x, imgPt.y)) { hs.onClick?.(); return; }
  }
}

function campKeyPressed() {
  if (key === "h" || key === "H") showHotspots = !showHotspots;
  if (key === "Escape") picking = null;

  if (campDialogueActive && (keyCode === ENTER || key === " " || keyCode === 32)) {
    campDialogueIndex++;
    if (campDialogueIndex >= CAMP_INTRO_DIALOGUE.length) campDialogueActive = false;
  }
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

function enterDoor(n) {
  if (n === 1) {
    if (typeof startLevel === "function") {
      startLevel(1);
      switchScene("level");
    } else {
      console.warn("[campScreen] startLevel not defined");
    }
    return;
  }

  console.log(`Door ${n} not implemented yet.`);
}

// ======= dialogue overlay =======
function drawCampDialogueOverlay(tf) {

  const pad = tf.dw * 0.03;
  const barH = tf.dh * 0.20;
  const x = tf.dx + pad;
  const y = tf.dy + tf.dh - pad - barH;
  const w = tf.dw - pad * 2;
  const h = barH;

  push();
  noStroke();
  fill(0, 0, 0, 170);
  rect(x, y, w, h, 18);
  pop();

  const msg = CAMP_INTRO_DIALOGUE[Math.min(campDialogueIndex, CAMP_INTRO_DIALOGUE.length - 1)];

  // use global font
  const f = window.Assets?.plasdripFont;

  push();
  if (f) textFont(f);
  textAlign(CENTER, CENTER);
  textSize(Math.floor(h * 0.26));
  textLeading(Math.floor(h * 0.24));
  fill(170, 10, 10, 240);
  stroke(0, 0, 0, 170);
  strokeWeight(6);
  text(msg, x + w / 2, y + h / 2);
  pop();

  const btnW = tf.dw * 0.10;
  const btnH = tf.dh * 0.075;
  const bx = tf.dx + tf.dw - pad - btnW;
  const by = tf.dy + tf.dh * 0.42;

  campNextBtnRect = { x: bx, y: by, w: btnW, h: btnH };

  const over = inRect(mouseX, mouseY, campNextBtnRect);
  if (over) cursor(HAND);

  push();
  noStroke();
  fill(255, 255, 255, over ? 95 : 70);
  rect(bx, by, btnW, btnH, 12);

  if (f) textFont(f);
  fill(255, 255, 255, 230);
  textAlign(CENTER, CENTER);
  textSize(Math.floor(btnH * 0.48));
  text("NEXT", bx + btnW / 2, by + btnH / 2 + 2);
  pop();
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

  const x = constrain(mouseX, 20, width - 20);
  const y = constrain(mouseY - 28, 20, height - 20);

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

