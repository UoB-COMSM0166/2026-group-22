// main.js — one p5 loop, scene manager (extended)

let scene = "title";
// scenes: "title" | "select" | "camp" | "shop" | "board" | "settings" | "level"

function switchScene(next) {
  scene = next;

  // onEnter hooks
  if (scene === "shop" && typeof shopOnEnter === "function") shopOnEnter();
  if (scene === "camp" && typeof campOnEnter === "function") campOnEnter();
  if (scene === "board" && typeof boardOnEnter === "function") boardOnEnter();
  if (scene === "settings" && typeof settingsOnEnter === "function") settingsOnEnter();
  if (scene === "select" && typeof selectOnEnter === "function") selectOnEnter();
  if (scene === "title" && typeof titleOnEnter === "function") titleOnEnter();
  if (scene === "level" && typeof levelOnEnter === "function") levelOnEnter();
}

// ---- p5 lifecycle (ONLY ONE SET) ----
function preload() {
  if (typeof titlePreload === "function") titlePreload();
  if (typeof selectPreload === "function") selectPreload();

  if (typeof campPreload === "function") campPreload();
  if (typeof shopPreload === "function") shopPreload();
  if (typeof boardPreload === "function") boardPreload();
  if (typeof settingsPreload === "function") settingsPreload();
  if (typeof levelPreload === "function") levelPreload();

  // ONLY load font once (global). DO NOT loadFont in other files.
  if (window.Assets && !window.Assets.plasdripFont) {
    window.Assets.plasdripFont = loadFont("assets/plasdrip.ttf");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (typeof titleSetup === "function") titleSetup();
  if (typeof selectSetup === "function") selectSetup();

  if (typeof campSetup === "function") campSetup();
  if (typeof shopSetup === "function") shopSetup();
  if (typeof boardSetup === "function") boardSetup();
  if (typeof settingsSetup === "function") settingsSetup();
  if (typeof levelSetup === "function") levelSetup();

  switchScene(scene);
}

function draw() {
  if (scene === "title" && typeof titleDraw === "function") return titleDraw();
  if (scene === "select" && typeof selectDraw === "function") return selectDraw();

  if (scene === "camp" && typeof campDraw === "function") return campDraw();
  if (scene === "shop" && typeof shopDraw === "function") return shopDraw();
  if (scene === "board" && typeof boardDraw === "function") return boardDraw();
  if (scene === "settings" && typeof settingsDraw === "function") return settingsDraw();
  if (scene === "level" && typeof levelDraw === "function") return levelDraw();

  // fallback
  background(0);
}

function mousePressed() {
  if (scene === "title" && typeof titleMousePressed === "function") return titleMousePressed();
  if (scene === "select" && typeof selectMousePressed === "function") return selectMousePressed();

  if (scene === "camp" && typeof campMousePressed === "function") return campMousePressed();
  if (scene === "shop" && typeof shopMousePressed === "function") return shopMousePressed();
  if (scene === "board" && typeof boardMousePressed === "function") return boardMousePressed();
  if (scene === "settings" && typeof settingsMousePressed === "function") return settingsMousePressed();
  if (scene === "level" && typeof levelMousePressed === "function") return levelMousePressed();
}

function keyPressed() {
  if (scene === "title" && typeof titleKeyPressed === "function") return titleKeyPressed();
  if (scene === "select" && typeof selectKeyPressed === "function") return selectKeyPressed();

  if (scene === "camp" && typeof campKeyPressed === "function") return campKeyPressed();
  if (scene === "shop" && typeof shopKeyPressed === "function") return shopKeyPressed();
  if (scene === "board" && typeof boardKeyPressed === "function") return boardKeyPressed();
  if (scene === "settings" && typeof settingsKeyPressed === "function") return settingsKeyPressed();
  if (scene === "level" && typeof levelKeyPressed === "function") return levelKeyPressed();
}

function windowResized() {
  if (scene === "level" && typeof levelHandleResize === "function") {
    levelHandleResize();
    return;
  }
  resizeCanvas(window.innerWidth, window.innerHeight);
}

