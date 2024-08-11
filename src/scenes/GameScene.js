import { preload, create, handleKey, endGame, updateScore } from '../utils/gameUtils.js';
import { startTimer } from '../utils/timer.js'; // Import timer function

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        preload(this);
    }

    create() {
        create(this);

        // Start the timer with a duration of 60 seconds
        startTimer(this, 60, () => {
            this.endGame(); // End the game when the timer reaches 0
        });
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
