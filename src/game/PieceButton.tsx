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
  width: 1.6em;
  height: 1.6em;
  padding: 0em;
`;

const ButtonInnerCellUnfilled = styled.div<{ color?: string; }>`
  border-color: #${props => props.color};
  border-style: solid;
  border-width: 0.1em;
  box-sizing: border-box;
  width: 1.6em;
  height: 1.6em;
  padding: 0em;
`;

const ButtonInnerCellContainer = styled.div<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.backgroundLines};
  border: none;
  width: 8em;
  height: 8em;
  padding: 0em;
  margin: auto auto;
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
`;

const InnerPieceButton = styled.button<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.backgroundLines};
  border: none;
  padding: 0.25em;
  margin: 0.5em;
  cursor: pointer;

  &: hover {
    border-style: none;
    background-color: #${props => props.theme.potentialShapeLines};
  }

  &: disabled {
    opacity: 0.25;
    border-style: none;
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
      <ButtonInnerCellContainer theme={props.theme}>
        {generateCells()}
      </ButtonInnerCellContainer>
    </InnerPieceButton>
  )
};