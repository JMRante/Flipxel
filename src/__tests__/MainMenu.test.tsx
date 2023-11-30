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
    const firstLevelItem = screen.getByTestId('ScrollSelectorItemText0');

    expect(firstLevelItem).toHaveTextContent('5 x 5 Easy');
  });

  describe('Menu buttons function correctly', () => {
    test('Clicking a level pack goes to the right level select page', () => {
      const firstLevelButton = screen.getByTestId('ScrollSelectorItemButton0');

      fireEvent.click(firstLevelButton);

      const levelPackTitle = screen.getByTestId('LevelSelectPackTitle');

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

    });
  
    test('Clicking editor opens the entering editor modal', () => {

    });
  
    test('Clicking editor opens the entering editor modal', () => {

    });
  });

  describe('Editor modal has correctly functioning buttons', () => {
    test('Cannot create a new level pack with an invalid name', () => {
  
    });

    test('Can create a new level pack with a valid name', () => {
  
    });

    test('Clicking load prompts to load a level pack for editing', () => {
  
    });

    test('Canceling the modal goes back to the main menu', () => {
  
    });
  });
});
