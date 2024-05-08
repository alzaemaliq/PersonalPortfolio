// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const collisionsMap = [];
// Assuming 'collisions' is an array defined somewhere above this code
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width = 96;
    static height = 96;
    constructor({ position }) {
        this.position = position;
    }

    draw(ctx, mapX, mapY) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x + mapX, this.position.y + mapY, Boundary.width, Boundary.height);
    }

    bounds(mapX, mapY) {
        return {
            left: this.position.x + mapX,
            right: this.position.x + mapX + Boundary.width,
            top: this.position.y + mapY,
            bottom: this.position.y + mapY + Boundary.height
        };
    }
}


const boundaries = [];

// Iterate through each row and each symbol within the row
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 146) { // Check if the symbol equals 146
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width,
                    y: i * Boundary.height
                }
            }));
        }
    });
});

console.log(boundaries);


// Initialize images for the map, player in different directions, and foreground
const mapImage = new Image();
const playerDown = new Image();
const playerUp = new Image();
const playerLeft = new Image();
const playerRight = new Image();
const foregroundImage = new Image();

// Specify source paths for images
mapImage.src = './imageSources/LobbyMap.png';
playerDown.src = '/characterResources/playerDown.png';
playerUp.src = '/characterResources/playerUp.png';
playerLeft.src = '/characterResources/playerLeft.png';
playerRight.src = '/characterResources/playerRight.png';
foregroundImage.src = './imageSources/ForegroundMap.png';

// Define scale factors and movement speed
const mapScale = 3;
const playerScale = 1.5;
const speed = 4;

// Initialize scaled dimensions and positioning
let mapScaledWidth, mapScaledHeight, mapX, mapY;
let playerScaledWidth, playerScaledHeight;
let playerCropWidth, playerCropHeight;
let foregroundScaledWidth, foregroundScaledHeight, foregroundX, foregroundY;

// Define keys pressed state
const keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};
let keyOrder = [];
let frameIndex = 0;  // Current frame index for walking animation
let lastAnimationTime = 0;
const frameDuration = 150;  // Time each frame is displayed in milliseconds
let lastDirection = 'down'; // Default direction facing down

// Function to resize the canvas to fill the window and redraw content
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateDimensions();
    drawContent();
}

// Calculate scaled dimensions and positions
function updateDimensions() {
    mapScaledWidth = mapImage.width * mapScale;
    mapScaledHeight = mapImage.height * mapScale;
    mapX = (canvas.width - mapScaledWidth) / 2;
    mapY = (canvas.height - mapScaledHeight) / 2;

    foregroundScaledWidth = foregroundImage.width * mapScale;
    foregroundScaledHeight = foregroundImage.height * mapScale;
    foregroundX = mapX;
    foregroundY = mapY;

    playerCropWidth = playerDown.width / 4;
    playerCropHeight = playerDown.height;
    playerScaledWidth = playerCropWidth * playerScale;
    playerScaledHeight = playerCropHeight * playerScale;
}

function checkCollision(proposedX, proposedY) {
    // Compute hitbox based on proposed movement
    const hitbox = {
        left: proposedX + 5,
        right: proposedX + 5 + 64,
        top: proposedY + 48,
        bottom: proposedY + 48 + 48
    };

    for (let boundary of boundaries) {
        const bounds = boundary.bounds(mapX, mapY);
        if (hitbox.left < bounds.right &&
            hitbox.right > bounds.left &&
            hitbox.top < bounds.bottom &&
            hitbox.bottom > bounds.top) {
            return true;
        }
    }
    return false;
}


// Function to draw all content on the canvas
function drawContent() {
    if (!mapImage.complete || !playerDown.complete || !playerUp.complete || !playerLeft.complete || !playerRight.complete || !foregroundImage.complete) {
        return; // Ensure all images are loaded before drawing
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mapImage, mapX, mapY, mapScaledWidth, mapScaledHeight);

    let playerImage = playerDown;
    switch (lastDirection) {
        case 'up':
            playerImage = playerUp;
            break;
        case 'down':
            playerImage = playerDown;
            break;
        case 'left':
            playerImage = playerLeft;
            break;
        case 'right':
            playerImage = playerRight;
            break;
    }

    const playerX = (canvas.width - playerScaledWidth) / 2 + 47;
    const playerY = (canvas.height - playerScaledHeight) / 2 + 30;
    const frameOffset = frameIndex * playerCropWidth;

    ctx.drawImage(playerImage,
        frameOffset, 0, playerCropWidth, playerCropHeight,
        playerX, playerY,
        playerScaledWidth, playerScaledHeight);

    ctx.drawImage(foregroundImage, foregroundX, foregroundY, foregroundScaledWidth, foregroundScaledHeight);
}


// Event listeners and animation setup
mapImage.onload = updateDimensions;
playerDown.onload = updateDimensions;
playerUp.onload = updateDimensions;
playerLeft.onload = updateDimensions;
playerRight.onload = updateDimensions;
foregroundImage.onload = updateDimensions;
window.addEventListener('resize', resizeCanvas);

function animate(time) {
    requestAnimationFrame(animate);

    let playerX = (canvas.width - playerScaledWidth) / 2 + 47;
    let playerY = (canvas.height - playerScaledHeight) / 2 + 30;

    let playerMoved = false;  // Flag to check if player has moved

    if (keysPressed.w) {
        if (!checkCollision(playerX, playerY - speed)) {
            mapY += speed;
            foregroundY += speed;
            lastDirection = 'up';
            playerMoved = true;
        }
    }
    if (keysPressed.s) {
        if (!checkCollision(playerX, playerY + speed)) {
            mapY -= speed;
            foregroundY -= speed;
            lastDirection = 'down';
            playerMoved = true;
        }
    }
    if (keysPressed.a) {
        if (!checkCollision(playerX - speed, playerY)) {
            mapX += speed;
            foregroundX += speed;
            lastDirection = 'left';
            playerMoved = true;
        }
    }
    if (keysPressed.d) {
        if (!checkCollision(playerX + speed, playerY)) {
            mapX -= speed;
            foregroundX -= speed;
            lastDirection = 'right';
            playerMoved = true;
        }
    }

    drawContent();
    updateAnimationFrame(time, playerMoved);
}

function updateAnimationFrame(time, playerMoved) {
    // Update the animation frame only if the player has moved
    if (playerMoved) {
        if (time - lastAnimationTime > frameDuration) {
            frameIndex = (frameIndex + 1) % 4;  // Cycle through frames
            lastAnimationTime = time;
        }
    } else {
        // If player hasn't moved, reset to the first frame (or specific frame)
        if (lastDirection === 'right') {
            frameIndex = 3;  // Set to last frame if facing right
        } else {
            frameIndex = 0;
        }
    }
}

animate(0); // Start the animation loop

window.addEventListener('keydown', (e) => {
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        keysPressed[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        keysPressed[e.key] = false;
    }
});

// Initial canvas setup
resizeCanvas();
