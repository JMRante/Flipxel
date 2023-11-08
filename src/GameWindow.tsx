import { Stage } from "@pixi/react";
import { GameBoard, IGameTheme } from "./GameBoard";
import { useState } from "react";

export interface IGameWindowProps {
  boardGoal: boolean[],
  pieces: Array<boolean[]>,
  currentPieceIndex: number
};

export const GameWindow = (props: IGameWindowProps) => {
  const defaultTheme: IGameTheme = {
    backgroundBase: 0x9eacbc,
    backgroundLines: 0x8697aa,
    targetBoxLines: 0x232b35,
    filledBox: 0x414e5e,
    potentialShapeLines: 0xdce2ef
  }

  const width = 800;
  const height = 800;

  const cellsWide = 5;
  const cellsHigh = 5;

  const stageProps = {
    height,
    width,
    options: {
      backgroundColor: defaultTheme.backgroundBase,
      antialias: true,
    },
  };

  return (
    <Stage {...stageProps}>
      <GameBoard cellsWide={cellsWide} cellsHigh={cellsHigh} windowWidth={width} windowHeight={height} boardGoal={props.boardGoal} currentPiece={props.pieces[props.currentPieceIndex]} theme={defaultTheme}/>
    </Stage>
  );
}