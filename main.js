document.addEventListener('DOMContentLoaded', () => {

    const gamesCompleted = [
        localStorage.getItem('game1Completed'),
        localStorage.getItem('game2Completed'),
        localStorage.getItem('game3Completed'),
        localStorage.getItem('game4Completed'),
        localStorage.getItem('game5Completed'),
        localStorage.getItem('game6Completed')
    ];


    if (gamesCompleted.every(status => status === 'true')) {
        document.getElementById('achievement').style.display = 'block';
    }
});