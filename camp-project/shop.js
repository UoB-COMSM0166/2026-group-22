// shop.js — shop scene
let shopBgImg;
let plasdripFont;
// Item icons
let pistolIconImg;
let fireballIconImg;
// Inventory bar (owned items)
let invSlots = [];            // computed each frame
let hoveredInvItemId = null;  // optional


// Equipped weapon (only one)
let equippedWeaponId = null; // "pistol" | "fireball" | null
// Info panel button rect
let infoBtnEquipR = null;
let infoBtnSellR = null;




// ===== shop state =====
const START_COINS = 10;
let coins = START_COINS; // Default coins (if no local save file exists)
// Economy config
const SELL_REFUND_RATE = 1.0; // 1.0 = full refund, 0.5 = half refund

const SHOP_STORAGE_KEY = "camp_shop_state_v1";

// Two items: pistol/fireball
const SHOP_ITEMS = [
  {
    id: "pistol",
    name: "Pistol",
    price: 3,
    desc: ["A reliable handgun.", "Good for single targets."],
  },
  {
    id: "fireball",
    name: "Fireball Magic",
    price: 4,
    desc: ["Cast a blazing fireball.", "Great for crowd damage."],
  },
];

//Having status
let owned = { pistol: false, fireball: false };

//UI status
let hoveredItemId = null;
let selectedItemId = null;

//Purchase pop-up window
let showBuyModal = false;
let modalBtnBuyR = null;
let modalBtnCancelR = null;

const SHOP_SLOTS = [
  // Top-left shelf slot #1
  { itemId: "pistol",   rx: 0.287, ry: 0.255, rw: 0.075, rh: 0.100 },

  // Top-left shelf slot #2
  { itemId: "fireball", rx: 0.375, ry: 0.255, rw: 0.075, rh: 0.100 },
];





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

  // Item icons (update filenames to your actual assets)
  pistolIconImg = loadImage("assets/icon_pistol.png");
  fireballIconImg = loadImage("assets/icon_fireball.png");
}

function loadShopState() {
  try {
    const raw = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (typeof data.coins === "number") coins = data.coins;

    if (data.owned && typeof data.owned === "object") {
      owned.pistol = !!data.owned.pistol;
      owned.fireball = !!data.owned.fireball;
    }

    // Load equipped weapon (must be owned)
    if (typeof data.equippedWeaponId === "string" && owned[data.equippedWeaponId]) {
      equippedWeaponId = data.equippedWeaponId;
    } else {
      equippedWeaponId = null;
    }
  } catch (e) {
    console.warn("loadShopState failed:", e);
  }
}

function saveShopState() {
  try {
    localStorage.setItem(
      SHOP_STORAGE_KEY,
      JSON.stringify({ coins, owned, equippedWeaponId })
    );
  } catch (e) {
    console.warn("saveShopState failed:", e);
  }
}

function shopSetup() {}

// call on every entry
function shopOnEnter() {
  dialogueStartMs = millis();

  loadShopState();
  hoveredItemId = null;
  selectedItemId = null;
  showBuyModal = false;
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
    // hover items -> pointer
  if (hoveredItemId) cursor("pointer");


  // 4) bottom dialogue bar
  const a = getDialogueAlpha();
  if (a > 0) drawBottomDialogueCentered(tf, SHOP_LINES, a);

  // Draw inventory bar (owned items)
  drawInventoryBar(tf);

  // Action hint + Esc hint
  drawShopActionHint(tf);
  drawEscHint(tf);

  // 5) coins + shop items UI
  drawCoins(tf);
  drawShopItems(tf);

  // 6) item info panel
  if (selectedItemId) {
  const anchor = getItemAnchorRect(tf, selectedItemId);
  if (anchor) drawItemInfoPanel(tf, selectedItemId, anchor);
}

  // 7) buy modal on top
  if (showBuyModal && selectedItemId) {
    const rects = drawBuyModal(tf, selectedItemId);
    modalBtnBuyR = rects.buy;
    modalBtnCancelR = rects.cancel;
  } else {
    modalBtnBuyR = modalBtnCancelR = null;
  }


}

