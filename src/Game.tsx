import { useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";
import './Game.css';

export enum GameState {
  Playing,
  Won
};

export interface IGameTheme {
  backgroundBase: string,
  backgroundLines: string,
  targetBoxLines: string,
  filledBox: string,
  potentialShapeLines: string
};

export interface IPieceInstruction {
  index: number,
  x: number,
  y: number
}

export const Game = () => {
  const [cellsWide, setCellsWide] = useState(5);
  const [cellsHigh, setCellsHigh] = useState(5);

  const [board, setBoard] = useState<boolean[]>(Array(cellsWide * cellsHigh).fill(false));

  const [boardGoal, setBoardGoal] = useState([
    false, false, false, false, false,
    false, true, true, true, false,
    false, true, false, true, false,
    false, true, true, true, false,
    false, false, false, false, false,
  ]);

  const [pieces, setPieces] = useState([
    [
      false, false, false, false, false,
      false, false, false, false, false,
      false, true, true, true, false,
      false, true, false, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, true, false, false,
      false, false, true, false, false,
      false, false, true, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, false, false, false,
      false, false, true, true, false,
      false, false, false, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, false, false, false,
      false, false, true, false, false,
      false, false, false, false, false,
      false, false, false, false, false,
    ]
  ]);

  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [playedPieces, setPlayedPieces] = useState<IPieceInstruction[]>([]);
  const [pieceFutureHistory, setPieceFutureHistory] = useState<IPieceInstruction[]>([]);
  const [gameState, setGameState] = useState(GameState.Playing);
  const [nextPieceToPlay, setNextPieceToPlay] = useState<IPieceInstruction | undefined>(undefined);

  const [theme, setTheme] = useState<IGameTheme>({
    backgroundBase: '9eacbc',
    backgroundLines: '8697aa',
    targetBoxLines: '232b35',
    filledBox: '414e5e',
    potentialShapeLines: 'dce2ef'
  });

  const undo = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newPlayedPieces = playedPieces.slice();
    const cutPiece = newPlayedPieces.pop();
    setPlayedPieces(newPlayedPieces);

    if (cutPiece !== undefined) {
      setNextPieceToPlay(cutPiece);

      const newPieceFutureHistory = pieceFutureHistory.slice();
      newPieceFutureHistory.unshift(cutPiece);
      setPieceFutureHistory(newPieceFutureHistory);
    }
  };

  const redo = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newPieceFutureHistory = pieceFutureHistory.slice();
    const reusedPiece = newPieceFutureHistory.shift();
    setPieceFutureHistory(newPieceFutureHistory);

    if (reusedPiece !== undefined) {
      setNextPieceToPlay(reusedPiece);

      const newPlayedPieces = playedPieces.slice();
      newPlayedPieces.push(reusedPiece);
      setPlayedPieces(newPlayedPieces);
    }
  };

  return (
    <div>
      <GameWindow 
        theme={theme}
        cellsWide={cellsWide} 
        cellsHigh={cellsHigh} 
        board={board} 
        boardGoal={boardGoal} 
        setBoard={setBoard} 
        pieces={pieces} 
        currentPieceIndex={currentPieceIndex}
        playedPieces={playedPieces} 
        setPlayedPieces={setPlayedPieces}
        setPieceFutureHistory={setPieceFutureHistory}
        nextPieceToPlay={nextPieceToPlay}
        setNextPieceToPlay={setNextPieceToPlay}
      />
      <PieceSelector 
        theme={theme}
        pieces={pieces} 
        currentPieceIndex={currentPieceIndex} 
        setCurrentPieceIndex={setCurrentPieceIndex} 
        playedPieces={playedPieces}
      />
      <div className="Game-button-container">
        <button className="Game-button" disabled={playedPieces.length === 0} onClick={undo}>Undo</button>
        <button className="Game-button" disabled={pieceFutureHistory.length === 0} onClick={redo}>Redo</button>
        <button className="Game-button">Restart</button>
        <button className="Game-button">Menu</button>
      </div>
    </div>
  );
};