class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentKey = "";
  }

  // 1. Initialize and register all scene instances
  init() {
    this.scenes = {
      "title":    new TitleScene(),
      "select":   new CharacterSelectScene(),
      "camp":     new CampScene(),
      "shop":     new ShopScene(), 
      "board":    new HintBoardScene(), // Add your board scene here
      "settings": new SettingsScene(),
      "level":    new LevelScene()
    };
    
    // Default starting point
    this.switch("title");
  }

  // 2. The transition logic (The "Brain" of the engine)
  switch(key) {
    if (!this.scenes[key]) {
      console.error(`Scene "${key}" not found!`);
      return;
    }

    // A) Cleanup the OLD scene (very important for Level CSS reset)
    if (this.currentScene && this.currentScene.onExit) {
      this.currentScene.onExit();
    }
    
    this.currentKey = key;
    this.currentScene = this.scenes[key];
    
    // B) Setup the NEW scene
    if (this.currentScene && this.currentScene.onEnter) {
      this.currentScene.onEnter();
    }

    console.log(`[SceneManager] Switched to: ${key}`);
  }

  // 3. p5.js Lifecycle Delegation
  preload() {
    // Tell every scene to load its own images/sounds
    for (let key in this.scenes) {
      if (this.scenes[key].preload) this.scenes[key].preload();
    }
    
    // Global Assets
    if (!window.Assets) window.Assets = {};
    window.Assets.plasdripFont = loadFont("assets/plasdrip.ttf");
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
    // Some scenes might need a one-time setup (like loading pixels)
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
    // Normal scenes just resize the canvas
    resizeCanvas(windowWidth, windowHeight);
    
    // The Level scene might have special resize logic (centering)
    if (this.currentScene && this.currentScene.handleResize) {
      this.currentScene.handleResize();
    }
  }
}

// Instantiate it globally so all scenes can call 'sceneManager.switch()'
const sceneManager = new SceneManager();