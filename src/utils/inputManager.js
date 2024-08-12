// src/utils/inputManager.js

import { generateArrowSequence, displaySequence, updateArrowColor } from './arrowSequence.js';
import { updateScore } from './scoreManager.js';
import { loseHealth } from './playerHealth.js';
import { setLevelBackground } from './levelManager.js';

export function handleKey(scene, event) {
    const directionMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = directionMap[event.key];
    if (newDirection) {
        if ((scene.currentDirection.x + newDirection.x === 0 && scene.currentDirection.y === 0) ||
            (scene.currentDirection.y + newDirection.y === 0 && scene.currentDirection.x === 0)) {
            scene.currentDirection = newDirection;
        } else {
            scene.currentDirection.x += newDirection.x;
            scene.currentDirection.y += newDirection.y;

            const magnitude = Math.sqrt(scene.currentDirection.x ** 2 + scene.currentDirection.y ** 2);
            if (magnitude !== 0) {
                scene.currentDirection.x /= magnitude;
                scene.currentDirection.y /= magnitude;
            }
        }

        scene.lastDirection = newDirection;
        scene.isMoving = true;
    }

    const currentArrowDirection = scene.currentArrowSequence[scene.currentArrowIndex];
    if (event.key === `Arrow${currentArrowDirection.charAt(0).toUpperCase() + currentArrowDirection.slice(1)}`) {
        updateArrowColor(scene, scene.currentArrowIndex, currentArrowDirection);
        scene.currentArrowIndex++;
        updateScore(scene, 10);

        if (scene.currentArrowIndex >= scene.currentArrowSequence.length) {
            scene.level++;
            scene.levelText.setText('Level:' + scene.level);

            if (scene.level === 10) {
                setLevelBackground(scene, 10);
            }

            scene.currentArrowSequence = scene.nextArrowSequence;
            scene.nextArrowSequence = generateArrowSequence(10);
            scene.currentArrowIndex = 0;

            scene.arrows.forEach(arrow => arrow.destroy());
            displaySequence(scene, scene.currentArrowSequence, 300);
        }
    } else {
        const healthIcons = {
            full: '❤️',
            empty: '♡'
        };
        loseHealth(scene, healthIcons);
    }
}
