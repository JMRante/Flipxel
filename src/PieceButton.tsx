import './PieceButton.css'

export interface IPieceButtonProps {
  piece: boolean[],
  selected: boolean,
  clickEvent: React.MouseEventHandler<HTMLButtonElement>
};

export const PieceButton = (props: IPieceButtonProps) => {
  const generateCells = () => {
    return props.piece.map((x, i) => {
      const classList = x ? (props.selected ? 'PieceButton-cell-filled-selected' : 'PieceButton-cell-filled') : 'PieceButton-cell-unfilled';
      return <div key={`PieceButtonCell${i}`} className={classList}/>
    });
  };

  return (
    <button onClick={props.clickEvent} className='PieceButton'>
      {generateCells()}
    </button>
  )
};