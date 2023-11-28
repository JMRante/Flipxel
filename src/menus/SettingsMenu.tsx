import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import './SettingsMenu.css';
import themes from '../data/themes.json';
import { ScrollSelector } from "./ScrollSelector";
import { GameButton } from "./GameButton";
import { useState } from "react";
import { Modal } from "./Modal";
import { ModalBox } from "./ModalBox";
import { ModalHeader } from "./ModalHeader";

export interface ISettingsMenuProps {
  theme: IGameTheme,
  setPage: Function,
  setTheme: Function,
  levelPacks: ILevelPack[]
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
  const [confirmingSaveDelete, setConfirmingSaveDelete] = useState(false);

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

  const openClearSaveDataConfirmation = () => {
    setConfirmingSaveDelete(true);
  };

  const clearSaveData = () => {
    props.levelPacks.forEach(x => localStorage.removeItem(`${x.name}-save-data`));
    setConfirmingSaveDelete(false);
  };

  const closeClearSaveDataConfirmation = () => {
    setConfirmingSaveDelete(false);
  };

  const goBackToMainMenu = () => {
    props.setPage(AppPage.MainMenu);
  };

  const renderSaveClearConfirmModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Clear All Save Data?</ModalHeader>
          <GameButton theme={props.theme} onClick={clearSaveData}>Yes</GameButton>
          <GameButton theme={props.theme} onClick={closeClearSaveDataConfirmation}>No</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  return (
    <div>
      {confirmingSaveDelete && renderSaveClearConfirmModal()}
      <div className="SettingsMenu">
        <SettingsMenuTitle color={props.theme.potentialShapeLines}>Settings</SettingsMenuTitle>
        <SettingsMenuSubTitle color={props.theme.potentialShapeLines}>Change Theme</SettingsMenuSubTitle>
        <ScrollSelector theme={props.theme} items={themeNameList} itemClickHandler={clickOnTheme}/>
        <div className="SettingsMenu-button-container">
          <GameButton theme={props.theme} onClick={openClearSaveDataConfirmation}>Clear Save Data</GameButton>
          <GameButton theme={props.theme} onClick={goBackToMainMenu}>Back</GameButton>
        </div>
      </div>
    </div>
  )
};