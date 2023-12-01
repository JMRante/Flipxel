import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

describe('Settings Menu Tests', () => {
  beforeEach(() => {
    render(<App/>)

    const settingsButton = screen.getByTestId('SettingsButton');
    fireEvent.click(settingsButton);
  });

  describe('Settings menu buttons function correctly', () => {
    test('Clicking a theme changes the theme', async () => {
      const secondThemeButton = screen.getByTestId('ScrollSelectorItemButton1');
      fireEvent.click(secondThemeButton);

      const secondThemeName = screen.getByTestId('ScrollSelectorItemText1');

      expect(secondThemeName).toHaveTextContent('Rusty Red');
      expect(await localStorage.getItem('theme')).toBe('1');
    });
  
    test('Clicking clear save data opens the confirmation modal', () => {
      const clearSaveDataButton = screen.getByTestId('ClearSaveDataButton');
      fireEvent.click(clearSaveDataButton);

      const clearSaveDataYesButton = screen.getByTestId('ClearSaveDataYesButton');
      
      expect(clearSaveDataYesButton).toBeInTheDocument();
    });

    test('Clicking back button goes back to main menu', () => {
      const backButton = screen.getByTestId('BackButton');
      fireEvent.click(backButton);

      const mainMenu = screen.getByTestId('MainMenu');

      expect(mainMenu).toBeInTheDocument();
    });
  });

  describe('Clear save data confirmation modal has correctly functioning buttons', () => {
    beforeEach(() => {
      const clearSaveDataButton = screen.getByTestId('ClearSaveDataButton');
      fireEvent.click(clearSaveDataButton);
    });

    test('Clicking yes clears out the save data', async () => {
      await localStorage.setItem('5x5 Easy-save-data', 'test');

      const yesButton = screen.getByTestId('ClearSaveDataYesButton');
      fireEvent.click(yesButton);

      const saveClearConfirmModal = screen.queryByTestId('SaveClearConfirmModal');

      expect(saveClearConfirmModal).not.toBeInTheDocument();
      expect(await localStorage.getItem('5x5 Easy-save-data')).toBeNull();
    });

    test('Canceling the modal goes back to the settings menu', async () => {
      await localStorage.setItem('5x5 Easy-save-data', 'test');

      const noButton = screen.getByTestId('ClearSaveDataNoButton');
      fireEvent.click(noButton);

      const saveClearConfirmModal = screen.queryByTestId('SaveClearConfirmModal');

      expect(saveClearConfirmModal).not.toBeInTheDocument();
      expect(await localStorage.getItem('5x5 Easy-save-data')).toBe('test');
    });
  });
});
