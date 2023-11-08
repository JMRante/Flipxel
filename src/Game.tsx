import { useState } from "react";
import { GameWindow } from "./GameWindow";
import { PieceSelector } from "./PieceSelector";

export const Game = () => {
  const [boardGoal, setBoardGoal] = useState([
    false, false, false, false, false,
    false, true, true, true, false,
    false, true, false, true, false,
    false, true, true, true, false,
    false, false, false, false, false,
  ]);

  const [pieces, setPieces] = useState([
    [
      false, false, false, false, false,
      false, false, true, false, false,
      false, true, true, true, false,
      false, false, true, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, true, true, false, false,
      false, true, true, true, false,
      false, false, true, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, true, false, false,
      false, true, true, true, false,
      false, false, true, true, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, true, false, false,
      false, false, true, true, false,
      false, false, true, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, true, false, false,
      false, true, true, false, false,
      false, false, true, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, true, false, false,
      false, false, true, false, false,
      false, true, true, true, false,
      false, false, true, false, false,
      false, false, false, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, true, false, false,
      false, true, true, true, false,
      false, false, true, false, false,
      false, true, true, false, false,
    ],
    [
      false, false, false, false, false,
      false, false, false, false, false,
      true, true, true, true, true,
      false, false, false, false, false,
      false, false, false, false, false,
    ],
  ]);

  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);

  return (
    <div>
      <GameWindow boardGoal={boardGoal} pieces={pieces} currentPieceIndex={currentPieceIndex}/>
      <PieceSelector pieces={pieces} currentPieceIndex={currentPieceIndex} setCurrentPieceIndex={setCurrentPieceIndex}/>
      <div>
        <button>Restart</button>
        <button>Menu</button>
      </div>
    </div>
  );
};