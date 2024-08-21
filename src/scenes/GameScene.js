import { createGameScene } from '../utils/createGameScene.js';
import { handleKey, enableSwipeInput  } from '../utils/inputManager.js';
import { endGame } from '../utils/endGame.js';
import { startTimer } from '../utils/timer.js'; // Import timer function
import { updateScore } from '../utils/scoreManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        createGameScene(this);
        // Start the timer with a duration of 60 seconds
        startTimer(this, 60, () => {
            this.endGame(); // End the game when the timer reaches 0
        });
        // Enable swipe input for touch devices
        enableSwipeInput(this);
    }

    update() {
        if (this.isMoving) {
            this.player.setVelocity(this.currentDirection.x * this.playerSpeed, this.currentDirection.y * this.playerSpeed);
        }
    }

    handleKey(event) {
        handleKey(this, event);
    }

    updateScore() {
        updateScore(this);
    }

    async endGame() {
        endGame(this);
    }
}
