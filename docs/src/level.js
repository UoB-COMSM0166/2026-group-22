// level.js
// Make level scene look like the original standalone Kirby demo:
// fixed 600x400 canvas, centered on the page.

let levelPlayer = null;
let levelWorld = null;
let levelDoor = 1;

let levelAssets = {
  idle: null,
  walk: null,
  jump: null,
};

const LEVEL_CANVAS_W = 600;
const LEVEL_CANVAS_H = 400;

let levelCanvasActive = false;

function levelPreload() {
  levelAssets.idle = loadImage("./assets/kirby_idle.png");
  levelAssets.walk = loadImage("./assets/kirby_move.png");
  levelAssets.jump = loadImage("./assets/kirby_jump.png");
}

function levelSetup() {
  // nothing needed
}

function buildLevel(doorNumber = 1) {
  levelDoor = doorNumber;

  const playerFrames = [
    levelAssets.idle,
    levelAssets.walk,
    levelAssets.jump,
  ];

  levelPlayer = new Player(playerFrames);
  levelWorld = new World(levelPlayer);

  console.log("[level] buildLevel for door:", doorNumber);
}

function applyLevelCanvasMode() {
  resizeCanvas(LEVEL_CANVAS_W, LEVEL_CANVAS_H);

  const html = document.documentElement;
  const body = document.body;
  const c = document.querySelector("canvas");

  html.style.height = "100%";

  body.style.margin = "0";
  body.style.minHeight = "100vh";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.background = "#e9e9e9"; // 接近你截图里的灰白背景
  body.style.overflow = "hidden";

  if (c) {
    c.style.display = "block";
    c.style.margin = "0";
    c.style.width = LEVEL_CANVAS_W + "px";
    c.style.height = LEVEL_CANVAS_H + "px";
  }

  levelCanvasActive = true;
}

function restoreFullCanvasMode() {
  const html = document.documentElement;
  const body = document.body;
  const c = document.querySelector("canvas");

  // 先恢复页面样式
  html.style.height = "";
  html.style.width = "";

  body.style.margin = "0";
  body.style.minHeight = "";
  body.style.height = "";
  body.style.display = "block";
  body.style.justifyContent = "";
  body.style.alignItems = "";
  body.style.background = "#111";
  body.style.overflow = "";

  // 再恢复 canvas 样式
  if (c) {
    c.style.display = "block";
    c.style.margin = "0 auto";
    c.style.width = "";
    c.style.height = "";
    c.style.maxWidth = "";
    c.style.maxHeight = "";
  }

  // 最后恢复成窗口全屏大小
  resizeCanvas(window.innerWidth, window.innerHeight);

  levelCanvasActive = false;
}

function levelOnEnter() {
  applyLevelCanvasMode();

  if (!levelWorld) {
    buildLevel(levelDoor || 1);
  }
}

function startLevel(n) {
  levelDoor = n || 1;
  applyLevelCanvasMode();
  buildLevel(levelDoor);
}

function levelDraw() {
  if (!levelPlayer || !levelWorld) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Loading level...", width / 2, height / 2);
    return;
  }

  levelWorld.update();
  levelWorld.show();
  drawLevelUI();
}

function drawLevelUI() {
  push();
  fill(255);
  textSize(16);
  textAlign(CENTER, TOP);
  text("A / D to Move | SPACE to Jump | ESC to Camp", width / 2, 16);
  pop();
}

function levelMousePressed() {
  // no-op
}

function levelKeyPressed() {
  if (key === "Escape" || keyCode === ESCAPE) {
    restoreFullCanvasMode();
    switchScene("camp");
    return;
  }

  if (levelPlayer) {
    levelPlayer.handleKeyPress();
  }
}

function levelHandleResize() {
  if (levelCanvasActive) {
    applyLevelCanvasMode();
  }
}
