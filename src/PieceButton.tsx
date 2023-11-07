import './PieceButton.css'

export interface IPieceButtonProps {
  piece: boolean[]
}

export const PieceButton = (props: IPieceButtonProps) => {
  const generateCells = () => {
    return props.piece.map(x => {
      const classList = x ? 'pieceCellFilled' : 'pieceCellUnfilled';
      return <div className={classList}/>
    });
  };

  return (
    <button className='pieceButton'>
      {generateCells()}
    </button>
  )
};