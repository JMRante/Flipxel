import styled from "styled-components";
import { IGameTheme } from "../App";

const GameFileInputLabel = styled.label<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.backgroundLines};
  color: #${props => props.theme.trueBackground};
  border: none;
  padding-left: 25px;
  padding-right: 25px;
  height: 50px;
  margin: 5px;
  cursor: pointer;
  font-size: 30px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  flex: 1;
  display: block;
  line-height: 50px;

  &: hover {
    background-color: #${props => props.theme.backgroundBase};
  }

  &: disabled {
    background-color: #${props => props.theme.filledBox};
    color: #${props => props.theme.backgroundLines};
    cursor: default;
  }
`;

export interface IGameFileInputProps {
  theme: IGameTheme,
  children?: React.ReactNode
};

export const GameFileInput = (props: IGameFileInputProps) => {
  return (
    <GameFileInputLabel theme={props.theme}>
      <input type="file" style={{ display: "none" }}></input>
      {props.children}
    </GameFileInputLabel>
  );
};