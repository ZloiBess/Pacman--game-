export default class Pacman {
    constructor(map) {
        this.map = map;
        [this.y, this.x, this.score] = this.#getCurrentPositionAndNumberScore();
        [this.initY, this.initX] = [this.y, this.x];
        this.shiftDirection = 'right';
        this.countScore = 0;
        this.coordinateFoodEaten = [];
        this.teleportInDirection = null;
        this.hearts = 3;
    }

    #getCurrentPositionAndNumberScore() {
        let y = null;
        let x = null;
        let score = 0;
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                if (this.map[row][col] === 3) {
                    y = row;
                    x = col;
                }
                if (this.map[row][col] === 2 || this.map[row][col] > 5) {
                    score++;
                }
            }
        }
        return [x, y, score];
    }

    setLooksDirection(direction) {
        direction = direction.toLowerCase();

        if (direction.includes('right')) {
            if (this.map[this.y][this.x + 1] !== 1) {
                this.shiftDirection = 'right';
            }
        }

        if (direction.includes('left')) {
            if (this.map[this.y][this.x - 1] !== 1) {
                this.shiftDirection = 'left';
            }
        }

        if (direction.includes('up')) {
            if (this.map[this.y - 1][this.x] !== 1) {
                this.shiftDirection = 'up';
            }
        }

        if (direction.includes('down')) {
            if (this.map[this.y + 1][this.x] !== 1) {
                this.shiftDirection = 'down';
            }
        }
    }

    teleportToCoordinate(direction) {
        direction = direction.toLowerCase();

        if (direction.includes('right')) {
            if (this.map[this.y][this.x + 1] == undefined) {
                this.map[this.y][this.x] = 0;
                this.x = 0;
                this.pushCoordinateFoodEaten(this.y, this.x);
                this.map[this.y][this.x] = 3;
                this.shiftDirection = 'teleportLeft';
                return true;
            }
        }

        if (direction.includes('left')) {
            if (this.map[this.y][this.x - 1] == undefined) {
                this.map[this.y][this.x] = 0;
                this.x = this.map[this.y].length - 1;
                this.pushCoordinateFoodEaten(this.y, this.x);
                this.map[this.y][this.x] = 3;
                this.shiftDirection = 'teleportRight';
                return true;
            }
        }

        if (direction.includes('up')) {
            if (this.map[this.y - 1][this.x] == undefined) {
                console.log('teleport');
                return true;
            }
        }

        if (direction.includes('down')) {
            if (this.map[this.y + 1][this.x] == undefined) {
                console.log('teleport');
                return true;
            }
        }
        return false;
    }

    step(direction) {
        if (this.teleportToCoordinate(direction)) return true;

        this.setLooksDirection(direction);

        if (this.shiftDirection.includes('right')) {
            if (this.map[this.y][this.x + 1] !== 1) {
                this.pushCoordinateFoodEaten(this.y, this.x + 1);
                this.map[this.y][this.x] = 0;
                this.map[this.y][this.x + 1] = 3;
                this.x = this.x + 1;
                return true;
            }
        }

        if (this.shiftDirection.includes('left')) {
            if (this.map[this.y][this.x - 1] !== 1) {
                this.pushCoordinateFoodEaten(this.y, this.x - 1);
                this.map[this.y][this.x] = 0;
                this.map[this.y][this.x - 1] = 3;
                this.x = this.x - 1;
                return true;
            }
        }

        if (this.shiftDirection.includes('up')) {
            if (this.map[this.y - 1][this.x] !== 1) {
                this.pushCoordinateFoodEaten(this.y - 1, this.x);
                this.map[this.y][this.x] = 0;
                this.map[this.y - 1][this.x] = 3;
                this.y = this.y - 1;
                return true;
            }
        }

        if (this.shiftDirection.includes('down')) {
            if (this.map[this.y + 1][this.x] !== 1) {
                this.pushCoordinateFoodEaten(this.y + 1, this.x);
                this.map[this.y][this.x] = 0;
                this.map[this.y + 1][this.x] = 3;
                this.y = this.y + 1;
                return true;
            }
        }
        return false;
    }

    pushCoordinateFoodEaten(y, x) {
        if (this.map[y][x] == 2 || this.map[y][x] > 5) {
            this.countScore = this.countScore + 1;
            this.coordinateFoodEaten.push([y, x]);
        }
    }
}
