// src/scenes/SettingsScene.js
class SettingsScene {
  constructor() {
    // You can add properties like this.volume = 100 later
  }

  preload() {
    // Load any settings icons or background music here
  }

  setup() {
    // One-time setup
  }

  onEnter() {
    console.log("Entering Settings...");
  }

  draw() {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    
    // Add a bit of style to your placeholder
    text("SETTINGS", width / 2, height / 2 - 40);
    
    textSize(16);
    fill(150);
    text("(TODO: Add Volume & Graphics Options)", width / 2, height / 2);
    
    fill(200);
    text("Press ESC to return to Camp", width / 2, height / 2 + 60);
    
    cursor("default");
  }

  mousePressed() {
    // Handle slider clicks here later
  }

  keyPressed() {
    // Standard back-navigation
    if (keyCode === ESCAPE) {
      sceneManager.switch("camp");
    }
  }
}