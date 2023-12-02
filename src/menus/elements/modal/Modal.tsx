import styled from 'styled-components';

export interface IModalProps {
  children?: React.ReactNode,
  internalTestId: string
};

const ModalBackground = styled.span`
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  left: 0em;
  top: 0em;
  z-index: 10;
  position: absolute;
`;

export const Modal = (props: IModalProps) => {
  return (
    <ModalBackground data-testid={props.internalTestId}>
      {props.children}
    </ModalBackground>
  );
};