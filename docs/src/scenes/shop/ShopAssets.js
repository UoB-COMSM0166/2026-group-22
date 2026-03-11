// src/Shop/ShopAssets.js
class ShopAssets {
  constructor() {
    this.bgImg = null;
    this.font = null;
    
    // Use an object to store icons dynamically
    this.icons = {};
  }

  preload() {
    // 1. Load Main Shop Assets
    this.bgImg = loadImage("assets/shop_bg.png");
    this.font = loadFont("assets/plasdrip.ttf");

    // 2. Load Item Icons dynamically based on ShopData keys
    // This matches the 'iconKey' in your SHOP_ITEMS array
    this.icons["pistol"] = loadImage("assets/icon_pistol.png");
    this.icons["fireball"] = loadImage("assets/icon_fireball.png");
    
    // Note: If you add a "shield" to ShopData, just add its icon here!
  }

  /**
   * Returns a p5.Image for a specific item.
   * @param {string} key - The iconKey from ShopData.
   */
  getIconByKey(key) {
    return this.icons[key] || null;
  }
}

// Create a single instance to be used by the ShopScene and its components
const shopAssets = new ShopAssets();