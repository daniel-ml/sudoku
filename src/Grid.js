import React, { Component } from "react";
import S from "./SudokuConcepts";

class Grid extends Component {
    renderCell(cell) {
        const initValue = this.props.init[S.gridIndex(cell)];
        const placeholder = this.props.values[cell].split("").join(" ");
        const value = S.digits.includes(initValue) ? initValue : placeholder.length === 1 ? placeholder : "";
        return (
            <td key={cell}>
                <textarea rows="3" cols="3" maxLength="1"
                    value={value}
                    placeholder={placeholder}
                    readOnly />
            </td>
        );
    }

    renderRow(row) {
        return (
            <tr key={row}>
                {S.cols.split("").map(c => this.renderCell(row + c))}
            </tr>
        );
    }

    renderBoxRow(i) {
        const rows = S.boxRows[i];
        return (
            <tbody key={rows}>
                {rows.split("").map(r => this.renderRow(r))}
            </tbody>
        );
    }

    render() {
        return (
            <table>
                <caption>Sudoku</caption>
                <colgroup><col /><col /><col /></colgroup>
                <colgroup><col /><col /><col /></colgroup>
                <colgroup><col /><col /><col /></colgroup>
                {this.renderBoxRow(0)}
                {this.renderBoxRow(1)}
                {this.renderBoxRow(2)}
            </table>
        );
    }
}

export default Grid;
