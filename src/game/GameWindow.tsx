import { Stage } from "@pixi/react";
import { GameBoard } from "./GameBoard";
import { EditorState, GameState, IPieceInstruction } from "./Game";
import { Color } from "pixi.js";
import { IGameTheme, ILevel } from "../App";
import styled from "styled-components";
import { useLayoutEffect, useState } from "react";

export interface IGameWindowProps {
  theme: IGameTheme,
  cellsWide: number,
  cellsHigh: number,
  board: boolean[],
  setBoard: Function,
  boardGoal: boolean[],
  setBoardGoal: Function,
  pieces: Array<boolean[]>,
  currentPieceIndex: number,
  setCurrentPieceIndex: Function,
  playedPieces: IPieceInstruction[],
  setPlayedPieces: Function,
  pieceFutureHistory: IPieceInstruction[],
  setPieceFutureHistory: Function,
  gameState: GameState,
  level: ILevel,
  editorState: EditorState,
  setIsEditorDirty: Function,
  undoTriggered: boolean,
  setUndoTriggered: Function,
  redoTriggered: boolean
  setRedoTriggered: Function,
};

const GameWindowContainer = styled.div<{ currentpieceindex: number | undefined, height: number, width: number }>`
  cursor: ${props => props.currentpieceindex !== undefined ? 'pointer' : 'default'}
  width: ${props => props.width};
  height: ${props => props.height};
`;

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => {
      const finalDimensions = Math.min(800, window.innerWidth - (window.innerWidth / 10))
      setSize([finalDimensions, finalDimensions]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

export const GameWindow = (props: IGameWindowProps) => {
  const [width, height] = useWindowSize();

  const stageProps = {
    height,
    width,
    options: {
      backgroundColor: new Color(props.theme.backgroundBase).toNumber(),
      antialias: true,
    },
  };

  return (
    <GameWindowContainer currentpieceindex={props.currentPieceIndex} width={width} height={height}>
      <Stage {...stageProps} style={{WebkitTapHighlightColor: 'transparent'}}>
        <GameBoard 
          cellsWide={props.cellsWide} 
          cellsHigh={props.cellsHigh} 
          board={props.board} 
          setBoard={props.setBoard} 
          windowWidth={width} 
          windowHeight={height} 
          boardGoal={props.boardGoal}
          setBoardGoal={props.setBoardGoal}
          theme={props.theme}
          pieces={props.pieces}
          currentPieceIndex={props.currentPieceIndex}
          setCurrentPieceIndex={props.setCurrentPieceIndex}
          playedPieces={props.playedPieces}
          setPlayedPieces={props.setPlayedPieces}
          pieceFutureHistory={props.pieceFutureHistory}
          setPieceFutureHistory={props.setPieceFutureHistory}
          gameState={props.gameState}
          level={props.level}
          editorState={props.editorState}
          setIsEditorDirty={props.setIsEditorDirty}
          undoTriggered={props.undoTriggered}
          setUndoTriggered={props.setUndoTriggered}
          redoTriggered={props.redoTriggered}
          setRedoTriggered={props.setRedoTriggered}
        />
      </Stage>
    </GameWindowContainer>
  );
};