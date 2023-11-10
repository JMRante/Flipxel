import { IGameTheme } from './Game';
import './PieceButton.css'
import styled from 'styled-components'

export interface IPieceButtonProps {
  theme: IGameTheme,
  piece: boolean[],
  selected: boolean,
  used: boolean,
  clickEvent: React.MouseEventHandler<HTMLButtonElement>
};

const ButtonInnerCellFilled = styled.div<{ color?: string; }>`
  border: none;
  background-color: #${props => props.color};
  width: 20px;
  height: 20px;
  padding: 0px;
`;

const ButtonInnerCellUnfilled = styled.div<{ color?: string; }>`
  border-color: #${props => props.color};
  border-style: solid;
  border-width: 1px;
  width: 18px;
  height: 18px;
  padding: 0px;
`;

export const PieceButton = (props: IPieceButtonProps) => {
  const generateCells = () => {
    return props.piece.map((pieceCell, index) => {
      if (pieceCell) {
        if (props.selected) {
          return (<ButtonInnerCellFilled key={`PieceButtonCell${index}`} color={props.theme.potentialShapeLines}/>)
        } else {
          return (<ButtonInnerCellFilled key={`PieceButtonCell${index}`} color={props.theme.filledBox}/>)
        }
      } else {
        return (<ButtonInnerCellUnfilled key={`PieceButtonCell${index}`} color={props.theme.backgroundBase}/>)
      }
    });
  };

  return (
    <button onClick={props.clickEvent} className='PieceButton' disabled={props.used}>
      {generateCells()}
    </button>
  )
};