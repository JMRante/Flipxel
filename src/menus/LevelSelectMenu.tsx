import styled from "styled-components";
import { AppPage, IGameTheme, ILevel, ILevelPack } from "../App";
import { GameButton } from "./GameButton";
import { ScrollSelector } from "./ScrollSelector";
import './LevelSelectMenu.css';
import { useState } from "react";
import { Modal } from "./Modal";
import { ModalBox } from "./ModalBox";
import { ModalHeader } from "./ModalHeader";
import { GameTextField } from "./GameTextField";
import { MenuDivider } from "./MenuDivider";

export interface ILevelSelectMenuProps {
  theme: IGameTheme,
  setPage: Function,
  levelPack: ILevelPack,
  setCurrentLevelPack: Function,
  setCurrentLevel: Function,
  isEditorMode: boolean,
  isEditorDirty: boolean,
  setIsEditorDirty: Function
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

export const MIN_DIMENSIONS = 5;
export const MAX_DIMENSIONS = 30;

export const LevelSelectMenu = (props: ILevelSelectMenuProps) => {
  const [addingNewLevel, setAddingNewLevel] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelDimensions, setNewLevelDimensions] = useState('5');
  const [confirmingNoSave, setConfirmingNoSave] = useState(false);

  const clickOnLevel = (index: number) => {
    props.setCurrentLevel(props.levelPack.levels[index]);

    if (props.isEditorMode) {
      props.setPage(AppPage.Editor);
    } else {
      props.setPage(AppPage.Game);
    }
  };

  const goBackToMainMenu = () => {
    props.setPage(AppPage.MainMenu);
  };

  const goToAddNewLevelModal = () => {
    setAddingNewLevel(true);
  };

  const onNewLevelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLevelName(e.target.value);
  };

  const onNewLevelDimensionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLevelDimensions(e.target.value);
  };

  const validateNewDimensions = (dimensions: string) => {
    const parsedDimensions = parseInt(dimensions);
    if (parsedDimensions && parsedDimensions >= MIN_DIMENSIONS && parsedDimensions <= MAX_DIMENSIONS) {
      return true;
    } else {
      return false;
    }
  };

  const createNewLevel = () => {
    const parsedDimensions = parseInt(newLevelDimensions);

    const newLevel: ILevel = {
      name: newLevelName,
      dimension: parsedDimensions,
      goal: Array(parsedDimensions * parsedDimensions).fill(0),
      pieces: []
    };

    props.levelPack.levels.push(newLevel);

    props.setCurrentLevelPack(props.levelPack);

    setNewLevelName('');
    setAddingNewLevel(false);
    props.setIsEditorDirty(true);
  };

  const cancelAddNewLevel = () => {
    setNewLevelName('');
    setAddingNewLevel(false);
  };

  const saveLevelPack = () => {
      let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.levelPack));
      var virtualLink = document.createElement('a');
      virtualLink.href = data;
      virtualLink.download = props.levelPack.name + ".json";
      document.body.appendChild(virtualLink);
      virtualLink.click();
      virtualLink.remove();
      props.setIsEditorDirty(false);
  }

  const openNoSaveConfirmModal = () => {
    setConfirmingNoSave(true);
  };

  const closeNoSaveConfirmModal = () => {
    setConfirmingNoSave(false);
  };

  const renderAddingNewLevelModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Add New Level</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelNameChange}></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelName.length === 0 || !validateNewDimensions(newLevelDimensions)} onClick={createNewLevel}>New</GameButton>
          <MenuDivider color={props.theme.potentialShapeLines}/>
          <GameTextField theme={props.theme} type="text" value={newLevelDimensions} onChange={onNewLevelDimensionsChange}></GameTextField>
          <MenuDivider color={props.theme.potentialShapeLines}/>
          <GameButton theme={props.theme} onClick={cancelAddNewLevel}>Cancel</GameButton>
        </ModalBox>
      </Modal>
    )
  }

  const renderNoSaveConfirmModal = () => {
    return (
      <Modal>
      <ModalBox color={props.theme.trueBackground}>
        <ModalHeader color={props.theme.potentialShapeLines}>Leave Without Saving?</ModalHeader>
        <GameButton theme={props.theme} onClick={goBackToMainMenu}>Yes</GameButton>
        <GameButton theme={props.theme} onClick={closeNoSaveConfirmModal}>No</GameButton>
      </ModalBox>
    </Modal>
    );
  };

  const levelNames = props.levelPack.levels.map(x => x.name);

  return (
    <div>
      {addingNewLevel && renderAddingNewLevelModal()}
      {confirmingNoSave && renderNoSaveConfirmModal()}
      <div className="LevelSelectMenu">
        <LevelSelectTitle color={props.theme.potentialShapeLines}>Level Select</LevelSelectTitle>
        <LevelSelectPackTitle color={props.theme.potentialShapeLines}>{props.levelPack.name}</LevelSelectPackTitle>
        <ScrollSelector theme={props.theme} items={levelNames} itemClickHandler={clickOnLevel}/>
        <div className="LevelSelectMenu-button-container">
          {props.isEditorMode && <GameButton theme={props.theme} onClick={goToAddNewLevelModal}>Add</GameButton>}
          {props.isEditorMode && <GameButton theme={props.theme} onClick={saveLevelPack}>Save</GameButton>}
          <GameButton theme={props.theme} onClick={props.isEditorDirty ? openNoSaveConfirmModal : goBackToMainMenu}>Back</GameButton>
        </div>
      </div>
    </div>
  )
};