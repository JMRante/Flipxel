import styled from "styled-components";
import { IGameTheme } from "../../../App";

export const ModalBox = styled.div<{ theme?: IGameTheme; }>`
  background-color: #${props => props.theme.trueBackground};
  padding: 15px;
  width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
`;