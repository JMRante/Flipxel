import styled from "styled-components";
import { IGameTheme } from "../App";
import './ScrollSelector.css';

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

export const ScrollSelector = (props: IScrollSelectorProps) => {
  const generateItems = () => {
    return props.items.map((item, index) => {
      const clickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.itemClickHandler(index);
      };

      return (
      <ScrollSelectorButton key={`ScrollSelectorItem${index}`} theme={props.theme} onClick={clickEvent}>
        {props.itemsStatus && <span className="ScrollSelector-item-status">{props.itemsStatus[index] ? '●' : '○'}</span>}
        <span className="ScrollSelector-item-text">{item}</span>
      </ScrollSelectorButton>);
    });
  };

  return (
    <ScrollSelectorBox theme={props.theme}>
      {generateItems()}
    </ScrollSelectorBox>
  )
};