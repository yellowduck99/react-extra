import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'

/*
add new class to index.css

.winning {
  background: yellow;
}

*/


function Square(props) {

    return (
        // add class for changing color
        <button className={props.win? "square winning": "square" }onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        // check not null and check in winning squares
        let win = this.props.winner.winner && this.props.winner.winningSquares.includes(i)?true:false
        return (
            <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            // pass the win to square
            win={win}
            />
        );
    }
    renderRow(n) {
        let row = []
        for (let i = 0; i< 3;i++){
            row.push(this.renderSquare(n+i))
        }
        return(<div className="board-row">{row}</div>)
    }
    renderBoard() {
        let board = []
        for (let i = 0;i< 7;i = i+3){
            board.push(<div key={i}>{this.renderRow(i)}</div>)
        }
        return(board)
    }
  
    render() {
        return (
            <div>
                {this.renderBoard()}
            </div>
        );
    }
}
  
class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            history: [
            {
                squares: Array(9).fill(null),
                location: ''
            }
            ],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        };
    }
  
    handleClick(i) {
        let locations = [
            '(0,0)',
            '(0,1)',
            '(0,2)',
            '(1,0)',
            '(1,1)',
            '(1,2)',
            '(2,0)',
            '(2,1)',
            '(2,2)',
        ]
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
            {
                squares: squares,
                location: locations[i]
            }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            isAscending: this.state.isAscending
        });
    }
  
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggle() {
        this.setState({
            isAscending: !this.state.isAscending
        })
    }
  
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        // map((element, index) => { /* … */ })
        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move + step.location:
            'Go to game start';
            return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{this.state.stepNumber === move ? <b>{desc}</b>:desc}</button>
            </li>
            );
        });
    
        let status;
        if (winner.winner) {
            status = "Winner: " + winner.winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
    
        return (
            <div className="game">
            <div className="game-board">
                <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
                // pass winner to board
                winner={winner}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => this.toggle()}>toggle</button>
                <ol>{this.state.isAscending?moves:moves.reverse()}</ol>
            </div>
            </div>
        );
    }
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner:squares[a],
                winningSquares: lines[i]
            }
        }
    }
    return {
        winner:null,
        winningSquares: null
    };
}
