import React from 'react';
import Square from '@/components/Square';

interface Props {
  type: any;
}
const MinesweeperSquare = (props: Props) => {
  //TODO state machine
  const {type} = props;

  return (
    <Square>
      {type}
    </Square>
  )
}

export default MinesweeperSquare;
