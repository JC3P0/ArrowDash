// src/scenes/GameScene.js

import { saveHighScore, getHighScores } from '../api/highscores.js';
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

        this.score = 0;
        this.highscores = [];
        this.arrowSequence = this.generateArrowSequence(10);
        this.currentArrowIndex = 0;
        this.loadHighScores();

        this.player = this.physics.add.image(400, 500, window.selectedPlayer);
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true); // Make the player bounce off the world bounds
        this.player.body.onWorldBounds = true;
        this.player.body.bounce.set(1);
        this.physics.world.on('worldbounds', this.handleWorldBounds, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentDirection = { x: 0, y: 0 };
        this.lastDirection = { x: 0, y: 0 }; // Store the last direction
        this.isMoving = false; // Flag to check if movement has started

        this.playerAttributes = playerAttributes[window.selectedPlayer];
        this.playerSpeed = this.playerAttributes.speed * 40; // Adjust speed factor as necessary

        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        this.arrows = this.arrowSequence.map((direction, index) => {
            return this.add.image(100 + index * 70, 300, `blue${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
        });

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

        const currentArrowDirection = this.arrowSequence[this.currentArrowIndex];
        if (event.key === `Arrow${currentArrowDirection.charAt(0).toUpperCase() + currentArrowDirection.slice(1)}`) {
            this.arrows[this.currentArrowIndex].setTexture(`green${currentArrowDirection.charAt(0).toUpperCase() + currentArrowDirection.slice(1)}`);
            this.currentArrowIndex++;
            this.score += 10;
            this.updateScore();

            if (this.currentArrowIndex >= this.arrowSequence.length) {
                this.gameOver();
            }
        } else {
            this.gameOver();
        }
    }

    updateScore() {
        this.scoreText.setText('Score: ' + this.score);
    }

    async loadHighScores() {
        try {
            this.highscores = await getHighScores();
        } catch (error) {
            console.error('Error loading high scores:', error);
        }
    }

    async gameOver() {
        const lowestHighScore = this.highscores[this.highscores.length - 1]?.score || 0;

        if (this.highscores.length < 10 || this.score > lowestHighScore) {
            const playerName = prompt('You got a high score! Enter your name:');
            if (playerName) {
                await saveHighScore(playerName, this.score);
                this.loadHighScores();
            }
        }

        this.scene.start('MainMenuScene');
    }

    generateArrowSequence(length) {
        const directions = ['up', 'down', 'left', 'right'];
        return Array.from({ length }, () => directions[Math.floor(Math.random() * directions.length)]);
    }

    handleWorldBounds(body) {
        // Reverse the direction of velocity when hitting the edge
        if (body.blocked.up || body.blocked.down) {
            this.currentDirection.y = -this.currentDirection.y;
        }
        if (body.blocked.left || body.blocked.right) {
            this.currentDirection.x = -this.currentDirection.x;
        }
    }
}
