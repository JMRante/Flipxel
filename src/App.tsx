import React from 'react';
import './App.css';
import { GameWindow } from './GameWindow';
import { PieceSelector } from './PieceSelector';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <GameWindow/>
        <PieceSelector/>
        <div>
          <button>Restart</button>
          <button>Menu</button>
        </div>
      </header>
    </div>
  );
}

export default App;
