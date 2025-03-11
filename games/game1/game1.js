const randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 5;

function checkGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    const result = document.getElementById('guessResult');
    const attemptsLeft = document.getElementById('attemptsLeft');

    if (isNaN(guess) || guess < 1 || guess > 100) {
        result.textContent = 'Please enter a valid number between 1 and 100!';
        return;
    }

    attempts--;
    attemptsLeft.textContent = `Attempts left: ${attempts}`;

    if (guess === randomNumber) {
        result.textContent = 'Congratulations! You guessed it right!';
        disableGame();
        localStorage.setItem('game1Completed', 'true');
    } else if (guess < randomNumber) {
        result.textContent = 'Too low! Try again.';
    } else {
        result.textContent = 'Too high! Try again.';
    }

    if (attempts === 0) {
        result.textContent = `Game Over! The number was ${randomNumber}.`;
        disableGame();
        localStorage.setItem('game1Completed', 'true');
    }
}

function disableGame() {
    document.getElementById('guessInput').disabled = true;
    document.querySelector('button').disabled = true;
}


function resetGame() {
    attempts = 5;
    document.getElementById('guessResult').textContent = '';
    document.getElementById('attemptsLeft').textContent = 'Attempts left: 5';
    document.getElementById('guessInput').disabled = false;
    document.querySelector('button').disabled = false;
    document.getElementById('guessInput').value = '';
}

