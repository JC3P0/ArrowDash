// src/utils/preload.js

import { loadAndCacheImage } from './imageCache.js';

export async function preload(scene) {

    // GitHub URLs commented out when repo made private
    const imageLinks = {
        'level-1': 'assets/level-1.png',
        'level-10': 'assets/level-10.png',
        'player-1': 'assets/player-1.png',
        'player-2': 'assets/player-2.png',
        'player-3': 'assets/player-3.png',
        'player-4': 'assets/player-4.png',
        'player-5': 'assets/player-5.png',
        'blueUp': 'assets/blueUp.png',
        'blueDown': 'assets/blueDown.png',
        'blueLeft': 'assets/blueLeft.png',
        'blueRight': 'assets/blueRight.png',
        'greenUp': 'assets/greenUp.png',
        'greenDown': 'assets/greenDown.png',
        'greenLeft': 'assets/greenLeft.png',
        'greenRight': 'assets/greenRight.png',
        'xp': 'assets/xp.png',
        'heart': 'assets/heart.png',
        'timer': 'assets/timer.png',
    };

    for (const [key, url] of Object.entries(imageLinks)) {
        if (!scene.textures.exists(key)) {
            const imageBlob = await loadAndCacheImage(url);
            scene.textures.addBase64(key, imageBlob);
        }
    }
}
