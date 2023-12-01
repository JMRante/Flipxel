import styled from "styled-components";
import { AppPage, IGameTheme, ILevelPack } from "../App";
import { GameButton } from "./elements/input/GameButton";
import { ScrollSelector } from "./elements/ScrollSelector";
import { Modal } from "./elements/modal/Modal";
import { GameTextField } from "./elements/input/GameTextField";
import { useState } from "react";
import { ModalBox } from "./elements/modal/ModalBox";
import { GameFileInput } from "./elements/input/GameFileInput";
import { ModalHeader } from "./elements/modal/ModalHeader";
import { MenuDivider } from "./elements/layout/MenuDivider";
import { MenuContainer } from "./elements/layout/MenuContainer";
import { MenuButtonContainer } from "./elements/layout/MenuButtonContainer";

export interface IMainMenuProps {
  theme: IGameTheme,
  setPage: Function,
  levelPacks: ILevelPack[],
  setLevelPacks: Function,
  setCurrentLevelPack: Function
};

const MainMenuTitle = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
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
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Edit Pack</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelPackNameChange} data-testid="EditorStartLevelPackNameInput"></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelPackName.length === 0} onClick={createNewLevelPackAndGoToEditorLevelSelect} data-testid="NewLevelPackButton">New</GameButton>
          <MenuDivider/>
          <GameFileInput theme={props.theme} onChange={onLoadLevelPackForEditor} internalTestId="LoadLevelPackToEditInput">Load</GameFileInput>
          <MenuDivider/>
          <GameButton theme={props.theme} onClick={cancelEditorStart} data-testid="CancelEditorStartButton">Cancel</GameButton>
        </ModalBox>
      </Modal>
    )
  }

  return (
    <div data-testid="MainMenu">
      {enteringEditor && renderEditorStartModal()}
      <MenuContainer>
        <MainMenuTitle theme={props.theme}>Flipxel</MainMenuTitle>
        <ScrollSelector theme={props.theme} items={levelPackNames} itemClickHandler={goToLevelPack}/>
        <MenuButtonContainer>
          <GameFileInput theme={props.theme} onChange={onLoadLevelPack} internalTestId="LoadLevelPackInput">Load Pack</GameFileInput>
          <GameButton theme={props.theme} onClick={goToSettings} data-testid="SettingsButton">Settings</GameButton>
          <GameButton theme={props.theme} onClick={goToEditorStart} data-testid="EditorButton">Editor</GameButton>
        </MenuButtonContainer>
      </MenuContainer>
    </div>
  )
};