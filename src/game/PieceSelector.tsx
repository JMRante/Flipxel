import './PieceSelector.css';
import { PieceButton } from "./PieceButton";
import { IPieceInstruction } from './Game';
import { IGameTheme } from '../App';

export interface IPieceSelectorProps {
  theme: IGameTheme,
  pieces: Array<boolean[]>,
  currentPieceIndex: number,
  setCurrentPieceIndex: Function,
  playedPieces: IPieceInstruction[]
};

export const PieceSelector = (props: IPieceSelectorProps) => {
  const generatePieceButtons = () => {
    return props.pieces.map((piece, index) => {
      const clickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.setCurrentPieceIndex(index);
      };

      const pieceUsed = props.playedPieces.find(playedPiece => playedPiece.index === index) ? true : false;

      return <PieceButton theme={props.theme} key={`PieceButton${index}`} piece={piece} selected={!pieceUsed && index === props.currentPieceIndex} used={pieceUsed} clickEvent={clickEvent}></PieceButton>
    });
  };

  return (
    <div className="PieceSelector">
      {generatePieceButtons()}
    </div>
  );
};