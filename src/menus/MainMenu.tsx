import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './MainMenu.css';
import { Modal } from "./Modal";
import { GameTextField } from "./GameTextField";
import { useState } from "react";
import { ModalBox } from "./ModalBox";
import { GameFileInput } from "./GameFileInput";
import { ModalHeader } from "./ModalHeader";

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

const MainMenuDivider = styled.div`
  margin-top: 15px;
  padding-top: 15px;
`;

export const MainMenu = (props: IMainMenuProps) => {
  const [enteringEditor, setEnteringEditor] = useState(false);
  const [newLevelPackName, setNewLevelPackName] = useState("");

  const goToLevelPack = (index: number) => {
    props.setCurrentLevelPack(props.levelPacks[index]);
    props.setPage(AppPage.LevelSelectMenu);
  };

  const goToSettings = () => {
    props.setPage(AppPage.SettingsMenu);
  };

  const goToEditorStart = () => {
    setEnteringEditor(true);
  };

  const cancelEditorStart = () => {
    setEnteringEditor(false);
  };

  const onNewLevelPackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setNewLevelPackName(e.target.value);
  }

  const createNewLevelPackAndGoToEditorLevelSelect = () => {
    const newLevelPack: ILevelPack = {
      name: newLevelPackName,
      levels: []
    };

    props.setCurrentLevelPack(newLevelPack);

    props.setPage(AppPage.EditorLevelSelectMenu);
  };

  const levelPackNames = props.levelPacks.map(x => x.name);

  const renderEditorStartModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Edit Level Pack</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelPackNameChange}></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelPackName.length === 0} onClick={createNewLevelPackAndGoToEditorLevelSelect}>New</GameButton>
          <MainMenuDivider color={props.theme.potentialShapeLines}/>
          <GameFileInput theme={props.theme}>Load</GameFileInput>
          <MainMenuDivider color={props.theme.potentialShapeLines}/>
          <GameButton theme={props.theme} onClick={cancelEditorStart}>Cancel</GameButton>
        </ModalBox>
      </Modal>
    )
  }

  return (
    <div>
      {enteringEditor && renderEditorStartModal()}
      <div className="MainMenu">
        <MainMenuTitle color={props.theme.potentialShapeLines}>Flipxel</MainMenuTitle>
        <ScrollSelector theme={props.theme} items={levelPackNames} itemClickHandler={goToLevelPack}/>
        <div className="MainMenu-button-container">
          <GameButton theme={props.theme}>Load Pack</GameButton>
          <GameButton theme={props.theme} onClick={goToSettings}>Settings</GameButton>
          <GameButton theme={props.theme} onClick={goToEditorStart}>Editor</GameButton>
        </div>
      </div>
    </div>
  )
};