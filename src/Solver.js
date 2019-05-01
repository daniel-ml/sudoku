import S from "./SudokuConcepts";

class Solver {
    constructor(init) {
        this.logMessage("Initial state");
        this.state = { log: this.log, history: [], step: 0 };
        for (const cell of S.cells) {
            this.state[cell] = S.digits;
        }
        this.state.history.push(this.getHistoryItem(this.state));
        const grid = init.split("").map((d, i) => [S.cells[i], d]).filter(m => S.digits.includes(m[1]));
        for (const g of grid) {
            this.assign(this.state, g[0], g[1]);
        }
        this.logMessage("Constraint propagation complete!", this.state);
    }

    logMessage(message, state) {
        if (this.log === undefined) {
            this.log = "";
        }
        this.log += message + ";";
        if (state) {
            this.updateHistory(state);
        }
    }

    getHistoryItem(state) {
        const historyItem = (({ history, log, step, ...values }) => ({ log, ...values }))(state);
        return historyItem;
    }

    getValues(state) {
        const values = (({ history, log, step, ...values }) => ({ ...values }))(state);
        return values;
    }

    updateHistory(state) {
        state.log = this.log;
        const historyItem = this.getHistoryItem(state);
        state.history.push(historyItem);
        state.step = state.history.length - 1;
    }

    /** Eliminate values other than digit from cell. Return true if there are no contradicitons and false otherwise. */
    eliminateOtherValues(state, cell, digit) {
        const otherValues = state[cell].replace(digit, "").split("");
        if (otherValues.length > 0) {
            this.logMessage("Assign " + digit + " to " + cell, state);
        }
        for (const value of otherValues) {
            if (!this.eliminate(state, cell, value)) {
                return false;
            }
        }
        return true;
    }

    /** Eliminate digit from the peers of cell. Return true if there are no contradictions and false otherwise. */
    eliminatePeers(state, cell, digit) {
        const peers = S.peers[cell];
        for (const peer of peers) {
            if (!this.eliminate(state, peer, digit)) {
                return false;
            }
        }
        return true;
    }

    /** Assign digit to each unit of cell if there is only one place for it.
     * Return true if there are no contradictions and false otherwise.*/
    assignUnits(state, cell, digit) {
        for (const unit of S.unitList[cell]) {
            let places = unit.map(u => state[u].includes(digit) ? u : false).filter(m => m !== false);
            if (places.length === 0) {
                this.logMessage("Contradiction: no place for " + digit + " in " + S.unitName(unit), state);
                return false;
            }
            if (places.length === 1) {
                if (state[places[0]].length > 1) {
                    this.logMessage(S.unitName(unit) + " has only one place for " + digit + " at " + places[0]);
                }
                if (!this.assign(state, places[0], digit)) {
                    return false;
                }
            }
        }
        return true;
    }

    /** Assign digit to cell by eliminating other values from state. Append values to state history if grid changed.
     * Return updated state, or return false if there is a contradiction. */
    assign(state, cell, digit) {
        if (!this.eliminateOtherValues(state, cell, digit)) {
            return false;
        }
        //this.updateHistory(state);
        return state;
    }

    /** Speculatively assign digit to cell by copying the state. Return result of assign(). */
    speculate(state, cell, digit) {
        const copy = Object.assign({}, state);
        this.logMessage("Try " + digit + " at " + cell, state);
        const result = this.assign(copy, cell, digit);
        return result;
    }

    /** Eliminate digit from cell. If cell is reduced to one value, eliminate that value from its peers.
     * If a unit of cell is reduced to one place for digit, assign digit to that place.
     * Return true if there are no contradictions and false otherwise. */
    eliminate(state, cell, digit) {
        if (!state[cell].includes(digit)) {
            return true;
        }
        this.logMessage("Eliminate " + digit + " from " + cell);
        state[cell] = state[cell].replace(digit, "");
        if (state[cell].length === 0) {
            this.logMessage("Contradiction: " + cell + " has no possible value", state);
            return false;
        }
        if (state[cell].length === 1) {
            if (!this.eliminatePeers(state, cell, state[cell])) {
                return false;
            }
        }
        const noContradictions = this.assignUnits(state, cell, digit);
        return noContradictions;
    }

    /** Recursively search values for a solution. Start with the cell with the fewest possibilities.
     * Return the values of the solution, or return false if there is no solution. */
    search(state) {
        if (state === false) {
            return false;
        }
        if (S.cells.every(c => state[c].length === 1)) {
            this.logMessage("Solution found!", state);
            return state;
        }
        const cellValueMap = S.cells.map(c => [c, state[c]]).filter(m => m[1].length > 1);
        const [minCell, minValue] = cellValueMap.sort((f, g) => f[1].length < g[1].length ? -1 : f[1].length > g[1].length ? 1 : 0)[0];
        let result = false;
        for (const digit of minValue) {
            result = this.search(this.speculate(state, minCell, digit));
            if (result !== false) {
                break;
            }
        }
        return result;
    }
}

export default Solver;
