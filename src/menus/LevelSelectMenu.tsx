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
  isEditorMode: boolean
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
  const [addingNewLevel, setAddingNewLevel] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');

  const clickOnLevel = (index: number) => {
    props.setCurrentLevel(props.levelPack.levels[index]);
    props.setPage(AppPage.Game);
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

  const createNewLevel = () => {
    const newLevel: ILevel = {
      name: newLevelName,
      dimension: 5,
      goal: [],
      pieces: []
    };

    props.levelPack.levels.push(newLevel);

    props.setCurrentLevelPack(props.levelPack);

    setNewLevelName('');
    setAddingNewLevel(false);
  };

  const cancelAddNewLevel = () => {
    setNewLevelName('');
    setAddingNewLevel(false);
  };

  const renderAddingNewLevelModal = () => {
    return (
      <Modal>
        <ModalBox color={props.theme.trueBackground}>
          <ModalHeader color={props.theme.potentialShapeLines}>Add New Level</ModalHeader>
          <GameTextField theme={props.theme} type="text" onChange={onNewLevelNameChange}></GameTextField>
          <GameButton theme={props.theme} disabled={newLevelName.length === 0} onClick={createNewLevel}>New</GameButton>
          <MenuDivider color={props.theme.potentialShapeLines}/>
          <GameButton theme={props.theme} onClick={cancelAddNewLevel}>Cancel</GameButton>
        </ModalBox>
      </Modal>
    )
  }

  const levelNames = props.levelPack.levels.map(x => x.name);

  return (
    <div>
      {addingNewLevel && renderAddingNewLevelModal()}
      <div className="LevelSelectMenu">
        <LevelSelectTitle color={props.theme.potentialShapeLines}>Level Select</LevelSelectTitle>
        <LevelSelectPackTitle color={props.theme.potentialShapeLines}>{props.levelPack.name}</LevelSelectPackTitle>
        <ScrollSelector theme={props.theme} items={levelNames} itemClickHandler={clickOnLevel}/>
        <div className="LevelSelectMenu-button-container">
          {props.isEditorMode && <GameButton theme={props.theme} onClick={goToAddNewLevelModal}>Add</GameButton>}
          <GameButton theme={props.theme} onClick={goBackToMainMenu}>Back</GameButton>
        </div>
      </div>
    </div>
  )
};