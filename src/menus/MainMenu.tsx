import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './MainMenu.css';
import { Modal } from "./Modal";
import { GameTextField } from "./GameTextField";
import { useEffect, useState } from "react";
import { ModalBox } from "./ModalBox";
import { GameFileInput } from "./GameFileInput";
import { ModalHeader } from "./ModalHeader";
import { MenuDivider } from "./MenuDivider";

export interface IMainMenuProps {
  theme: IGameTheme,
  setPage: Function,
  levelPacks: ILevelPack[],
  setLevelPacks: Function,
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
  const [enteringEditor, setEnteringEditor] = useState(false);
  const [newLevelPackName, setNewLevelPackName] = useState('');

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

  const onLoadLevelPack = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader();

      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target) {
          const fileText = e.target.result;

          if (typeof fileText === 'string') {
            const loadedLevelPack: ILevelPack = JSON.parse(fileText);

            const newLevelPacks = props.levelPacks.slice();
            newLevelPacks.push(loadedLevelPack);

            props.setLevelPacks(newLevelPacks);
          } else {
            console.error('Failed to load level pack');
          }
        } else {
          console.error('Failed to load level pack');
        }
      };
    }
  };

  const onLoadLevelPackForEditor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader();

      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target) {
          const fileText = e.target.result;

          if (typeof fileText === 'string') {
            const loadedLevelPack: ILevelPack = JSON.parse(fileText);

            props.setCurrentLevelPack(loadedLevelPack);
            props.setPage(AppPage.EditorLevelSelectMenu);
          } else {
            console.error('Failed to load level pack');
          }
        } else {
          console.error('Failed to load level pack');
        }
      };
    }
  };

  const levelPackNames = props.levelPacks.map(x => x.name);

  const renderEditorStartModal = () => {
    return (
      <Modal internalTestId="EditorStartModal">
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Edit Level Pack</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelPackNameChange} data-testid="EditorStartLevelPackNameInput"></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelPackName.length === 0} onClick={createNewLevelPackAndGoToEditorLevelSelect} data-testid="NewLevelPackButton">New</GameButton>
          <MenuDivider color={props.theme.potentialShapeLines}/>
          <GameFileInput theme={props.theme} onChange={onLoadLevelPackForEditor} internalTestId="LoadLevelPackToEditInput">Load</GameFileInput>
          <MenuDivider color={props.theme.potentialShapeLines}/>
          <GameButton theme={props.theme} onClick={cancelEditorStart} data-testid="CancelEditorStartButton">Cancel</GameButton>
        </ModalBox>
      </Modal>
    )
  }

  return (
    <div data-testid="MainMenu">
      {enteringEditor && renderEditorStartModal()}
      <div className="MainMenu">
        <MainMenuTitle color={props.theme.potentialShapeLines}>Flipxel</MainMenuTitle>
        <ScrollSelector theme={props.theme} items={levelPackNames} itemClickHandler={goToLevelPack}/>
        <div className="MainMenu-button-container">
          <GameFileInput theme={props.theme} onChange={onLoadLevelPack} internalTestId="LoadLevelPackInput">Load Pack</GameFileInput>
          <GameButton theme={props.theme} onClick={goToSettings} data-testid="SettingsButton">Settings</GameButton>
          <GameButton theme={props.theme} onClick={goToEditorStart} data-testid="EditorButton">Editor</GameButton>
        </div>
      </div>
    </div>
  )
};