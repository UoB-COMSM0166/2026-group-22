class LevelBuilder {
  static build(world, data, levelAssets) {

    const currentDiff = gameState.difficulty || "EASY";
    const m = CONFIG.DIFFICULTY_PRESETS[currentDiff];

    if (data.bubbleMode) {
      world.player.bubbleMode = true;
      world.player.abilities.activateBubble(3);
    } else {
      world.player.bubbleMode = false;
      world.player.abilities.resetBubbleState();
    }

    let currentX = 0;

    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w / 2;
      let centerY = world.height - p.altitude - p.h / 2;
      let topY = centerY - p.h / 2;

      let platform;
      if (p.isMoving) {
        platform = new MovingPlatform(
          centerX, centerY, p.w, p.h, levelAssets.tile, p.rangeX, p.rangeY, p.speed
        );
      } else if (p.isVanish) {
        platform = new VanishablePlatform(centerX, centerY, p.w, p.h, levelAssets.crackTile);
      } else if (p.isChainDrop) {
        let targetY = world.height - p.dropAltitude - p.h / 2;
        platform = new ChainPlatform(centerX, centerY, p.w, p.h, levelAssets.tile, targetY);
      } else {
        platform = new Platform(centerX, centerY, p.w, p.h, levelAssets.tile);
      }

      platform.removesSkill = p.removesSkill || false;
      platform.hasBoss = p.hasBoss || false;
      platform.bossType = p.bossType;

      world.platforms.push(platform);

      // Place Coins
      if (p.hasCoin) {
        world.coins.push(new Coin(centerX, centerY - 50));
      }
      if (p.coins && Array.isArray(p.coins)) {
        for (let offsetX of p.coins) {
          world.coins.push(new Coin(centerX + offsetX, centerY - 50));
        }
      }

      // Place Enemies
      if (p.hasEnemy) {
        const base = data.enemyConfig;

        const scaledConfig = {
          ...base,
          maxHp: base.maxHp * m.hp,
          damage: base.damage * m.damage,
          speed: base.speed * m.speed
        };
        world.enemies.push(new Enemy(centerX, centerY - 100, levelAssets.enemySprites, scaledConfig));
      }

      // Place Checkpoints
      if (p.hasCheckpoint) {
        world.checkpoints.push(new Checkpoint(centerX + p.w / 4, topY));
      }

      currentX = centerX + p.w / 2;
    }

    // Item Placement
    if (data.items) {
      world.items = data.items.map(itemData => {
        const itemClass = world.itemTypes[itemData.type];
        return itemClass ? new itemClass(itemData.x, itemData.y) : null;
      }).filter(i => i);
    }
  }
}