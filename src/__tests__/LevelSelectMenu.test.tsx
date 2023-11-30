import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import { setupJestCanvasMock } from 'jest-webgl-canvas-mock';

const addNewLevel = () => {
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
};

describe('Level Select Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();
  });

  describe('Game Mode', () => {
    beforeEach(() => {
      render(<App/>)
  
      const firstLevelPackButton = screen.getByTestId('ScrollSelectorItemButton0');
      fireEvent.click(firstLevelPackButton);
    });
  
    describe('Level select buttons function correctly', () => {
      test('Clicking a level goes to game page for that level', () => {
        const firstLevelButton = screen.getByTestId('ScrollSelectorItemButton0');
        fireEvent.click(firstLevelButton);

        const game = screen.getByTestId('Game');
        const levelTitle = screen.getByTestId('LevelTitle');

        expect(game).toBeInTheDocument();
        expect(levelTitle).toHaveTextContent('Level 1');
      });
    
      test('Clicking back goes to the main menu', () => {
        const backButton = screen.getByTestId('BackButton');
        fireEvent.click(backButton);

        const mainMenu = screen.getByTestId('MainMenu');

        expect(mainMenu).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
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
    });
  
    describe('Editor level select buttons function correctly', () => {
      test('Clicking a level goes to editor page for that level', () => {
        addNewLevel();

        const firstLevelButton = screen.getByTestId('ScrollSelectorItemButton0');
        fireEvent.click(firstLevelButton);

        const editor = screen.getByTestId('Editor');
        const levelTitle = screen.getByTestId('LevelTitle');

        expect(editor).toBeInTheDocument();
        expect(levelTitle).toHaveTextContent('Test Level');
      });
    
      test('Clicking add button opens add new level modal', () => {
        const addButton = screen.getByTestId('AddButton');
        fireEvent.click(addButton);

        const addNewLevelModal = screen.getByTestId('AddingNewLevelModal');

        expect(addNewLevelModal).toBeInTheDocument();
      });
  
      test('Clicking back goes to the main menu if no changes made', () => {
        const saveButton = screen.getByTestId('SaveButton');
        fireEvent.click(saveButton);

        const backButton = screen.getByTestId('BackButton');
        fireEvent.click(backButton);

        const mainMenu = screen.getByTestId('MainMenu');

        expect(mainMenu).toBeInTheDocument();
      });
  
      test('Clicking back opens the no save confirmation modal if changes made', () => {
        addNewLevel();

        const backButton = screen.getByTestId('BackButton');
        fireEvent.click(backButton);

        const noSaveConfirmlModal = screen.getByTestId('NoSaveConfirmModal');

        expect(noSaveConfirmlModal).toBeInTheDocument();
      });
    });
  
    describe('Editor create new level modal functions correctly', () => {
      test('Cannot create a new level with an invalid name', () => {
        const addButton = screen.getByTestId('AddButton');
        fireEvent.click(addButton);

        const addNewLevelButton = screen.getByTestId('AddNewLevelButton');

        expect(addNewLevelButton).toBeDisabled();
      });
  
      test('Cannot create a new level pack with invalid dimensions', () => {
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
            value: '2'
          }
        });

        const addNewLevelButton = screen.getByTestId('AddNewLevelButton');

        expect(addNewLevelButton).toBeDisabled();
      });
  
      test('Can create a new level with a valid name and valid dimensions', () => {
        addNewLevel();

        const addNewLevelModal = screen.queryByTestId('AddingNewLevelModal');
        const firstLevelText = screen.getByTestId('ScrollSelectorItemText0');

        expect(addNewLevelModal).not.toBeInTheDocument();
        expect(firstLevelText).toHaveTextContent('Test Level');
      });
  
      test('Canceling the modal goes back to the level select menu, clearing out the new level data', () => {
        const addButton = screen.getByTestId('AddButton');
        fireEvent.click(addButton);

        const newLevelNameInput = screen.getByTestId('NewLevelNameInput');
        fireEvent.change(newLevelNameInput, {
          target: {
            value: 'Test Level'
          }
        });

        const backButton = screen.getByTestId('AddNewLevelCancelButton');
        fireEvent.click(backButton);

        const addNewLevelModal = screen.queryByTestId('AddingNewLevelModal');

        expect(addNewLevelModal).not.toBeInTheDocument();

        const addButton2 = screen.getByTestId('AddButton');
        fireEvent.click(addButton2);

        const newLevelNameInput2 = screen.getByTestId('NewLevelNameInput');

        expect(newLevelNameInput2).toHaveTextContent('');
      });
    });
  
    describe('Editor confirm no save when leaving modal functions correctly', () => {
      test('Clicking yes leaves without saving level pack', () => {
        addNewLevel();

        const backButton = screen.getByTestId('BackButton');
        fireEvent.click(backButton);

        const confirmNoSaveYesButton = screen.getByTestId('NoSaveConfirmYesButton');
        fireEvent.click(confirmNoSaveYesButton);

        const mainMenu = screen.getByTestId('MainMenu');

        expect(mainMenu).toBeInTheDocument();
      });
  
      test('Canceling the modal goes back to the level select menu', () => {
        addNewLevel();

        const backButton = screen.getByTestId('BackButton');
        fireEvent.click(backButton);

        const confirmNoSaveNoButton = screen.getByTestId('NoSaveConfirmNoButton');
        fireEvent.click(confirmNoSaveNoButton);

        const levelSelectMenu = screen.getByTestId('LevelSelectMenu');

        expect(levelSelectMenu).toBeInTheDocument();
      });
    });
  });
});
