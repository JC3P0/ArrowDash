// src/scenes/GameScene.js

import { preload, create, handleKey, endGame, updateScore } from '../utils/gameUtils.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        preload(this);
    }

    create() {
        create(this);
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
