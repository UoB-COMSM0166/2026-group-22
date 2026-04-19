class AssetManager {
  constructor() {
    this.images = {};
    this.levelAssets = [];
    this.fonts = {};
    this.isLoaded = false;
  }

  preload() {
    this.images.char1_idle = loadImage("./assets/entities/char/char1/idle.png");
    this.images.char1_walk1 = loadImage("./assets/entities/char/char1/walk1.png");
    this.images.char1_walk2 = loadImage("./assets/entities/char/char1/walk2.png");
    this.images.char1_jump = loadImage("./assets/entities/char/char1/jump.png");
    this.images.char1_attack = loadImage("./assets/entities/char/char1/attack.png");
    this.images.char1_skill = loadImage("./assets/entities/char/char1/skill.png");
    this.images.char1_bust = loadImage("./assets/entities/char/char1/bust.png");

    this.images.char2_idle = loadImage("./assets/entities/char/char2/idle.png");
    this.images.char2_walk1 = loadImage("./assets/entities/char/char2/walk1.png");
    this.images.char2_walk2 = loadImage("./assets/entities/char/char2/walk2.png");
    this.images.char2_jump = loadImage("./assets/entities/char/char2/jump.png");
    this.images.char2_attack = loadImage("./assets/entities/char/char2/attack.png");
    this.images.char2_skill = loadImage("./assets/entities/char/char2/skill.png");
    this.images.char2_bust = loadImage("./assets/entities/char/char2/bust.png");

    this.images.boss_slash = loadImage("./assets/projectiles/slash.png");

    this.loadSpriteSheet("./assets/entities/enemies/fire_spirit/idle.png", 128, 128, 6, (frames) => {
      this.images.minion_idle = frames;
    });

    this.loadSpriteSheet("./assets/entities/enemies/fire_spirit/walk.png", 128, 128, 7, (frames) => {
      this.images.minion_walk = frames;
    });

    this.loadSpriteSheet("./assets/entities/enemies/fire_spirit/attack.png", 128, 128, 12, (frames) => {
      this.images.minion_attack = frames;
    });

    this.images.title_bg = loadImage("./assets/scenes/title.png");
    this.images.char_select_bg = loadImage("./assets/scenes/char_select.png");
    this.images.difficult_select_bg = loadImage("./assets/scenes/diff_select.png");
    this.images.camp_scene = loadImage("./assets/scenes/camp.png");
    this.images.shop_bg = loadImage("./assets/scenes/shop.png");

    this.images.start_btn = loadImage("./assets/ui/btn_start.png");
    this.images.select_btn = loadImage("./assets/ui/btn_select.png");
    this.images.easy_btn = loadImage("./assets/ui/btn_easy.png");
    this.images.difficult_btn = loadImage("./assets/ui/btn_difficult.png");

    this.images.arrow_r = loadImage("./assets/ui/arrow_right_transparent.png");
    this.images.arrow_l = loadImage("./assets/ui/arrow_left_transparent.png");
    this.images.icon_set = loadImage("./assets/ui/icon_settings.png");
    this.images.icon_snd = loadImage("./assets/ui/icon_sound.png");

    this.images.full_heart = loadImage("./assets/ui/full_heart.png");
    this.images.half_heart = loadImage("./assets/ui/half_heart.png");
    this.images.empty_heart = loadImage("./assets/ui/empty_heart.png");

    for (let i = 1; i <= 12; i++) {
      const key = `coin${i}`;
      const path = `./assets/collectables/coin/${key}.png`;
      this.images[key] = loadImage(path);
    }
    this.images.bow = loadImage("./assets/collectables/bow.png");
    this.images.bubble = loadImage("./assets/collectables/bubble.png");
    this.images.jump_booster = loadImage("./assets/collectables/jump_booster.png");
    this.images.shrink_potion = loadImage("./assets/collectables/shrink_potion.png");
    
    this.images.pistol = loadImage("./assets/weapons/pistol.png");
    this.images.ion_fury = loadImage("./assets/weapons/ion_fury.png");
    this.images.the_shredder = loadImage("./assets/weapons/the_shredder.png");
    this.images.vipers_kiss = loadImage("./assets/weapons/vipers_kiss.png");
    this.images.titans_breath = loadImage("./assets/weapons/titans_breath.png");

    this.fonts.main = loadFont("./assets/fonts/plasdrip.ttf");

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
          far: loadImage(`./assets/levels/${data.backgrounds.far}`),
          midBack: loadImage(`./assets/levels/${data.backgrounds.midBack}`),
          midFront: loadImage(`./assets/levels/${data.backgrounds.midFront}`),
          front: loadImage(`./assets/levels/${data.backgrounds.front}`)
        },
        tile: loadImage(`./assets/levels/${data.tile}`),
        crackTile: null,
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

      if (data.crackTile) {
        levelBundle.crackTile = loadImage(`./assets/levels/${data.crackTile}`)
      }

      ['idle', 'walk', 'hurt'].forEach(action => {
        const config = data.enemySprites[action];
        const path = `./assets/entities/enemies/${config.path}`;

        this.loadSpriteSheet(path, config.w, config.h, config.count, (frames) => {
          levelBundle.enemySprites[action] = frames;
        });
      });

      ['idle', 'attack', 'hurt', 'dead'].forEach(action => {
        const config = data.bossSprites[action];
        const path = `./assets/entities/bosses/${config.path}`;

        this.loadSpriteSheet(path, config.w, config.h, config.count, (frames) => {
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