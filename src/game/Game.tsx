import { useEffect, useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";
import './Game.css';
import { AppPage, IGameTheme, ILevel } from "../App";
import { GameButton } from "../menus/GameButton";

export enum GameState {
  Playing,
  Won
};

export interface IPieceInstruction {
  index: number,
  x: number,
  y: number
};

export interface IGameProps {
  theme: IGameTheme,
  setPage: Function,
  level?: ILevel
};

export const Game = (props: IGameProps) => {
  let dimension = 5;

  if (props.level) {
    dimension = props.level.dimension;
  }

  const [cellsWide, setCellsWide] = useState(dimension);
  const [cellsHigh, setCellsHigh] = useState(dimension);

  const [board, setBoard] = useState<boolean[]>(Array(cellsWide * cellsHigh).fill(false));

  let boardGoalDefault = Array(cellsWide * cellsHigh).fill(false);
  let piecesDefault: Array<boolean[]> = [];

  if (props.level) {
    boardGoalDefault = props.level.goal.map(x => x == 0 ? false : true);
    piecesDefault = props.level.pieces.map(x => x.layout.map(y => y == 0 ? false : true));
  }

  const [boardGoal, setBoardGoal] = useState(boardGoalDefault);
  const [pieces, setPieces] = useState(piecesDefault);

  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [playedPieces, setPlayedPieces] = useState<IPieceInstruction[]>([]);
  const [pieceFutureHistory, setPieceFutureHistory] = useState<IPieceInstruction[]>([]);
  const [gameState, setGameState] = useState(GameState.Playing);
  const [nextPieceToPlay, setNextPieceToPlay] = useState<IPieceInstruction | undefined>(undefined);

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

  const goBackToLevelSelectMenu = () => {
    props.setPage(AppPage.LevelSelectMenu);
  };

  const checkBoardMeetsGoal = () => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== boardGoal[i]) {
        return false;
      }
    }

    if (playedPieces.length !== pieces.length) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (checkBoardMeetsGoal()) {
      setGameState(GameState.Won);
    }
  }, [board]);

  const renderWinModal = () => {
    return (
      <div className="Game-win-modal-background">
        <h1 className="Game-win-text">Complete!</h1>
      </div>
    );
  };

  return (
    <div>
      {gameState === GameState.Won && renderWinModal()}
      <GameWindow 
        theme={props.theme}
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
        gameState={gameState}
      />
      <PieceSelector 
        theme={props.theme}
        pieces={pieces} 
        currentPieceIndex={currentPieceIndex} 
        setCurrentPieceIndex={setCurrentPieceIndex} 
        playedPieces={playedPieces}
      />
      <div className="Game-button-container">
        <GameButton theme={props.theme} disabled={playedPieces.length === 0} onClick={undo}>Undo</GameButton>
        <GameButton theme={props.theme} disabled={pieceFutureHistory.length === 0} onClick={redo}>Redo</GameButton>
        <GameButton theme={props.theme}>Restart</GameButton>
        <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back</GameButton>
      </div>
    </div>
  );
};