import styled from "styled-components";
import { IGameTheme } from "../../../App";

export const ModalHeader = styled.h1<{ theme?: IGameTheme; }>`
  color: #${props => props.theme.potentialShapeLines};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
