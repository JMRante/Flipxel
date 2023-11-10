import { Stage } from "@pixi/react";
import { GameBoard } from "./GameBoard";
import { IGameTheme, IPieceInstruction } from "./Game";
import { Color } from "pixi.js";

export interface IGameWindowProps {
  theme: IGameTheme,
  cellsWide: number,
  cellsHigh: number,
  board: boolean[],
  setBoard: Function,
  boardGoal: boolean[],
  pieces: Array<boolean[]>,
  currentPieceIndex: number,
  playedPieces: IPieceInstruction[],
  setPlayedPieces: Function,
  setPieceFutureHistory: Function,
  nextPieceToPlay: IPieceInstruction | undefined,
  setNextPieceToPlay: Function
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
          theme={props.theme}
          pieces={props.pieces}
          currentPieceIndex={props.currentPieceIndex}
          playedPieces={props.playedPieces}
          setPlayedPieces={props.setPlayedPieces}
          setPieceFutureHistory={props.setPieceFutureHistory}
          nextPieceToPlay={props.nextPieceToPlay}
          setNextPieceToPlay={props.setNextPieceToPlay}
        />
      </Stage>
    </div>
  );
}