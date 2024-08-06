// src/scenes/PlayerSelectorScene.js

export default class PlayerSelectorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerSelectorScene' });
    }

    preload() {
        this.load.image('player-1', 'assets/player-1.png');
        this.load.image('player-2', 'assets/player-2.png');
        this.load.image('player-3', 'assets/player-3.png');
        this.load.image('player-4', 'assets/player-4.png');
        this.load.image('player-5', 'assets/player-5.png');
    }

    create() {
        document.getElementById('player-selector-container').innerHTML = `
            <div class="player-selector">
                <h1>Select Your Player</h1>
                <div id="player-icons">
                    <img src="assets/player-1.png" id="player-1" class="player-icon">
                    <img src="assets/player-2.png" id="player-2" class="player-icon">
                    <img src="assets/player-3.png" id="player-3" class="player-icon">
                    <img src="assets/player-4.png" id="player-4" class="player-icon">
                    <img src="assets/player-5.png" id="player-5" class="player-icon">
                </div>
            </div>
        `;

        document.getElementById('main-menu-container').style.display = 'none';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('player-selector-container').style.display = 'flex';

        // Add event listeners to player icons
        document.querySelectorAll('.player-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                this.selectPlayer(event.target.id);
            });
        });
    }

    selectPlayer(playerId) {
        console.log('Selected player:', playerId);
        // Save the selected player to a global variable or state
        window.selectedPlayer = playerId;
        document.getElementById('selected-player-icon').src = `assets/${playerId}.png`;
        document.getElementById('selected-player-icon').style.display = 'block';
        this.backToMenu();
    }

    backToMenu() {
        document.getElementById('main-menu-container').style.display = 'flex';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('player-selector-container').style.display = 'none';
        this.scene.start('MainMenuScene'); // Ensure to start the MainMenuScene
    }
}
