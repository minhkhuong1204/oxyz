const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [];
let food = {};
let dx = 1;
let dy = 0;
let score = 0;
let gameRunning = false;


const foodImage = new Image();
foodImage.src = 'oxyz.jpg';

function startGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    spawnFood();
    gameRunning = true;
    gameLoop();
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        spawnFood();
    }
}

function drawGame() {

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };


    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    snake.unshift(head);


    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }


    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#006400' : '#90EE90';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });


    if (foodImage.complete) {
        ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    } else {

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }


    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert(`Game Over! Your score: ${score}`);
        gameRunning = false;
        localStorage.setItem('game4Completed', 'true');
        return;
    }
}

function gameLoop() {
    if (!gameRunning) return;
    drawGame();
    setTimeout(gameLoop, 100);
}


document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

startGame(); 