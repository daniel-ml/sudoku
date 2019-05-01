/** Return the cross product of two vectors. Use to generate cell names. */
function cross(rows, cols) {
    let result = [];
    for (let row of rows) {
        for (let col of cols) {
            result.push(row + col)
        }
    }
    return result;
}

const digits = "123456789";
const rows = "ABCDEFGHI";
const cols = digits;
const cells = cross(rows, cols);
const boxRows = ["ABC", "DEF", "GHI"];
const boxCols = ["123", "456", "789"];

const boxes = (() => {
    let boxes = [];
    for (let boxRow of boxRows) {
        for (let boxCol of boxCols) {
            boxes.push(cross(boxRow, boxCol))
        }
    }
    return boxes;
})();

const unitList = (() => {
    let unitList = {};
    for (let cell of cells) {
        let rowUnit = cols.split("").map(c => cell.charAt(0) + c);
        let colUnit = rows.split("").map(r => r + cell.charAt(1));
        let boxUnit = [];
        for (let box of boxes) {
            if (box.indexOf(cell) >= 0) {
                boxUnit.push(...box);
                break;
            }
        }
        unitList[cell] = [rowUnit, colUnit, boxUnit];
    }
    return unitList;
})();

const peers = (() => {
    let peers = {};
    for (let cell of cells) {
        peers[cell] = [...new Set([].concat(...unitList[cell]))].filter(v => v !== cell)
    }
    return peers;
})();

class SudokuConcepts {

    static get digits() {
        return digits;
    }

    static get rows() {
        return rows;
    }

    static get cols() {
        return cols;
    }

    static get cells() {
        return cells;
    }

    static get boxRows() {
        return boxRows;
    }

    static get boxCols() {
        return boxCols;
    }

    static get boxes() {
        return boxes;
    }

    static get unitList() {
        return unitList;
    }

    static get peers() {
        return peers;
    }

    /** Return the grid index of a cell. */
    static gridIndex(cell) {
        return this.cells.indexOf(cell);
    }

    /** Return the name of a unit, e.g. "Row A", "Column 1", "Box A1-C3". */
    static unitName(unit) {
        const cell1 = unit[0];
        const cell9 = unit[8];
        const row = cell1[0];
        const col = cell1[1];
        if (row === cell9[0]) {
            return "Row " + row;
        }
        else if (col === cell9[1]) {
            return "Column " + col;
        }
        else {
            return "Box " + cell1 + "-" + cell9;
        }
    }
}

export default SudokuConcepts;
