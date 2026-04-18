class AssetManager {
  constructor() {
    this.images = {};
    this.levelAssets = [];
    this.fonts = {};
    this.isLoaded = false;
  }

  preload() {
    this.images.char1_idle = loadImage("./assets/char/char1/char1_idle.png");
    this.images.char1_walk1 = loadImage("./assets/char/char1/char1_walk1.png");
    this.images.char1_walk2 = loadImage("./assets/char/char1/char1_walk2.png");
    this.images.char1_jump = loadImage("./assets/char/char1/char1_jump.png");
    this.images.char1_attack = loadImage("./assets/char/char1/char1_attack.png");
    this.images.char1_skill = loadImage("./assets/char/char1/char1_skill.png");
    this.images.char1_bust = loadImage("./assets/char/char1/char1_bust.png");

    this.images.char2_idle = loadImage("./assets/char/char2/char2_idle.png");
    this.images.char2_walk1 = loadImage("./assets/char/char2/char2_walk1.png");
    this.images.char2_walk2 = loadImage("./assets/char/char2/char2_walk2.png");
    this.images.char2_jump = loadImage("./assets/char/char2/char2_jump.png");
    this.images.char2_attack = loadImage("./assets/char/char2/char2_attack.png");
    this.images.char2_skill = loadImage("./assets/char/char2/char2_skill.png");
    this.images.char2_bust = loadImage("./assets/char/char2/char2_bust.png");

    this.images.boss_slash = loadImage("./assets/boss_slash.png");

    this.loadSpriteSheet("./assets/fire_spirit/idle.png", 128, 128, 6, (frames) => {
      this.images.minion_idle = frames;
    });

    this.loadSpriteSheet("./assets/fire_spirit/walk.png", 128, 128, 7, (frames) => {
      this.images.minion_walk = frames;
    });

    this.loadSpriteSheet("./assets/fire_spirit/attack.png", 128, 128, 12, (frames) => {
      this.images.minion_attack = frames;
    });

    this.images.title_bg = loadImage("./assets/title_cover.png");
    this.images.start_btn = loadImage("./assets/btn_start.png");
    this.images.char_select_bg = loadImage("./assets/character_select.png");
    this.images.select_btn = loadImage("./assets/btn_select.png");
    this.images.camp_scene = loadImage("./assets/camp_scene.png");
    this.images.arrow_r = loadImage("./assets/arrow_right_transparent.png");
    this.images.arrow_l = loadImage("./assets/arrow_left_transparent.png");
    this.images.icon_set = loadImage("./assets/icon_settings.png");
    this.images.icon_snd = loadImage("./assets/icon_sound.png");

    this.images.full_heart = loadImage("./assets/full_heart.png");
    this.images.half_heart = loadImage("./assets/half_heart.png");
    this.images.empty_heart = loadImage("./assets/empty_heart.png");

    for (let i = 1; i <= 12; i++) {
      const key = `coin${i}`;
      const path = `./assets/coin/${key}.png`;
      this.images[key] = loadImage(path);
    }

    this.images.shop_bg = loadImage("./assets/shop_bg.png");
    this.images.icon_pistol = loadImage("./assets/icon_pistol.png");
    this.images.icon_fireball = loadImage("./assets/icon_fireball.png");

    this.fonts.main = loadFont("./assets/plasdrip.ttf");

    this.loadLevelAssets();

    this.isLoaded = true;
    console.log("[AssetManager] All global assets preloaded.");
  }

  loadLevelAssets() {
    this.levelAssets = CONFIG.LEVELS.map(level => {
      const data = level.assets;
      if (!data) return null;

      const levelBundle = {
        backgrounds: {
          far: loadImage(data.backgrounds.far),
          midBack: loadImage(data.backgrounds.midBack),
          midFront: loadImage(data.backgrounds.midFront),
          front: loadImage(data.backgrounds.front)
        },
        platformTile: loadImage(data.platformTile),
        enemySprites: {
          idle: [],
          walk: [],
          hurt: []
        },
        bossSprites: {
          idle: [],
          attack: [],
          hurt: [],
          slash: this.getImg('boss_slash')
        }
      };

      ['idle', 'walk', 'hurt'].forEach(action => {
        const config = data.enemySprites[action];

        this.loadSpriteSheet(config.path, config.w, config.h, config.count, (frames) => {
          levelBundle.enemySprites[action] = frames;
        });
      });

      ['idle', 'attack', 'hurt', 'dead'].forEach(action => {
        const config = data.bossSprites[action];

        this.loadSpriteSheet(config.path, config.w, config.h, config.count, (frames) => {
          levelBundle.bossSprites[action] = frames;
        });
      });

      return levelBundle;
    });
  }

  loadSpriteSheet(path, frameW, frameH, frameCount, callback) {
    loadImage(path, (sheet) => {
      let frames = [];
      for (let i = 0; i < frameCount; i++) {
        frames.push(sheet.get(i * frameW, 0, frameW, frameH));
      }
      callback(frames);
    });
  }

  getImg(key) {
    if (!this.images[key]) console.warn(`AssetManager: Image '${key}' not found.`);
    return this.images[key];
  }

  getFont(key = 'main') {
    return this.fonts[key];
  }

  getLevelAssets(index) {
    return this.levelAssets[index] || null;
  }
}

const assets = new AssetManager();