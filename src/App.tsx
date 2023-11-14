import React, { useState } from 'react';
import { Game } from './game/Game';
import styled from 'styled-components';
import { SettingsMenu } from './menus/SettingsMenu';
import { MainMenu } from './menus/MainMenu';
import { LevelSelectMenu } from './menus/LevelSelectMenu';

export interface IGameTheme {
  trueBackground: string,
  backgroundBase: string,
  backgroundLines: string,
  targetBoxLines: string,
  filledBox: string,
  potentialShapeLines: string
};

const GameWrapper = styled.div<{ color?: string; }>`
  text-align: center;
  background-color: #${props => props.color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export enum AppPage {
  MainMenu,
  LevelSelectMenu,
  Game,
  Editor,
  SettingsMenu
};

const App = () => {

  /*
  Main Menu
    Title
    Scrolling Level Pack Selector
      Scrolling Level Selector
      Back
    Load Level Pack Button
    Settings Button
      Change Theme
      Clear Save Data
    Level Editor Button
  */
  const [page, setPage] = useState<AppPage>(AppPage.MainMenu);

  const [theme, setTheme] = useState<IGameTheme>({
    trueBackground: '161e28',
    backgroundBase: '9eacbc',
    backgroundLines: '8697aa',
    targetBoxLines: '232b35',
    filledBox: '414e5e',
    potentialShapeLines: 'dce2ef'
  });

  switch (page) {
    default:
    case AppPage.MainMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <MainMenu theme={theme} setPage={setPage}/>
        </GameWrapper>
      );
    case AppPage.LevelSelectMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <LevelSelectMenu theme={theme} setPage={setPage} levelPackName='5x5 Easy'/>
        </GameWrapper>
      );
    case AppPage.Game:
      return (
        <GameWrapper color={theme.trueBackground}>
          <Game theme={theme}/>
        </GameWrapper>
      );
    case AppPage.Editor:
      return (
        <GameWrapper color={theme.trueBackground}>
          <Game theme={theme}/>
        </GameWrapper>
      );
    case AppPage.SettingsMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <SettingsMenu theme={theme}/>
        </GameWrapper>
      );
  }
};

export default App;
