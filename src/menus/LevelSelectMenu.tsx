import styled from "styled-components";
import { AppPage, IGameTheme } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './LevelSelectMenu.css';

export interface ILevelSelectMenuProps {
  theme: IGameTheme,
  setPage: Function,
  levelPackName: string
};

const LevelSelectTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 64px;
  margin-bottom: 5px;
`;

const LevelSelectPackTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 40px;
  margin-top: 5px;
  margin-bottom: 32px;
`;

const testLevelNames = [
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5',
  'Level 6',
  'Level 7',
  'Level 8',
  'Level 9',
  'Level 10',
  'Level 11',
  'Level 12',
  'Level 13',
  'Level 14',
  'Level 15',
  'Level 16',
  'Level 17',
  'Level 18',
  'Level 19',
  'Level 20'
];

export const LevelSelectMenu = (props: ILevelSelectMenuProps) => {
  const clickOnLevel = (index: number) => {
  };

  const goBackToMainMenu = () => {
    props.setPage(AppPage.MainMenu);
  };

  return (
    <div className="LevelSelectMenu">
      <LevelSelectTitle color={props.theme.potentialShapeLines}>Level Select</LevelSelectTitle>
      <LevelSelectPackTitle color={props.theme.potentialShapeLines}>{props.levelPackName}</LevelSelectPackTitle>
      <ScrollSelector theme={props.theme} items={testLevelNames} itemClickHandler={clickOnLevel}/>
      <div className="LevelSelectMenu-button-container">
        <GameButton theme={props.theme} onClick={goBackToMainMenu}>Menu</GameButton>
      </div>
    </div>
  )
};