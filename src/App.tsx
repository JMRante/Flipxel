import React, { useState } from 'react';
import { Game } from './game/Game';
import styled from 'styled-components';
import { SettingsMenu } from './menus/SettingsMenu';
import { MainMenu } from './menus/MainMenu';
import { LevelSelectMenu } from './menus/LevelSelectMenu';
import themes from './data/themes.json';
import EasyLevelPack5x5 from './data/5x5EasyLevelPack.json';

export interface IGameTheme {
  name: string,
  trueBackground: string,
  backgroundBase: string,
  backgroundLines: string,
  targetBoxLines: string,
  filledBox: string,
  potentialShapeLines: string
};

export interface ILevelPack {
  name: string,
  levels: ILevel[]
};

export interface ILevel {
  name: string,
  dimension: number,
  goal: number[],
  pieces: ILevelPiece[]
};

export interface ILevelPiece {
  layout: number[]
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
  SettingsMenu,
  EditorLevelSelectMenu
};

const App = () => {
  const [page, setPage] = useState<AppPage>(AppPage.MainMenu);

  const [theme, setTheme] = useState<IGameTheme>(themes.themes[0]);

  const [levelPacks, setLevelPacks] = useState<Array<ILevelPack>>([EasyLevelPack5x5]);

  const [currentLevelPack, setCurrentLevelPack] = useState<ILevelPack>(levelPacks[0]);
  const [currentLevel, setCurrentLevel] = useState<ILevel>(currentLevelPack.levels[0]);

  switch (page) {
    default:
    case AppPage.MainMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <MainMenu theme={theme} setPage={setPage} levelPacks={levelPacks} setCurrentLevelPack={setCurrentLevelPack}/>
        </GameWrapper>
      );
    case AppPage.LevelSelectMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <LevelSelectMenu theme={theme} setPage={setPage} levelPack={currentLevelPack} setCurrentLevel={setCurrentLevel} isEditorMode={false}/>
        </GameWrapper>
      );
    case AppPage.Game:
      return (
        <GameWrapper color={theme.trueBackground}>
          <Game theme={theme} setPage={setPage} level={currentLevel} isEditorMode={false}/>
        </GameWrapper>
      );
    case AppPage.EditorLevelSelectMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <LevelSelectMenu theme={theme} setPage={setPage} levelPack={currentLevelPack} setCurrentLevel={setCurrentLevel} isEditorMode={true}/>
        </GameWrapper>
      );
    case AppPage.Editor:
      return (
        <GameWrapper color={theme.trueBackground}>
          <Game theme={theme} setPage={setPage} isEditorMode={true}/>
        </GameWrapper>
      );
    case AppPage.SettingsMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <SettingsMenu theme={theme} setPage={setPage} setTheme={setTheme}/>
        </GameWrapper>
      );
  }
};

export default App;
