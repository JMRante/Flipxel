import styled from "styled-components";
import { IGameTheme } from "../App";

export const GameButton = styled.button<{ theme?: IGameTheme; }>`
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

  &: hover {
    background-color: #${props => props.theme.backgroundBase};
  }

  &: disabled {
    background-color: #${props => props.theme.filledBox};
    color: #${props => props.theme.backgroundLines};
    cursor: default;
  }
`;