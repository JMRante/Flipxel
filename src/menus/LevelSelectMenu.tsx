import styled from "styled-components";
import { AppPage, IGameTheme, ILevel, ILevelPack, ILevelPackSaveData } from "../App";
import { GameButton } from "./elements/input/GameButton";
import { ScrollSelector } from "./elements/ScrollSelector";
import { useEffect, useState } from "react";
import { Modal } from "./elements/modal/Modal";
import { ModalBox } from "./elements/modal/ModalBox";
import { ModalHeader } from "./elements/modal/ModalHeader";
import { GameTextField } from "./elements/input/GameTextField";
import { MenuDivider } from "./elements/layout/MenuDivider";
import { MenuContainer } from "./elements/layout/MenuContainer";
import { MenuButtonContainer } from "./elements/layout/MenuButtonContainer";

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

const LevelSelectTitle = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 64px;
  margin-top: 20px;
  margin-bottom: 5px;
`;

const LevelSelectPackTitle = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 40px;
  margin-top: 5px;
  margin-bottom: 26px;
`;

export const MIN_DIMENSIONS = 5;
export const MAX_DIMENSIONS = 20;

export const LevelSelectMenu = (props: ILevelSelectMenuProps) => {
  const [addingNewLevel, setAddingNewLevel] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelDimensions, setNewLevelDimensions] = useState('5');
  const [confirmingNoSave, setConfirmingNoSave] = useState(false);
  const [levelPackSaveData, setLevelPackSaveData] = useState<boolean[]>([])

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

  useEffect(() => {
    if (!props.isEditorMode) {
      const saveData = localStorage.getItem(`${props.levelPack.name}-save-data`);

      if (saveData) {
        const parsedSaveData: ILevelPackSaveData = JSON.parse(atob(saveData));
        setLevelPackSaveData(parsedSaveData.completion.map(x => x === 1 ? true : false));
      } else {
        const newSaveData: ILevelPackSaveData = {
          completion: Array(props.levelPack.levels.length).fill(0)
        };
        setLevelPackSaveData(newSaveData.completion.map(x => x === 1 ? true : false));
        localStorage.setItem(`${props.levelPack.name}-save-data`, btoa(JSON.stringify(newSaveData)));
      }
    }
  }, [props])
  
  const renderAddingNewLevelModal = () => {
    return (
      <Modal internalTestId="AddingNewLevelModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Add New Level</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelNameChange} data-testid="NewLevelNameInput"></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelName.length === 0 || !validateNewDimensions(newLevelDimensions)} onClick={createNewLevel} data-testid="AddNewLevelButton">New</GameButton>
          <MenuDivider/>
          <GameTextField theme={props.theme} type="text" value={newLevelDimensions} onChange={onNewLevelDimensionsChange} data-testid="NewLevelSizeInput"></GameTextField>
          <MenuDivider/>
          <GameButton theme={props.theme} onClick={cancelAddNewLevel} data-testid="AddNewLevelCancelButton">Cancel</GameButton>
        </ModalBox>
      </Modal>
    )
  }

  const renderNoSaveConfirmModal = () => {
    return (
      <Modal internalTestId="NoSaveConfirmModal">
        <ModalBox theme={props.theme}>
          <ModalHeader theme={props.theme}>Leave Without Saving?</ModalHeader>
          <GameButton theme={props.theme} onClick={goBackToMainMenu} data-testid="NoSaveConfirmYesButton">Yes</GameButton>
          <GameButton theme={props.theme} onClick={closeNoSaveConfirmModal} data-testid="NoSaveConfirmNoButton">No</GameButton>
        </ModalBox>
      </Modal>
    );
  };

  const levelNames = props.levelPack.levels.map(x => x.name);

  return (
    <div data-testid="LevelSelectMenu">
      {addingNewLevel && renderAddingNewLevelModal()}
      {confirmingNoSave && renderNoSaveConfirmModal()}
      <MenuContainer>
        <LevelSelectTitle theme={props.theme}>Level Select</LevelSelectTitle>
        <LevelSelectPackTitle theme={props.theme} data-testid="LevelSelectPackTitle">{props.levelPack.name}</LevelSelectPackTitle>
        <ScrollSelector theme={props.theme} items={levelNames} itemsStatus={levelPackSaveData.length > 0 ? levelPackSaveData : undefined} itemClickHandler={clickOnLevel}/>
        <MenuButtonContainer>
          {props.isEditorMode && <GameButton theme={props.theme} onClick={goToAddNewLevelModal} data-testid="AddButton">Add</GameButton>}
          {props.isEditorMode && <GameButton theme={props.theme} onClick={saveLevelPack} data-testid="SaveButton">Save</GameButton>}
          <GameButton theme={props.theme} onClick={props.isEditorMode && props.isEditorDirty ? openNoSaveConfirmModal : goBackToMainMenu} data-testid="BackButton">Back</GameButton>
        </MenuButtonContainer>
      </MenuContainer>
    </div>
  )
};