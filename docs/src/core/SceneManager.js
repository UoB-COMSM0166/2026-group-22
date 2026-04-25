class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentKey = "";

    this.player = null;
    this.instructions = new InstructionUI();
  }

  initLoader(bgImg) {
    this.scenes = {
      "loading": new LoadingScene(bgImg)
    }
  }

  initGameScenes() {
    this.scenes = {
      "title": new TitleScene(),
      "select": new CharSelectScene(),
      "difficulty": new DiffSelectScene(),
      "camp": new CampScene(),
      "shop": new ShopScene(),
      "board": new HintBoardScene(),
      "settings": new SettingsScene(),
      "level": new LevelScene(),
      "boss": new BossScene()
    };
  }

  start() {
    this.switch("loading");
  }

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

    if (this.currentScene && this.currentScene.onEnter) {
      this.currentScene.onEnter(data);
    }
  }


  preload() {
    for (let key in this.scenes) {
      if (this.scenes[key].preload) this.scenes[key].preload();
    }
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
      this.instructions.draw();
    } else {
      background(0);
    }
  }

  mousePressed() {
    if (this.instructions.isActive) {
      this.instructions.advance();
      return;
    }

    if (this.currentScene && this.currentScene.mousePressed) {
      this.currentScene.mousePressed();
    }
  }

  keyPressed() {
    if (this.instructions.isActive) {
      if (keyCode === ENTER) {
        this.instructions.advance();
        return;
      }
    }

    if (this.currentScene && this.currentScene.keyPressed) {
      this.currentScene.keyPressed();
    }
  }

  windowResized() {
    if (this.currentScene && this.currentScene.canvasActive) {
      if (this.currentScene.handleResize) this.currentScene.handleResize();
    } else {
      resizeCanvas(windowWidth, windowHeight);
    }
  }
}

const sceneManager = new SceneManager();