function shopMousePressed() {
  const tf = getContainTransform(shopBgImg);

  //If the purchase pop-up window is open: first process the pop-up button
  if (showBuyModal && selectedItemId) {
    if (modalBtnBuyR && inRect(mouseX, mouseY, modalBtnBuyR)) {
      tryBuySelected();
      return;
    }
    if (modalBtnCancelR && inRect(mouseX, mouseY, modalBtnCancelR)) {
      showBuyModal = false;
      return;
    }
    //Click on other parts of the mask ->also cancel
    showBuyModal = false;
    return;
  }

  // 2) close X
  const closeR = getShopCloseRect(tf);
  if (inRect(mouseX, mouseY, closeR)) {
    switchScene("camp");
    return;
  }

    // 3) Handle Equip button click 
  if (infoBtnEquipR && selectedItemId && owned[selectedItemId]) {
    if (inRect(mouseX, mouseY, infoBtnEquipR)) {
      if (equippedWeaponId !== selectedItemId) {
        equipWeapon(selectedItemId);
      }
      return;
    }
  }

    // Handle Sell button click
  if (infoBtnSellR && selectedItemId && owned[selectedItemId]) {
    if (inRect(mouseX, mouseY, infoBtnSellR)) {
      sellItem(selectedItemId);
      return;
    }
  }
  
// Inventory bar click -> select item (show info panel)
  const invHit = hitTestInventory(mouseX, mouseY);
  if (invHit) {
  selectedItemId = invHit;
  showBuyModal = false; // just in case
  return;
}



  // 4) Slot click 
  const hit = hitTestShopSlot(tf, mouseX, mouseY);
  if (hit) {
    selectedItemId = hit.itemId;

    if (!owned[selectedItemId]) {
      showBuyModal = true;
      return;
    }

    showBuyModal = false;
    return;
  }


  //5) Click Blank ->Uncheck
  selectedItemId = null;
}


