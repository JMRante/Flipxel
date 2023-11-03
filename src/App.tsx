import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IGameBoardProps, GameBoard, IGameBoardTheme } from './GameBoard';

function App() {
  const defaultTheme: IGameBoardTheme = {
    backgroundBase: 0x9eacbc,
    backgroundLines: 0x8697aa,
    targetBoxLines: 0x232b35,
    filledBox: 0x414e5e,
    potentialShapeLines: 0xdce2ef
  }

  return (
    <div className="App">
      <header className="App-header">
        <GameBoard cellsWide={10} cellsHigh={10} theme={defaultTheme}/>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
