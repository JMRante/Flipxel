import styled from "styled-components";
import { AppPage, IGameTheme } from "../App";
import './SettingsMenu.css';
import themes from '../data/themes.json';
import { ScrollSelector } from "./ScrollSelector";
import { GameButton } from "./GameButton";

export interface ISettingsMenuProps {
  theme: IGameTheme,
  setPage: Function,
  setTheme: Function
};

const SettingsMenuTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 64px;
  margin-top: 20px;
  margin-bottom: 5px;
`;

const SettingsMenuSubTitle = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 40px;
  margin-top: 5px;
  margin-bottom: 26px;
`;

export const SettingsMenu = (props: ISettingsMenuProps) => {
  const themeList = themes.themes;
  const themeNameList = themes.themes.map(x => {
    if (x.name === props.theme.name) {
      return `> ${x.name}`;
    } else {
      return x.name;
    }
  });

  const clickOnTheme = (index: number) => {
    props.setTheme(themeList[index]);
  };

  const goBackToMainMenu = () => {
    props.setPage(AppPage.MainMenu);
  };

  return (
    <div className="SettingsMenu">
      <SettingsMenuTitle color={props.theme.potentialShapeLines}>Settings</SettingsMenuTitle>
      <SettingsMenuSubTitle color={props.theme.potentialShapeLines}>Change Theme</SettingsMenuSubTitle>
      <ScrollSelector theme={props.theme} items={themeNameList} itemClickHandler={clickOnTheme}/>
      <div className="SettingsMenu-button-container">
        <GameButton theme={props.theme}>Clear Save Data</GameButton>
        <GameButton theme={props.theme} onClick={goBackToMainMenu}>Menu</GameButton>
      </div>
    </div>
  )
};