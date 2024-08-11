import { generateArrowSequence, displaySequence, updateArrowColor } from './arrowSequence.js';
import { loadHighScores, checkAndSaveHighScore } from './highScores.js';
import { displayHealth, updateHealthText, loseHealth } from './playerHealth.js';
import playerAttributes from './playerAttributes.js';
import { setLevelBackground } from './levelManager.js'; // Import the level manager

export function preload(scene) {
    scene.load.image('level-1', 'assets/level-1.png');
    scene.load.image('level-10', 'assets/level-10.png');
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
    // Create the initial background image for level 1
    scene.background = scene.add.image(400, 355, 'level-1'); // Start with level-1 background

    // Set world bounds to the size of the sky image (800x600)
    scene.physics.world.setBounds(0, 55, 800, 600); // Lowered world bounds start

    // Add a background for the stats area with reduced height
    const statsBackground = scene.add.graphics();
    statsBackground.fillStyle(0x5a5499, 0.5); // Semi-transparent black
    statsBackground.fillRect(0, 0, 800, 55); // Reduced height for the stats background

    // Position the level, timer, and score in the new stats area
    scene.levelText = scene.add.text(10, 15, 'Level:1', { fontSize: '32px', fill: '#fff' });
    scene.timerText = scene.add.text(370, 15, '⏱1:00', { fontSize: '32px', fill: '#fff' });
    scene.scoreText = scene.add.text(555, 15, 'Score:000000', { fontSize: '32px', fill: '#fff' });

    // Create the player after the background
    scene.player = scene.physics.add.image(400, 500, window.selectedPlayer);
    scene.player.setScale(0.5);
    scene.player.setCollideWorldBounds(true);
    scene.player.body.onWorldBounds = true;
    scene.player.body.bounce.set(1);
    scene.physics.world.on('worldbounds', () => handleWorldBounds(scene.player.body, scene.currentDirection), scene);

    // Create cursor keys for player movement
    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.currentDirection = { x: 0, y: 0 };
    scene.lastDirection = { x: 0, y: 0 };

    // Set player attributes based on selected player
    scene.playerAttributes = playerAttributes[window.selectedPlayer];
    scene.playerAttributes.maxHealth = scene.playerAttributes.health;
    scene.playerSpeed = scene.playerAttributes.speed * 40;

    // Adjust the Y position for the hearts and place them between the level and timer
    displayHealth(scene, 165, 10); // Adjusted X position (165) and Y position (10)

    // Initialize the level and load high scores
    scene.level = 1;
    loadHighScores(scene);

    // Initialize the game state
    scene.score = 0;
    scene.currentArrowIndex = 0;
    scene.playerAttributes.health = scene.playerAttributes.maxHealth;
    scene.currentArrowSequence = generateArrowSequence(10);
    scene.nextArrowSequence = generateArrowSequence(10);
    displaySequence(scene, scene.currentArrowSequence);
    scene.isMoving = false;
    scene.currentDirection = { x: 0, y: 0 };

    // Handle keydown events
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
            scene.levelText.setText('Level:' + scene.level);

            if (scene.level === 10) {
                // Reset player position when reaching level 10
                setLevelBackground(scene, 10);
            }

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
    scene.scoreText.setText('Score:' + scene.score.toString().padStart(6, '0')); // Display up to 100,000
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
            popupMessage.textContent = `Your Score: ${scene.score}. Enter your name:`;
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
                    await checkAndSaveHighScore(scene, playerName, scene.score, scene.level, window.selectedPlayer.split('-')[1]);
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
