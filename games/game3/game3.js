const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const hpDisplay = document.getElementById('hp');

let score = 0;
let hp = 100;
let shooter = { x: canvas.width / 2, y: canvas.height - 30, angle: 0 };
let bullets = [];
let bubbles = [];
const bubbleColors = ['red', 'blue', 'green', 'yellow'];
const bubbleRadius = 20;
let nextBulletColor = '';
let gameRunning = false;

function startGame() {
    score = 0;
    hp = 100;
    scoreDisplay.textContent = score;
    hpDisplay.textContent = hp;
    shooter = { x: canvas.width / 2, y: canvas.height - 30, angle: 0 };
    bullets = [];
    bubbles = [];
    spawnBubbles(10);
    nextBulletColor = getRandomColorFromBubbles();
    gameRunning = true;
    gameLoop();
}

function spawnBubbles(count) {
    const minDistance = bubbleRadius * 2.5;
    for (let i = 0; i < count; i++) {
        let x, y, color, validPosition;
        do {
            x = Math.random() * (canvas.width - bubbleRadius * 2) + bubbleRadius;
            y = Math.random() * 150 + bubbleRadius;
            color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
            validPosition = bubbles.every(bubble => {
                const dx = bubble.x - x;
                const dy = bubble.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance >= minDistance;
            });
        } while (!validPosition);
        bubbles.push({ x, y, color, radius: bubbleRadius });
    }
}

function getRandomColorFromBubbles() {
    const currentColors = [...new Set(bubbles.map(b => b.color))];
    return currentColors[Math.floor(Math.random() * currentColors.length)];
}

function drawShooter() {
    ctx.save();
    ctx.translate(shooter.x, shooter.y);
    ctx.rotate(shooter.angle);
    ctx.fillStyle = 'black';
    ctx.fillRect(-10, -5, 20, 10);
    ctx.restore();


    ctx.beginPath();
    ctx.arc(shooter.x, shooter.y + 20, 10, 0, Math.PI * 2);
    ctx.fillStyle = nextBulletColor;
    ctx.fill();
    ctx.closePath();
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawBubbles() {
    bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
    });
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.y < 0 || bullet.x < 0 || bullet.x > canvas.width) {
            bullets.splice(index, 1);
            if (!bullet.hit) {
                hp -= 10;
                hpDisplay.textContent = hp;
                if (hp <= 0) {
                    alert('Game Over! Your HP reached 0.');
                    gameRunning = false;
                    localStorage.setItem('game3Completed', 'true');
                }
            }
        }
    });
}

function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = 0; j < bubbles.length; j++) {
            const bubble = bubbles[j];
            const dx = bullet.x - bubble.x;
            const dy = bullet.y - bubble.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.radius + bubble.radius) {
                bullet.hit = true;
                bullets.splice(i, 1);
                if (bullet.color === bubble.color) {
                    bubbles.splice(j, 1);
                    score += 10;
                    scoreDisplay.textContent = score;
                    if (bubbles.length === 0) {
                        alert('Congratulations! You cleared all bubbles!');
                        gameRunning = false;
                        localStorage.setItem('game3Completed', 'true');
                    }
                } else {
                    hp -= 10;
                    hpDisplay.textContent = hp;
                    if (hp <= 0) {
                        alert('Game Over! Your HP reached 0.');
                        gameRunning = false;
                    }
                }
                nextBulletColor = getRandomColorFromBubbles();
                return;
            }
        }
    }
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShooter();
    drawBullets();
    drawBubbles();
    updateBullets();
    checkCollisions();

    requestAnimationFrame(gameLoop);
}


canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    shooter.angle = Math.atan2(mouseX - shooter.x, shooter.y - mouseY);
});

canvas.addEventListener('click', () => {
    if (!gameRunning) return;
    const bulletColor = nextBulletColor;
    const speed = 5;
    const vx = Math.sin(shooter.angle) * speed;
    const vy = -Math.cos(shooter.angle) * speed;
    bullets.push({
        x: shooter.x,
        y: shooter.y,
        vx: vx,
        vy: vy,
        radius: 10,
        color: bulletColor,
        hit: false
    });
    nextBulletColor = getRandomColorFromBubbles();
});

startGame(); 