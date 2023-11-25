import { Stage } from "@pixi/react";
import { GameBoard } from "./GameBoard";
import { EditorState, GameState, IPieceInstruction } from "./Game";
import { Color } from "pixi.js";
import { IGameTheme, ILevel } from "../App";

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
  setPieceFutureHistory: Function,
  nextPieceToPlay: IPieceInstruction | undefined,
  setNextPieceToPlay: Function,
  gameState: GameState,
  level: ILevel,
  editorState: EditorState,
  setIsEditorDirty: Function
};

export const GameWindow = (props: IGameWindowProps) => {

  const width = 800;
  const height = 800;

  const stageProps = {
    height,
    width,
    options: {
      backgroundColor: new Color(props.theme.backgroundBase).toNumber(),
      antialias: true,
    },
  };

  return (
    <div style={{cursor: props.currentPieceIndex !== undefined ? 'pointer' : 'default', width: `${width}px` , height: `${height}px`}}>
      <Stage {...stageProps}>
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
          setPieceFutureHistory={props.setPieceFutureHistory}
          nextPieceToPlay={props.nextPieceToPlay}
          setNextPieceToPlay={props.setNextPieceToPlay}
          gameState={props.gameState}
          level={props.level}
          editorState={props.editorState}
          setIsEditorDirty={props.setIsEditorDirty}
        />
      </Stage>
    </div>
  );
};