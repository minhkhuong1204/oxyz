let pieces = [
    { id: 0, posX: 0, posY: 0 },
    { id: 1, posX: -80, posY: 0 },
    { id: 2, posX: -160, posY: 0 },
    { id: 3, posX: 0, posY: -80 },
    { id: 4, posX: -80, posY: -80 },
    { id: 5, posX: -160, posY: -80 },
    { id: 6, posX: 0, posY: -160 },
    { id: 7, posX: -80, posY: -160 },
    { id: 8, posX: -160, posY: -160 }
];
let puzzleArea = document.getElementById('puzzleArea');
let message = document.getElementById('message');
let hintArea = document.getElementById('hintArea');

function startPuzzle() {
    puzzleArea.innerHTML = '';
    message.textContent = '';
    hintArea.style.display = 'none';
    pieces.sort(() => Math.random() - 0.5);

    pieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        div.style.backgroundImage = 'url("puzzle-image.jpg")';
        div.style.backgroundPosition = `${piece.posX}px ${piece.posY}px`;
        div.draggable = true;
        div.dataset.index = index;
        div.ondragstart = (e) => e.dataTransfer.setData('text', index);
        div.ondragover = (e) => e.preventDefault();
        div.ondrop = (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text'));
            const toIndex = parseInt(div.dataset.index);
            swapPieces(fromIndex, toIndex);
            checkWin();
        };
        puzzleArea.appendChild(div);
    });
}

function swapPieces(fromIndex, toIndex) {
    [pieces[fromIndex], pieces[toIndex]] = [pieces[toIndex], pieces[fromIndex]];
    renderPuzzle();
}

function renderPuzzle() {
    puzzleArea.innerHTML = '';
    pieces.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        div.style.backgroundImage = 'url("puzzle-image.jpg")';
        div.style.backgroundPosition = `${piece.posX}px ${piece.posY}px`;
        div.draggable = true;
        div.dataset.index = index;
        div.ondragstart = (e) => e.dataTransfer.setData('text', index);
        div.ondragover = (e) => e.preventDefault();
        div.ondrop = (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text'));
            const toIndex = parseInt(div.dataset.index);
            swapPieces(fromIndex, toIndex);
            checkWin();
        };
        puzzleArea.appendChild(div);
    });
}

function checkWin() {
    const correctOrder = [
        { id: 0, posX: 0, posY: 0 },
        { id: 1, posX: -80, posY: 0 },
        { id: 2, posX: -160, posY: 0 },
        { id: 3, posX: 0, posY: -80 },
        { id: 4, posX: -80, posY: -80 },
        { id: 5, posX: -160, posY: -80 },
        { id: 6, posX: 0, posY: -160 },
        { id: 7, posX: -80, posY: -160 },
        { id: 8, posX: -160, posY: -160 }
    ];
    if (pieces.every((piece, index) =>
        piece.posX === correctOrder[index].posX && piece.posY === correctOrder[index].posY)) {
        message.textContent = 'Congratulations! You solved the puzzle!';
        disableDragging();
        localStorage.setItem('game2Completed', 'true');
    }
}

function disableDragging() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    puzzlePieces.forEach(piece => {
        piece.draggable = false;
    });
}

function showHint() {
    hintArea.style.display = 'block';
    setTimeout(() => {
        hintArea.style.display = 'none';
    }, 3000);
}

startPuzzle(); 