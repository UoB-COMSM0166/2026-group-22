class SystemControls {
  constructor(scene) {
    this.scene = scene;

    this.backRect = { x: 0, y: 0, w: 0, h: 0 };
    this.settingsRect = { x: 0, y: 0, w: 0, h: 0 };
  }

  draw(tf = null) {
    const s = tf ? tf.dw * 0.06 : 50;
    const pad = tf ? tf.dw * 0.01 : 5;

    const yPos = tf ? tf.dy + pad : pad;

    this.backRect = { x: tf ? tf.dx + pad : pad, y: yPos, w: s, h: s };

    const trX = tf ? tf.dx + tf.dw - pad - s : width - pad - s;

    this.settingsRect = { x: trX, y: yPos, w: s, h: s };

    this._renderIcon(assets.getImg('arrow_l'), this.backRect, 1.0);
    
    if (sceneManager.currentSceneName !== "settings") {
      this._renderIcon(assets.getImg('icon_set'), this.settingsRect, 0.88);
    }
  }

  _renderIcon(img, r, baseScale = 1.0) {
    if (!img) return;
    const hovered = this.scene.inRect(mouseX, mouseY, r);
    const clicking = hovered && mouseIsPressed;

    push();
    imageMode(CENTER);

    if (hovered) {
      cursor(HAND);
      tint(255, 255);
    } else {
      tint(255, 180);
    }

    let s = baseScale;
    if (clicking) {
      s *= 0.95;
    } else if (hovered) {
      s *= 1.06;
    }

    image(img, r.x + r.w / 2, r.y + r.h / 2, r.w * s, r.h * s);
    pop();
  }

  handleClick() {
    if (this.scene.exitPromptActive) return false;

    if (this.scene.inRect(mouseX, mouseY, this.backRect)) {
      this.scene.exitPromptActive = true;
      return true;
    }

    if (this.scene.inRect(mouseX, mouseY, this.settingsRect)) {
      if (sceneManager.currentSceneName === "settings") return false;
      const snapshot = get();
      sceneManager.switch("settings", {
        returnTo: sceneManager.currentSceneName,
        bg: snapshot
      });
      return true;
    }

    return false;
  }
}