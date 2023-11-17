import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './MainMenu.css';

export interface IMainMenuProps {
  theme: IGameTheme,
  setPage: Function,
  levelPacks: ILevelPack[],
  setCurrentLevelPack: Function
};

const MainMenuTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 120px;
  margin-top: 0px;
  margin-bottom: 32px;
`;

export const MainMenu = (props: IMainMenuProps) => {
  const goToLevelPack = (index: number) => {
    props.setCurrentLevelPack(props.levelPacks[index]);
    props.setPage(AppPage.LevelSelectMenu);
  };

  const goToSettings = () => {
    props.setPage(AppPage.SettingsMenu);
  };

  const levelPackNames = props.levelPacks.map(x => x.name);

  return (
    <div className="MainMenu">
      <MainMenuTitle color={props.theme.potentialShapeLines}>Flipxel</MainMenuTitle>
      <ScrollSelector theme={props.theme} items={levelPackNames} itemClickHandler={goToLevelPack}/>
      <div className="MainMenu-button-container">
        <GameButton theme={props.theme}>Load Pack</GameButton>
        <GameButton theme={props.theme} onClick={goToSettings}>Settings</GameButton>
        <GameButton theme={props.theme}>Editor</GameButton>
      </div>
    </div>
  )
};