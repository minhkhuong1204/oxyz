const imageDisplay = document.getElementById('imageDisplay');
const guessArea = document.getElementById('guessArea');
const currentGuess = document.getElementById('currentGuess');
const options = document.getElementById('options');
const attemptsDisplay = document.getElementById('attempts');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');


const images = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg'

];

let score = 0;
let attempts = 5;
let correctSequence = [];
let guessSequence = [];
let roundActive = false;

function startRound() {
    if (roundActive) return;
    roundActive = true;


    attempts = 5;
    guessSequence = [];
    attemptsDisplay.textContent = attempts;
    scoreDisplay.textContent = score;
    guessArea.style.display = 'none';
    startButton.disabled = true;


    correctSequence = shuffleArray([...images]);


    imageDisplay.innerHTML = '';
    correctSequence.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        imageDisplay.appendChild(img);
    });


    setTimeout(() => {
        imageDisplay.innerHTML = '';
        guessArea.style.display = 'block';
        showOptions();
    }, 3000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showOptions() {
    currentGuess.innerHTML = '';
    options.innerHTML = '';


    for (let i = 0; i < 5; i++) {
        const img = document.createElement('img');
        img.src = guessSequence[i]
        currentGuess.appendChild(img);
    }


    images.forEach(src => {
        if (!guessSequence.includes(src)) {
            const img = document.createElement('img');
            img.src = src;
            img.onclick = () => guessImage(src);
            options.appendChild(img);
        }
    });
}

function guessImage(src) {
    if (!roundActive || attempts <= 0) return;

    guessSequence.push(src);
    attempts--;
    attemptsDisplay.textContent = attempts;


    if (guessSequence[guessSequence.length - 1] !== correctSequence[guessSequence.length - 1]) {
        endGame(`Wrong! The correct sequence was:`);

        return;
    }


    showOptions();


    if (guessSequence.length === 5) {
        score += 50;
        scoreDisplay.textContent = score;
        imageDisplay.innerHTML = 'Correct! Click "Start" for the next round.';
        roundActive = false;
        startButton.disabled = false;
        guessArea.style.display = 'none';
        return;
    }


    if (attempts === 0) {
        endGame(`Game Over! You ran out of attempts. The correct sequence was:`);
    }
}

function endGame(message) {
    imageDisplay.innerHTML = message;
    correctSequence.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        imageDisplay.appendChild(img);
    });
    roundActive = false;
    startButton.disabled = false;
    startButton.textContent = 'Play Again';
    guessArea.style.display = 'none';
}


startButton.addEventListener('click', () => {
    if (!roundActive && startButton.textContent === 'Play Again') {
        score = 0;
        scoreDisplay.textContent = score;
        imageDisplay.innerHTML = '';
        startButton.textContent = 'Start';
        startRound();
    }
});