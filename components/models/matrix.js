class Martrix {
    m;

    constructor(matrix) {
        this.m = matrix;
    }

    get rowsNum() {
        return this.m.length;
    }

    get colsNum() {
        return this.m[0].length;
    }

    transpose() {
        const desArr = [];
        for (let y = 0; y < this.colsNum; y++) {
            desArr[y] = [];
            for (let x = 0; x < this.rowsNum; x++) {
                desArr[y][x] = this.m[x][y];
            }
        }
        return desArr;
    }
}
export {
    Martrix
}