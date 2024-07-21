export default class Ghost {
    constructor(map, number, rangeRadarY, rangeRadarX) {
        this.map = map;
        this.number = number;
        [this.y, this.x] = this.#getCurrentPosition();
        [this.initY, this.initX] = [this.y, this.x];
        this.rangeRadarY = rangeRadarY;
        this.rangeRadarX = rangeRadarX;
        this.looksDirection = null;
        this.checkStepLeft = true;
        this.checkStepRight = true;
        this.checkStepUp = true;
        this.checkStepDown = true;
        this.currMarker = 2;
    }

    #getCurrentPosition() {
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                if (this.map[row][col] === this.number) {
                    return [row, col];
                }
            }
        }
        return new Error(
            `Ghost position was not found. There must be element ${this.number} on the map`
        );
    }

    stepToPacman() {
        let spottedPacman = this.getCoordinatePacmanInTheRange();

        if (spottedPacman) {
            let [distanceY, distanceX] = [
                this.y - spottedPacman[0],
                this.x - spottedPacman[1],
            ];

            let directionChaseY =
                distanceY === 0 ? 'stop' : distanceY > 0 ? 'up' : 'down';
            let directionChaseX =
                distanceX === 0 ? 'Stop' : distanceX > 0 ? 'Left' : 'Right';
            let directionMove = directionChaseY + directionChaseX;

            if (directionMove.includes('upLeft')) {
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
                if (this.checkStepDown && this.stepDown()) return true;
            }

            if (directionMove.includes('upRight')) {
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
                if (this.checkStepDown && this.stepDown()) return true;
            }

            if (directionMove.includes('downLeft')) {
                if (this.checkStepDown && this.stepDown()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
            }

            if (directionMove.includes('downRight')) {
                if (this.checkStepDown && this.stepDown()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
            }

            if (directionMove.includes('stopLeft')) {
                if (this.checkStepLeft && this.stepLeft()) return true;
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepDown && this.stepDown()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
            }

            if (directionMove.includes('stopRight')) {
                if (this.checkStepRight && this.stepRight()) return true;
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepDown && this.stepDown()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
            }

            if (directionMove.includes('upStop')) {
                if (this.checkStepUp && this.stepUp()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
                if (this.checkStepDown && this.stepDown()) return true;
            }

            if (directionMove.includes('downStop')) {
                if (this.checkStepDown && this.stepDown()) return true;
                if (this.checkStepLeft && this.stepLeft()) return true;
                if (this.checkStepRight && this.stepRight()) return true;
                if (this.checkStepUp && this.stepUp()) return true;
            }
        }

        this.looksDirection = null;
        return false;
    }

    stepUp() {
        let stepUp = this.map[this.y - 1][this.x];
        if (stepUp == undefined) {
            this.checkStepUp = false;
            this.checkStepDown = true;
            return false;
        }

        if (stepUp > 5) {
            this.checkStepLeft = true;
            this.checkStepRight = true;
            this.checkStepUp = true;
            this.checkStepDown = true;
            return false;
        }

        if (stepUp !== 1) {
            this.map[this.y][this.x] = this.currMarker;
            this.currMarker = stepUp;
            this.y = this.y - 1;
            this.map[this.y][this.x] = this.number;
            this.looksDirection = 'up';
            this.checkStepLeft = true;
            this.checkStepRight = true;
            this.checkStepUp = true;
            this.checkStepDown = false;
            return true;
        }
        this.checkStepUp = false;
        this.checkStepDown = true;

        return false;
    }

    stepDown() {
        let stepDown = this.map[this.y + 1][this.x];
        if (stepDown == undefined) {
            this.checkStepDown = false;
            this.checkStepUp = true;
            return false;
        }

        if (stepDown > 5) {
            this.checkStepLeft = true;
            this.checkStepRight = true;
            this.checkStepUp = true;
            this.checkStepDown = true;
            return false;
        }
        if (stepDown !== 1) {
            this.map[this.y][this.x] = this.currMarker;
            this.currMarker = stepDown;
            this.y = this.y + 1;
            this.map[this.y][this.x] = this.number;
            this.looksDirection = 'down';
            this.checkStepLeft = true;
            this.checkStepRight = true;
            this.checkStepDown = true;
            this.checkStepUp = false;
            return true;
        }
        this.checkStepDown = false;
        this.checkStepUp = true;
        return false;
    }

    stepLeft() {
        let stepLeft = this.map[this.y][this.x - 1];
        if (stepLeft == undefined) {
            this.checkStepLeft = false;
            this.checkStepRight = true;
            return false;
        }

        if (stepLeft > 5) {
            this.checkStepLeft = true;
            this.checkStepRight = true;
            this.checkStepUp = true;
            this.checkStepDown = true;
            return false;
        }
        if (stepLeft !== 1) {
            this.map[this.y][this.x] = this.currMarker;
            this.currMarker = stepLeft;
            this.x = this.x - 1;
            this.map[this.y][this.x] = this.number;
            this.looksDirection = 'left';
            this.checkStepDown = true;
            this.checkStepUp = true;
            this.checkStepLeft = true;
            this.checkStepRight = false;
            return true;
        }
        this.checkStepLeft = false;
        this.checkStepRight = true;
        return false;
    }

    stepRight() {
        let stepRight = this.map[this.y][this.x + 1];
        if (stepRight == undefined) {
            this.checkStepRight = false;
            this.checkStepLeft = true;
            return false;
        }

        if (stepRight > 5) {
            this.checkStepLeft = true;
            this.checkStepRight = true;
            this.checkStepUp = true;
            this.checkStepDown = true;
            return false;
        }
        if (stepRight !== 1) {
            this.map[this.y][this.x] = this.currMarker;
            this.currMarker = stepRight;
            this.x = this.x + 1;
            this.map[this.y][this.x] = this.number;
            this.looksDirection = 'right';
            this.checkStepDown = true;
            this.checkStepUp = true;
            this.checkStepRight = true;
            this.checkStepLeft = false;
            return true;
        }
        this.checkStepRight = false;
        this.checkStepLeft = true;
        return false;
    }

    getCoordinatePacmanInTheRange() {
        let start = this.calculateStartCoordinateRadar();

        let countMaxRangeRow = this.rangeRadarY;
        for (let row = start[0]; row < this.map.length; row++) {
            if (countMaxRangeRow == 0) break;

            let countMaxRangeCol = this.rangeRadarX;
            for (let col = start[1]; col < this.map[row].length; col++) {
                if (countMaxRangeCol == 0) break;
                let marker = this.map[row][col];

                if (marker === 3) {
                    return [row, col];
                }
                countMaxRangeCol--;
            }
            countMaxRangeRow--;
        }
        return null;
    }

    //get leftTopCorner
    calculateStartCoordinateRadar() {
        let resY = this.y;
        let resX = this.x;

        let countY = 0;
        while (resY > 0 && this.rangeRadarY / 2 > countY) {
            resY--;
            countY++;
        }

        let countX = 0;
        while (resX > 0 && this.rangeRadarX / 2 > countX) {
            resX--;
            countX++;
        }

        return [resY, resX];
    }
}
