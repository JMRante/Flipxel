import './Modal.css';

export interface IModalProps {
  children?: React.ReactNode,
  internalTestId: string
};

export const Modal = (props: IModalProps) => {
  return (
    <div className="Modal" data-testid={props.internalTestId}>
      {props.children}
    </div>
  );
};