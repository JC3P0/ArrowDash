// src/utils/gameUtils.js

import { generateArrowSequence, displaySequence, updateArrowColor } from './arrowSequence.js';
import { loadHighScores, checkAndSaveHighScore } from './highScores.js';
import { displayHealth, updateHealthText, loseHealth } from './playerHealth.js';
import playerAttributes from './playerAttributes.js';

export function preload(scene) {
    scene.load.image('sky', 'assets/sky.png');
    scene.load.image('player-1', 'assets/player-1.png');
    scene.load.image('player-2', 'assets/player-2.png');
    scene.load.image('player-3', 'assets/player-3.png');
    scene.load.image('player-4', 'assets/player-4.png');
    scene.load.image('player-5', 'assets/player-5.png');
    scene.load.image('blueUp', 'assets/blueUp.png');
    scene.load.image('blueDown', 'assets/blueDown.png');
    scene.load.image('blueLeft', 'assets/blueLeft.png');
    scene.load.image('blueRight', 'assets/blueRight.png');
    scene.load.image('greenUp', 'assets/greenUp.png');
    scene.load.image('greenDown', 'assets/greenDown.png');
    scene.load.image('greenLeft', 'assets/greenLeft.png');
    scene.load.image('greenRight', 'assets/greenRight.png');
}

export function create(scene) {
    scene.add.image(400, 300, 'sky');

    scene.player = scene.physics.add.image(400, 500, window.selectedPlayer);
    scene.player.setScale(0.5);
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

    scene.scoreText = scene.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    scene.levelText = scene.add.text(10, 80, 'Level: 1', { fontSize: '32px', fill: '#fff' });

    scene.level = 1;
    loadHighScores(scene);

    scene.score = 0;
    scene.currentArrowIndex = 0;
    scene.playerAttributes.health = scene.playerAttributes.maxHealth;
    scene.currentArrowSequence = generateArrowSequence(10);
    scene.nextArrowSequence = generateArrowSequence(10);
    displaySequence(scene, scene.currentArrowSequence);
    displayHealth(scene);
    scene.isMoving = false;
    scene.currentDirection = { x: 0, y: 0 };

    scene.input.keyboard.on('keydown', (event) => handleKey(scene, event));
}

export function handleKey(scene, event) {
    const directionMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = directionMap[event.key];
    if (newDirection) {
        if ((scene.currentDirection.x + newDirection.x === 0 && scene.currentDirection.y === 0) ||
            (scene.currentDirection.y + newDirection.y === 0 && scene.currentDirection.x === 0)) {
            scene.currentDirection = newDirection;
        } else {
            scene.currentDirection.x += newDirection.x;
            scene.currentDirection.y += newDirection.y;

            const magnitude = Math.sqrt(scene.currentDirection.x ** 2 + scene.currentDirection.y ** 2);
            if (magnitude !== 0) {
                scene.currentDirection.x /= magnitude;
                scene.currentDirection.y /= magnitude;
            }
        }

        scene.lastDirection = newDirection;
        scene.isMoving = true;
    }

    const currentArrowDirection = scene.currentArrowSequence[scene.currentArrowIndex];
    if (event.key === `Arrow${currentArrowDirection.charAt(0).toUpperCase() + currentArrowDirection.slice(1)}`) {
        updateArrowColor(scene, scene.currentArrowIndex, currentArrowDirection);
        scene.currentArrowIndex++;
        scene.score += 10;
        updateScore(scene);

        if (scene.currentArrowIndex >= scene.currentArrowSequence.length) {
            scene.level++;
            scene.levelText.setText('Level: ' + scene.level);
            scene.currentArrowSequence = scene.nextArrowSequence;
            scene.nextArrowSequence = generateArrowSequence(10);
            scene.currentArrowIndex = 0;

            scene.arrows.forEach(arrow => arrow.destroy());
            displaySequence(scene, scene.currentArrowSequence, 300);
        }
    } else {
        const healthIcons = {
            full: '❤️',
            empty: '♡'
        };
        loseHealth(scene, healthIcons);
    }
}

export function updateScore(scene) {
    scene.scoreText.setText('Score: ' + scene.score);
}

export async function endGame(scene) {
    // Stop player movement
    scene.isMoving = false;
    scene.player.setVelocity(0, 0); // Set player velocity to zero

    // Ensure the last arrow color change only if index is within bounds
    if (scene.currentArrowIndex > 0 && scene.currentArrowIndex <= scene.currentArrowSequence.length) {
        const currentArrowDirection = scene.currentArrowSequence[scene.currentArrowIndex - 1];
        updateArrowColor(scene, scene.currentArrowIndex - 1, currentArrowDirection);
    }

    const healthIcons = {
        full: '❤️',
        empty: '♡'
    };
    updateHealthText(scene, healthIcons);

    // Disable further input
    scene.input.keyboard.removeAllListeners('keydown');

    setTimeout(async () => {
        const playerNameInput = document.getElementById('player-name');
        const submitScoreButton = document.getElementById('submit-score');
        const continueButton = document.getElementById('continue-button');
        const popup = document.getElementById('highscore-popup');
        const popupTitle = document.getElementById('popup-title');
        const popupMessage = document.getElementById('popup-message');

        playerNameInput.value = '';
        popup.style.display = 'flex';

        const lowestHighScore = scene.highscores[scene.highscores.length - 1]?.score || 0;

        if (scene.highscores.length < 10 || scene.score > lowestHighScore) {
            popupTitle.textContent = 'New High Score!';
            popupMessage.textContent = 'Enter your name:';
            playerNameInput.style.display = 'block';
            submitScoreButton.style.display = 'block';
            continueButton.style.display = 'none';

            const validateInput = (e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                e.target.value = value.substring(0, 6);
            };

            playerNameInput.addEventListener('input', validateInput);

            submitScoreButton.onclick = async () => {
                const playerName = playerNameInput.value.toUpperCase();
                if (playerName.length >= 3 && playerName.length <= 6) {
                    console.log(`Saving high score for player: ${playerName}, score: ${scene.score}, level: ${scene.level}, avatar: ${window.selectedPlayer.split('-')[1]}`);
                    await checkAndSaveHighScore(scene, playerName, scene.score, scene.level, window.selectedPlayer.split('-')[1]);
                    console.log('High score save attempt finished');
                    window.location.reload(); // Reload the entire webpage to reset the game
                } else {
                    alert('Name must be between 3 and 6 characters and contain only letters or numbers.');
                }
            };
        } else {
            popupTitle.textContent = 'Your Score';
            popupMessage.textContent = `Your score was ${scene.score}. Unfortunately, it did not make it into the top 10. Try again next time!`;
            playerNameInput.style.display = 'none';
            submitScoreButton.style.display = 'none';
            continueButton.style.display = 'block';

            continueButton.onclick = () => {
                window.location.reload(); // Reload the entire webpage to reset the game
            };
        }
    }, 100);
}

export function handleWorldBounds(body, currentDirection) {
    if (body.blocked.up || body.blocked.down) {
        currentDirection.y = -currentDirection.y;
    }
    if (body.blocked.left || body.blocked.right) {
        currentDirection.x = -currentDirection.x;
    }
}
