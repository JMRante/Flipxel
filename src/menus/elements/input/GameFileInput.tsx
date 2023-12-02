import styled from "styled-components";
import { IGameTheme } from "../../../App";

const GameFileInputLabel = styled.label<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.backgroundLines};
  color: #${props => props.theme.trueBackground};
  border: none;
  padding-left: 0.8em;
  padding-right: 0.8em;
  height: min(9vw, 2em);
  margin: 0.2em;
  cursor: pointer;
  font-size: min(4.1vw, 1.5em);
  font-weight: bold;
  font-family: 'Courier New', monospace;
  flex: 1;
  display: block;
  line-height: min(9vw, 2em);

  &: hover {
    background-color: #${props => props.theme.backgroundBase};
  }

  &: disabled {
    background-color: #${props => props.theme.filledBox};
    color: #${props => props.theme.backgroundLines};
    cursor: default;
  }

  &: first-child {
    margin-left: 0em;
  }

  &: last-child {
    margin-right: 0em;
  }

  &: only-child {
    margin-left: 0em;
    margin-right: 0em;
  }
`;

export interface IGameFileInputProps {
  theme: IGameTheme,
  children?: React.ReactNode,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  internalTestId: string
};

export const GameFileInput = (props: IGameFileInputProps) => {
  return (
    <GameFileInputLabel theme={props.theme}>
      <input type="file" style={{ display: "none" }} onChange={props.onChange} data-testid={props.internalTestId}></input>
      {props.children}
    </GameFileInputLabel>
  );
};