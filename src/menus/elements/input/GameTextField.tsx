import styled from "styled-components";
import { IGameTheme } from "../../../App";

export const GameTextField = styled.input<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.trueBackground};
  color: #${props => props.theme.potentialShapeLines};
  border: solid;
  border-color: #${props => props.theme.backgroundBase};
  border-width: 2px;
  padding-left: 0.8em;
  padding-right: 0.8em;
  height: min(9vw, 2em);
  margin: 0.2em;
  font-size: min(4.1vw, 1.5em);
  font-weight: bold;
  font-family: 'Courier New', monospace;
  flex: 3;
  box-sizing: border-box;

  &: focus {
    border: solid;
    border-color: #${props => props.theme.potentialShapeLines};
    border-width: 2px;
    outline: 0;
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