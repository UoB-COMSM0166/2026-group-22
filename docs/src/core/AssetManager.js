class AssetManager {
  constructor() {
    this.images = {};
    this.levelAssets = [];
    this.fonts = {};
    this.isLoaded = false;

    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  trackLoad(path, type = 'image', callback = null) {
    this.totalAssets++;
    const onComplete = (asset) => {
      this.loadedAssets++;
      if (callback) callback(asset);
    };

    if (type === 'font') return loadFont(path, onComplete);
    return loadImage(path, onComplete);
  }

  getProgress() {
    return this.loadedAssets / this.totalAssets;
  }

  preload() {
    this.images.char1_idle = this.trackLoad("./assets/entities/char/char1/idle.png");
    this.images.char1_walk1 = this.trackLoad("./assets/entities/char/char1/walk1.png");
    this.images.char1_walk2 = this.trackLoad("./assets/entities/char/char1/walk2.png");
    this.images.char1_jump = this.trackLoad("./assets/entities/char/char1/jump.png");
    this.images.char1_attack = this.trackLoad("./assets/entities/char/char1/attack.png");
    this.images.char1_skill = this.trackLoad("./assets/entities/char/char1/skill.png");
    this.images.char1_bust = this.trackLoad("./assets/entities/char/char1/bust.png");

    this.images.char2_idle = this.trackLoad("./assets/entities/char/char2/idle.png");
    this.images.char2_walk1 = this.trackLoad("./assets/entities/char/char2/walk1.png");
    this.images.char2_walk2 = this.trackLoad("./assets/entities/char/char2/walk2.png");
    this.images.char2_jump = this.trackLoad("./assets/entities/char/char2/jump.png");
    this.images.char2_attack = this.trackLoad("./assets/entities/char/char2/attack.png");
    this.images.char2_skill = this.trackLoad("./assets/entities/char/char2/skill.png");
    this.images.char2_bust = this.trackLoad("./assets/entities/char/char2/bust.png");

    this.images.boss_slash = this.trackLoad("./assets/projectiles/slash.png");

    this.loadSpriteSheet("./assets/entities/enemies/fire_spirit/idle.png", 128, 128, 6, (frames) => {
      this.images.minion_idle = frames;
    });

    this.loadSpriteSheet("./assets/entities/enemies/fire_spirit/walk.png", 128, 128, 7, (frames) => {
      this.images.minion_walk = frames;
    });

    this.loadSpriteSheet("./assets/entities/enemies/fire_spirit/attack.png", 128, 128, 12, (frames) => {
      this.images.minion_attack = frames;
    });

    this.images.fire_ball = this.trackLoad("./assets/entities/enemies/fire_spirit/fire_ball.png")

    this.images.title_bg = this.trackLoad("./assets/scenes/title.png");
    this.images.char_select_bg = this.trackLoad("./assets/scenes/char_select.png");
    this.images.difficult_select_bg = this.trackLoad("./assets/scenes/diff_select.png");
    this.images.camp_scene = this.trackLoad("./assets/scenes/camp.png");
    this.images.shop_bg = this.trackLoad("./assets/scenes/shop.png");

    this.images.start_btn = this.trackLoad("./assets/ui/btn_start.png");
    this.images.select_btn = this.trackLoad("./assets/ui/btn_select.png");
    this.images.easy_btn = this.trackLoad("./assets/ui/btn_easy.png");
    this.images.difficult_btn = this.trackLoad("./assets/ui/btn_difficult.png");

    this.images.arrow_r = this.trackLoad("./assets/ui/arrow_right_transparent.png");
    this.images.arrow_l = this.trackLoad("./assets/ui/arrow_left_transparent.png");
    this.images.icon_set = this.trackLoad("./assets/ui/icon_settings.png");
    this.images.icon_snd = this.trackLoad("./assets/ui/icon_sound.png");

    this.images.full_heart = this.trackLoad("./assets/ui/full_heart.png");
    this.images.half_heart = this.trackLoad("./assets/ui/half_heart.png");
    this.images.empty_heart = this.trackLoad("./assets/ui/empty_heart.png");

    for (let i = 1; i <= 12; i++) {
      const key = `coin${i}`;
      const path = `./assets/collectables/coin/${key}.png`;
      this.images[key] = this.trackLoad(path);
    }
    this.images.bow = this.trackLoad("./assets/collectables/bow.png");
    this.images.bubble = this.trackLoad("./assets/collectables/bubble.png");
    this.images.jump_booster = this.trackLoad("./assets/collectables/jump_booster.png");
    this.images.shrink_potion = this.trackLoad("./assets/collectables/shrink_potion.png");

    this.images.pistol = this.trackLoad("./assets/weapons/pistol.png");
    this.images.ion_fury = this.trackLoad("./assets/weapons/ion_fury.png");
    this.images.the_shredder = this.trackLoad("./assets/weapons/the_shredder.png");
    this.images.vipers_kiss = this.trackLoad("./assets/weapons/vipers_kiss.png");
    this.images.titans_breath = this.trackLoad("./assets/weapons/titans_breath.png");

    this.images.pistol_bullet = this.trackLoad("./assets/weapons/bullets/pistol.png");
    this.images.fury_bullet = this.trackLoad("./assets/weapons/bullets/ion_fury.png");
    this.images.shredder_bullet = this.trackLoad("./assets/weapons/bullets/the_shredder.png");
    this.images.viper_bullet = this.trackLoad("./assets/weapons/bullets/vipers_kiss.png");
    this.images.titan_bullet = this.trackLoad("./assets/weapons/bullets/titans_breath.png");

    this.fonts.main = this.trackLoad("./assets/fonts/plasdrip.ttf", 'font');

    this.loadLevelAssets();

    this.isLoaded = true;
    console.log("[AssetManager] All global assets preloaded.");
  }

  loadLevelAssets() {
    this.levelAssets = CONFIG.LEVELS.map((level, i) => {
      const data = level.assets;
      if (!data) return null;

      const levelNum = i + 1;
      const levelPath = `./assets/levels/lv${levelNum}`

      const levelBundle = {
        backgrounds: {
          far: this.trackLoad(`${levelPath}/bg/far.png`),
          midBack: this.trackLoad(`${levelPath}/bg/mid_back.png`),
          midFront: this.trackLoad(`${levelPath}/bg/mid_front.png`),
          front: this.trackLoad(`${levelPath}/bg/front.png`)
        },
        tile: this.trackLoad(`${levelPath}/env/tile.png`),
        crackTile: null,
        checkpoint: [],
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

      for (let i = 0; i <= 3; i++) {
        levelBundle.checkpoint.push(
          this.trackLoad(`${levelPath}/env/checkpoint/cp${i}.png`)
        );
      }

      if (levelNum !== 1) {
        levelBundle.crackTile = this.trackLoad(`${levelPath}/env/crack_tile.png`)
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
    this.trackLoad(path, 'image', (sheet) => {
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