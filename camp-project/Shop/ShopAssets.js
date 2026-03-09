// ShopAssets.js
// Asset loading only

class ShopAssets {
  constructor() {
    this.bgImg = null;
    this.font = null;

    this.pistolIconImg = null;
    this.fireballIconImg = null;
  }

  preload() {
    // NOTE: Update paths if your assets folder differs
    this.bgImg = loadImage("assets/shop_bg.png");
    this.font = loadFont("assets/plasdrip.ttf");

    // Icons
    this.pistolIconImg = loadImage("assets/icon_pistol.png");
    this.fireballIconImg = loadImage("assets/icon_fireball.png");
  }

  getIconByKey(iconKey) {
    if (iconKey === "pistol") return this.pistolIconImg;
    if (iconKey === "fireball") return this.fireballIconImg;
    return null;
  }
}
