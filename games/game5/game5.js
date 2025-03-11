const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

const playerSize = 20;
let player = { x: 50, y: canvas.height / 2, speed: 5 };
let obstacles = [];
let goal = { x: canvas.width - 50, y: 50, width: 40, height: 40 };
let score = 0;
let level = 1;
let gameRunning = false;

function startGame() {
    player = { x: 50, y: canvas.height / 2, speed: 5 };
    obstacles = [];
    score = 0;
    level = 1;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    spawnObstacles(level);
    gameRunning = true;
    gameLoop();
}

function spawnObstacles(currentLevel) {
    obstacles = [];
    let count, speed, directionX, directionY, spacing;

    switch (currentLevel) {
        case 1:
            count = 5;
            speed = 2;
            directionX = -1;
            directionY = 0;
            spacing = 100;
            for (let i = 0; i < count; i++) {
                obstacles.push({
                    x: 150 + i * spacing,
                    y: canvas.height / 2 + (i % 2 === 0 ? -50 : 50),
                    radius: 15,
                    speed: speed,
                    dx: directionX,
                    dy: directionY
                });
            }
            break;
        case 2:
            count = 7;
            speed = 2.5;
            directionX = 0;
            directionY = 1;
            spacing = 80;
            for (let i = 0; i < count; i++) {
                obstacles.push({
                    x: 150 + i * spacing,
                    y: -15,
                    radius: 15,
                    speed: speed,
                    dx: directionX,
                    dy: directionY
                });
            }
            break;
        case 3:
            count = 9;
            speed = 3;
            directionX = 1;
            directionY = 1;
            spacing = 60;
            for (let i = 0; i < count; i++) {
                obstacles.push({
                    x: 150 + i * spacing,
                    y: -15 - i * 20,
                    radius: 15,
                    speed: speed,
                    dx: directionX,
                    dy: directionY
                });
            }
            break;
    }
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x - playerSize / 2, player.y - playerSize / 2, playerSize, playerSize);
}

function drawObstacles() {
    ctx.fillStyle = 'blue';
    obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawGoal() {
    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x - goal.width / 2, goal.y - goal.height / 2, goal.width, goal.height);
}

function updatePlayer() {
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;

    player.x = Math.max(playerSize / 2, Math.min(canvas.width - playerSize / 2, player.x));
    player.y = Math.max(playerSize / 2, Math.min(canvas.height - playerSize / 2, player.y));
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.speed * obstacle.dx;
        obstacle.y += obstacle.speed * obstacle.dy;


        if (level === 1) {
            if (obstacle.x + obstacle.radius < 0) obstacle.x = canvas.width + obstacle.radius;
        } else if (level === 2) {
            if (obstacle.y - obstacle.radius > canvas.height) obstacle.y = -obstacle.radius;
        } else if (level === 3) {
            if (obstacle.x - obstacle.radius > canvas.width || obstacle.y - obstacle.radius > canvas.height) {
                obstacle.x = 150 + obstacles.indexOf(obstacle) * 60;
                obstacle.y = -15 - obstacles.indexOf(obstacle) * 20;
            }
        }
    });
}

function checkCollision() {
    for (let obstacle of obstacles) {
        const dx = player.x - obstacle.x;
        const dy = player.y - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < playerSize / 2 + obstacle.radius) {
            alert(`Game Over! Your score: ${score}`);
            gameRunning = false;
            localStorage.setItem('game5Completed', 'true');
            return true;
        }
    }


    if (
        player.x + playerSize / 2 > goal.x - goal.width / 2 &&
        player.x - playerSize / 2 < goal.x + goal.width / 2 &&
        player.y + playerSize / 2 > goal.y - goal.height / 2 &&
        player.y - playerSize / 2 < goal.y + goal.height / 2
    ) {
        score += 10;
        scoreDisplay.textContent = score;

        if (score % 10 === 0 && level < 3) {
            level++;
            levelDisplay.textContent = level;
            spawnObstacles(level);
        }

        player.x = 50;
        player.y = canvas.height / 2;
    }
    return false;
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    drawGoal();
    updatePlayer();
    updateObstacles();

    if (!checkCollision()) {
        requestAnimationFrame(gameLoop);
    }
}


let keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

startGame(); 