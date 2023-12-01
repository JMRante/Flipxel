import { PieceButton } from "./PieceButton";
import { IPieceInstruction } from './Game';
import { IGameTheme } from '../App';
import styled from 'styled-components';

export interface IPieceSelectorProps {
  theme: IGameTheme,
  pieces: Array<boolean[]>,
  currentPieceIndex: number,
  setCurrentPieceIndex: Function,
  playedPieces: IPieceInstruction[]
};

const PieceSelectorContainer = styled.div<{ theme?: IGameTheme; }>`
  width: 750px;
  height: 125px;
  display: flex;
  flex-wrap: no-wrap;
  overflow-x: auto;
  margin-top: 8px;
  margin-left: auto;
  margin-right: auto;

  scrollbar-width: thin;
  scrollbar-color: #${props => props.theme.backgroundBase} #${props => props.theme.filledBox};

  &:: -webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #${props => props.theme.filledBox};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #${props => props.theme.backgroundBase};
  }
`;

export const PieceSelector = (props: IPieceSelectorProps) => {
  const generatePieceButtons = () => {
    return props.pieces.map((piece, index) => {
      const clickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.setCurrentPieceIndex(index);
      };

      const pieceUsed = props.playedPieces.find(playedPiece => playedPiece.index === index) ? true : false;

      return <PieceButton theme={props.theme} key={`PieceButton${index}`} piece={piece} selected={!pieceUsed && index === props.currentPieceIndex} used={pieceUsed} clickEvent={clickEvent} internalTestId={`PieceButton${index}`}></PieceButton>
    });
  };

  return (
    <PieceSelectorContainer theme={props.theme}>
      {generatePieceButtons()}
    </PieceSelectorContainer>
  );
};