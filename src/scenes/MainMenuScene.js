// src/scenes/MainMenuScene.js

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // No assets to preload for this scene
    }

    create() {
        document.getElementById('main-menu-container').innerHTML = `
            <div class="menu">
                <button class="play" onclick="startGame()">Play</button>
                <button onclick="selectPlayer()">Select Player</button>
                <button onclick="viewHighScores()">High Scores</button>
            </div>
        `;

        document.getElementById('main-menu-container').style.display = 'flex';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
    }
}

window.startGame = function () {
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    window.game.scene.start('GameScene');
};

window.selectPlayer = function () {
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    window.game.scene.start('PlayerSelectorScene');
};

window.viewHighScores = function () {
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('highscores-container').style.display = 'flex';
    window.game.scene.start('HighScoresScene');
};
