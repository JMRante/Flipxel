import { useEffect, useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";
import './Game.css';
import { AppPage, IGameTheme, ILevel } from "../App";
import { GameButton } from "../menus/GameButton";
import { Modal } from "../menus/Modal";
import styled from "styled-components";
import { ModalBox } from "../menus/ModalBox";

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
  level?: ILevel,
  isEditorMode: boolean
};

const GameWinText = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Game = (props: IGameProps) => {
  let dimension = 5;

  if (props.level) {
    dimension = props.level.dimension;
  }

  const cellsWide = dimension;
  const cellsHigh = dimension;

  const [board, setBoard] = useState<boolean[]>(Array(cellsWide * cellsHigh).fill(false));

  let boardGoal = Array(cellsWide * cellsHigh).fill(false);
  let pieces: Array<boolean[]> = [];

  if (props.level) {
    boardGoal = props.level.goal.map(x => x === 0 ? false : true);
    pieces = props.level.pieces.map(x => x.layout.map(y => y === 0 ? false : true));
  }
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

  useEffect(() => {
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

    if (checkBoardMeetsGoal()) {
      setGameState(GameState.Won);
    }
  }, [board, boardGoal, playedPieces.length, pieces.length]);

  const renderWinModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <GameWinText  color={props.theme.potentialShapeLines}>Complete!</GameWinText>
          <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back to Level Select</GameButton>
        </ModalBox>
      </Modal>
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