import { Stage, Sprite, Graphics as GraphicsComp } from '@pixi/react';
import { Graphics } from 'pixi.js';
import { useCallback } from 'react';

export interface IGameBoardProps {
  cellsWide: number,
  cellsHigh: number,
  theme: IGameBoardTheme
}

export interface IGameBoardTheme {
  backgroundBase: number,
  backgroundLines: number,
  targetBoxLines: number,
  filledBox: number,
  potentialShapeLines: number
}

export const GameBoard = (props: IGameBoardProps) =>
{
  const width = 800;
  const height = 800;
  const stageProps = {
    height,
    width,
    options: {
      backgroundColor: props.theme.backgroundBase,
      antialias: true,
    },
  };

  const cellWidth = width / props.cellsWide;
  const cellHeight = height / props.cellsHigh;

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      g.lineStyle(2, props.theme.backgroundLines, 1);

      for (let x = 0; x <= props.cellsWide; x++) {
        g.moveTo(x * cellWidth, 0);
        g.lineTo(x * cellWidth, height);
      }

      for (let y = 0; y <= props.cellsHigh; y++) {
        g.moveTo(0, y * cellHeight);
        g.lineTo(width, y * cellHeight);
      }

      g.lineStyle(0);
      g.beginFill(props.theme.filledBox, 1);
      g.drawRect((3 * cellWidth) + 4, (4 * cellHeight) + 4, cellWidth - 8, cellHeight - 8);
      g.endFill();

      g.lineStyle(0);
      g.beginFill(props.theme.filledBox, 1);
      g.drawRect((5 * cellWidth) + 4, (2 * cellHeight) + 4, cellWidth - 8, cellHeight - 8);
      g.endFill();

      g.lineStyle(3, props.theme.targetBoxLines, 1);
      g.drawRect(2 * cellWidth, 4 * cellHeight, cellWidth, cellHeight);

      g.lineStyle(0);
      g.beginFill(props.theme.filledBox, 1);
      g.drawRect(4 * cellWidth, 4 * cellHeight, cellWidth, cellHeight);
      g.endFill();

      g.lineStyle(3, props.theme.targetBoxLines, 1);
      g.drawRect(4 * cellWidth, 4 * cellHeight, cellWidth, cellHeight);

      g.lineStyle(0);
      g.beginFill(props.theme.filledBox, 1);
      g.drawRect(5 * cellWidth, 4 * cellHeight, cellWidth, cellHeight);
      g.endFill();

      g.lineStyle(3, props.theme.targetBoxLines, 1);
      g.drawRect(5 * cellWidth, 4 * cellHeight, cellWidth, cellHeight);

      g.lineStyle(3, props.theme.targetBoxLines, 1);
      g.drawRect(5 * cellWidth, 3 * cellHeight, cellWidth, cellHeight);

      g.lineStyle(3, props.theme.potentialShapeLines, 1);
      g.drawRect((5 * cellWidth) + 5, (1 * cellHeight) + 5, cellWidth - 10, cellHeight - 10);
      g.drawRect((5 * cellWidth) + 5, (2 * cellHeight) + 5, cellWidth - 10, cellHeight - 10);
      g.drawRect((5 * cellWidth) + 5, (3 * cellHeight) + 5, cellWidth - 10, cellHeight - 10);
      g.drawRect((5 * cellWidth) + 5, (4 * cellHeight) + 5, cellWidth - 10, cellHeight - 10);
    },
    [props],
  );

  return (
    <Stage {...stageProps}>
      <GraphicsComp draw={draw} />
    </Stage>
  );
};