// src/utils/arrowSequence.js

export function generateArrowSequence(length) {
    const directions = ['up', 'down', 'left', 'right'];
    return Array.from({ length }, () => directions[Math.floor(Math.random() * directions.length)]);
}

export function displaySequence(scene, sequence, startY = 300) {
    const arrowImages = {
        up: 'blueUp',
        down: 'blueDown',
        left: 'blueLeft',
        right: 'blueRight'
    };

    scene.arrows = sequence.map((direction, index) => {
        return scene.add.image(100 + index * 70, startY, arrowImages[direction]);
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
