// src/utils/preload.js

import { loadAndCacheImage } from './imageCache.js';

export async function preload(scene) {

    const imageLinks = {
        'level-1': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/level-1.png',
        'level-10': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/level-10.png',
        'player-1': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/player-1.png',
        'player-2': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/player-2.png',
        'player-3': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/player-3.png',
        'player-4': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/player-4.png',
        'player-5': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/player-5.png',
        'blueUp': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/blueUp.png',
        'blueDown': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/blueDown.png',
        'blueLeft': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/blueLeft.png',
        'blueRight': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/blueRight.png',
        'greenUp': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/greenUp.png',
        'greenDown': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/greenDown.png',
        'greenLeft': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/greenLeft.png',
        'greenRight': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/greenRight.png',
        'xp': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/xp.png',
        'heart': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/heart.png',
        'timer': 'https://raw.githubusercontent.com/JC3P0/misc_assets/main/ArrowDash/timer.png',
    };

    for (const [key, url] of Object.entries(imageLinks)) {
        if (!scene.textures.exists(key)) {
            const imageBlob = await loadAndCacheImage(url);
            scene.textures.addBase64(key, imageBlob);
        }
    }
}
