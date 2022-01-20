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
const totalMines = [8, 12, 20];//easy, medium, hard
let currentTotalMines = 0;
let gridArray;
let time = 0;
let started = false;
let clearCount = 0;
let mineCells = [];

class Mine {
    constructor(mine, mineCount, id) {
        this.mine = mine;
        this.mineCount = mineCount;
        this.id = id;
    }
}

const generateGrid = () => {
    gridArray = new Array(size);//create an array of size 'size' to contain more arrays

    let id = 0;
    for (let i = 0; i < size; i++) {
        gridArray[i] = new Array(size);//create a new array inside the current index of parent array 
        for (let j = 0; j < size; j++) {
            const btn = document.createElement('button');
            btn.id = id.toString();
            btn.onclick = checkForMine;
            btn.classList.add('grid-btns');
            grid.appendChild(btn);
            gridArray[i][j] = new Mine(false, 0, id);
            id++;
        }
    }
}
const generateMines = (id) => {
    Here:
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridArray[i][j].id != id && !gridArray[i][j].mine) {
                const isMine = Math.random() > 0.89;
                gridArray[i][j].mine = isMine;
                if (isMine) {
                    mineCells.push(gridArray[i][j].id);
                }
                if (mineCells.length == currentTotalMines) {
                    break Here;
                }
            }

        }
        if (mineCells.length < currentTotalMines && i == size - 1) {
            i = 0;
        }
    }
    started = true;
}
const checkForMine = (e) => {

    const id = Number.parseInt(e.target.id);
    const i = Number.parseInt(id / size); // get the row
    const j = id % size; // get the column
    if (!started) generateMines(e.target.id);
    if (gridArray[i][j]?.mine) { // current pressed cell
        showAllMines();
    } else {
        e.target.classList.add('btn-nm');
        e.target.classList.add('pointer-disable');
        clearCount++;
        if (clearCount == (gridArray.length - currentTotalMines)) { // cells grid cleaned
            gameWinner();
            return;
        }
        checkForMinesAround(i, j, id); //current cell selected
    }
}
const checkForMinesAround = (i, j, id) => {
    let rowStart = i - 1, rowEnd = i + 1;
    let colStart = j - 1, colEnd = j + 1;

    for (let a = rowStart; a <= rowEnd ; a++) {
        if(a<0 || a>=size) continue;
        for (let s = colStart; s <= colEnd ; s++) {
            if(s<0 || s>=size) continue;
            if (gridArray[a][s].mine) {
                gridArray[i][j].mineCount++;
            }
        }
    }
    if (gridArray[i][j].mineCount > 0) {
        const btn = document.getElementById(id);
        btn.classList.add(`mine-${gridArray[i][j].mineCount}`);
        btn.innerHTML = gridArray[i][j].mineCount;
    }
}
const timerInterval = (p) => {
    time++;
    p.innerHTML = `Time: ${time}s`;
}
const startGame = () => {
    difficulty = select.value;
    difficulty[0].toLowerCase();
    switch (difficulty) {
        case 'easy':
            size = 7;
            currentTotalMines = totalMines[0];
            break;
        case 'medium':
            size = 9;
            currentTotalMines = totalMines[1];
            break;
        case 'hard':
            size = 12;
            currentTotalMines = totalMines[2];
            break;
    }
    select.disabled = startBtn.disabled = true;
    grid.classList.add(`grid-${difficulty}`);
    generateGrid();
    
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    
    p1.innerHTML=`Total mines: ${currentTotalMines}`;
    minesAmount.append(p1);

    p2.innerHTML = `Time: ${time}s`;
    timer.append(p2);

    intervalID = setInterval(()=>timerInterval(p2), 1000);
}
const gameWinner = () => {
    const win = document.createElement('h1');
    win.innerHTML = 'You win!';
    win.classList.add('win');
    gameEnd(win);
}
const gameLoser = () => {
    const lost = document.createElement('h1');
    lost.innerHTML = 'You lost!';
    lost.classList.add('lost');
    gameEnd(lost);
}
const gameEnd=(append)=>{
    clearInterval(intervalID);
    
    popup.appendChild(append);
    
    const stats = document.getElementById('stats');
    stats.classList.add('fixed-stats');
    stats.classList.remove('d-flex','d-flex-row');

    popup.appendChild(stats);
    popup.appendChild(resetBtn);
    popup.classList.add('pop-up');
}
const showAllMines = () => {
    let i = 0;
    grid.classList.add('pointer-disable');
    let idI = setInterval(() => {
        const btn = document.getElementById(mineCells[i]);
        btn.classList.add('btn-m');
        i++;
        if (i >= mineCells.length){
            setTimeout(gameLoser,1000);
            clearInterval(idI);
        }

    }, 55);
}
const reloadPage = () => {
    window.location.reload();
}
const setListeners = () => {
    resetBtn.addEventListener('click', reloadPage);
    startBtn.addEventListener('click', startGame);
}


setListeners();