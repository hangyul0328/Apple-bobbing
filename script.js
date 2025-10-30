const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('game-over');
const startButton = document.getElementById('start-button');

const player = {
    x: 50,
    y: 50,
    width: 20,
    height: 20,
    color: 'blue',
    direction: 'right',
};

const apple = {
    x: 0,
    y: 0,
    radius: 10,
    color: 'red',
};

let score = 0;
let gameRunning = false;
let gameInterval;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawApple() {
    ctx.fillStyle = apple.color;
    ctx.beginPath();
    ctx.arc(apple.x, apple.y, apple.radius, 0, Math.PI * 2);
    ctx.fill();
}

function moveApple() {
    apple.x = Math.floor(Math.random() * (canvas.width - apple.radius * 2)) + apple.radius;
    apple.y = Math.floor(Math.random() * (canvas.height - apple.radius * 2)) + apple.radius;
}

function updateScore() {
    scoreEl.textContent = score;
}

function movePlayer() {
    const speed = score / 10 + 1;
    switch (player.direction) {
        case 'up':
            player.y -= speed;
            break;
        case 'down':
            player.y += speed;
            break;
        case 'left':
            player.x -= speed;
            break;
        case 'right':
            player.x += speed;
            break;
    }
}

function checkCollision() {
    // Player and apple
    const dx = player.x + player.width / 2 - apple.x;
    const dy = player.y + player.height / 2 - apple.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.width / 2 + apple.radius) {
        score += 10;
        updateScore();
        moveApple();
    }

    // Player and walls
    if (player.x < 0 || player.x + player.width > canvas.width ||
        player.y < 0 || player.y + player.height > canvas.height) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    gameOverEl.classList.remove('hidden');
    startButton.disabled = false;
    startButton.textContent = 'Play Again';
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    checkCollision();

    drawPlayer();
    drawApple();
}

function startGame() {
    player.x = 50;
    player.y = 50;
    player.direction = 'right';
    score = 0;
    updateScore();
    gameRunning = true;
    gameOverEl.classList.add('hidden');
    startButton.disabled = true;

    moveApple();
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player.direction = 'up';
            break;
        case 'ArrowDown':
            player.direction = 'down';
            break;
        case 'ArrowLeft':
            player.direction = 'left';
            break;
        case 'ArrowRight':
            player.direction = 'right';
            break;
    }
});

// Initial draw
updateScore();
drawPlayer();
moveApple(); // place apple initially
drawApple(); // draw it
