import { PieceButton } from "./PieceButton";

export const PieceSelector = () => {
  const pieceTest = [
    false, false, false, false, false,
    false, false, true, false, false,
    false, true, true, true, false,
    false, false, true, false, false,
    false, false, false, false, false,
  ];

  return (
    <PieceButton piece={pieceTest}></PieceButton>
  );
};