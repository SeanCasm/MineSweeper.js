const resetBtn = document.getElementById('reset');
const select = document.getElementById('select');
const startBtn = document.getElementById('start');
const grid = document.getElementById('grid');
const popup = document.getElementById('popup');
const timer = document.getElementById('timer');

let intervalID;
let difficult = 'easy';
let size = 0;
const totalMines = [10, 35, 50];
let currentTotalMines = 0;
let gridMatrix;
let time = 0;
let started = false;
let clearCount = 0;
let btns = [];

const generateGrid = () => {
    gridMatrix = new Array(size).fill({}).map(() => new Array(size).fill({}));
    for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
            const e = document.createElement('button');
            e.addEventListener('click', checkForMine);
            const id = i.toString() + j.toString();
            e.classList.add(id);
            e.classList.add('grid-btns');
            btns.push(e);
            grid.appendChild(e);
        }

    }
}
const generateMines = () => {
    let totalMines = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            gridMatrix[i][j] = {
                mine: Math.random() < 0.15, //cell has a mine or not
                mineCount: 0, // total mines around cell
                hasMines() {
                    return mineCount > 0;
                }
            }
            if (gridMatrix[i][j].mine) totalMines++;

            if (totalMines >= currentTotalMines) return;
        }
        if (i == size - 1 && totalMines < currentTotalMines) i = 0;
    }
}

const checkForMine = (e) => {
    if (!started) generateMines();

    const i = e.target.classList[0];
    const k = Number.parseInt(i[0]);
    const l = Number.parseInt(i[1]);
    console.log(k,l);
    if (gridMatrix[k - 1][l - 1].mine) {
        gameLost();
    } else {
        const btn = document.getElementsByClassName(k.toString() + l.toString())[0];
        btn.classList.add('btn-nm');
        clearCount++;
        if (clearCount == size * size) {
            gameEnd();
            return;
        }
        checkForMinesAround(k - 1, l - 1); //current cell selected
    }
    started = true;
}
const checkForMinesAround = (i = 0, j = 0) => {
    let cellAdj;
    const currentCell = gridMatrix[i][j];
    let btn;
    let p = (i + 1).toString(), o = (j + 1).toString();
    if (i - 1 >= 0 && j - 1 >= 0) {
        cellAdj = gridMatrix[i - 1][j - 1];
        if (cellAdj.mine) currentCell.mineCount++;
    }
    if (i - 1 >= 0) {
        cellAdj = gridMatrix[i - 1][j];
        if (cellAdj.mine) currentCell.mineCount++;
    }
    if (i - 1 >= 0 && j + 1 < size) {
        cellAdj = gridMatrix[i - 1][j + 1];
        if (cellAdj.mine) currentCell.mineCount++;
    }

    if (j - 1 >= 0) {
        cellAdj = gridMatrix[i][j - 1];
        if (cellAdj.mine) currentCell.mineCount++;
    }

    if (j + 1 < size) {
        cellAdj = gridMatrix[i][j + 1];
        if (cellAdj.mine) currentCell.mineCount++;
    }
    if (i + 1 < size && j - 1 >= 0) {
        cellAdj = gridMatrix[i + 1][j - 1];
        if (cellAdj.mine) currentCell.mineCount++;
    }
    if (i + 1 < size) {
        cellAdj = gridMatrix[i + 1][j];
        if (cellAdj.mine) currentCell.mineCount++;
    }
    if (i + 1 < size && j + 1 < size) {
        cellAdj = gridMatrix[i + 1][j + 1];
        if (cellAdj.mine) currentCell.mineCount++;
    }
    btn = document.getElementsByClassName(p + o)[0];
    if (currentCell.hasMines) {
        btn.classList.add(`mine-${currentCell.mineCount}`)
        btn.innerHTML = currentCell.mineCount;
    }
}
const timerInterval = () => {
    time++;
    timer.innerHTML = `Time: ${time}s`;
}
const startGame = () => {
    difficult = select.value;
    difficult[0].toLowerCase();
    switch (difficult) {
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
    grid.classList.add(`grid-${difficult}`);
    generateGrid();
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
    revealAllMines();
    const lost = document.createElement('h1');
    lost.innerHTML = 'You lost!';
    popup.appendChild(lost);
    lost.classList.add('lost');
    clearInterval(intervalID);
    grid.classList.add('grid-disable');
}
const revealAllMines = () => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridMatrix[i][j].mine) {
                const btn = document.getElementsByClassName((i+1).toString()+(j+1).toString())[0];
                btn.classList.add('btn-m');
            }
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