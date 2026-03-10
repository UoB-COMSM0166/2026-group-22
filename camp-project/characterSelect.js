// characterSelect.js  (scene id: "select")

let selectBgImg;

// popup state
let selectPopupOpen = false;
let pendingChar = null; // { id, name, desc }

// ---- optional: your 5 character infos (can change later) ----
const CHARACTERS = [
  { id: 1, name: "Ash",   desc: "A silent survivor. Balanced stats." },
  { id: 2, name: "Iris",  desc: "Quick hands, quicker feet." },
  { id: 3, name: "Nyx",   desc: "A cursed wanderer with dark gifts." },
  { id: 4, name: "Orin",  desc: "Strong body, stubborn will." },
  { id: 5, name: "Vale",  desc: "Calm mind. Deadly precision." },
];

function selectPreload() {
  selectBgImg = loadImage("assets/character_select.png");
}

function selectSetup() {}

function selectOnEnter() {
  // reset when entering this scene
  selectPopupOpen = false;
  pendingChar = null;
}

function selectDraw() {
  background(0);
  const tf = getContainTransform(selectBgImg);
  image(selectBgImg, tf.dx, tf.dy, tf.dw, tf.dh);

  cursor("default");

  // 1) if popup open -> draw popup + hover logic only inside popup
  if (selectPopupOpen && pendingChar) {
    drawSelectPopup(tf, pendingChar);
    const over = isMouseOverPopup(tf);
    if (over) cursor("pointer");
    return;
  }

  // 2) normal state -> hover SELECT buttons
  const buttons = getSelectButtons(tf); // 5 rects
  let overAny = false;
  for (const b of buttons) {
    if (inRect(mouseX, mouseY, b.rect)) { overAny = true; break; }
  }
  if (overAny) cursor("pointer");
}

function selectMousePressed() {
  const tf = getContainTransform(selectBgImg);

  // If popup open, handle it first (block click-through)
  if (selectPopupOpen && pendingChar) {
    handlePopupClick(tf);
    return;
  }

  // otherwise: check 5 select buttons
  const buttons = getSelectButtons(tf);
  for (const b of buttons) {
    if (inRect(mouseX, mouseY, b.rect)) {
      pendingChar = CHARACTERS[b.index];
      selectPopupOpen = true;
      return;
    }
  }
}

function selectKeyPressed() {
  if (key === "Escape") {
    if (selectPopupOpen) {
      selectPopupOpen = false;
      pendingChar = null;
    } else {
      // back to title if you want
      switchScene("title");
    }
  }
}

/* =============================
   Buttons (aligned to image)
   ============================= */

// We compute 5 button rects near the bottom of the image.
// This is a generic layout that matches your screenshot.
// If your buttons don't line up perfectly, tweak these ratios.
function getSelectButtons(tf) {
  const btnW = tf.dw * 0.14;
  const btnH = tf.dh * 0.055;
  const gap = tf.dw * 0.04;

  const totalW = 5 * btnW + 4 * gap;
  const startX = tf.dx + (tf.dw - totalW) / 2;

  const y = tf.dy + tf.dh * 0.78; // near where SELECT buttons are

  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push({
      index: i,
      rect: { x: startX + i * (btnW + gap), y, w: btnW, h: btnH }
    });
  }
  return arr;
}

/* =============================
   Popup (Confirm / Cancel)
   ============================= */

function getPopupRect(tf) {
  // popup centered within the IMAGE area
  const w = tf.dw * 0.70;
  const h = tf.dh * 0.45;
  const x = tf.dx + (tf.dw - w) / 2;
  const y = tf.dy + (tf.dh - h) / 2;
  return { x, y, w, h };
}

function getPopupButtons(p) {
  const btnW = p.w * 0.22;
  const btnH = p.h * 0.16;
  const gap = p.w * 0.04;

  const y = p.y + p.h - btnH - p.h * 0.08;
  const confirm = {
    x: p.x + p.w / 2 - gap / 2 - btnW,
    y,
    w: btnW,
    h: btnH
  };
  const cancel = {
    x: p.x + p.w / 2 + gap / 2,
    y,
    w: btnW,
    h: btnH
  };
  return { confirm, cancel };
}

function drawSelectPopup(tf, charObj) {
  const p = getPopupRect(tf);
  const { confirm, cancel } = getPopupButtons(p);

  // dark overlay (whole canvas)
  push();
  noStroke();
  fill(0, 0, 0, 170);
  rect(0, 0, width, height);

  // popup panel
  fill(20, 20, 22, 230);
  rect(p.x, p.y, p.w, p.h, 18);

  // left "portrait placeholder" (you can replace with real image later)
  const pad = p.w * 0.05;
  const leftW = p.w * 0.32;
  const boxX = p.x + pad;
  const boxY = p.y + pad;
  const boxH = p.h * 0.62;

  fill(0, 0, 0, 120);
  rect(boxX, boxY, leftW, boxH, 14);

  // right text area
  const textX = boxX + leftW + pad;
  const textY = boxY;
  const textW = p.x + p.w - pad - textX;

  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(28);
  text(charObj.name, textX, textY);

  textSize(18);
  fill(220);
  text(charObj.desc, textX, textY + 42, textW);

  // buttons
  drawPopupButton(confirm, "CONFIRM");
  drawPopupButton(cancel, "CANCEL");

  pop();
}

function drawPopupButton(r, label) {
  const over = inRect(mouseX, mouseY, r);

  push();
  noStroke();
  fill(0, 0, 0, over ? 170 : 130);
  rect(r.x, r.y, r.w, r.h, 12);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(r.h * 0.38);
  text(label, r.x + r.w / 2, r.y + r.h / 2);
  pop();
}

function isMouseOverPopup(tf) {
  const p = getPopupRect(tf);
  const { confirm, cancel } = getPopupButtons(p);
  return inRect(mouseX, mouseY, confirm) || inRect(mouseX, mouseY, cancel);
}

function handlePopupClick(tf) {
  const p = getPopupRect(tf);
  const { confirm, cancel } = getPopupButtons(p);

  // click outside popup => close
  if (!inRect(mouseX, mouseY, p)) {
    selectPopupOpen = false;
    pendingChar = null;
    return;
  }

  if (inRect(mouseX, mouseY, cancel)) {
    selectPopupOpen = false;
    pendingChar = null;
    return;
  }

  if (inRect(mouseX, mouseY, confirm)) {
    // store into GameState for maps to read
    if (window.GameState && typeof window.GameState.setSelectedCharacter === "function") {
      window.GameState.setSelectedCharacter(pendingChar);
    } else {
      console.warn("GameState.setSelectedCharacter missing!");
    }

    selectPopupOpen = false;
    pendingChar = null;

    // go to camp
    switchScene("camp");
  }
}

/* =============================
   Shared helpers
   ============================= */

// If you already have these globally (campScreen.js), you can remove duplicates.
// But having them here is safe.

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
