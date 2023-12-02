import styled from "styled-components";
import { IGameTheme } from "../../../App";

export const GameButton = styled.button<{ theme?: IGameTheme; }>`
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