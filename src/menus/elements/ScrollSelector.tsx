import styled from "styled-components";
import { IGameTheme } from "../../App";

export interface IScrollSelectorProps {
  theme: IGameTheme,
  items: string[],
  itemsStatus?: boolean[],
  itemClickHandler: (index: number) => void
};

const ScrollSelectorBox = styled.div<{ theme?: IGameTheme; }>`
  border: none;
  background-color: #${props => props.theme.filledBox};
  display: flex;
  flex-direction: column;
  height: 600px;
  flex-wrap: no-wrap;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #${props => props.theme.backgroundBase} #${props => props.theme.filledBox};

  &:: -webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #${props => props.theme.filledBox};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #${props => props.theme.backgroundBase};
  }
`;

const ScrollSelectorButton = styled.button<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.filledBox};
  color: #${props => props.theme.potentialShapeLines};
  border: none;
  height: 50px;
  min-height: 50px;
  margin: 0px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  display: flex;  
  align-items: center;
  justify-content: center;

  &: hover {
    background-color: #${props => props.theme.potentialShapeLines};
    color: #${props => props.theme.filledBox};
  }
`;

const ScrollSelectorItemStatus = styled.span`
  margin-right: auto; 
  width: 32px;
`;

const ScrollSelectorItemText = styled.span`
  margin-right: auto;
  width: 100%;
`;

export const ScrollSelector = (props: IScrollSelectorProps) => {
  const generateItems = () => {
    return props.items.map((item, index) => {
      const clickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.itemClickHandler(index);
      };

      return (
      <ScrollSelectorButton key={`ScrollSelectorItem${index}`} theme={props.theme} onClick={clickEvent} data-testid={`ScrollSelectorItemButton${index}`}>
        {props.itemsStatus && <ScrollSelectorItemStatus>{props.itemsStatus[index] ? '●' : '○'}</ScrollSelectorItemStatus>}
        <ScrollSelectorItemText data-testid={`ScrollSelectorItemText${index}`}>{item}</ScrollSelectorItemText>
      </ScrollSelectorButton>);
    });
  };

  return (
    <ScrollSelectorBox theme={props.theme} data-testid="ScrollSelector">
      {generateItems()}
    </ScrollSelectorBox>
  )
};