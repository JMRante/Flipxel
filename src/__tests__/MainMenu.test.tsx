import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

const mockLevelPackFileData = {
  "name": "Mock Level Pack",
  "levels": [
    {
      "name": "Mock Level 1",
      "dimension": 5,
      "goal": [0,0,0,0,0, 0,1,1,1,0, 0,1,0,1,0, 0,1,1,1,0, 0,0,0,0,0],
      "pieces": [
        {
          "layout": [0,0,0,0,0, 0,0,0,0,0, 0,1,1,1,0, 0,1,0,0,0, 0,0,0,0,0]
        },
        {
          "layout": [0,0,0,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,0,0,0]
        },
        {
          "layout": [0,0,0,0,0, 0,0,0,0,0, 0,0,1,1,0, 0,0,0,0,0, 0,0,0,0,0]
        },
        {
          "layout": [0,0,0,0,0, 0,0,0,0,0, 0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0]
        }
      ]
    }
  ]
}

describe('Main Menu Tests', () => {
  beforeEach(() => {
    render(<App/>)
  });

  test('Default level packs load', () => {
    const firstLevelPackItem = screen.getByTestId('ScrollSelectorItemText0');

    expect(firstLevelPackItem).toHaveTextContent('5 x 5 Easy');
  });

  describe('Menu buttons function correctly', () => {
    test('Clicking a level pack goes to the right level select page', () => {
      const firstLevelPackButton = screen.getByTestId('ScrollSelectorItemButton0');
      fireEvent.click(firstLevelPackButton);

      const levelSelectMenu = screen.getByTestId('LevelSelectMenu');
      const levelPackTitle = screen.getByTestId('LevelSelectPackTitle');

      expect(levelSelectMenu).toBeInTheDocument();
      expect(levelPackTitle).toHaveTextContent('5 x 5 Easy');
    });
  
    test('Clicking load pack prompts to load a file and loads it properly', async () => {
      const mockLevelPackData = JSON.stringify(mockLevelPackFileData);
      const mockLevelPackFile = new File([mockLevelPackData], "lp_mock.json", { type: "application/json" });

      const loadLevelPackInput: HTMLInputElement = screen.getByTestId('LoadLevelPackInput');
      
      await userEvent.upload(loadLevelPackInput, mockLevelPackFile);

      expect(loadLevelPackInput.files).toHaveLength(1);
    });

    test('Clicking settings goes to the settings page', () => {
      const settingsButton = screen.getByTestId('SettingsButton');
      fireEvent.click(settingsButton);

      const settingsMenu = screen.getByTestId('SettingsMenu');

      expect(settingsMenu).toBeInTheDocument();
    });
  
    test('Clicking editor opens the entering editor modal', () => {
      const editorButton = screen.getByTestId('EditorButton');
      fireEvent.click(editorButton);

      const editorStartModal = screen.getByTestId('EditorStartModal');

      expect(editorStartModal).toBeInTheDocument();
    });
  });

  describe('Editor modal has correctly functioning buttons', () => {
    beforeEach(() => {
      const editorButton = screen.getByTestId('EditorButton');
      fireEvent.click(editorButton);
    });
  
    test('Cannot create a new level pack with an invalid name', () => {
      const newLevelPackButton = screen.getByTestId('NewLevelPackButton');

      expect(newLevelPackButton).toBeDisabled();
    });

    test('Can create a new level pack with a valid name', () => {
      const editorNewLevelPackNameInput = screen.getByTestId('EditorStartLevelPackNameInput');
      fireEvent.change(editorNewLevelPackNameInput, {
        target: {
          value: 'Test Level Pack'
        }
      });

      const newLevelPackButton = screen.getByTestId('NewLevelPackButton');
      fireEvent.click(newLevelPackButton);

      const levelSelectMenu = screen.getByTestId('LevelSelectMenu');
      const levelPackTitle = screen.getByTestId('LevelSelectPackTitle');

      expect(levelSelectMenu).toBeInTheDocument();
      expect(levelPackTitle).toHaveTextContent('Test Level Pack');
    });

    test('Clicking load prompts to load a level pack for editing and loads it properly', async () => {
      const mockLevelPackData = JSON.stringify(mockLevelPackFileData);
      const mockLevelPackFile = new File([mockLevelPackData], "lp_mock.json", { type: "application/json" });

      const loadLevelPackInput: HTMLInputElement = screen.getByTestId('LoadLevelPackToEditInput');
      
      await userEvent.upload(loadLevelPackInput, mockLevelPackFile);

      expect(loadLevelPackInput.files).toHaveLength(1);
    });

    test('Canceling the modal goes back to the main menu', () => {
      const cancelButton = screen.getByTestId('CancelEditorStartButton');
      fireEvent.click(cancelButton);

      const editorStartModal= screen.queryByTestId('EditorStartModal');

      expect(editorStartModal).not.toBeInTheDocument();
    });
  });
});
