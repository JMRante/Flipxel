import { Stage } from "@pixi/react";
import { GameBoard, IGameTheme } from "./GameBoard";

export const GameWindow = () => {
  const defaultTheme: IGameTheme = {
    backgroundBase: 0x9eacbc,
    backgroundLines: 0x8697aa,
    targetBoxLines: 0x232b35,
    filledBox: 0x414e5e,
    potentialShapeLines: 0xdce2ef
  }

  const boardGoalTest = [
    false, false, false, false, false,
    false, true, true, true, false,
    false, true, false, true, false,
    false, true, true, true, false,
    false, false, false, false, false,
  ];

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
      <GameBoard cellsWide={cellsWide} cellsHigh={cellsHigh} windowWidth={width} windowHeight={height} boardGoal={boardGoalTest} theme={defaultTheme}/>
    </Stage>
  )
}