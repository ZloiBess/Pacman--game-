console.log('main!');
import Maps from './entity/Maps.js';
import Pacman from './entity/Pacman.js';
import Ghost from './entity/Ghost.js';

//_________________________________/Elements page.
const playingField = document.querySelector('.playing-field');
const scoreElement = document.querySelector('.score');
let pacmanElement;
let ghostsElements = [];
let rectElement;
//_________________________________/Objects.
const RANGE_RADAR_GHOST_Y = 23;
const RANGE_RADAR_GHOST_X = 23;
let MAP_ARR = Maps.defaultMap();
const PACMAN_OBJ = new Pacman(MAP_ARR);
const GHOST6 = new Ghost(MAP_ARR, 6, RANGE_RADAR_GHOST_Y, RANGE_RADAR_GHOST_X);
const GHOST7 = new Ghost(MAP_ARR, 7, RANGE_RADAR_GHOST_Y, RANGE_RADAR_GHOST_X);
const GHOST8 = new Ghost(MAP_ARR, 8, RANGE_RADAR_GHOST_Y, RANGE_RADAR_GHOST_X);
const GHOST9 = new Ghost(MAP_ARR, 9, RANGE_RADAR_GHOST_Y, RANGE_RADAR_GHOST_X);
const GHOSTS_ARR = [GHOST6, GHOST7, GHOST8, GHOST9];
//_________________________________/Internal mechanism.
let intervalIndexPacman = null;
let intervalIndexGhosts = null;
let inputKey = null;
let countLessHearts = PACMAN_OBJ.hearts;
const SPEED_PAKMAN_MS = 200;
const SPEED_GHOST_MS = 300;

// _______________________________________________________
{
    document.addEventListener('keydown', (event) => {
        inputKey = event.key;
    });
    drawField();
    startProcess();
    setInterval(() => _TEST_showMap(), 200);
}
//_______________________________________________/Init//.

function startProcess() {
    intervalIndexPacman = setInterval(() => {
        if (PACMAN_OBJ.step(inputKey)) {
            drawPacmanEat();
            drawShiftPacman();
        }
    }, SPEED_PAKMAN_MS);

    intervalIndexGhosts = setInterval(() => {
        if (inputKey !== null) {
            for (let i = 0; i < GHOSTS_ARR.length; i++) {
                let currGhost = GHOSTS_ARR[i];
                if (currGhost.getCoordinatePacmanInTheRange()) {
                    currGhost.stepToPacman();
                    drawShiftGhost(i);
                }
            }
        }
    }, SPEED_GHOST_MS);

    setInterval(() => {
        checkPacmanCollidedGhost();
        gameOver();
    }, SPEED_PAKMAN_MS / 2.0);
}

let pacmanShiftY = 0;
let pacmanShiftX = 0;
function drawShiftPacman() {
    const rectHeight = rectElement.getBoundingClientRect().height;
    const rectWidth = rectElement.getBoundingClientRect().width;
    const pacmanShift = PACMAN_OBJ.shiftDirection;
    const wFIeld = playingField.getBoundingClientRect().width;
    let isWasTeleport = false;

    switch (pacmanShift) {
        case 'teleportLeft':
            pacmanElement.style.display = 'none';
            pacmanShiftX = 0 - rectWidth;
            pacmanElement.style.left = pacmanShiftX + 'px';
            isWasTeleport = true;
            break;
        case 'teleportRight':
            pacmanElement.style.display = 'none';
            pacmanShiftX = wFIeld - rectWidth * 2;
            pacmanElement.style.left = pacmanShiftX + 'px';
            isWasTeleport = true;
            break;
        case 'right':
            pacmanElement.classList = 'pacman right';
            pacmanShiftX += rectWidth;
            break;
        case 'left':
            pacmanElement.classList = 'pacman left';
            pacmanShiftX -= rectWidth;
            break;
        case 'up':
            pacmanElement.classList = 'pacman up';
            pacmanShiftY -= rectHeight;
            break;
        case 'down':
            pacmanElement.classList = 'pacman down';
            pacmanShiftY += rectHeight;
            break;
    }

    if (isWasTeleport) {
        setTimeout(() => (pacmanElement.style.display = 'block'), 50);
    } else {
        pacmanElement.style.top =
            pacmanShiftY +
            (rectHeight - pacmanElement.getBoundingClientRect().height) / 4.0 +
            'px';
        pacmanElement.style.left =
            pacmanShiftX +
            (rectWidth - pacmanElement.getBoundingClientRect().width) / 4.0 +
            'px';
    }
}

