import { useEffect, useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";
import './Game.css';
import { AppPage, IGameTheme, ILevel } from "../App";
import { GameButton } from "../menus/GameButton";
import { Modal } from "../menus/Modal";
import { ModalBox } from "../menus/ModalBox";
import { ModalHeader } from "../menus/ModalHeader";
import styled from "styled-components";

export enum GameState {
  Playing,
  Won,
  Editing
};

export interface IPieceInstruction {
  index: number,
  x: number,
  y: number
};

export interface IGameProps {
  theme: IGameTheme,
  setPage: Function,
  level: ILevel,
  isEditorMode: boolean
};

const LevelTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 40px;
  margin-bottom: 20px;
`;

const CreatePiecePartButton = styled.button<
{ 
  theme?: IGameTheme; 
  selected?: boolean;
}>`
  background-color: #${props => props.selected ? props.theme.backgroundBase : props.theme.filledBox};
  border: none;
  width: 24px;
  height: 24px;
  padding: 2px;
  margin: 5px;
  cursor: pointer;

  &: hover {
    border-style: solid;
    border-color: #${props => props.theme.potentialShapeLines};
    border-width: 2px;
    padding: 0px;
  }
`;

export const Game = (props: IGameProps) => {
  let dimension = 5;

  dimension = props.level.dimension;

  const cellsWide = dimension;
  const cellsHigh = dimension;

  const [board, setBoard] = useState<boolean[]>(Array(cellsWide * cellsHigh).fill(false));

  const [boardGoal, setBoardGoal] = useState<boolean[]>(props.level.goal.map(x => x === 0 ? false : true));
  const [pieces, setPieces] = useState<Array<boolean[]>>(props.level.pieces.map(x => x.layout.map(y => y === 0 ? false : true)));
  
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [playedPieces, setPlayedPieces] = useState<IPieceInstruction[]>([]);
  const [pieceFutureHistory, setPieceFutureHistory] = useState<IPieceInstruction[]>([]);
  const [gameState, setGameState] = useState(props.isEditorMode ? GameState.Editing : GameState.Playing);
  const [nextPieceToPlay, setNextPieceToPlay] = useState<IPieceInstruction | undefined>(undefined);

  const [addingPiece, setAddingPiece] = useState(false);
  const [newPiece, setNewPiece] = useState(Array(25).fill(0));

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
    if (props.isEditorMode) {
      props.setPage(AppPage.EditorLevelSelectMenu);
    } else {
      props.setPage(AppPage.LevelSelectMenu);
    }
  };

  const openAddPieceModal = () => {
    setAddingPiece(true);
  };

  const createPiecePart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newPieceCopy = newPiece.slice();
    newPieceCopy[parseInt(e.currentTarget.value)] = newPieceCopy[parseInt(e.currentTarget.value)] === 0 ? 1 : 0;

    setNewPiece(newPieceCopy);
  };

  const addPiece = () => {
    if (props.level) {
      props.level.pieces.push({layout: newPiece});
      setPieces(props.level.pieces.map(x => x.layout.map(y => y === 0 ? false : true)));
    }

    closeAddPieceModal();
  };

  const closeAddPieceModal = () => {
    setAddingPiece(false);
    setNewPiece(Array(25).fill(0));
  };

  const oustPiece = () => {
    if (props.level && props.level.pieces.length > 0) {
      props.level.pieces.splice(currentPieceIndex, 1);
      setPieces(props.level.pieces.map(x => x.layout.map(y => y === 0 ? false : true)));
    }
  };

  const renameLevel = () => {

  };

  const deleteLevel = () => {

  };

  useEffect(() => {
    if (gameState !== GameState.Editing) {
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
    }
  }, [board, boardGoal, playedPieces.length, pieces.length]);

  const renderWinModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Complete!</ModalHeader>
          <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back to Level Select</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  const renderCreatePiecePartRow = (rowIndex: number) => {
    return [...Array(5)].map((e, i) => {
      const partIndex = (rowIndex * 5) + i;

      return (
        <CreatePiecePartButton key={`CreatePiecePart${partIndex}`} theme={props.theme} selected={newPiece[partIndex]} onClick={createPiecePart} value={partIndex}/>
      );
    });
  }

  const renderCreatePiecePartRows = () => {
    return [...Array(5)].map((e, i) => {
      return (
        <div key={`CreatePiecePartRow${i}`}>
          {renderCreatePiecePartRow(i)}
        </div>
      );
    });
  }

  const renderAddPieceModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Add Piece</ModalHeader>
          <div className="Game-add-piece-box">
            {renderCreatePiecePartRows()}
          </div>
          <div className="Game-button-container">
            <GameButton theme={props.theme} onClick={addPiece}>Add</GameButton>
            <GameButton theme={props.theme} onClick={closeAddPieceModal}>Cancel</GameButton>
          </div>
        </ModalBox>
      </Modal>
    );
  };

  const renderGameButtons = () => {
    return (
      <div className="Game-button-container">
        <GameButton theme={props.theme} disabled={playedPieces.length === 0} onClick={undo}>Undo</GameButton>
        <GameButton theme={props.theme} disabled={pieceFutureHistory.length === 0} onClick={redo}>Redo</GameButton>
        <GameButton theme={props.theme}>Restart</GameButton>
        <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back</GameButton>
      </div>
    );
  };

  const renderEditorButtons = () => {
    return (
      <div>
        <div className="Game-button-container">
          <GameButton theme={props.theme} onClick={openAddPieceModal}>Add Piece</GameButton>
          <GameButton theme={props.theme} onClick={oustPiece}>Oust Piece</GameButton>
          <GameButton theme={props.theme}>Goal Mode</GameButton>
        </div>
        <div className="Game-button-container">
          <GameButton theme={props.theme}>Delete</GameButton>
          <GameButton theme={props.theme}>Rename</GameButton>
          <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back</GameButton>
        </div>
      </div>
    );
  };

  return (
    <div>
      {gameState === GameState.Won && !props.isEditorMode && renderWinModal()}
      {gameState === GameState.Editing && addingPiece &&  renderAddPieceModal()}
      <LevelTitle color={props.theme.potentialShapeLines}>{props.level.name}</LevelTitle>
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
      {gameState !== GameState.Editing && renderGameButtons()}
      {gameState === GameState.Editing && renderEditorButtons()}
    </div>
  );
};