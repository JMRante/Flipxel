import { useEffect, useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";
import './Game.css';
import { AppPage, IGameTheme, ILevel, ILevelPack, ILevelPackSaveData } from "../App";
import { GameButton } from "../menus/GameButton";
import { Modal } from "../menus/Modal";
import { ModalBox } from "../menus/ModalBox";
import { ModalHeader } from "../menus/ModalHeader";
import styled from "styled-components";
import { GameTextField } from "../menus/GameTextField";
import { MenuDivider } from "../menus/MenuDivider";
import { MIN_DIMENSIONS } from "../menus/LevelSelectMenu";

export enum GameState {
  Playing,
  Won,
  Editing
};

export enum EditorState {
  Edit,
  Test
};

export interface IPieceInstruction {
  index: number,
  x: number,
  y: number
};

export interface IGameProps {
  theme: IGameTheme,
  setPage: Function,
  levelPack: ILevelPack,
  level: ILevel,
  isEditorMode: boolean,
  deleteCurrentLevel: Function,
  setIsEditorDirty: Function
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
  let dimension = MIN_DIMENSIONS;

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

  const [changingLevelName, setChangingLevelName] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');

  const [deletingLevel, setDeletingLevel] = useState(false);

  const [editorState, setEdtiorState] = useState(EditorState.Edit);

  const undo = () => {
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

  const redo = () => {
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

  const restart = () => {
    setBoard(Array(cellsWide * cellsHigh).fill(false));
    setCurrentPieceIndex(0);
    setPlayedPieces([]);
    setPieceFutureHistory([]);
    setNextPieceToPlay(undefined);
  };

  const completeLevel = () => {
    const loadedSaveData = localStorage.getItem(`${props.levelPack.name}-save-data`);
    let saveData: ILevelPackSaveData;

    if (loadedSaveData) {
      saveData = JSON.parse(atob(loadedSaveData));
    } else {
      saveData = {
        completion: Array(props.levelPack.levels.length).fill(0)
      };
    }

    const levelIndex = props.levelPack.levels.findIndex(x => x.name === props.level.name);
    saveData.completion[levelIndex] = 1;
    console.log(saveData);
    localStorage.setItem(`${props.levelPack.name}-save-data`, btoa(JSON.stringify(saveData)));

    goBackToLevelSelectMenu();
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
    props.level.pieces.push({layout: newPiece});
    setPieces(props.level.pieces.map(x => x.layout.map(y => y === 0 ? false : true)));

    props.setIsEditorDirty(true);
    closeAddPieceModal();
  };

  const closeAddPieceModal = () => {
    setAddingPiece(false);
    setNewPiece(Array(25).fill(0));
  };

  const oustPiece = () => {
    if (props.level.pieces.length > 0) {
      props.level.pieces.splice(currentPieceIndex, 1);
      setPieces(props.level.pieces.map(x => x.layout.map(y => y === 0 ? false : true)));
      props.setIsEditorDirty(true);
    }
  };

  const toggleEditorState = () => {
    if (editorState === EditorState.Edit) {
      restart();
      setEdtiorState(EditorState.Test);
    } else {
      restart();
      setEdtiorState(EditorState.Edit);
    }
  };

  const openRenameLevelModal = () => {
    setChangingLevelName(true);
  };

  const onNewLevelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLevelName(e.target.value);
  };

  const renameLevel = () => {
    props.level.name = newLevelName;
    props.setIsEditorDirty(true);
    closeRenameLevelModal();
  };

  const closeRenameLevelModal = () => {
    setNewLevelName('');
    setChangingLevelName(false);
  };

  const openDeleteLevelModal = () => {
    setDeletingLevel(true);
  };

  const deleteLevel = () => {
    props.setIsEditorDirty(true);
    props.deleteCurrentLevel();
  };

  const closeDeleteLevelModal = () => {
    setDeletingLevel(false);
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
          <GameButton theme={props.theme} onClick={completeLevel}>Back to Level Select</GameButton>
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

  const renderRenameLevelModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Rename Level</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelNameChange}></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelName.length === 0} onClick={renameLevel}>Change</GameButton>
          <MenuDivider color={props.theme.potentialShapeLines}/>
          <GameButton theme={props.theme} onClick={closeRenameLevelModal}>Cancel</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  const renderDeleteLevelConfirmModal = () => {
    return (
      <Modal>
      <ModalBox color={props.theme.trueBackground}>
        <ModalHeader color={props.theme.potentialShapeLines}>Delete Level?</ModalHeader>
        <GameButton theme={props.theme} onClick={deleteLevel}>Yes</GameButton>
        <GameButton theme={props.theme} onClick={closeDeleteLevelModal}>No</GameButton>
      </ModalBox>
    </Modal>
    );
  };

  const renderGameButtons = () => {
    return (
      <div className="Game-button-container">
        <GameButton theme={props.theme} disabled={playedPieces.length === 0} onClick={undo}>Undo</GameButton>
        <GameButton theme={props.theme} disabled={pieceFutureHistory.length === 0} onClick={redo}>Redo</GameButton>
        <GameButton theme={props.theme} onClick={restart}>Restart</GameButton>
        <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back</GameButton>
      </div>
    );
  };

  const renderEditorButtonsEditMode = () => {
    return (
      <div>
        <div className="Game-button-container">
          <GameButton theme={props.theme} onClick={openAddPieceModal}>Add Piece</GameButton>
          <GameButton theme={props.theme} onClick={oustPiece}>Oust Piece</GameButton>
          <GameButton theme={props.theme} onClick={toggleEditorState}>Test</GameButton>
        </div>
        <div className="Game-button-container">
          <GameButton theme={props.theme} onClick={openRenameLevelModal}>Rename</GameButton>
          <GameButton theme={props.theme} onClick={openDeleteLevelModal}>Delete</GameButton>
          <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu}>Back</GameButton>
        </div>
      </div>
    );
  };

  const renderEditorButtonsTestMode = () => {
    return (
      <div>
        <div className="Game-button-container">
          <GameButton theme={props.theme} disabled={playedPieces.length === 0} onClick={undo}>Undo</GameButton>
          <GameButton theme={props.theme} disabled={pieceFutureHistory.length === 0} onClick={redo}>Redo</GameButton>
          <GameButton theme={props.theme} onClick={restart}>Restart</GameButton>
          <GameButton theme={props.theme} onClick={toggleEditorState}>Edit</GameButton>
        </div>
      </div>
    );
  };

  return (
    <div>
      {gameState === GameState.Won && !props.isEditorMode && renderWinModal()}
      {gameState === GameState.Editing && addingPiece &&  renderAddPieceModal()}
      {gameState === GameState.Editing && changingLevelName &&  renderRenameLevelModal()}
      {gameState === GameState.Editing && deletingLevel && renderDeleteLevelConfirmModal()}
      <LevelTitle color={props.theme.potentialShapeLines}>{props.level.name}</LevelTitle>
      <GameWindow 
        theme={props.theme}
        cellsWide={cellsWide} 
        cellsHigh={cellsHigh}
        board={board} 
        boardGoal={boardGoal} 
        setBoard={setBoard} 
        setBoardGoal={setBoardGoal}
        pieces={pieces} 
        currentPieceIndex={currentPieceIndex}
        setCurrentPieceIndex={setCurrentPieceIndex}
        playedPieces={playedPieces} 
        setPlayedPieces={setPlayedPieces}
        setPieceFutureHistory={setPieceFutureHistory}
        nextPieceToPlay={nextPieceToPlay}
        setNextPieceToPlay={setNextPieceToPlay}
        gameState={gameState}
        level={props.level}
        editorState={editorState}
        setIsEditorDirty={props.setIsEditorDirty}
      />
      <PieceSelector 
        theme={props.theme}
        pieces={pieces} 
        currentPieceIndex={currentPieceIndex} 
        setCurrentPieceIndex={setCurrentPieceIndex} 
        playedPieces={playedPieces}
      />
      {gameState !== GameState.Editing && renderGameButtons()}
      {gameState === GameState.Editing && (editorState === EditorState.Edit ? renderEditorButtonsEditMode() : renderEditorButtonsTestMode())}
    </div>
  );
};