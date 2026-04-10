// src/classes/AssetManager.js
class AssetManager {
  constructor() {
    this.images = {};
    this.levelBackgrounds = [];
    this.fonts = {};
    this.isLoaded = false;
  }

  /**
   * Load every global asset here. 
   * This should be called inside the main p5.js preload().
   */
  preload() {
    this.images.char1_idle = loadImage("./assets/char/char1_idle.png");
    this.images.char1_walk1 = loadImage("./assets/char/char1_walk1.png");
    this.images.char1_walk2 = loadImage("./assets/char/char1_walk2.png");
    this.images.char1_jump = loadImage("./assets/char/char1_jump.png");
    this.images.char1_attack = loadImage("./assets/char/char1_attack.png");
    this.images.char1_skill = loadImage("./assets/char/char1_skill.png");

    this.images.enemy_idle = loadImage("./assets/enemy_idle.png");
    this.images.enemy_walk1 = loadImage("./assets/enemy_walk1.png");
    this.images.enemy_walk2 = loadImage("./assets/enemy_walk2.png");
    this.images.enemy_hurt = loadImage("./assets/enemy_hurt.png");

    this.images.boss_idle = loadImage("./assets/boss_idle.png");
    this.images.boss_shoot = loadImage("./assets/boss_shoot.png");

    // 2. World & Environment
    this.images.platform_tile = loadImage("./assets/platform_tile.png");

    // 3. UI & Menus
    this.images.title_bg = loadImage("assets/title_cover.png");
    this.images.start_btn = loadImage("assets/btn_start.png");
    this.images.char_select_bg = loadImage("assets/character_select.png");
    this.images.camp_A = loadImage("assets/camp_A.png");
    this.images.camp_B = loadImage("assets/camp_B.png");
    this.images.arrow_r = loadImage("assets/arrow_right_transparent.png");
    this.images.arrow_l = loadImage("assets/arrow_left_transparent.png");
    this.images.icon_set = loadImage("assets/icon_settings.png");
    this.images.icon_snd = loadImage("assets/icon_sound.png");

    this.images.full_heart = loadImage("assets/full_heart.png");
    this.images.half_heart = loadImage("assets/half_heart.png");

    for (let i = 1; i <= 12; i++) {
      const key = `coin${i}`;
      const path = `assets/coin/${key}.png`;
      this.images[key] = loadImage(path);
    }

    // 4. Shop Icons
    this.images.shop_bg = loadImage("assets/shop_bg.png");
    this.images.icon_pistol = loadImage("assets/icon_pistol.png");
    this.images.icon_fireball = loadImage("assets/icon_fireball.png");

    // 5. Fonts
    this.fonts.main = loadFont("assets/plasdrip.ttf");

    this.loadLevelBackgrounds();

    this.isLoaded = true;
    console.log("[AssetManager] All global assets preloaded.");
  }

  loadLevelBackgrounds() {
    this.levelBackgrounds = CONFIG.LEVELS.map(level => {
      if (!level.backgrounds) return null;

      return {
        far: loadImage(level.backgrounds.far),
        midBack: loadImage(level.backgrounds.midBack),
        midFront: loadImage(level.backgrounds.midFront),
        front: loadImage(level.backgrounds.front)
      };
    });
  }

  // --- GETTERS ---
  // Using getters prevents other classes from accidentally overwriting your assets
  getImg(key) {
    if (!this.images[key]) console.warn(`AssetManager: Image '${key}' not found.`);
    return this.images[key];
  }

  getFont(key = 'main') {
    return this.fonts[key];
  }

  getLevelBgs(index) {
    return this.levelBackgrounds[index] || { far: null, midBack: null, midFront: null, front: null };
  }
}

// Create a global instance
const assets = new AssetManager();