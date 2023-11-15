import styled from "styled-components";
import { AppPage, IGameTheme } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './MainMenu.css';

export interface IMainMenuProps {
  theme: IGameTheme
  setPage: Function
};

const MainMenuTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 120px;
  margin-top: 0px;
  margin-bottom: 32px;
`;

const testLevelPackNames = [
  '5x5 Easy',
  '5x5 Hard',
  '5x5 Mindnumbing',
  '10x10 Easy',
  '10x10 Hard',
  '10x10 Mindnumbing',
  '15x15 Easy',
  '15x15 Hard',
  '15x15 Mindnumbing',
];

export const MainMenu = (props: IMainMenuProps) => {
  const goToLevelPack = (index: number) => {
    props.setPage(AppPage.LevelSelectMenu);
  };

  const goToSettings = () => {
    props.setPage(AppPage.SettingsMenu);
  };

  return (
    <div className="MainMenu">
      <MainMenuTitle color={props.theme.potentialShapeLines}>Flipxel</MainMenuTitle>
      <ScrollSelector theme={props.theme} items={testLevelPackNames} itemClickHandler={goToLevelPack}/>
      <div className="MainMenu-button-container">
        <GameButton theme={props.theme}>Load Pack</GameButton>
        <GameButton theme={props.theme} onClick={goToSettings}>Settings</GameButton>
        <GameButton theme={props.theme}>Editor</GameButton>
      </div>
    </div>
  )
};