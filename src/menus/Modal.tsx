import './Modal.css';

export interface IModalProps {
  children?: React.ReactNode
};

export const Modal = (props: IModalProps) => {
  return (
    <div className="Modal">
      {props.children}
    </div>
  );
};