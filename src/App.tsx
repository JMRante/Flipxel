import { useEffect, useState } from 'react';
import { Game } from './game/Game';
import styled from 'styled-components';
import { SettingsMenu } from './menus/SettingsMenu';
import { MainMenu } from './menus/MainMenu';
import { LevelSelectMenu } from './menus/LevelSelectMenu';
import themes from './data/themes.json';
import EasyLevelPack5x5 from './data/p_5x5easy.json';
import EasyLevelPack7x7 from './data/p_7x7easy.json';
import EasyLevelPack10x10 from './data/p_10x10easy.json';
import MediumLevelPack5x5 from './data/p_5x5medium.json';
import MediumLevelPack7x7 from './data/p_7x7medium.json';
import MediumLevelPack10x10 from './data/p_10x10medium.json';
import HardLevelPack5x5 from './data/p_5x5hard.json';
import HardLevelPack7x7 from './data/p_7x7hard.json';
import HardLevelPack10x10 from './data/p_10x10hard.json';

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

export interface ISaveData {
  levelPackSaveData: ILevelPackSaveData[]
}

export interface ILevelPackSaveData {
  name: string,
  completion: number[]
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

  const [levelPacks, setLevelPacks] = useState<Array<ILevelPack>>([
    EasyLevelPack5x5,
    EasyLevelPack7x7,
    EasyLevelPack10x10,
    MediumLevelPack5x5,
    MediumLevelPack7x7,
    MediumLevelPack10x10,
    HardLevelPack5x5,
    HardLevelPack7x7,
    HardLevelPack10x10
  ]);

  const [currentLevelPack, setCurrentLevelPack] = useState<ILevelPack>(levelPacks[0]);
  const [currentLevel, setCurrentLevel] = useState<ILevel>(currentLevelPack.levels[0]);

  const [isEditorDirty, setIsEditorDirty] = useState(true);

  const deleteCurrentLevel = () => {
    setPage(AppPage.EditorLevelSelectMenu)

    const currentLevelIndex = currentLevelPack.levels.indexOf(currentLevel);
    currentLevelPack.levels.splice(currentLevelIndex, 1);
  };

  useEffect(() => {
    const savedThemeIndex = localStorage.getItem('theme');

    if (savedThemeIndex) {
      const parsedThemeIndex = parseInt(savedThemeIndex);
      setTheme(themes.themes[parsedThemeIndex]);
    }
  }, []);

  switch (page) {
    default:
    case AppPage.MainMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <MainMenu 
            theme={theme} 
            setPage={setPage} 
            levelPacks={levelPacks} 
            setLevelPacks={setLevelPacks} 
            setCurrentLevelPack={setCurrentLevelPack}
          />
        </GameWrapper>
      );
    case AppPage.LevelSelectMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <LevelSelectMenu 
            theme={theme} 
            setPage={setPage} 
            levelPack={currentLevelPack} 
            setCurrentLevelPack={setCurrentLevelPack} 
            setCurrentLevel={setCurrentLevel} 
            isEditorMode={false} 
            isEditorDirty={isEditorDirty} 
            setIsEditorDirty={setIsEditorDirty}
          />
        </GameWrapper>
      );
    case AppPage.Game:
      return (
        <GameWrapper color={theme.trueBackground}>
          <Game 
            theme={theme} 
            setPage={setPage} 
            levelPack={currentLevelPack} 
            level={currentLevel} 
            isEditorMode={false}
            deleteCurrentLevel={deleteCurrentLevel}
            setIsEditorDirty={setIsEditorDirty}
          />
        </GameWrapper>
      );
    case AppPage.EditorLevelSelectMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <LevelSelectMenu 
            theme={theme} 
            setPage={setPage} 
            levelPack={currentLevelPack} 
            setCurrentLevelPack={setCurrentLevelPack} 
            setCurrentLevel={setCurrentLevel} 
            isEditorMode={true} 
            isEditorDirty={isEditorDirty} 
            setIsEditorDirty={setIsEditorDirty}
          />
        </GameWrapper>
      );
    case AppPage.Editor:
      return (
        <GameWrapper color={theme.trueBackground}>
          <Game 
            theme={theme} 
            setPage={setPage} 
            levelPack={currentLevelPack} 
            level={currentLevel} 
            isEditorMode={true} 
            deleteCurrentLevel={deleteCurrentLevel}
            setIsEditorDirty={setIsEditorDirty}
          />
        </GameWrapper>
      );
    case AppPage.SettingsMenu:
      return (
        <GameWrapper color={theme.trueBackground}>
          <SettingsMenu 
            theme={theme} 
            setPage={setPage} 
            setTheme={setTheme}
            levelPacks={levelPacks}
          />
        </GameWrapper>
      );
  }
};

export default App;
