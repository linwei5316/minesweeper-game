import React from 'react';
import styled from "styled-components";
import Square from '@/components/Square';
import {MinesweeperMapData} from '@/consts/types';

const StyledSquare = styled(Square)`
  font-size: 14px;
`

interface Props {
  type: MinesweeperMapData;
  onClick: () => void;
  onContextMenu: () => void;
}
const MinesweeperSquare = (props: Props) => {
  //TODO state machine
  const {type, onClick, onContextMenu} = props;

  const clickContextMenuHandler = (event: any) => {
    if (event.type === 'contextmenu') {
      event.preventDefault();
      onContextMenu();
    }
  }

  return (
    <StyledSquare onClick={() => onClick()} onContextMenu={clickContextMenuHandler}>
      {type}
    </StyledSquare>
  )
}

export default MinesweeperSquare;
