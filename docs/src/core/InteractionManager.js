// src/classes/InteractionManager.js
class InteractionManager {
  /**
   * Handles physical collisions between an entity and a solid platform.
   * Replaces handleSolidCollision from World.js.
   */
  static resolveSolid(entity, platform, world) {
    if (!platform.active || !entity.intersects(platform)) return;

    const p = platform.getBounds();
    const overlap = entity.getOverlap(platform);
    const minOverlap = Math.min(overlap.top, overlap.bottom, overlap.left, overlap.right);

    // 1. Resolve Position (Push out of the platform)
    if (minOverlap === overlap.top && entity.velY > 0) { // Landing
      entity.y = p.top - entity.h / 2;
      entity.velY = 0;
      if (entity.land) entity.land(); // Trigger animations/jump reset

      // 2. Handle Logic Triggers (Scene switches, skill resets)
      if (entity instanceof Player) {
        if (platform instanceof VanishablePlatform) platform.isTouched = true;
        if (platform.removesSkill) entity.abilities.resetSkills();

        if (platform.hasBoss || platform.hasSummonerBoss) {
          sceneManager.switch("boss", {
            bossType: platform.hasSummonerBoss ? "summoner" : "regular",
            bgLayers: world.bgLayers,
            worldAssets: world.worldAssets
          });
        }
      }

      // Moving platform momentum
      if (platform.velX || platform.velY) {
        entity.x += platform.velX;
        entity.y += platform.velY;
      }
    }
    else if (minOverlap === overlap.bottom && entity.velY < 0) { // Hit head
      entity.y = p.bottom + entity.h / 2;
      entity.velY = 0;
    }
    else if (minOverlap === overlap.left) {
      entity.x = p.left - entity.w / 2;
    }
    else if (minOverlap === overlap.right) {
      entity.x = p.right + entity.w / 2;
    }
  }

  /**
   * Handles combat collisions: bullets vs enemies and enemies vs player.
   */
  static handleCombat(player, enemies, bullets) {
    // Bullets vs Enemies
    for (let bullet of bullets) {
      for (let enemy of enemies) {
        if (enemy.active && bullet.active && bullet.intersects(enemy)) {
          enemy.takeDamage(bullet.damage);
          bullet.active = false;
        }
      }
    }

    // Enemies vs Player
    for (let enemy of enemies) {
      if (enemy.active && player.active && player.intersects(enemy)) {
        const dir = (player.x < enemy.x) ? -1 : 1;
        player.takeDamage(10, dir);
      }
    }
  }

  /**
   * Handles puzzle-specific interactions (e.g., Bow vs ChainPlatforms).
   */
  static handlePuzzles(bullets, platforms) {
    for (let bullet of bullets) {
      if (!bullet.active) continue;
      for (let platform of platforms) {
        if (platform instanceof ChainPlatform && platform.state === 'IDLE') {
          if (bullet.intersects(platform)) {
            platform.triggerBreak();
            bullet.active = false;
          }
        }
      }
    }
  }

  /**
   * Handles map limits, holes, and falling off the screen.
   */
  static handleWorldLimits(player, world) {
    const p = player.getBounds();
    const floorY = world.height - world.groundThickness;

    // Check for pits/holes
    let overHole = world.holes.some(h => h.contains(p.left) && h.contains(p.right));

    if (!overHole && p.bottom > floorY) {
      player.y = floorY - player.h / 2;
      player.land();
    }

    if (p.top > world.height) {
      world.respawnPlayer();
    }

    // Keep Kirby within horizontal walls
    player.x = constrain(player.x, player.w / 2, world.width - player.w / 2);
    player.y = max(player.y, player.h / 2);
  }

  static resolveHitGroup(projectiles, target, onHit) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (projectiles[i].active && projectiles[i].intersects(target)) {
        onHit(projectiles[i], target);
        projectiles[i].active = false;
        projectiles.splice(i, 1);
      }
    }
  }

  static updateProjectiles(projectiles) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      projectiles[i].update();
      if (!projectiles[i].active) {
        projectiles.splice(i, 1);
      }
    }
  }
}