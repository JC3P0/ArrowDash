// src/utils/gameUtils.js

import { getHighScores, saveHighScore } from '../api/highscores.js';

export function generateArrowSequence(length) {
    const directions = ['up', 'down', 'left', 'right'];
    return Array.from({ length }, () => directions[Math.floor(Math.random() * directions.length)]);
}

export function displaySequence(scene) {
    const arrowImages = {
        up: 'blueUp',
        down: 'blueDown',
        left: 'blueLeft',
        right: 'blueRight'
    };

    scene.arrows = scene.arrowSequence.map((direction, index) => {
        return scene.add.image(100 + index * 70, 300, arrowImages[direction]);
    });
}

export function updateArrowColor(scene, index, direction) {
    const arrowImages = {
        up: 'greenUp',
        down: 'greenDown',
        left: 'greenLeft',
        right: 'greenRight'
    };

    scene.arrows[index].setTexture(arrowImages[direction]);
}

export async function loadHighScores(scene) {
    try {
        scene.highscores = await getHighScores();
    } catch (error) {
        console.error('Error loading high scores:', error);
    }
}

export async function checkAndSaveHighScore(scene, playerName, score) {
    const lowestHighScore = scene.highscores[scene.highscores.length - 1]?.score || 0;

    if (scene.highscores.length < 10 || score > lowestHighScore) {
        if (scene.highscores.length >= 10) {
            scene.highscores.pop();
        }
        scene.highscores.push({ player: playerName, score });
        scene.highscores.sort((a, b) => b.score - a.score);

        await saveHighScore(playerName, score);
    }
}

export function handleWorldBounds(body, currentDirection) {
    // Reverse the direction of velocity when hitting the edge
    if (body.blocked.up || body.blocked.down) {
        currentDirection.y = -currentDirection.y;
    }
    if (body.blocked.left || body.blocked.right) {
        currentDirection.x = -currentDirection.x;
    }
}
