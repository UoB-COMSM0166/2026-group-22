function settingsPreload() {}
function settingsSetup() {}
function settingsDraw() {
  background(0);
  fill(255); textSize(32); textAlign(CENTER, CENTER);
  text("SETTINGS (TODO) — press Esc to return", width/2, height/2);
  cursor("default");
}
function settingsMousePressed() {}
function settingsKeyPressed() { if (key === "Escape") switchScene("camp"); }