import { Graphics as GraphicsComp, useTick } from '@pixi/react';
import { FederatedPointerEvent, Graphics, Rectangle } from 'pixi.js';
import { useCallback, useRef, useState } from 'react';
import { EditorState, Game, GameState, IPieceInstruction } from './Game';
import { IGameTheme, ILevel } from '../App';

export interface IGameBoardProps {
  cellsWide: number,
  cellsHigh: number,
  board: boolean[],
  setBoard: Function,
  windowWidth: number,
  windowHeight: number,
  boardGoal: boolean[],
  setBoardGoal: Function,
  theme: IGameTheme,
  pieces: Array<boolean[]>,
  currentPieceIndex: number,
  setCurrentPieceIndex: Function,
  playedPieces: IPieceInstruction[],
  setPlayedPieces: Function
  setPieceFutureHistory: Function,
  nextPieceToPlay: IPieceInstruction | undefined,
  setNextPieceToPlay: Function,
  gameState: GameState,
  level: ILevel,
  editorState: EditorState
};

interface ICoordinate {
  x: number,
  y: number
};

function lerp(start: number, end: number, t: number){
  return (1 - t) * start + t * end;
};

export const GameBoard = (props: IGameBoardProps) =>
{
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMouseIn, setIsMouseIn] = useState(false);
  const isMouseDown = useRef(false);
  const [flipTimer, setFlipTimer] = useState(0);
  const [flipCoordinates, setFlipCoordinates] = useState<ICoordinate[]>([]);

  const cellWidth = props.windowWidth / props.cellsWide;
  const cellHeight = props.windowHeight / props.cellsHigh;

  const currentPiece = props.currentPieceIndex !== undefined ? props.pieces[props.currentPieceIndex] : undefined;

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
    if (isMouseIn && !isMouseDown.current) {
      if (props.editorState === EditorState.Test || props.gameState !== GameState.Editing) {
        if (flipTimer === 0 && currentPiece !== undefined) {
          props.setNextPieceToPlay({
            index: props.currentPieceIndex, 
            x: cursorPosition.x, 
            y: cursorPosition.y
          });
          props.setPieceFutureHistory([]);
        }
      } else {
        const cursorToCellIndex = cursorPosition.x + (cursorPosition.y * props.cellsWide);

        const modifiedBoardGoal = props.level.goal.slice();
        modifiedBoardGoal[cursorToCellIndex] = modifiedBoardGoal[cursorToCellIndex] === 0 ? 1 : 0;

        props.level.goal = modifiedBoardGoal;
        props.setBoardGoal(modifiedBoardGoal.map(x => x === 0 ? false : true));
      }

      isMouseDown.current = true;
    }
  };

  const mouseUp = (e: FederatedPointerEvent) => {
    if (isMouseDown) {
      isMouseDown.current = false;
    }
  };

  if (props.nextPieceToPlay !== undefined) {
    if (flipTimer !== 0) {
      props.setNextPieceToPlay(undefined);
    } else {
      const nextPiece = props.pieces[props.nextPieceToPlay.index];

      if (nextPiece !== undefined) {
        const modifiedBoard = props.board.slice();
        const newFlipCoordinates: ICoordinate[] = [];
  
        for (let cursorCellX = -2; cursorCellX <= 2; cursorCellX++) {
          for (let cursorCellY = -2; cursorCellY <= 2; cursorCellY++) {
            const pieceCursorCellX: number = cursorCellX + props.nextPieceToPlay.x;
            const pieceCursorCellY: number = cursorCellY + props.nextPieceToPlay.y;
  
            const currentPieceIndex = (cursorCellX + 2) + ((cursorCellY + 2) * 5);
  
            if (nextPiece[currentPieceIndex] 
              && pieceCursorCellX >= 0 
              && pieceCursorCellX < props.cellsWide 
              && pieceCursorCellY >= 0 
              && pieceCursorCellY < props.cellsHigh) {
              const cursorToCellIndex = pieceCursorCellX + (pieceCursorCellY * props.cellsWide);
              modifiedBoard[cursorToCellIndex] = !modifiedBoard[cursorToCellIndex];
  
              newFlipCoordinates.push({
                x: pieceCursorCellX, 
                y: pieceCursorCellY
              });
            }
          }
        }
  
        props.setBoard(modifiedBoard);
  
        setFlipTimer(flipTime);
  
        setFlipCoordinates(newFlipCoordinates);
  
        let newPlayedPieces = props.playedPieces.slice();

        if (isMouseDown.current) {
          newPlayedPieces.push(props.nextPieceToPlay);
          props.setPlayedPieces(newPlayedPieces);
        }

        props.setNextPieceToPlay(undefined);

        props.setCurrentPieceIndex(undefined);

        for (let i = 0; i < props.pieces.length; i++) {
          if (newPlayedPieces.find(x => x.index === i) === undefined) {
            props.setCurrentPieceIndex(i);
            break;
          }
        }
      }
    }
  }

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
      for (let i = 0; i < props.board.length; i++) {
        const x = i % props.cellsWide;
        const y = Math.floor(i / props.cellsWide);

        const isFlipping = flipCoordinates.find(a => { return a.x === x && a.y === y });

        const goalFilledDimension = cellWidth - 4;
        const notGoalFilledDimension = cellWidth - 12;
        const goalFilledXStart = (x * cellWidth) + 2;
        const notGoalFilledXStart = (x * cellWidth) + 6;
        const goalFilledYStart = (y * cellHeight) + 2;
        const notGoalFilledYStart = (y * cellHeight) + 6;

        const normalizedFlipTimer = props.board[i] ? 1 - (flipTimer / flipTime) : flipTimer / flipTime;

        const fillX = lerp((x * cellWidth) + (cellWidth / 2), props.boardGoal[i] ? goalFilledXStart : notGoalFilledXStart, isFlipping ? normalizedFlipTimer : (props.board[i] ? 1 : 0));
        const fillWidth = lerp(0, props.boardGoal[i] ? goalFilledDimension : notGoalFilledDimension, isFlipping ? normalizedFlipTimer : (props.board[i] ? 1 : 0));

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
      if (isMouseIn && currentPiece !== undefined && (props.gameState === GameState.Playing || props.editorState === EditorState.Test)) {
        for (let cursorCellX = -2; cursorCellX <= 2; cursorCellX++) {
          for (let cursorCellY = -2; cursorCellY <= 2; cursorCellY++) {
            const pieceCursorCellX = cursorCellX + cursorPosition.x;
            const pieceCursorCellY = cursorCellY + cursorPosition.y;

            const currentPieceIndex = (cursorCellX + 2) + ((cursorCellY + 2) * 5);
            
            if (currentPiece[currentPieceIndex] 
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
      
      // Draw cursor cell for adding goal in editor
      if (isMouseIn && props.gameState === GameState.Editing && props.editorState === EditorState.Edit) {
        g.lineStyle(4, props.theme.potentialShapeLines, 1);
        g.drawRect((cursorPosition.x * cellWidth) + 3, (cursorPosition.y * cellHeight) + 3, cellWidth - 6, cellHeight - 6);
      }
    },
    [props, cursorPosition, isMouseIn, cellWidth, cellHeight, flipTimer, flipCoordinates, currentPiece],
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