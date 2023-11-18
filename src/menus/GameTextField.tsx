import styled from "styled-components";
import { IGameTheme } from "../App";

export const GameTextField = styled.input<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.trueBackground};
  color: #${props => props.theme.potentialShapeLines};
  border: solid;
  border-color: #${props => props.theme.backgroundBase};
  border-width: 2px;
  padding-left: 25px;
  padding-right: 25px;
  height: 50px;
  margin: 5px;
  font-size: 30px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  flex: 1;

  &: focus {
    border: solid;
    border-color: #${props => props.theme.potentialShapeLines};
    border-width: 2px;
    outline: 0;
  }
`;