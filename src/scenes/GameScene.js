import { generateArrowSequence, displaySequence, updateArrowColor } from '../utils/arrowSequence.js';
import { loadHighScores, checkAndSaveHighScore } from '../utils/highScores.js';
import { displayHealth, updateHealthText, loseHealth } from '../utils/playerHealth.js';
import { handleWorldBounds } from '../utils/gameUtils.js';
import playerAttributes from '../utils/playerAttributes.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('player-1', 'assets/player-1.png');
        this.load.image('player-2', 'assets/player-2.png');
        this.load.image('player-3', 'assets/player-3.png');
        this.load.image('player-4', 'assets/player-4.png');
        this.load.image('player-5', 'assets/player-5.png');
        this.load.image('blueUp', 'assets/blueUp.png');
        this.load.image('blueDown', 'assets/blueDown.png');
        this.load.image('blueLeft', 'assets/blueLeft.png');
        this.load.image('blueRight', 'assets/blueRight.png');
        this.load.image('greenUp', 'assets/greenUp.png');
        this.load.image('greenDown', 'assets/greenDown.png');
        this.load.image('greenLeft', 'assets/greenLeft.png');
        this.load.image('greenRight', 'assets/greenRight.png');
    }

    create() {
        this.add.image(400, 300, 'sky'); // Add the background image

        this.player = this.physics.add.image(400, 500, window.selectedPlayer);
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true); // Make the player bounce off the world bounds
        this.player.body.onWorldBounds = true;
        this.player.body.bounce.set(1);
        this.physics.world.on('worldbounds', () => handleWorldBounds(this.player.body, this.currentDirection), this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentDirection = { x: 0, y: 0 };
        this.lastDirection = { x: 0, y: 0 }; // Store the last direction

        this.playerAttributes = playerAttributes[window.selectedPlayer];
        this.playerAttributes.maxHealth = this.playerAttributes.health; // Store max health
        this.playerSpeed = this.playerAttributes.speed * 40; // Adjust speed factor as necessary

        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.levelText = this.add.text(10, 80, 'Level: 1', { fontSize: '32px', fill: '#fff' }); // Moved down

        this.level = 1;
        loadHighScores(this);

        // Reset the game state
        this.score = 0;
        this.currentArrowIndex = 0;
        this.playerAttributes.health = this.playerAttributes.maxHealth;
        this.currentArrowSequence = generateArrowSequence(10);
        this.nextArrowSequence = generateArrowSequence(10);
        displaySequence(this, this.currentArrowSequence);
        displayHealth(this);
        this.isMoving = false;
        this.currentDirection = { x: 0, y: 0 };

        this.input.keyboard.on('keydown', this.handleKey, this);
    }

    update() {
        if (this.isMoving) {
            this.player.setVelocity(this.currentDirection.x * this.playerSpeed, this.currentDirection.y * this.playerSpeed);
        }
    }

    handleKey(event) {
        const directionMap = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 }
        };

        const newDirection = directionMap[event.key];
        if (newDirection) {
            // Check if the new direction cancels out the current direction
            if ((this.currentDirection.x + newDirection.x === 0 && this.currentDirection.y === 0) ||
                (this.currentDirection.y + newDirection.y === 0 && this.currentDirection.x === 0)) {
                // If it cancels out, use the new direction with full velocity
                this.currentDirection = newDirection;
            } else {
                // Otherwise, add the velocity of the key press direction
                this.currentDirection.x += newDirection.x;
                this.currentDirection.y += newDirection.y;

                // Normalize the direction vector to maintain consistent speed in diagonals
                const magnitude = Math.sqrt(this.currentDirection.x ** 2 + this.currentDirection.y ** 2);
                if (magnitude !== 0) { // Avoid division by zero
                    this.currentDirection.x /= magnitude;
                    this.currentDirection.y /= magnitude;
                }
            }

            this.lastDirection = newDirection; // Update the last direction
            this.isMoving = true; // Start moving
        }

        const currentArrowDirection = this.currentArrowSequence[this.currentArrowIndex];
        if (event.key === `Arrow${currentArrowDirection.charAt(0).toUpperCase() + currentArrowDirection.slice(1)}`) {
            updateArrowColor(this, this.currentArrowIndex, currentArrowDirection);
            this.currentArrowIndex++;
            this.score += 10;
            this.updateScore();

            if (this.currentArrowIndex >= this.currentArrowSequence.length) {
                this.level++;
                this.levelText.setText('Level: ' + this.level);
                this.currentArrowSequence = this.nextArrowSequence;
                this.nextArrowSequence = generateArrowSequence(10);
                this.currentArrowIndex = 0;

                // Remove previous arrow sequence
                this.arrows.forEach(arrow => arrow.destroy());
                displaySequence(this, this.currentArrowSequence, 300); // Display new sequence at the same position
            }
        } else {
            const healthIcons = {
                full: '❤️',
                empty: '♡'
            };
            loseHealth(this, healthIcons); // Lose health on incorrect key press
        }
    }

    updateScore() {
        this.scoreText.setText('Score: ' + this.score);
    }

    async loadHighScores() {
        await loadHighScores(this);
    }

    async endGame() {
        // Ensure the last arrow color change only if index is within bounds
        if (this.currentArrowIndex > 0 && this.currentArrowIndex <= this.currentArrowSequence.length) {
            const currentArrowDirection = this.currentArrowSequence[this.currentArrowIndex - 1];
            updateArrowColor(this, this.currentArrowIndex - 1, currentArrowDirection);
        }

        const healthIcons = {
            full: '❤️',
            empty: '♡'
        };
        updateHealthText(this, healthIcons);

        setTimeout(() => {
            const playerNameInput = document.getElementById('player-name');
            const submitScoreButton = document.getElementById('submit-score');
            const popup = document.getElementById('highscore-popup');

            playerNameInput.value = '';
            popup.style.display = 'flex';

            const validateInput = (e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                e.target.value = value.substring(0, 6);
            };

            playerNameInput.addEventListener('input', validateInput);

            submitScoreButton.onclick = async () => {
                const playerName = playerNameInput.value.toUpperCase();
                if (playerName.length >= 3 && playerName.length <= 6) {
                    console.log(`Saving high score for player: ${playerName}, score: ${this.score}, level: ${this.level}, avatar: ${window.selectedPlayer.split('-')[1]}`);
                    await checkAndSaveHighScore(this, playerName, this.score, this.level, window.selectedPlayer.split('-')[1]);
                    console.log('High score save attempt finished');
                    window.location.reload(); // Reload the entire webpage to reset the game
                } else {
                    alert('Name must be between 3 and 6 characters and contain only letters or numbers.');
                }
            };
        }, 100); // Add a short delay to ensure prompt is handled
    }
}
