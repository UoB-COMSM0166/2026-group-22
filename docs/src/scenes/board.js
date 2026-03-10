function boardPreload() {}
function boardSetup() {}
function boardDraw() {
  background(0);
  fill(255); textSize(32); textAlign(CENTER, CENTER);
  text("BOARD (TODO) — press Esc to return", width/2, height/2);
  cursor("default");
}
function boardMousePressed() {}
function boardKeyPressed() { if (key === "Escape") switchScene("camp"); }
