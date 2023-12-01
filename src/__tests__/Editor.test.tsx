import { fireEvent, render, screen } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-webgl-canvas-mock";
import App from "../App";

describe('Editor Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();

    render(<App/>)

    const editorButton = screen.getByTestId('EditorButton');
    fireEvent.click(editorButton);
  
    const editorNewLevelPackNameInput = screen.getByTestId('EditorStartLevelPackNameInput');
    fireEvent.change(editorNewLevelPackNameInput, {
      target: {
        value: 'Test Level Pack'
      }
    });

    const newLevelPackButton = screen.getByTestId('NewLevelPackButton');
    fireEvent.click(newLevelPackButton);

    const addButton = screen.getByTestId('AddButton');
    fireEvent.click(addButton);
  
    const newLevelNameInput = screen.getByTestId('NewLevelNameInput');
    fireEvent.change(newLevelNameInput, {
      target: {
        value: 'Test Level'
      }
    });
  
    const newLevelSizeInput = screen.getByTestId('NewLevelSizeInput');
    fireEvent.change(newLevelSizeInput, {
      target: {
        value: '10'
      }
    });
  
    const addNewLevelButton = screen.getByTestId('AddNewLevelButton');
    fireEvent.click(addNewLevelButton);

    const firstLevelButton = screen.getByTestId('ScrollSelectorItemButton0');
    fireEvent.click(firstLevelButton);
  });

  describe('Editor menu buttons function correctly', () => {
    test('Clicking add piece opens the add piece modal', () => {
      const addPieceButton = screen.getByTestId('AddPieceButton');
      fireEvent.click(addPieceButton);

      const addPieceModal = screen.getByTestId('AddPieceModal');

      expect(addPieceModal).toBeInTheDocument();
    });
  
    test('Cannot click oust piece if no pieces exists', () => {
      const oustButton = screen.getByTestId('OustButton');

      expect(oustButton).toBeDisabled();
    });

    test('Clicking oust piece removes the selected piece', () => {
      const addPieceButton = screen.getByTestId('AddPieceButton');
      fireEvent.click(addPieceButton);
    
      const createPiecePartButton = screen.getByTestId('CreatePiecePart0Button');
      fireEvent.click(createPiecePartButton);
    
      const confirmAddPieceButton = screen.getByTestId('ConfirmAddPieceButton');
      fireEvent.click(confirmAddPieceButton);

      const oustButton = screen.getByTestId('OustButton');
      fireEvent.click(oustButton);

      const pieceButton0 = screen.queryByTestId('PieceButton0');

      expect(pieceButton0).not.toBeInTheDocument();
    });

    test('Clicking test switches to level test mode', () => {
      const testButton = screen.getByTestId('TestButton');
      fireEvent.click(testButton);

      const test = screen.getByTestId('Test');

      expect(test).toBeInTheDocument();
    });
  
    test('Clicking rename opens the rename level modal', () => {
      const renameButton = screen.getByTestId('RenameButton');
      fireEvent.click(renameButton);

      const renameLevelModal = screen.getByTestId('RenameLevelModal');

      expect(renameLevelModal).toBeInTheDocument();
    });
  
    test('Clicking back goes back to the editor level select menu', () => {
      const backButton = screen.getByTestId('BackButton');
      fireEvent.click(backButton);

      const levelSelectMenu = screen.getByTestId('LevelSelectMenu');

      expect(levelSelectMenu).toBeInTheDocument();
    });
  });

  describe('Piece creation modal functions correctly', () => {
    beforeEach(() => {
      const addPieceButton = screen.getByTestId('AddPieceButton');
      fireEvent.click(addPieceButton);
    });

    test('Cannot add a piece with no parts', () => {
      const confirmAddPieceButton = screen.getByTestId('ConfirmAddPieceButton');

      expect(confirmAddPieceButton).toBeDisabled();
    });
  
    test('Can add a piece with the add button if it has parts', () => {
      const createPiecePartButton = screen.getByTestId('CreatePiecePart0Button');
      fireEvent.click(createPiecePartButton);
    
      const confirmAddPieceButton = screen.getByTestId('ConfirmAddPieceButton');
      fireEvent.click(confirmAddPieceButton);

      const addPieceModal = screen.queryByTestId('AddPieceModal');

      expect(addPieceModal).not.toBeInTheDocument();

      const pieceButton0 = screen.queryByTestId('PieceButton0');

      expect(pieceButton0).toBeInTheDocument();
    });

    test('Clicking cancel closes the add piece modal', () => {
      const cancelAddPieceButton = screen.getByTestId('CancelAddPieceButton');
      fireEvent.click(cancelAddPieceButton);

      const addPieceModal = screen.queryByTestId('AddPieceModal');

      expect(addPieceModal).not.toBeInTheDocument();
    });
  });

  describe('Rename level modal functions correctly', () => {
    beforeEach(() => {
      const renameButton = screen.getByTestId('RenameButton');
      fireEvent.click(renameButton);
    });

    test('Cannot click change button if new name is invalid', () => {
      const changeLevelNameButton = screen.getByTestId('ChangeLevelNameButton');

      expect(changeLevelNameButton).toBeDisabled();
    });
  
    test('Change button closes modal and renames level if value is valid', () => {
      const levelNameInput = screen.getByTestId('LevelNameInput');
      fireEvent.change(levelNameInput, {
        target: {
          value: 'Test Level 2'
        }
      });

      const changeLevelNameButton = screen.getByTestId('ChangeLevelNameButton');
      fireEvent.click(changeLevelNameButton);

      const renameLevelModal = screen.queryByTestId('RenameLevelModal');

      expect(renameLevelModal).not.toBeInTheDocument();
      
      const levelTitle = screen.queryByTestId('LevelTitle');
      
      expect(levelTitle).toHaveTextContent('Test Level 2');
    });

    test('Clicking cancel closes the rename level modal', () => {
      const cancelRenameLevelButton = screen.getByTestId('CancelRenameLevelButton');
      fireEvent.click(cancelRenameLevelButton);

      const renameLevelModal = screen.queryByTestId('RenameLevelModal');

      expect(renameLevelModal).not.toBeInTheDocument();
    });
  });

  describe('Delete level confirmation modal functions correctly', () => {
    beforeEach(() => {
      const deleteButton = screen.getByTestId('DeleteButton');
      fireEvent.click(deleteButton);
    });

    test('Clicking yes goes back to the level select menu with the level removed', () => {
      const deleteLevelConfirmYesButton = screen.getByTestId('DeleteLevelConfirmYesButton');
      fireEvent.click(deleteLevelConfirmYesButton);

      const deleteLevelConfirmModal = screen.queryByTestId('DeleteLevelConfirmModal');
      const firstLevelButton = screen.queryByTestId('ScrollSelectorItemButton0');

      expect(deleteLevelConfirmModal).not.toBeInTheDocument();
      expect(firstLevelButton).not.toBeInTheDocument();
    });
  
    test('Clicking no closes the delete level confirm modal', () => {
      const deleteLevelConfirmNoButton = screen.getByTestId('DeleteLevelConfirmNoButton');
      fireEvent.click(deleteLevelConfirmNoButton);

      const deleteLevelConfirmModal = screen.queryByTestId('DeleteLevelConfirmModal');

      expect(deleteLevelConfirmModal).not.toBeInTheDocument();
    });
  });

  describe('Level test menu buttons function correctly', () => {
    beforeEach(() => {
      const testButton = screen.getByTestId('TestButton');
      fireEvent.click(testButton);
    });

    test('When no move made, undo and redo cannot be clicked', () => {
      const undoButton = screen.getByTestId('UndoButton');
      const redoButton = screen.getByTestId('RedoButton');

      expect(undoButton).toBeDisabled();
      expect(redoButton).toBeDisabled();
    });
  
    test('Clicking the edit button returns to the edit page', () => {
      const editButton = screen.getByTestId('EditButton');
      fireEvent.click(editButton);

      const editor = screen.getByTestId('Editor');

      expect(editor).toBeInTheDocument();
    });
  });
});
