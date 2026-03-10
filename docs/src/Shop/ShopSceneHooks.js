// shopSceneHooks.js
// Global hooks used by main.js, forwarding to Shop instance

let SHOP = null;

function shopPreload() {
  const assets = new ShopAssets();
  assets.preload();

  const state = new ShopState();
  const ui = new ShopUI(assets);

  SHOP = new Shop(state, assets, ui);
}

function shopOnEnter() {
  if (SHOP) SHOP.onEnter();
}

function shopDraw() {
  if (SHOP) SHOP.draw();
}

function shopMousePressed() {
  if (SHOP) SHOP.mousePressed();
}

function shopKeyPressed() {
  if (SHOP) SHOP.keyPressed();
}