function shopKeyPressed() {
  //Priority of Esc: Close pop-up first ->Uncheck ->Return to camp last
  if (key === "Escape" || keyCode === ESCAPE) {
    if (showBuyModal) { showBuyModal = false; return; }
    if (selectedItemId) { selectedItemId = null; return; }
    switchScene("camp");
    return;
  }

  //Enter Quick Purchase (optional)
  if ((keyCode === ENTER || keyCode === RETURN) && showBuyModal && selectedItemId) {
    tryBuySelected();
    return;
  }
  // Press R to reset shop (debug / restart loop)
  if (key === "r" || key === "R") {
    resetShop();
    return;
  }

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

function drawShopActionHint(tf) {
  push();

  // Put action hint just above the ESC hint (left-bottom corner)
  const pad = tf.dw * 0.02;
  const x = tf.dx + pad;
  const yEsc = tf.dy + tf.dh - pad;

  const size = Math.max(19, Math.floor(tf.dh * 0.024));
  textAlign(LEFT, BOTTOM);
  textSize(size);
  noStroke();
  fill(255, 200);

  // Show different hint depending on selection (optional)
  const hint = selectedItemId ? "Click buttons to equip / sell" : "Click to buy";
  text(hint, x, yEsc - size * 2.25);

  pop();
}


function drawCoins(tf) {
  push();
  const pad = tf.dw * 0.02;
  const x = tf.dx + pad;
  const y = tf.dy + pad;

  noStroke();
  fill(0, 0, 0, 140);
  rect(x, y, tf.dw * 0.16, tf.dh * 0.06, 12);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(Math.max(14, Math.floor(tf.dh * 0.03)));
  text(`Coins: ${coins}`, x + pad * 0.6, y + tf.dh * 0.03);

  pop();
}

function drawShopItems(tf) {
  hoveredItemId = null;

  for (const slot of SHOP_SLOTS) {
    // Hide purchased items from shelf
    if (owned[slot.itemId]) continue;
    const r = slotRectToScreen(tf, slot);
    const over = inRect(mouseX, mouseY, r);
    if (over) hoveredItemId = slot.itemId;
    

    // slot background
    push();
    noStroke();
    fill(0, 0, 0, over ? 120 : 90);
    rect(r.x, r.y, r.w, r.h, 14);

    // border (selected / hover)
    strokeWeight(3);
    if (selectedItemId === slot.itemId) stroke(255);
    else if (over) stroke(220);
    else stroke(160, 160, 160, 120);
    noFill();
    rect(r.x, r.y, r.w, r.h, 14);

    // label + price
    const item = SHOP_ITEMS.find(it => it.id === slot.itemId);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(Math.max(12, Math.floor(r.h * 0.18)));
    // Draw item icon
    const iconImg = getItemIcon(slot.itemId);
    if (iconImg) {
      drawIconFit(iconImg, r, 0.62);
    }

    pop();
  }
}

function drawItemInfoPanel(tf, itemId, anchor) {
  const item = SHOP_ITEMS.find(it => it.id === itemId);
  if (!item) return;

  push();

  const pad = tf.dw * 0.02;
  const w = tf.dw * 0.28;
  const h = tf.dh * 0.26;

  // Prefer right of anchor, fallback to left
  let x = anchor.x + anchor.w + pad;
  let y = anchor.y - h * 0.15;

  if (x + w > tf.dx + tf.dw) {
    x = anchor.x - pad - w;
  }

  // Clamp inside image area
  x = constrain(x, tf.dx + pad, tf.dx + tf.dw - pad - w);
  y = constrain(y, tf.dy + pad, tf.dy + tf.dh - pad - h);

  // Panel background
  noStroke();
  fill(0, 0, 0, 150);
  rect(x, y, w, h, 16);

  // Title
  fill(255);
  textAlign(LEFT, TOP);
  textSize(Math.max(16, Math.floor(h * 0.14)));
  text(item.name, x + pad * 0.7, y + pad * 0.5);

  // Lines (remove "Click slot to buy" from here)
  textSize(Math.max(12, Math.floor(h * 0.10)));
  fill(230);

  const lines = [
    ...item.desc,
    "",
    owned[itemId] ? "Status: Owned" : `Price: ${item.price} coins`,
    `Your coins: ${coins}`,
  ];

  const lineH = Math.max(14, Math.floor(h * 0.11));
  let yy = y + pad * 0.5 + lineH * 1.6;
  for (const s of lines) {
    text(s, x + pad * 0.7, yy);
    yy += lineH;
  }

  // Buttons (only when owned)
  infoBtnEquipR = null;
  infoBtnSellR = null;

  if (owned[itemId]) {
    const btnH = h * 0.14;
    const btnW = w * 0.38;
    const gap = w * 0.06;

    const by = y + h * 0.82;
    const bx1 = x + (w - (btnW * 2 + gap)) / 2;
    const bx2 = bx1 + btnW + gap;

    infoBtnEquipR = { x: bx1, y: by, w: btnW, h: btnH };
    const isEquipped = equippedWeaponId === itemId;
    drawModalButton(infoBtnEquipR, isEquipped ? "EQUIPPED" : "EQUIP", inRect(mouseX, mouseY, infoBtnEquipR), !isEquipped);

    infoBtnSellR = { x: bx2, y: by, w: btnW, h: btnH };
    drawModalButton(infoBtnSellR, "SELL", inRect(mouseX, mouseY, infoBtnSellR), true);
  }

  pop();
}


function drawBuyModal(tf, itemId) {
  const item = SHOP_ITEMS.find(it => it.id === itemId);
  if (!item) return { buy: null, cancel: null };

  push();

  // overlay
  noStroke();
  fill(0, 0, 0, 170);
  rect(0, 0, width, height);

  const boxW = Math.min(tf.dw * 0.55, 560);
  const boxH = Math.min(tf.dh * 0.32, 260);
  const boxX = width / 2 - boxW / 2;
  const boxY = height / 2 - boxH / 2;

  fill(20, 20, 20, 235);
  rect(boxX, boxY, boxW, boxH, 18);

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(Math.max(18, Math.floor(boxH * 0.16)));
  text("Purchase Item", boxX + boxW / 2, boxY + boxH * 0.22);

  fill(230);
  textSize(Math.max(14, Math.floor(boxH * 0.11)));

  let msg = `${item.name} — ${item.price} coins`;
  if (owned[itemId]) msg = `${item.name} — already owned`;
  text(msg, boxX + boxW / 2, boxY + boxH * 0.46);

  const afford = coins >= item.price;
  const tip = owned[itemId]
    ? "You already have this item."
    : (afford ? "Click BUY to confirm." : "Not enough coins.");
  fill(200);
  textSize(Math.max(12, Math.floor(boxH * 0.09)));
  text(tip, boxX + boxW / 2, boxY + boxH * 0.60);

  // buttons
  const btnW = boxW * 0.26;
  const btnH = boxH * 0.18;
  const gap  = boxW * 0.06;

  const buy = {
    x: boxX + boxW / 2 - gap / 2 - btnW,
    y: boxY + boxH * 0.72,
    w: btnW, h: btnH
  };
  const cancel = {
    x: boxX + boxW / 2 + gap / 2,
    y: boxY + boxH * 0.72,
    w: btnW, h: btnH
  };

  drawModalButton(buy, "BUY", inRect(mouseX, mouseY, buy), !owned[itemId] && afford);
  drawModalButton(cancel, "CANCEL", inRect(mouseX, mouseY, cancel), true);

  pop();
  return { buy, cancel };
}

function drawModalButton(r, label, hover, enabled) {
  push();
  noStroke();

  const alpha = enabled ? (hover ? 210 : 170) : 90;
  fill(255, 255, 255, alpha * 0.15);
  rect(r.x, r.y, r.w, r.h, 12);

  stroke(255, enabled ? (hover ? 255 : 180) : 90);
  strokeWeight(2);
  noFill();
  rect(r.x, r.y, r.w, r.h, 12);

  noStroke();
  fill(255, enabled ? 255 : 120);
  textAlign(CENTER, CENTER);
  textSize(Math.max(14, Math.floor(r.h * 0.42)));
  text(label, r.x + r.w / 2, r.y + r.h / 2);

  pop();
}

function slotRectToScreen(tf, slot) {
  return {
    x: tf.dx + slot.rx * tf.dw,
    y: tf.dy + slot.ry * tf.dh,
    w: slot.rw * tf.dw,
    h: slot.rh * tf.dh,
  };
}

function hitTestShopSlot(tf, mx, my) {
  for (const slot of SHOP_SLOTS) {
    const r = slotRectToScreen(tf, slot);
    if (inRect(mx, my, r)) return slot;
  }
  return null;
}

function tryBuySelected() {
  const itemId = selectedItemId;
  const item = SHOP_ITEMS.find(it => it.id === itemId);
  if (!item) return;

  //Already owned: No deduction, close pop-up window directly
  if (owned[itemId]) {
    showBuyModal = false;
    return;
  }

  //Not enough money: not buying
  if (coins < item.price) {
    //You can also make a shaking/red prompt here
    return;
  }

  //Deduct money+mark ownership
  coins -= item.price;
  owned[itemId] = true;
  saveShopState();

  showBuyModal = false;
}

function canEquip(itemId) {
  return !!owned[itemId];
}

function equipWeapon(itemId) {
  // Only allow equipping owned weapons
  if (!canEquip(itemId)) return;

  // Equip exactly one weapon
  equippedWeaponId = itemId;
  saveShopState();
}

function getItemIcon(itemId) {
  if (itemId === "pistol") return pistolIconImg;
  if (itemId === "fireball") return fireballIconImg;
  return null;
}

function drawIconFit(img, rect, scale = 0.65) {
  // Draw image centered in rect with aspect-fit
  if (!img) return;

  const padW = rect.w * (1 - scale) * 0.5;
  const padH = rect.h * (1 - scale) * 0.5;
  const maxW = rect.w - padW * 2;
  const maxH = rect.h - padH * 2;

  const iw = img.width;
  const ih = img.height;
  if (!iw || !ih) return;

  const s = Math.min(maxW / iw, maxH / ih);
  const dw = iw * s;
  const dh = ih * s;

  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h * 0.46; // slightly upper to leave room for text

  push();
  imageMode(CENTER);
  // Optional: make unowned items dimmer
  // tint(255, owned[selectedItemId] ? 255 : 160);
  image(img, cx, cy, dw, dh);
  pop();
}

function sellItem(itemId) {
  // Only sell owned items
  if (!owned[itemId]) return;

  // Refund coins
  const item = SHOP_ITEMS.find(it => it.id === itemId);
  if (item) {
    coins += Math.round(item.price * SELL_REFUND_RATE);
  }

  // Remove from inventory
  owned[itemId] = false;

  // If it was equipped, unequip it (or auto-equip another owned item)
  if (equippedWeaponId === itemId) {
    equippedWeaponId = null;

    // Optional: auto-equip another owned weapon if exists
    const nextOwned = SHOP_ITEMS.find(it => owned[it.id]);
    if (nextOwned) equippedWeaponId = nextOwned.id;
  }

  // Close UI state (optional)
  showBuyModal = false;

  saveShopState();
}

function resetShop() {
  // Reset everything so player can buy again
  coins = START_COINS;
  owned = { pistol: false, fireball: false };
  equippedWeaponId = null;

  selectedItemId = null;
  hoveredItemId = null;
  showBuyModal = false;

  saveShopState();
}

function getOwnedItemIds() {
  // Return owned items in a stable order
  return SHOP_ITEMS.map(it => it.id).filter(id => !!owned[id]);
}

function getInventoryBarRect(tf) {
  const pad = tf.dw * 0.03;
  const barH = tf.dh * 0.14;

  // Move right a bit
  const x = tf.dx + pad + tf.dw * 0.05;

  // Move up a bit
  const y = tf.dy + tf.dh - pad - barH - tf.dh * 0.12;

  const w = tf.dw - pad * 2;
  const h = barH;
  return { x, y, w, h };
}


function drawInventoryBar(tf) {
  hoveredInvItemId = null;
  invSlots = [];

  const bar = getInventoryBarRect(tf);

  push();
  // Bar background
  noStroke();
  fill(0, 0, 0, 120);
  rect(bar.x, bar.y, bar.w, bar.h, 18);

  // Title
  fill(255, 210);
  textAlign(LEFT, CENTER);
  textSize(Math.max(12, Math.floor(bar.h * 0.22)));
  text("Inventory", bar.x + bar.w * 0.03, bar.y + bar.h * 0.22);

  const ownedIds = getOwnedItemIds(); // e.g. ["pistol","fireball"]
  const maxSlots = 6;                // number of inventory cells

  // Slot layout
  const slotSize = bar.h * 0.62;
  const gap = slotSize * 0.22;
  const startX = bar.x + bar.w * 0.22;
  const cy = bar.y + bar.h * 0.60;

  for (let i = 0; i < maxSlots; i++) {
    const itemId = ownedIds[i] || null;

    const r = {
      x: startX + i * (slotSize + gap),
      y: cy - slotSize / 2,
      w: slotSize,
      h: slotSize,
      itemId,
    };
    invSlots.push(r);

    const over = inRect(mouseX, mouseY, r);
    if (over && itemId) hoveredInvItemId = itemId;

    // Draw empty cell background
    push();
    noStroke();
    fill(255, 255, 255, over ? 28 : 18);
    rect(r.x, r.y, r.w, r.h, 14);

    // Draw border (highlight equipped)
    if (itemId && equippedWeaponId === itemId) {
      stroke(255, 220, 0, 220);
      strokeWeight(3);
    } else {
      stroke(255, 255, 255, 90);
      strokeWeight(2);
    }
    noFill();
    rect(r.x + 2, r.y + 2, r.w - 4, r.h - 4, 12);

    // Draw icon only if this cell has an item
    if (itemId) {
      const iconImg = getItemIcon(itemId);
      if (iconImg) drawIconFit(iconImg, r, 0.78);
    }

    pop();
  }

  // Cursor hint
  if (hoveredInvItemId) cursor("pointer");
}

function hitTestInventory(mx, my) {
  for (const r of invSlots) {
    if (r.itemId && inRect(mx, my, r)) return r.itemId;
  }
  return null;
}

function getItemAnchorRect(tf, itemId) {
  // If owned: anchor to inventory slot rect
  if (owned[itemId]) {
    for (const r of invSlots) {
      if (r.itemId === itemId) return r;
    }
    return null;
  }

  // If not owned: anchor to shelf slot rect
  const slot = SHOP_SLOTS.find(s => s.itemId === itemId);
  if (!slot) return null;
  return slotRectToScreen(tf, slot);
}




