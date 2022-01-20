const resetBtn = document.getElementById('reset');
const select = document.getElementById('select');
const startBtn = document.getElementById('start');
const grid = document.getElementById('grid');
const popup = document.getElementById('popup');
const timer = document.getElementById('timer');
const minesAmount = document.getElementById('minesAmount');

let intervalID;
let difficulty = 'easy';
let size = 0;
const totalMines = [10, 35, 50];//easy, medium, hard
let currentTotalMines = 0;
let gridArray = [{}];
let time = 0;
let started = false;
let clearCount = 0;

class Mine {
    constructor(mine, mineCount) {
        this.mine = mine;
        this.mineCount = mineCount;
    }
}

const generateGrid = () => {
    gridArray = new Array(size * size).fill(new Mine(false, 0));
    for (let i = 0; i < gridArray.length; i++) {
        const btn = document.createElement('button');
        btn.id = i.toString();
        btn.onclick = checkForMine;
        btn.classList.add('grid-btns');
        grid.appendChild(btn);
        gridArray[i] = new Mine(false, 0);
    }
}
const generateMines = (id) => {
    let totalMines = 0;
    let current = 0;
    for (let i = 0; i < gridArray.length; i++) {
        if (i != id) {
            const isMine = Math.random() > 0.89;
            gridArray[i].mine = isMine;
            if (isMine) totalMines++;
        }
        if (totalMines >= currentTotalMines) {
            current = i + 1;
            break;
        } else if (totalMines < currentTotalMines && i == gridArray.length - 1) i = 0;
    }
    for (let j = current; j < gridArray.length; j++) {
        gridArray[j] = new Mine(false, 0);
    }
    started = true;
}
const checkForMine = (e) => {

    const id = Number.parseInt(e.target.id);
    if (!started) generateMines(e.target.id);
    if (gridArray[id].mine) { // current pressed cell
        gameLost();
    } else {
        e.target.classList.add('btn-nm');
        clearCount++;
        if (clearCount == (gridArray.length - currentTotalMines)) { // cells grid cleaned
            gameEnd();
            return;
        }
        checkForMinesAround(id); //current cell selected
    }
}
const checkForMinesAround = (id) => {

    const top = id - size - 1;
    const mid = id - 1;
    const bottom = id + size - 1;

    //checks the top line
    for (let i = top; i <= top + 2; i++) {
        if (gridArray[i]?.mine) gridArray[id].mineCount++;
    }
    for (let i = mid; i < mid + 2; i++) {
        if (gridArray[i]?.mine) gridArray[id].mineCount++;
    }
    for (let i = bottom; i < bottom + 2; i++) {
        if (gridArray[i]?.mine) gridArray[id].mineCount++;
    }
    if (gridArray[id].mineCount>0) {
        const btn = document.getElementById(id);
        btn.classList.add(`mine-${gridArray[id].mineCount}`);
        btn.innerHTML = gridArray[id].mineCount;
    }
}
const timerInterval = () => {
    time++;
    timer.innerHTML = `Time: ${time}s`;
}
const startGame = () => {
    difficulty = select.value;
    difficulty[0].toLowerCase();
    switch (difficulty) {
        case 'easy':
            size = 9;
            currentTotalMines = totalMines[0];
            break;
        case 'medium':
            size = 12;
            currentTotalMines = totalMines[1];
            break;
        case 'hard':
            size = 15;
            currentTotalMines = totalMines[2];
            break;
    }
    select.disabled = startBtn.disabled = true;
    grid.classList.add(`grid-${difficulty}`);
    generateGrid();
    minesAmount.innerHTML = `Total mines: ${currentTotalMines}`;
    timer.innerHTML = `Time: ${time}s`;
    intervalID = setInterval(timerInterval, 1000);
}
const gameEnd = () => {
    const win = document.createElement('h1');
    win.innerHTML = 'You win!';
    popup.appendChild(win);
    win.classList.add('win');
    clearInterval(intervalID);
    grid.classList.add('grid-disable');
}
const gameLost = () => {
    showAllMines();
    const lost = document.createElement('h1');
    lost.innerHTML = 'You lost!';
    popup.appendChild(lost);
    lost.classList.add('lost');
    clearInterval(intervalID);
    grid.classList.add('grid-disable');
}
const showAllMines = () => {
    for (let i = 0; i < gridArray.length; i++) {
        if (gridArray[i].mine) {
            const btn = document.getElementById(i);
            btn.classList.add('btn-m');
        }
    }
}
const reloadPage = () => {
    window.location.reload();
}
const setListeners = () => {
    resetBtn.addEventListener('click', reloadPage);
    startBtn.addEventListener('click', startGame);
}


setListeners();