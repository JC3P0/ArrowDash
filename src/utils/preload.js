// src/utils/preload.js

import { loadAndCacheImage } from './imageCache.js';

export async function preload(scene) {

    const imageLinks = {
        'level-1': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/level-1.png',
        'level-10': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/level-10.png',
        'player-1': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/player-1.png',
        'player-2': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/player-2.png',
        'player-3': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/player-3.png',
        'player-4': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/player-4.png',
        'player-5': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/player-5.png',
        'blueUp': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/blueUp.png',
        'blueDown': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/blueDown.png',
        'blueLeft': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/blueLeft.png',
        'blueRight': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/blueRight.png',
        'greenUp': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/greenUp.png',
        'greenDown': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/greenDown.png',
        'greenLeft': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/greenLeft.png',
        'greenRight': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/greenRight.png',
        'xp': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/xp.png',
        'heart': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/heart.png',
        'timer': 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/timer.png',
    };

    for (const [key, url] of Object.entries(imageLinks)) {
        if (!scene.textures.exists(key)) {
            const imageBlob = await loadAndCacheImage(url);
            scene.textures.addBase64(key, imageBlob);
        }
    }
}
