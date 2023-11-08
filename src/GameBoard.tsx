import { Graphics as GraphicsComp, useTick } from '@pixi/react';
import { FederatedPointerEvent, Graphics, Rectangle } from 'pixi.js';
import { useCallback, useRef, useState } from 'react';

export interface IGameBoardProps {
  cellsWide: number,
  cellsHigh: number,
  windowWidth: number,
  windowHeight: number,
  boardGoal: boolean[],
  theme: IGameTheme,
  currentPiece: boolean[]
};

export interface IGameTheme {
  backgroundBase: number,
  backgroundLines: number,
  targetBoxLines: number,
  filledBox: number,
  potentialShapeLines: number
};

class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
};

function lerp(start: number, end: number, t: number){
  return (1 - t) * start + t * end;
};

export const GameBoard = (props: IGameBoardProps) =>
{
  const [board, setBoard] = useState<boolean[]>(Array(props.cellsWide * props.cellsHigh).fill(false));
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMouseIn, setIsMouseIn] = useState(false);
  const isMouseDown = useRef(false);
  const [flipTimer, setFlipTimer] = useState(0);
  const [flipCoordinates, setFlipCoordinates] = useState<Coordinate[]>([]);

  const cellWidth = props.windowWidth / props.cellsWide;
  const cellHeight = props.windowHeight / props.cellsHigh;

  const flipTime = 10;

  const mouseOver = (e: FederatedPointerEvent) => {
    setIsMouseIn(true);
  };

  const mouseOut = (e: FederatedPointerEvent) => {
    setIsMouseIn(false);
  };

  const mouseMove = (e: FederatedPointerEvent) => {
    if (isMouseIn) {
      setCursorPosition({ 
        x: Math.floor(e.global.x / cellWidth), 
        y: Math.floor(e.global.y / cellHeight) 
      });
    }
  };

  const mouseDown = (e: FederatedPointerEvent) => {
    if (isMouseIn && !isMouseDown.current && flipTimer === 0) {
      const modifiedBoard = board.slice();
      const newFlipCoordinates: Coordinate[] = [];

      for (let cursorCellX = -2; cursorCellX <= 2; cursorCellX++) {
        for (let cursorCellY = -2; cursorCellY <= 2; cursorCellY++) {
          const pieceCursorCellX = cursorCellX + cursorPosition.x;
          const pieceCursorCellY = cursorCellY + cursorPosition.y;

          const currentPieceIndex = (cursorCellX + 2) + ((cursorCellY + 2) * 5);

          if (props.currentPiece[currentPieceIndex] 
            && pieceCursorCellX >= 0 
            && pieceCursorCellX < props.cellsWide 
            && pieceCursorCellY >= 0 
            && pieceCursorCellY < props.cellsHigh) {
            const cursorToCellIndex = pieceCursorCellX + (pieceCursorCellY * props.cellsWide);
            modifiedBoard[cursorToCellIndex] = !modifiedBoard[cursorToCellIndex];

            newFlipCoordinates.push(new Coordinate(pieceCursorCellX, pieceCursorCellY));
          }
        }
      }

      setBoard(modifiedBoard);

      setFlipTimer(flipTime);

      setFlipCoordinates(newFlipCoordinates);

      isMouseDown.current = true;
    }
  };

  const mouseUp = (e: FederatedPointerEvent) => {
    if (isMouseDown) {
      isMouseDown.current = false;
    }
  };

  useTick(delta => {
    if (flipTimer > 0) {
      const newFlipTimer = flipTimer - delta;

      if (newFlipTimer <= 0) {
        setFlipTimer(0);
        setFlipCoordinates([]);
      } else {
        setFlipTimer(newFlipTimer);
      }
    }
  });

  const draw = useCallback(
    (g: Graphics) => {
      // Render
      g.clear();

      // Draw background lines
      g.lineStyle(2, props.theme.backgroundLines, 1);

      for (let x = 0; x <= props.cellsWide; x++) {
        g.moveTo(x * cellWidth, 0);
        g.lineTo(x * cellWidth, props.windowHeight);
      }

      for (let y = 0; y <= props.cellsHigh; y++) {
        g.moveTo(0, y * cellHeight);
        g.lineTo(props.windowWidth, y * cellHeight);
      }

      // Draw state of each cell + flipping animation
      for (let i = 0; i < board.length; i++) {
        const x = i % props.cellsWide;
        const y = Math.floor(i / props.cellsWide);

        const isFlipping = flipCoordinates.find(a => { return a.x === x && a.y === y });

        const goalFilledDimension = cellWidth - 4;
        const notGoalFilledDimension = cellWidth - 12;
        const goalFilledXStart = (x * cellWidth) + 2;
        const notGoalFilledXStart = (x * cellWidth) + 6;
        const goalFilledYStart = (y * cellHeight) + 2;
        const notGoalFilledYStart = (y * cellHeight) + 6;

        const normalizedFlipTimer = board[i] ? 1 - (flipTimer / flipTime) : flipTimer / flipTime;

        const fillX = lerp((x * cellWidth) + (cellWidth / 2), props.boardGoal[i] ? goalFilledXStart : notGoalFilledXStart, isFlipping ? normalizedFlipTimer : (board[i] ? 1 : 0));
        const fillWidth = lerp(0, props.boardGoal[i] ? goalFilledDimension : notGoalFilledDimension, isFlipping ? normalizedFlipTimer : (board[i] ? 1 : 0));

        g.lineStyle(0);
        g.beginFill(props.theme.filledBox, 1);
        g.drawRect(fillX, props.boardGoal[i] ? goalFilledYStart : notGoalFilledYStart, fillWidth, props.boardGoal[i] ? goalFilledDimension : notGoalFilledDimension);
        g.endFill();
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
        for (let cursorCellX = -2; cursorCellX <= 2; cursorCellX++) {
          for (let cursorCellY = -2; cursorCellY <= 2; cursorCellY++) {
            const pieceCursorCellX = cursorCellX + cursorPosition.x;
            const pieceCursorCellY = cursorCellY + cursorPosition.y;

            const currentPieceIndex = (cursorCellX + 2) + ((cursorCellY + 2) * 5);
            
            if (props.currentPiece[currentPieceIndex] 
              && pieceCursorCellX >= 0 
              && pieceCursorCellX < props.cellsWide 
              && pieceCursorCellY >= 0 
              && pieceCursorCellY < props.cellsHigh) {
              g.lineStyle(4, props.theme.potentialShapeLines, 1);
              g.drawRect((pieceCursorCellX * cellWidth) + 8, (pieceCursorCellY * cellHeight) + 8, cellWidth - 16, cellHeight - 16);
            }
          }
        }
      }
    },
    [props, cursorPosition, isMouseIn, board, cellWidth, cellHeight, flipTimer, flipCoordinates],
  );

  return (
    <GraphicsComp 
      draw={draw} 
      eventMode={'static'}
      hitArea={new Rectangle(0, 0, props.windowWidth, props.windowHeight)}
      mouseover={mouseOver}
      mouseout={mouseOut}
      mousemove={mouseMove}
      mousedown={mouseDown}
      mouseup={mouseUp}
    />
  );
};