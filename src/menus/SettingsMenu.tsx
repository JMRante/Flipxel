import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import themes from '../data/themes.json';
import { ScrollSelector } from "./elements/ScrollSelector";
import { GameButton } from "./elements/input/GameButton";
import { useState } from "react";
import { Modal } from "./elements/modal/Modal";
import { ModalBox } from "./elements/modal/ModalBox";
import { ModalHeader } from "./elements/modal/ModalHeader";
import { MenuContainer } from "./elements/layout/MenuContainer";
import { MenuButtonContainer } from "./elements/layout/MenuButtonContainer";
import { PageHeader } from "./elements/layout/PageHeader";

export interface ISettingsMenuProps {
  theme: IGameTheme,
  setPage: Function,
  setTheme: Function,
  levelPacks: ILevelPack[]
};

const SettingsMenuTitle = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: min(8vw, 3.5em);
  margin-top: 0em;
  margin-bottom: 0em;
`;

const SettingsMenuSubTitle = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: min(6vw, 2.5em);
  margin-top: 0em;
  margin-bottom: 0em;
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
    localStorage.setItem('theme', index.toString());
  };

  const openClearSaveDataConfirmation = () => {
    setConfirmingSaveDelete(true);
  };

  const clearSaveData = () => {
    props.levelPacks.forEach(x => localStorage.removeItem('save-data'));
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
      <Modal internalTestId="SaveClearConfirmModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Clear All Save Data?</ModalHeader>
          <MenuButtonContainer>
            <GameButton theme={props.theme} onClick={clearSaveData} data-testid="ClearSaveDataYesButton">Yes</GameButton>
            <GameButton theme={props.theme} onClick={closeClearSaveDataConfirmation} data-testid="ClearSaveDataNoButton">No</GameButton>
          </MenuButtonContainer>
        </ModalBox>
      </Modal>
    );
  };

  return (
    <div data-testid="SettingsMenu">
      {confirmingSaveDelete && renderSaveClearConfirmModal()}
      <MenuContainer>
        <PageHeader>
          <SettingsMenuTitle theme={props.theme}>Settings</SettingsMenuTitle>
          <SettingsMenuSubTitle theme={props.theme}>Change Theme</SettingsMenuSubTitle>
        </PageHeader>
        <ScrollSelector theme={props.theme} items={themeNameList} itemClickHandler={clickOnTheme}/>
        <MenuButtonContainer>
          <GameButton theme={props.theme} onClick={openClearSaveDataConfirmation} data-testid="ClearSaveDataButton">Clear Save Data</GameButton>
          <GameButton theme={props.theme} onClick={goBackToMainMenu} data-testid="BackButton">Back</GameButton>
        </MenuButtonContainer>
      </MenuContainer>
    </div>
  )
};