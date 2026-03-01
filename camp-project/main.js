// main.js — one p5 loop, scene manager

let scene = "camp"; // "camp" | "shop" | "board" | "settings" | "level"

function switchScene(next) {
  scene = next;

  // onEnter hooks
  if (scene === "shop" && typeof shopOnEnter === "function") shopOnEnter();
  if (scene === "camp" && typeof campOnEnter === "function") campOnEnter();
  if (scene === "board" && typeof boardOnEnter === "function") boardOnEnter();
  if (scene === "settings" && typeof settingsOnEnter === "function") settingsOnEnter();
}

// ---- p5 lifecycle ----
function preload() {
  if (typeof campPreload === "function") campPreload();
  if (typeof shopPreload === "function") shopPreload();
  if (typeof boardPreload === "function") boardPreload();
  if (typeof settingsPreload === "function") settingsPreload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (typeof campSetup === "function") campSetup();
  if (typeof shopSetup === "function") shopSetup();
  if (typeof boardSetup === "function") boardSetup();
  if (typeof settingsSetup === "function") settingsSetup();

  // enter initial scene
  switchScene(scene);
}

function draw() {
  if (scene === "camp" && typeof campDraw === "function") return campDraw();
  if (scene === "shop" && typeof shopDraw === "function") return shopDraw();
  if (scene === "board" && typeof boardDraw === "function") return boardDraw();
  if (scene === "settings" && typeof settingsDraw === "function") return settingsDraw();

  // fallback
  background(0);
}

function mousePressed() {
  if (scene === "camp" && typeof campMousePressed === "function") return campMousePressed();
  if (scene === "shop" && typeof shopMousePressed === "function") return shopMousePressed();
  if (scene === "board" && typeof boardMousePressed === "function") return boardMousePressed();
  if (scene === "settings" && typeof settingsMousePressed === "function") return settingsMousePressed();
}

function keyPressed() {
  if (scene === "camp" && typeof campKeyPressed === "function") return campKeyPressed();
  if (scene === "shop" && typeof shopKeyPressed === "function") return shopKeyPressed();
  if (scene === "board" && typeof boardKeyPressed === "function") return boardKeyPressed();
  if (scene === "settings" && typeof settingsKeyPressed === "function") return settingsKeyPressed();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

