// src/utils/preload.js
import { preloadPowerUps } from './powerUps.js';

export function preload(scene) {
    scene.load.image('level-1', 'assets/level-1.png');
    scene.load.image('level-10', 'assets/level-10.png');
    scene.load.image('player-1', 'assets/player-1.png');
    scene.load.image('player-2', 'assets/player-2.png');
    scene.load.image('player-3', 'assets/player-3.png');
    scene.load.image('player-4', 'assets/player-4.png');
    scene.load.image('player-5', 'assets/player-5.png');
    scene.load.image('blueUp', 'assets/blueUp.png');
    scene.load.image('blueDown', 'assets/blueDown.png');
    scene.load.image('blueLeft', 'assets/blueLeft.png');
    scene.load.image('blueRight', 'assets/blueRight.png');
    scene.load.image('greenUp', 'assets/greenUp.png');
    scene.load.image('greenDown', 'assets/greenDown.png');
    scene.load.image('greenLeft', 'assets/greenLeft.png');
    scene.load.image('greenRight', 'assets/greenRight.png');

    preloadPowerUps(scene);
}
