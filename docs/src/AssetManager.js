// src/classes/AssetManager.js
class AssetManager {
  constructor() {
    this.images = {};
    this.fonts = {};
    this.isLoaded = false;
  }

  /**
   * Load every global asset here. 
   * This should be called inside the main p5.js preload().
   */
  preload() {
    // 1. Player Sprites
    this.images.player_idle = loadImage("./assets/kirby_idle.png");
    this.images.player_walk = loadImage("./assets/kirby_move.png");
    this.images.player_jump = loadImage("./assets/kirby_jump.png");

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

    // 4. Shop Icons
    this.images.shop_bg    = loadImage("assets/shop_bg.png");
    this.images.icon_pistol = loadImage("assets/icon_pistol.png");
    this.images.icon_fireball  = loadImage("assets/icon_fireball.png");

    // 5. Fonts
    this.fonts.main = loadFont("assets/plasdrip.ttf");

    this.isLoaded = true;
    console.log("[AssetManager] All global assets preloaded.");
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
}

// Create a global instance
const assets = new AssetManager();