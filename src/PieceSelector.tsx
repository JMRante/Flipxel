import './PieceSelector.css';
import { PieceButton } from "./PieceButton";

export interface IPieceSelectorProps {
  pieces: Array<boolean[]>,
  currentPieceIndex: number,
  setCurrentPieceIndex: Function
};

export const PieceSelector = (props: IPieceSelectorProps) => {
  const generatePieceButtons = () => {
    return props.pieces.map((x, i) => {
      const clickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.setCurrentPieceIndex(i);
      };
      return <PieceButton key={`PieceButton${i}`} piece={x} selected={i === props.currentPieceIndex} clickEvent={clickEvent}></PieceButton>
    });
  };

  return (
    <div className="PieceSelector">
      {generatePieceButtons()}
    </div>
  );
};