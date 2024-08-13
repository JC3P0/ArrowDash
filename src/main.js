// src/main.js

import Phaser from 'phaser'; // Import Phaser directly if you want to bundle it with Webpack
import GameScene from './scenes/GameScene.js';
import PlayerSelectorScene from './scenes/PlayerSelectorScene.js';
import HighScoresScene from './scenes/HighScoresScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';

// Import CSS files
import './scenes/mainmenu.css';
import './scenes/playerselector.css';
import './scenes/highscores.css';
import './scenes/GameScene.css';  

if (!window.game) {
    const gameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 740,
        backgroundColor: '#000000', // Set a background color
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [MainMenuScene, GameScene, PlayerSelectorScene, HighScoresScene]
    };

    window.game = new Phaser.Game(gameConfig);
}