function drawShiftGhost(index) {
    let ghost = ghostsElements[index];
    let ghostSgiftY = parseFloat(ghost.style.top) || 0;
    let ghostSgiftX = parseFloat(ghost.style.left) || 0;

    const rectHeight = rectElement.getBoundingClientRect().height;
    const rectWidth = rectElement.getBoundingClientRect().width;

    const ghostLooks = GHOSTS_ARR[index].looksDirection;

    switch (ghostLooks) {
        case 'right':
            ghostSgiftX += rectWidth;
            break;
        case 'left':
            ghostSgiftX -= rectWidth;
            break;
        case 'up':
            ghostSgiftY -= rectHeight;
            break;
        case 'down':
            ghostSgiftY += rectHeight;
            break;
    }

    ghost.style.top =
        ghostSgiftY +
        // (rectHeight - ghost.getBoundingClientRect().height) / 2.0 +
        'px';
    ghost.style.left =
        ghostSgiftX +
        // (rectWidth - ghost.getBoundingClientRect().width) / 2.0 +
        'px';
}

function drawPacmanEat() {
    for (let i = 0; i < PACMAN_OBJ.coordinateFoodEaten.length; i++) {
        const eatYX = PACMAN_OBJ.coordinateFoodEaten[i];
        const calculateElement = eatYX[0] * MAP_ARR[0].length + eatYX[1];
        if (
            playingField.children[
                calculateElement
            ].children[0].classList.contains('food')
        ) {
            playingField.children[
                calculateElement
            ].children[0].classList.remove('food');
        }
    }
    scoreElement.textContent = `SCORE: ${PACMAN_OBJ.countScore}`;
}

function drawField() {
    playingField.style.gridTemplateColumns = `repeat(${MAP_ARR[0].length}, 1fr)`;
    for (let row = 0; row < MAP_ARR.length; row++) {
        for (let col = 0; col < MAP_ARR[row].length; col++) {
            const marker = MAP_ARR[row][col];
            drawElements(marker);
        }
    }
}

function drawElements(marker) {
    const className = marker === 1 ? 'rect-wall' : 'rect-passege';
    rectElement = document.createElement('div');
    rectElement.classList.add(className);

    if (marker == 2 || marker > 5) {
        const food = document.createElement('div');
        food.classList.add('food');
        rectElement.appendChild(food);
    }
    if (marker == 3) {
        const pacman = document.createElement('div');
        pacman.classList.add('pacman');
        pacman.classList.add(PACMAN_OBJ.shiftDirection);
        const mouth = document.createElement('div');
        mouth.classList.add('pacman-mouth');
        pacman.appendChild(mouth);
        rectElement.appendChild(pacman);
        pacmanElement = pacman;
        pacmanElement.style.left = 0;
        pacmanElement.style.top = 0;
        pacmanElement.style.transition = `left ${
            SPEED_PAKMAN_MS / 1000
        }s  linear, top ${SPEED_PAKMAN_MS / 1000}s linear`;
    }

    if (marker > 5) {
        const ghostElement = document.createElement('div');
        ghostElement.classList.add('ghost');
        rectElement.appendChild(ghostElement);
        ghostsElements.push(ghostElement);
        ghostElement.style.left = 0;
        ghostElement.style.top = 0;
        ghostElement.style.transition = `left ${
            SPEED_GHOST_MS / 1000
        }s  linear, top ${SPEED_GHOST_MS / 1000}s linear`;
    }

    playingField.appendChild(rectElement);
}

function checkPacmanCollidedGhost() {
    for (let i = 0; i < ghostsElements.length; i++) {
        let currGhost = ghostsElements[i];
        let currGhostRect = currGhost.getBoundingClientRect();
        if (
            pacmanElement.getBoundingClientRect().right > currGhostRect.left &&
            pacmanElement.getBoundingClientRect().left < currGhostRect.right &&
            pacmanElement.getBoundingClientRect().bottom > currGhostRect.top &&
            pacmanElement.getBoundingClientRect().top < currGhostRect.bottom
        ) {
            countLessHearts = countLessHearts - 1;
            let hearts = document.querySelector('.hearts');
            hearts.children[countLessHearts].style.opacity = '0';

            applyInitialPositions();
            return true;
        }
    }
    return false;
}

