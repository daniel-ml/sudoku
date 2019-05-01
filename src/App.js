import React, { Component } from 'react';
import Grid from "./Grid";
import Solver from "./Solver";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        // const init = "003020600900305001001806400008102900700000008006708200002609500800203009005010300";
        // const init = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        const init = "51..89..2.2...46....71..5..1.92.8......93..6.......4..2.3.6.........1...4........";
        // const init = "3.4.7...918..6..37...13.8..83....7.55...28.9.....4...3....5.976....9..5....6.....";
        // const init = "...8.1..........435............7.8........1...2..3....6......75..34........2..6..";
        this.init = init;
        let solver = new Solver(init);
        this.state = solver.state;
        this.solve = () => this.setState(s => solver.search(s));
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
    }

    previous() {
        if (this.state.step > 0) {
            this.setState(s => ({ step: s.step - 1 }));
        }
    }

    next() {
        const state = this.state;
        if (state.history[state.step + 1]) {
            this.setState(s => ({ step: s.step + 1 }));
        }
    }

    start() {
        this.setState({ step: 0 });
    }

    end() {
        this.setState(s => ({ step: s.history.length - 1 }));
    }

    render() {
        const step = this.state.step;
        const history = this.state.history[step];
        return (
            <div>
                <Grid init={this.init} values={history} />
                <button onClick={this.solve}>Solve</button>
                <button onClick={this.start}>Start</button>
                <button onClick={this.previous}>Previous</button>
                <button onClick={this.next}>Next</button>
                <button onClick={this.end}>End</button>
                <p>Step {step}</p>
                {history.log.split(";").map((m, i) => (<div key={i}>{m}</div>)).reverse()}
            </div>
        );
    }
}

export default App;
