class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentKey = "";
    // Added: A central reference to the player so HP/Items persist across scenes
    this.player = null;
  }

  init() {
    this.scenes = {
      "title": new TitleScene(),
      "select": new CharacterSelectScene(),
      "camp": new CampScene(),
      "shop": new ShopScene(),
      "board": new HintBoardScene(),
      "settings": new SettingsScene(),
      "level": new LevelScene(),
      "boss": new BossScene() // REGISTER: Added the BossScene
    };
  }

  start() {
    this.switch("title");
  }

  /**
   * Enhanced switch logic to allow passing data
   * @param {string} key - The scene name
   * @param {any} data - Optional data (Level index, Boss type, etc.)
   */
  switch(key, data) {
    if (!this.scenes[key]) {
      console.error(`Scene "${key}" not found!`);
      return;
    }

    if (this.currentScene && this.currentScene.onExit) {
      this.currentScene.onExit();
    }

    this.currentKey = key;
    this.currentScene = this.scenes[key];

    // Pass the 'data' argument to the new scene's onEnter method
    if (this.currentScene && this.currentScene.onEnter) {
      this.currentScene.onEnter(data);
    }

    console.log(`[SceneManager] Switched to: ${key}`, data ? `with data: ${data}` : "");
  }

  // --- p5.js Lifecycle Delegation ---

  preload() {
    for (let key in this.scenes) {
      if (this.scenes[key].preload) this.scenes[key].preload();
    }

    if (!window.Assets) window.Assets = {};
    window.Assets.plasdripFont = loadFont("assets/plasdrip.ttf");
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
    for (let key in this.scenes) {
      if (this.scenes[key].setup) this.scenes[key].setup();
    }
  }

  draw() {
    if (this.currentScene) {
      this.currentScene.draw();
    } else {
      background(0);
    }
  }

  mousePressed() {
    if (this.currentScene && this.currentScene.mousePressed) {
      this.currentScene.mousePressed();
    }
  }

  keyPressed() {
    if (this.currentScene && this.currentScene.keyPressed) {
      this.currentScene.keyPressed();
    }
  }

  windowResized() {
    // Only resize if not in 'Fixed Canvas' mode (LevelScene handleResize handles that)
    if (this.currentScene && this.currentScene.canvasActive) {
      if (this.currentScene.handleResize) this.currentScene.handleResize();
    } else {
      resizeCanvas(windowWidth, windowHeight);
    }
  }
}

const sceneManager = new SceneManager();