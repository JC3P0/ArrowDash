// src/utils/powerUps.js

import { updateScore } from './scoreManager.js';
import { updateHealthText } from './playerHealth.js'; // Import the function to update health

export function createPowerUp(scene, type, x, y) {
    let powerUpImageKey;

    switch (type) {
        case 'xp':
            powerUpImageKey = 'xp';
            break;
        case 'heart':
            powerUpImageKey = 'heart';
            break;
        case 'timer':
            powerUpImageKey = 'timer';
            break;
        default:
            return; // Exit if type is unknown
    }

    const powerUp = scene.physics.add.image(x, y, powerUpImageKey);
    powerUp.setOrigin(0.5); // Center the image
    powerUp.setScale(1); // Scale the image if necessary

    // Add collision detection with the player
    scene.physics.add.overlap(scene.player, powerUp, () => collectPowerUp(scene, type, powerUp), null, scene);
}

function collectPowerUp(scene, type, powerUp) {
    console.log('Power-up collected:', type); // Debugging output
    powerUp.destroy(); // Remove the power-up after collection

    switch (type) {
        case 'xp':
            updateScore(scene, 50); // Add 50 points for collecting a xp
            break;
        case 'heart':
            if (scene.playerAttributes.health < scene.playerAttributes.maxHealth) {
                scene.playerAttributes.health += 1;
            } else {
                updateScore(scene, 100); // Bonus points if health is full
            }
            updateHealthText(scene, { full: '❤️', empty: '♡' });
            break;
        case 'timer':
            scene.timeLeft += 10; // Add 10 seconds to the timer
            updateTimerText(scene);
            break;
    }
}

function updateTimerText(scene) {
    const minutes = Math.floor(scene.timeLeft / 60);
    const seconds = scene.timeLeft % 60;
    scene.timerText.setText(`⏱${minutes}:${seconds.toString().padStart(2, '0')}`);
}

// Function to start spawning power-ups every 5 seconds
export function startPowerUpSpawning(scene) {
    scene.time.addEvent({
        delay: 5000, // Spawn every 5 seconds
        callback: () => {
            const x = Phaser.Math.Between(50, 750); // Random x position within game bounds
            const y = Phaser.Math.Between(100, 500); // Random y position within game bounds
            const type = selectPowerUpType(scene.level); // Determine type based on level
            createPowerUp(scene, type, x, y);
        },
        loop: true
    });
}

function selectPowerUpType(level) {
    if (level >= 10) {
        // Levels 10+ include all power-ups
        const types = ['xp', 'heart', 'timer'];
        return types[Phaser.Math.Between(0, types.length - 1)];
    } else {
        // Levels 1-9 only include xp and heart
        const types = ['xp', 'heart'];
        return types[Phaser.Math.Between(0, types.length - 1)];
    }
}
