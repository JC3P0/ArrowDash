import { createPowerUp } from './powerUps.js';

export function setLevelBackground(scene) {
    if (scene.level === 10) {
        scene.background.setTexture('level-10');

        // Reset the player position
        scene.player.setPosition(400, 500);  // Set to the initial position
        scene.player.setVelocity(0, 0); // Ensure the player is not moving
        scene.isMoving = false; // Stop any current movement
    }

    // Start spawning power-ups
    startPowerUpSpawning(scene);
}

function startPowerUpSpawning(scene) {
    scene.time.addEvent({
        delay: 5000, // Every 5 seconds
        callback: () => {
            spawnRandomPowerUp(scene);
        },
        loop: true
    });
}

function spawnRandomPowerUp(scene) {
    const x = Phaser.Math.Between(50, 750); // Random X position
    const y = Phaser.Math.Between(100, 550); // Random Y position (within the world bounds)

    let powerUpType;
    if (scene.level >= 10) {
        // Levels 10 and above: spawn xp, heart, or timer
        const powerUpOptions = ['xp', 'heart', 'timer'];
        powerUpType = Phaser.Utils.Array.GetRandom(powerUpOptions);
    } else {
        // Levels 1-9: spawn only xp or heart
        const powerUpOptions = ['xp', 'heart'];
        powerUpType = Phaser.Utils.Array.GetRandom(powerUpOptions);
    }

    createPowerUp(scene, powerUpType, x, y);
}
