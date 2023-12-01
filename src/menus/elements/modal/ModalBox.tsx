import styled from "styled-components";

export const ModalBox = styled.div<{ color?: string; }>`
  background-color: #${props => props.color};
  padding: 15px;
  width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
`;