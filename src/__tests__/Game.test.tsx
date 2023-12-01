import { fireEvent, render, screen } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-webgl-canvas-mock";
import App from "../App";

describe('Game Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();

    render(<App/>)
  
    const firstLevelPackButton = screen.getByTestId('ScrollSelectorItemButton0');
    fireEvent.click(firstLevelPackButton);

    const firstLevelButton = screen.getByTestId('ScrollSelectorItemButton0');
    fireEvent.click(firstLevelButton);
  });

  describe('Game menu buttons function correctly', () => {
    test('When no move made, undo and redo cannot be clicked', () => {
      const undoButton = screen.getByTestId('UndoButton');
      const redoButton = screen.getByTestId('RedoButton');

      expect(undoButton).toBeDisabled();
      expect(redoButton).toBeDisabled();
    });
  
    test('Clicking back returns to the level select menu', () => {
      const backButton = screen.getByTestId('BackButton');
      fireEvent.click(backButton);

      const levelSelectMenu = screen.getByTestId('LevelSelectMenu');

      expect(levelSelectMenu).toBeInTheDocument();
    });
  });
});
