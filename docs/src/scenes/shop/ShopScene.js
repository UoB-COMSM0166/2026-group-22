class ShopScene {
  constructor() {
    this.shelf = new ShopShelf();
    this.infoPanel = new ShopInfoPanel();
    this.buyModel = new ShopBuyModel();
    this.inventoryBar = new ShopInventoryBar();
    this.bgImg = assets.getImg('shop_bg');
  }

  preload() {
  }

  onEnter() {
    shopState.load(); // Load data from localStorage on entry
    shopState.selectedItemId = null; 
    this.buyModel.close();
  }

  draw() {
    background(0);
    const tf = ShopUI.getContainTransform(this.bgImg);
    if (this.bgImg) image(this.bgImg, tf.dx, tf.dy, tf.dw, tf.dh);

    this.inventoryBar.draw(); 
    this.shelf.draw();
    this.infoPanel.draw();
    
    if (this.buyModel.isOpen) this.buyModel.draw();
    
    // Fixed: Pass the instance coins to the header
    ShopUI.drawHeader(shopState.coins); 
  }

  mousePressed() {
    if (this.buyModel.isOpen) {
      this.buyModel.handleMouse();
      return;
    }
    if (this.infoPanel.handleMouse()) return;
    if (this.inventoryBar.handleMouse()) return;
    this.shelf.handleMouse();
  }

  keyPressed() {
    if (keyCode === ESCAPE) sceneManager.switch("camp");
  }
}