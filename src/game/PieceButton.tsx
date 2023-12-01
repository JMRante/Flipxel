import { IGameTheme } from '../App';
import styled from 'styled-components'

export interface IPieceButtonProps {
  theme: IGameTheme,
  piece: boolean[],
  selected: boolean,
  used: boolean,
  clickEvent: React.MouseEventHandler<HTMLButtonElement>,
  internalTestId: string
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

const InnerPieceButton = styled.button<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.backgroundLines};
  border: none;
  display: flex;
  flex-wrap: wrap;
  width: 104px;
  height: 104px;
  padding: 2px;
  margin: 5px;
  cursor: pointer;
  flex: 0 0 auto;

  &: hover {
    border-style: solid;
    border-color: #${props => props.theme.potentialShapeLines};
    border-width: 2px;
    padding: 0px;
  }

  &: disabled {
    opacity: 0.25;
    border-style: none;
    padding: 2px;
    cursor: default;
  }
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
    <InnerPieceButton theme={props.theme} onClick={props.clickEvent} disabled={props.used} data-testid={props.internalTestId}>
      {generateCells()}
    </InnerPieceButton>
  )
};