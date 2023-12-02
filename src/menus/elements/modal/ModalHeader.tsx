import styled from "styled-components";
import { IGameTheme } from "../../../App";

export const ModalHeader = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: min(6vw, 2.5em);
  margin-top: 0.3em;
  margin-bottom: 0.3em;
`;
