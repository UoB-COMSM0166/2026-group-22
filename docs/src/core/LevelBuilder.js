// src/classes/LevelBuilder.js
class LevelBuilder {
  /**
   * Main build method to populate the world.
   * @param {World} world - The world instance to populate.
   * @param {Object} data - The level configuration data from CONFIG.LEVELS.
   */
  static build(world, data) {
    // 1. Bubble Mode Setup
    if (data.bubbleMode) {
      world.player.bubbleMode = true;
      world.player.activateBubble(3);
    } else {
      world.player.bubbleMode = false;
      world.player.resetBubbleState();
    }

    let currentX = data.startX;

    // 2. Platform & Entity Placement
    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w / 2;
      let centerY = world.height - p.altitude - p.h / 2;
      let topY = centerY - p.h / 2;

      // Platform instantiation
      let platform;
      if (p.isMoving) {
        platform = new MovingPlatform(
          centerX, centerY, p.w, p.h, world.platformTile, p.rangeX, p.rangeY, p.speed
        );
      } else if (p.isVanish) {
        platform = new VanishablePlatform(centerX, centerY, p.w, p.h, world.platformTile);
      } else if (p.isChainDrop) {
        let targetY = world.height - p.dropAltitude - p.h / 2;
        platform = new ChainPlatform(centerX, centerY, p.w, p.h, world.platformTile, targetY);
      } else {
        platform = new Platform(centerX, centerY, p.w, p.h, world.platformTile);
      }

      // Assign platform flags
      platform.removesSkill = p.removesSkill || false;
      platform.hasBoss = p.hasBoss || false;
      platform.hasSummonerBoss = p.hasSummonerBoss || false;
      world.platforms.push(platform);

      // Place Coins
      if (p.hasCoin) {
        world.coins.push(new Coin(centerX, centerY - 35));
      }
      if (p.coins && Array.isArray(p.coins)) {
        for (let offsetX of p.coins) {
          world.coins.push(new Coin(centerX + offsetX, centerY - 35));
        }
      }

      const enemySprites = {
        idle: assets.getImg('enemy_idle'),
        walk: [assets.getImg('enemy_walk1'), assets.getImg('enemy_walk2')],
        hurt: assets.getImg('enemy_hurt')
      };

      // Place Enemies
      if (p.hasEnemy) {
        world.enemies.push(new Enemy(centerX, centerY - 100, enemySprites));
      }

      // Place Checkpoints
      if (p.hasCheckpoint) {
        world.checkpoints.push(new Checkpoint(centerX + p.w / 4, topY));
      }

      currentX = centerX + p.w / 2;
    }

    // 3. Item Placement
    world.items = data.items.map(itemData => {
      const itemClass = world.itemTypes[itemData.type];
      return itemClass ? new itemClass(itemData.x, itemData.y) : null;
    }).filter(i => i);

    // 4. Hole Placement
    world.holes = data.holes.map(h => new Hole(h.startX, h.endX));
  }
}