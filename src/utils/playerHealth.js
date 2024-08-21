// src/utils/playerHealth.js

export function displayHealth(scene, xPosition, yPosition) {
    const healthIcons = {
        full: '❤️',
        empty: '♡'
    };

    scene.healthIcons = [];
    const spacing = 40; // Adjust spacing as needed
    for (let i = 0; i < scene.playerAttributes.maxHealth; i++) {
        const heart = scene.add.text(xPosition + i * spacing, yPosition, healthIcons.full, { fontSize: '32px', fill: '#fff', fontFamily: 'Arial' });
        scene.healthIcons.push(heart);
    }
    updateHealthText(scene, healthIcons);
}

export function updateHealthText(scene, healthIcons) {
    const { health, maxHealth } = scene.playerAttributes;
    for (let i = 0; i < maxHealth; i++) {
        if (i < health) {
            scene.healthIcons[i].setText(healthIcons.full);
            scene.healthIcons[i].setFontSize(32); // Full heart size
        } else {
            scene.healthIcons[i].setText(healthIcons.empty);
            scene.healthIcons[i].setFontSize(39); // Adjust empty heart size as needed
        }
    }
}

export function loseHealth(scene, healthIcons) {
    if (scene.playerAttributes.health > 0) {
        scene.playerAttributes.health -= 1;
        updateHealthText(scene, healthIcons);
        if (scene.playerAttributes.health === 0) {
            scene.endGame();
        }
    }
}
