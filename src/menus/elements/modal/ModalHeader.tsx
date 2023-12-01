import styled from "styled-components";

export const ModalHeader = styled.h1<{ color?: string; }>`
  color: #${props => props.color};
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
