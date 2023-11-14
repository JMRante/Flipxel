import styled from "styled-components";
import { IGameTheme } from "../App";

export interface IScrollSelectorProps {
  theme: IGameTheme,
  items: string[],
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
  padding-left: 25px;
  height: 50px;
  min-height: 50px;
  margin: 0px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Courier New', monospace;

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
      <ScrollSelectorButton theme={props.theme} onClick={clickEvent}>
        {item}
      </ScrollSelectorButton>);
    });
  };

  return (
    <ScrollSelectorBox theme={props.theme}>
      {generateItems()}
    </ScrollSelectorBox>
  )
};