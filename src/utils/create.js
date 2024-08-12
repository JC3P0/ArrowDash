// src/utils/create.js

import { displayHealth } from './playerHealth.js';
import playerAttributes from './playerAttributes.js';
import { loadHighScores } from './highScores.js';
import { handleKey } from './inputManager.js'
import { startPowerUpSpawning } from './powerUps.js';
import { setLevelBackground } from './levelManager.js';
import { handleWorldBounds } from './worldBoundsManager.js';
import { generateArrowSequence, displaySequence } from './arrowSequence.js';

export function create(scene) {
    scene.background = scene.add.image(400, 355, 'level-1');

    scene.physics.world.setBounds(0, 55, 800, 600);

    const statsBackground = scene.add.graphics();
    statsBackground.fillStyle(0x5a5499, 0.5);
    statsBackground.fillRect(0, 0, 800, 55);

    scene.levelText = scene.add.text(10, 15, 'Level:1', { fontSize: '32px', fill: '#fff' });
    scene.timerText = scene.add.text(370, 15, '⏱1:00', { fontSize: '32px', fill: '#fff' });
    scene.scoreText = scene.add.text(555, 15, 'Score:000000', { fontSize: '32px', fill: '#fff' });

    scene.score = 0;

    scene.player = scene.physics.add.image(400, 500, window.selectedPlayer);
    scene.player.setScale(1);
    scene.player.setCollideWorldBounds(true);
    scene.player.body.onWorldBounds = true;
    scene.player.body.bounce.set(1);
    scene.physics.world.on('worldbounds', () => handleWorldBounds(scene.player.body, scene.currentDirection), scene);

    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.currentDirection = { x: 0, y: 0 };
    scene.lastDirection = { x: 0, y: 0 };

    scene.playerAttributes = playerAttributes[window.selectedPlayer];
    scene.playerAttributes.maxHealth = scene.playerAttributes.health;
    scene.playerSpeed = scene.playerAttributes.speed * 40;

    displayHealth(scene, 165, 10);

    scene.level = 1;
    loadHighScores(scene);

    scene.currentArrowIndex = 0;
    scene.playerAttributes.health = scene.playerAttributes.maxHealth;
    scene.currentArrowSequence = generateArrowSequence(10);
    scene.nextArrowSequence = generateArrowSequence(10);
    displaySequence(scene, scene.currentArrowSequence);
    scene.isMoving = false;
    scene.currentDirection = { x: 0, y: 0 };

    scene.input.keyboard.on('keydown', (event) => handleKey(scene, event));

    startPowerUpSpawning(scene);
}
