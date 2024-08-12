export function generateArrowSequence(length) {
    const directions = ['up', 'down', 'left', 'right'];
    return Array.from({ length }, () => directions[Math.floor(Math.random() * directions.length)]);
}

export function displaySequence(scene, sequence) {
    const arrowImages = {
        up: 'blueUp',
        down: 'blueDown',
        left: 'blueLeft',
        right: 'blueRight'
    };

    // Set the Y position to place arrows just below the sky image
    const startY = 655 + 34; 

    // Remove the previous background if it exists
    if (scene.arrowBackground) {
        scene.arrowBackground.destroy();
    }

    // Simple and explicit positioning values
    const padding = 20; // Increase padding to make the background wider
    const backgroundX = 60 - padding / 2; // Adjust X position to keep arrows centered
    const backgroundY = startY - 30; // Adjust for padding above the arrows and center them vertically
    const backgroundWidth = sequence.length * 66 + 12 + padding; // Increase the width of the background
    const backgroundHeight = 60; // Slightly reduce the height of the background
    const backgroundColor = 0x2e2b5f; 
    const outlineColor = 0x5a5499; 

    // Add a new background rectangle with rounded corners
    scene.arrowBackground = scene.add.graphics();
    
    // Draw the background with rounded corners
    scene.arrowBackground.fillStyle(backgroundColor, .8); // Solid background color with full opacity
    scene.arrowBackground.fillRoundedRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight, 30); // Rounded corners with a radius of 25

    // Draw the transparent outline, slightly inset and smaller
    scene.arrowBackground.lineStyle(7, outlineColor, 1);
    scene.arrowBackground.strokeRoundedRect(backgroundX + 0, backgroundY + 0, backgroundWidth - 2, backgroundHeight - 2, 30); // Slightly inset with a 23 radius

    // Display the arrow sequence on top of the background
    scene.arrows = sequence.map((direction, index) => {
        return scene.add.image(backgroundX + padding / 2 + 20 + index * 70, startY, arrowImages[direction]); // Adjust for padding
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
