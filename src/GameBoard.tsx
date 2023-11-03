import { Stage, Sprite, Graphics as GraphicsComp } from '@pixi/react';
import { Graphics, Rectangle } from 'pixi.js';
import { useCallback, useState } from 'react';

export interface IGameBoardProps {
  cellsWide: number,
  cellsHigh: number,
  boardGoal: boolean[],
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
  const [board, setBoard] = useState<boolean[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMouseIn, setIsMouseIn] = useState(false);

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
      // Setup Interaction
      g.hitArea = new Rectangle(0, 0, width, height);
      g.interactive = true;

      let mouseIn = false;

      g.on("mouseover", function(e) {
        mouseIn = true;
        setIsMouseIn(mouseIn);
      });
      
      g.on("mouseout", function(e) {
        mouseIn = false;
        setIsMouseIn(mouseIn);
      });
      
      g.on("mousemove", function(e) {
        if (mouseIn) {
          setCursorPosition({ 
            x: Math.floor(e.global.x / cellWidth), 
            y: Math.floor(e.global.y / cellHeight) 
          })
        }
      });

      // Render
      g.clear();

      // Draw background lines
      g.lineStyle(2, props.theme.backgroundLines, 1);

      for (let x = 0; x <= props.cellsWide; x++) {
        g.moveTo(x * cellWidth, 0);
        g.lineTo(x * cellWidth, height);
      }

      for (let y = 0; y <= props.cellsHigh; y++) {
        g.moveTo(0, y * cellHeight);
        g.lineTo(width, y * cellHeight);
      }

      // Draw state of each cell
      for (let i = 0; i < board.length; i++) {
        if (board[i]) {
          const x = i % props.cellsWide;
          const y = Math.floor(i / props.cellsWide);

          g.lineStyle(0);
          g.beginFill(props.theme.filledBox, 1);
          g.drawRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          g.endFill();
        }
      }

      // Draw goal of each cell
      for (let i = 0; i < props.boardGoal.length; i++) {
        if (props.boardGoal[i]) {
          const x = i % props.cellsWide;
          const y = Math.floor(i / props.cellsWide);

          g.lineStyle(4, props.theme.targetBoxLines, 1);
          g.drawRect((x * cellWidth) + 3, (y * cellHeight) + 3, cellWidth - 6, cellHeight - 6);
        }
      }

      // Draw cursor cells
      if (isMouseIn) {
        g.lineStyle(4, props.theme.potentialShapeLines, 1);
        g.drawRect((cursorPosition.x * cellWidth) + 8, (cursorPosition.y * cellHeight) + 8, cellWidth - 16, cellHeight - 16);
      }
    },
    [props, cursorPosition, isMouseIn],
  );

  return (
    <Stage {...stageProps}>
      <GraphicsComp draw={draw} />
    </Stage>
  );
};