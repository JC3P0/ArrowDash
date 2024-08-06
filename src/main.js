// src/main.js

import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import PlayerSelectorScene from './scenes/PlayerSelectorScene.js';
import HighScoresScene from './scenes/HighScoresScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';

const Phaser = window.Phaser; // Phaser is available globally via the CDN

const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000', // Set a background color
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenuScene, PreloadScene, GameScene, UIScene, PlayerSelectorScene, HighScoresScene]
};

const game = new Phaser.Game(gameConfig);

// Attach the game instance to the window object
window.game = game;
