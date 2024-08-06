// src/scenes/GameScene.js

import { generateSequence, displaySequence, updateArrowColor, gameOver, promptForHighScore, displayHighScores } from '../utils/gameUtils.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player;
        this.cursors;
        this.arrowSequence = [];
        this.currentIndex = 0;
        this.score = 0;
        this.scoreText;
        this.highScoresText;
        this.arrows = [];
    }

    create() {
        console.log('Create started');
        this.add.image(400, 300, 'sky'); // This should display the sky image in the center

        this.player = this.physics.add.sprite(400, 300, 'player'); // This should display the player image
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.highScoresText = this.add.text(16, 50, 'Loading High Scores...', { fontSize: '16px', fill: '#fff' });

        let submitButton = this.add.text(16, 80, 'Submit High Score', { fontSize: '16px', fill: '#fff' }).setInteractive();
        submitButton.on('pointerdown', () => promptForHighScore(this));

        this.arrowSequence = generateSequence();
        displaySequence(this);
        displayHighScores(this, this.highScoresText); // Pass this.highScoresText here
        console.log('Create finished');
    }

    update() {
        if (this.currentIndex >= this.arrowSequence.length) {
            gameOver(this);
            return;
        }

        if (this.cursors.left.isDown && this.arrowSequence[this.currentIndex] === 'left') {
            updateArrowColor(this, this.currentIndex, 'left');
            this.currentIndex++;
            this.player.setVelocityX(-160);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        } else if (this.cursors.right.isDown && this.arrowSequence[this.currentIndex] === 'right') {
            updateArrowColor(this, this.currentIndex, 'right');
            this.currentIndex++;
            this.player.setVelocityX(160);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        } else if (this.cursors.up.isDown && this.arrowSequence[this.currentIndex] === 'up') {
            updateArrowColor(this, this.currentIndex, 'up');
            this.currentIndex++;
            this.player.setVelocityY(-160);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        } else if (this.cursors.down.isDown && this.arrowSequence[this.currentIndex] === 'down') {
            updateArrowColor(this, this.currentIndex, 'down');
            this.currentIndex++;
            this.player.setVelocityY(160);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        }

        if (this.currentIndex >= this.arrowSequence.length) {
            gameOver(this);
        }
    }
}
