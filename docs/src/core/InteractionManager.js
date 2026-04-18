class InteractionManager {
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
        player.takeDamage(enemy.damage);
      }
    }
  }

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

  static handleWorldLimits(player, world) {
    const p = player.getBounds();

    if (p.top > world.height) {
      world.respawnPlayer();
    }

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