function applyInitialPositions() {
    inputKey = null;

    //elements init
    pacmanElement.style.display = 'none';
    pacmanElement.classList = 'pacman right';
    pacmanElement.style.left = 0;
    pacmanElement.style.top = 0;
    pacmanShiftY = 0;
    pacmanShiftX = 0;
    setTimeout(() => (pacmanElement.style.display = 'block'), 50);

    for (let i = 0; i < ghostsElements.length; i++) {
        let currGhost = ghostsElements[i];
        currGhost.style.display = 'none';
        currGhost.style.left = 0;
        currGhost.style.top = 0;
        setTimeout(() => (currGhost.style.display = 'block'), 50);
    }

    //console init
    for (let i = 0; i < GHOSTS_ARR.length; i++) {
        let currGhost = GHOSTS_ARR[i];
        MAP_ARR[currGhost.y][currGhost.x] = currGhost.currMarker === 2 ? 2 : 0;
        currGhost.currMarker = MAP_ARR[currGhost.initY][currGhost.initX];
        MAP_ARR[currGhost.initY][currGhost.initX] = currGhost.number;
        currGhost.y = currGhost.initY;
        currGhost.x = currGhost.initX;
        currGhost.looksDirection = null;
    }

    // crutch! with a fast or slow collision animation,
    //PacMan (3) remains on the map in the console at the location of the collision with the ghost
    //and is also initialized at the starting position and two or more Pac-Man are obtained.
    //Because the collision trigger is an animation, not a console interpretation.
    for (let row = 0; row < MAP_ARR.length; row++) {
        for (let col = 0; col < MAP_ARR[row].length; col++) {
            let marker = MAP_ARR[row][col];
            if (marker === 3) {
                MAP_ARR[row][col] = 0;
            }
        }
    }
    MAP_ARR[PACMAN_OBJ.y][PACMAN_OBJ.x] = 0;
    MAP_ARR[PACMAN_OBJ.initY][PACMAN_OBJ.initX] = 3;
    [PACMAN_OBJ.y, PACMAN_OBJ.x] = [PACMAN_OBJ.initY, PACMAN_OBJ.initX];
    PACMAN_OBJ.shiftDirection = 'right';
}

function gameOver() {
    if (countLessHearts === 0 || PACMAN_OBJ.countScore === PACMAN_OBJ.score) {
        clearInterval(intervalIndexPacman);
        clearInterval(intervalIndexGhosts);

        const resultElem = document.querySelector('.result');
        if (countLessHearts === 0) {
            resultElem.innerHTML = '~YOU LOSE~ <br>  Press  Enter';
            resultElem.classList.add('result-lose');
        } else {
            resultElem.innerHTML = '~YOU WIN~ <br>  Press  Enter';
            resultElem.classList.add('result-win');
        }

        let temp = setInterval(() => {
            if (inputKey === 'Enter') {
                clearInterval(temp);
                inputKey = null;
                resultElem.innerHTML = '';
                resultElem.classList = 'result';
                countLessHearts = PACMAN_OBJ.hearts;
                playingField.innerHTML = '';
                ghostsElements = [];

                MAP_ARR = Maps.defaultMap();
                PACMAN_OBJ.countScore = 0;
                PACMAN_OBJ.coordinateFoodEaten = [];
                PACMAN_OBJ.map = MAP_ARR;
                for (let g of GHOSTS_ARR) {
                    g.map = MAP_ARR;
                    g.currMarker = 2;
                }
                drawField();
                scoreElement.textContent = 'SCORE: 0';
                const hearts = document.querySelector('.hearts');
                for (let h of hearts.children) {
                    h.style.opacity = '1';
                }
                startProcess();
            }
        }, 400);
    }
}

function _TEST_showMap() {
    console.clear();
    let arrRow = '';
    for (let row = 0; row < MAP_ARR.length; row++) {
        for (let col = 0; col < MAP_ARR[row].length; col++) {
            arrRow += MAP_ARR[row][col] + ' ';
        }
        arrRow = arrRow.replace(/3/g, '%c3%c');
        arrRow = arrRow.replace(/6/g, '%c6%c');
        arrRow = arrRow.replace(/7/g, '%c7%c');
        arrRow = arrRow.replace(/8/g, '%c8%c');
        arrRow = arrRow.replace(/8/g, '%c9%c');

        arrRow = `row:${row > 9 ? row : '0' + row} - ` + arrRow;

        console.log(arrRow, 'color: red', '');
        arrRow = '';
    }
    console.log(GHOST7.currMarker);
}
