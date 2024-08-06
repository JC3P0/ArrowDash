import { promptForHighScore, displayHighScores } from '../utils/gameUtils.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.highScoresText = this.add.text(16, 50, 'Loading High Scores...', { fontSize: '16px', fill: '#fff' });

        let submitButton = this.add.text(16, 80, 'Submit High Score', { fontSize: '16px', fill: '#fff' }).setInteractive();
        submitButton.on('pointerdown', () => promptForHighScore(this));

        displayHighScores(this);
    }

    updateScore(score) {
        this.scoreText.setText('Score: ' + score);
    }
}
