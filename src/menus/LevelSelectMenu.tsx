import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './LevelSelectMenu.css';

export interface ILevelSelectMenuProps {
  theme: IGameTheme,
  setPage: Function,
  levelPack: ILevelPack,
  setCurrentLevel: Function
};

const LevelSelectTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 64px;
  margin-top: 20px;
  margin-bottom: 5px;
`;

const LevelSelectPackTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 40px;
  margin-top: 5px;
  margin-bottom: 26px;
`;

export const LevelSelectMenu = (props: ILevelSelectMenuProps) => {
  const clickOnLevel = (index: number) => {
    props.setCurrentLevel(props.levelPack.levels[index]);
    props.setPage(AppPage.Game);
  };

  const goBackToMainMenu = () => {
    props.setPage(AppPage.MainMenu);
  };

  const levelNames = props.levelPack.levels.map(x => x.name);

  return (
    <div className="LevelSelectMenu">
      <LevelSelectTitle color={props.theme.potentialShapeLines}>Level Select</LevelSelectTitle>
      <LevelSelectPackTitle color={props.theme.potentialShapeLines}>{props.levelPack.name}</LevelSelectPackTitle>
      <ScrollSelector theme={props.theme} items={levelNames} itemClickHandler={clickOnLevel}/>
      <div className="LevelSelectMenu-button-container">
        <GameButton theme={props.theme} onClick={goBackToMainMenu}>Back</GameButton>
      </div>
    </div>
  )
};