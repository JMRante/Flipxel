import { useEffect, useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";
import { AppPage, IGameTheme, ILevel, ILevelPack, ILevelPackSaveData } from "../App";
import { GameButton } from "../menus/elements/input/GameButton";
import { Modal } from "../menus/elements/modal/Modal";
import { ModalBox } from "../menus/elements/modal/ModalBox";
import { ModalHeader } from "../menus/elements/modal/ModalHeader";
import styled from "styled-components";
import { GameTextField } from "../menus/elements/input/GameTextField";
import { MenuDivider } from "../menus/elements/layout/MenuDivider";
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

const LevelTitle = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
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

const GameButtonContainer = styled.div`
  display: flex;
`;

const AddPieceContainer = styled.div`
  margin-bottom: 20px;
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

  const [undoTriggered, setUndoTriggered] = useState(false);
  const [redoTriggered, setRedoTriggered] = useState(false);

  const [addingPiece, setAddingPiece] = useState(false);
  const [newPiece, setNewPiece] = useState(Array(25).fill(0));

  const [changingLevelName, setChangingLevelName] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');

  const [deletingLevel, setDeletingLevel] = useState(false);

  const [editorState, setEdtiorState] = useState(EditorState.Edit);

  const restart = () => {
    setBoard(Array(cellsWide * cellsHigh).fill(false));
    setCurrentPieceIndex(0);
    setPlayedPieces([]);
    setPieceFutureHistory([]);
  };

  const undo = () => {
    if (!undoTriggered) {
      setUndoTriggered(true);
    }
  };

  const redo = () => {
    if (!redoTriggered) {
      setRedoTriggered(true);
    }
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
  }, [board, boardGoal, playedPieces.length, pieces.length, gameState]);

  const renderWinModal = () => {
    return (
      <Modal internalTestId="WinModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Complete!</ModalHeader>
          <GameButton theme={props.theme} onClick={completeLevel}>Back to Puzzle Select</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  const renderCreatePiecePartRow = (rowIndex: number) => {
    return [...Array(5)].map((e, i) => {
      const partIndex = (rowIndex * 5) + i;

      return (
        <CreatePiecePartButton key={`CreatePiecePart${partIndex}`} theme={props.theme} selected={newPiece[partIndex]} onClick={createPiecePart} value={partIndex} data-testid={`CreatePiecePart${partIndex}Button`}/>
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
      <Modal internalTestId="AddPieceModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Add Piece</ModalHeader>
          <AddPieceContainer>
            {renderCreatePiecePartRows()}
          </AddPieceContainer>
          <GameButtonContainer>
            <GameButton theme={props.theme} disabled={!newPiece.find(x => x === 1)} onClick={addPiece} data-testid="ConfirmAddPieceButton">Add</GameButton>
            <GameButton theme={props.theme} onClick={closeAddPieceModal} data-testid="CancelAddPieceButton">Cancel</GameButton>
          </GameButtonContainer>
        </ModalBox>
      </Modal>
    );
  };

  const renderRenameLevelModal = () => {
    return (
      <Modal internalTestId="RenameLevelModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Rename Puzzle</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelNameChange} data-testid="LevelNameInput"></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelName.length === 0} onClick={renameLevel} data-testid="ChangeLevelNameButton">Change</GameButton>
          <MenuDivider/>
          <GameButton theme={props.theme} onClick={closeRenameLevelModal} data-testid="CancelRenameLevelButton">Cancel</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  const renderDeleteLevelConfirmModal = () => {
    return (
      <Modal internalTestId="DeleteLevelConfirmModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Delete Puzzle?</ModalHeader>
          <GameButton theme={props.theme} onClick={deleteLevel} data-testid="DeleteLevelConfirmYesButton">Yes</GameButton>
          <GameButton theme={props.theme} onClick={closeDeleteLevelModal} data-testid="DeleteLevelConfirmNoButton">No</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  const renderGameButtons = () => {
    return (
      <GameButtonContainer>
        <GameButton theme={props.theme} disabled={playedPieces.length === 0} onClick={undo} data-testid="UndoButton">Undo</GameButton>
        <GameButton theme={props.theme} disabled={pieceFutureHistory.length === 0} onClick={redo} data-testid="RedoButton">Redo</GameButton>
        <GameButton theme={props.theme} onClick={restart} data-testid="RestartButton">Restart</GameButton>
        <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu} data-testid="BackButton">Back</GameButton>
      </GameButtonContainer>
    );
  };

  const renderEditorButtonsEditMode = () => {
    return (
      <div>
        <GameButtonContainer>
          <GameButton theme={props.theme} onClick={openAddPieceModal} data-testid="AddPieceButton">Add Piece</GameButton>
          <GameButton theme={props.theme} disabled={pieces.length === 0} onClick={oustPiece} data-testid="OustButton">Oust Piece</GameButton>
          <GameButton theme={props.theme} onClick={toggleEditorState} data-testid="TestButton">Test</GameButton>
        </GameButtonContainer>
        <GameButtonContainer>
          <GameButton theme={props.theme} onClick={openRenameLevelModal} data-testid="RenameButton">Rename</GameButton>
          <GameButton theme={props.theme} onClick={openDeleteLevelModal} data-testid="DeleteButton">Delete</GameButton>
          <GameButton theme={props.theme} onClick={goBackToLevelSelectMenu} data-testid="BackButton">Back</GameButton>
        </GameButtonContainer>
      </div>
    );
  };

  const renderEditorButtonsTestMode = () => {
    return (
      <div>
        <GameButtonContainer>
          <GameButton theme={props.theme} disabled={playedPieces.length === 0} onClick={undo} data-testid="UndoButton">Undo</GameButton>
          <GameButton theme={props.theme} disabled={pieceFutureHistory.length === 0} onClick={redo} data-testid="RedoButton">Redo</GameButton>
          <GameButton theme={props.theme} onClick={restart} data-testid="RestartButton">Restart</GameButton>
          <GameButton theme={props.theme} onClick={toggleEditorState} data-testid="EditButton">Edit</GameButton>
        </GameButtonContainer>
      </div>
    );
  };

  return (
    <div data-testid={props.isEditorMode ? (editorState === EditorState.Test ? 'Test' : 'Editor') : 'Game'}>
      {gameState === GameState.Won && !props.isEditorMode && renderWinModal()}
      {gameState === GameState.Editing && addingPiece &&  renderAddPieceModal()}
      {gameState === GameState.Editing && changingLevelName &&  renderRenameLevelModal()}
      {gameState === GameState.Editing && deletingLevel && renderDeleteLevelConfirmModal()}
      <LevelTitle theme={props.theme} data-testid="LevelTitle">{props.level.name}</LevelTitle>
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
        pieceFutureHistory={pieceFutureHistory}
        setPieceFutureHistory={setPieceFutureHistory}
        gameState={gameState}
        level={props.level}
        editorState={editorState}
        setIsEditorDirty={props.setIsEditorDirty}
        undoTriggered={undoTriggered}
        setUndoTriggered={setUndoTriggered}
        redoTriggered={redoTriggered}
        setRedoTriggered={setRedoTriggered}
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