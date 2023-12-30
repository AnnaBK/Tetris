const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'T',
    'I'
];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'S': [
        [0, 0, 1],
        [1, 1, 1],
        [1, 0, 0]
    ],
    'Z': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    'I': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
};

const colors = ['red', 'green', 'blue', 'orange', 'yellow'];

let colorTetro = getRandomElement(colors);



let playfield;
let tetromino;
let cells;
let timeoutID;
let requestID;
let score = 0;
let isPaused = false;
let isGameOver = false;
const gameOverBlock = document.querySelector('.game-over');
// const btnRestart = document.querySelector('.restart');
const btnRestart = document.querySelectorAll('.restart');
const btnsControl = document.querySelectorAll('.control-btn');
document.getElementById('score').innerHTML = "Score: " + score;

init();

function init(){
    gameOverBlock.style.display = 'none';
    isGameOver = false;
    generatePlayfield();
    generateTetromino();
    startLoop();
    cells = document.querySelectorAll('.tetris div');
    score = 0;
    countScore(null);
}

// Keydown events
document.addEventListener('keydown', onKeyDown);

// Task 2
btnRestart.forEach(function(btn) {
    btn.addEventListener('click', function() {
        init();
    })
});

// Task 3
btnsControl.forEach(function(btn) {
    btn.addEventListener('click', function() {
        let idName = btn.getAttribute('id');
        onKeyDown(idName);
    })
});

function togglePauseGame() {
    isPaused = !isPaused;

    if(isPaused) {
        stopLoop();
    } else {
        startLoop();
    }
}
// Task 3
function onKeyDown(event) {
    if(event.key == 'p' || event == 'pause-btn') { 
        togglePauseGame(); 
    }
    if(isPaused) {
        return;
    }
    switch(event.key || event) {
        case ' ':
        case 'fall-btn':
            dropTetrominoDown();
            break;
        case 'ArrowUp':
        case 'rotate-btn':
            rotateTetromino();
            break;
        case 'ArrowDown' || 'down-btn':
        case 'down-btn':
            moveTetrominoDown();
            break;
        case 'ArrowLeft' || 'left-btn':
        case 'left-btn':
            moveTetrominoLeft();
            break;
        case 'ArrowRight' || 'right-btn':
        case 'right-btn':
            moveTetrominoRight();
            break;
    }
    draw();
}

function dropTetrominoDown() {
    while(! isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
}

function moveTetrominoDown() {
    tetromino.row += 1;
    if(isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
}

function moveTetrominoLeft() {
    tetromino.column -=1;
    if(isValid()) {
        tetromino.column +=1;
    }
}

function moveTetrominoRight() {
    tetromino.column +=1;
    if(isValid()) {
        tetromino.column -=1;
    }
}

// functions generate playdields and tetromino

function generatePlayfield() {
    document.querySelector('.tetris').innerHTML = '';
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));

    // console.log(playfield);
};

function generateTetromino() {
    const nameTetro = getRandomElement(TETROMINO_NAMES);
    const matrixTetro = TETROMINOES[nameTetro];
    // console.log(matrixTetro);

    const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);
    const rowTetro = -2;

    tetromino ={
        name: nameTetro,
        matrix: matrixTetro,
        column: columnTetro,
        row: rowTetro,
        color: colorTetro,
    }
}

//draw

function drawPlayfield(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++) {
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            // if(playfield[row][column] == 0) { continue };
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            if (name) {
                cells[cellIndex].classList.add(name); 
            }
            else {
                cells[cellIndex].style.removeProperty('background-color');
            }
        }
    }

}

function drawTetronimo() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++) {
        for(let column = 0; column < tetrominoMatrixSize; column++) {
            // cells[cellIndex].innerHTML = array[row][column];
            if(tetromino.matrix[row][column] == 0){ continue };
            if(isOutsideTopBoard(row)) { continue };
            const cellIndex = convertPositionToIndex(tetromino.row + row, 
                tetromino.column + column);
            cells[cellIndex].classList.add(name);
            cells[cellIndex].style.backgroundColor = tetromino.color;
        }
    }
}

function draw() {
    cells.forEach(function(cell) {
        cell.removeAttribute('class');
    });
    drawPlayfield();
    drawTetronimo();
}

function countScore(destroyedRows) {
    switch(destroyedRows){
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break; 
        case 4:
            score += 100;
            break; 
        default:
            score += 0;      
    }
    document.querySelector('#score').innerHTML = "Score: " + score;
}
// Task 1
function gameOver() {
    stopLoop();
    gameOverBlock.style.display = 'flex';
    document.querySelector('#final-score').innerHTML = score;
}

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function isOutsideTopBoard(row) {
    return tetromino.row + row < 0;
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for( let row = 0; row < matrixSize; row++) {
        for( let column = 0; column < matrixSize; column++) {
            if(!tetromino.matrix[row][column])
                continue;
            if(isOutsideTopBoard(row)){ 
                isGameOver = true;
                return;
            }
            playfield[tetromino.row + row][tetromino.column + column]
                = tetromino.name;
        }
    }
    const filledRows = findFilledRows();
    // console.log(filledRows);
    removeFilledRows(filledRows);
    colorTetro = getRandomElement(colors);
    generateTetromino();
}

function removeFilledRows(filledRows) {
    filledRows.forEach(row => {
        dropRowsAbove(row);
    });
    countScore(filledRows.length); 
}

function dropRowsAbove(rowDelete) {
    for(let row = rowDelete; row > 0; row--){
        playfield[row] = playfield[row - 1];
    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows() {
    const filledRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row++) {
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(playfield[row][column] != 0) {
                filledColumns++;
            }
        }
        if(PLAYFIELD_COLUMNS == filledColumns) {
            filledRows.push(row);
            // score++;
            // document.getElementById('score').innerHTML = "Score: " + score;
        }
    }
    return filledRows;
}

function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver) {
        gameOver();
    }
}

function startLoop() {
    timeoutID = setTimeout(
        () => (requestID = requestAnimationFrame(moveDown)),
        700
    );
}

function stopLoop() {
    cancelAnimationFrame(requestID);
    timeoutID = clearTimeout(timeoutID);
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if(isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
};

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for( let row = 0; row < matrixSize; row++) {
        for( let column = 0; column < matrixSize; column++) {
            if(!tetromino.matrix[row][column]) { continue }
            // if(tetromino.matrix[row][column] == 0) { continue; }
            if(tetromino.row + row < 0) { continue };
            if(isOutsideOfGameBoard(row, column)){ return true; }
            if(hasColisions(row, column)){ return true; }
        }
    }
    return false;
}

function isOutsideOfGameBoard(row, column) {
    return tetromino.column + column < 0||
           tetromino.column + column >= PLAYFIELD_COLUMNS ||
           tetromino.row + row >= playfield.length;
}

function hasColisions(row, column) {
    return playfield[tetromino.row + row][tetromino.column + column];
}
