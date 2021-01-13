import React from 'react';
import styled from "styled-components";
import {MapUnitType} from '@/consts/enum';
import Square from '@/components/Square';
import {MinesweeperMapData} from '@/consts/types';


const isSquareCover = (typeValue: MinesweeperMapData) => {
  const condition = [MapUnitType.Flag, null];

  return condition.includes(typeValue);
}


const StyledSquare = styled(Square)<{ type: MinesweeperMapData }>`
  font-size: 14px;
  ${({type, theme}) => {
    return isSquareCover(type) 
      ?  ''
      : `border: 1px solid ${theme.palette.grayLight};`;
  }}
`

interface Props {
  type: MinesweeperMapData;
  onClick: () => void;
  onContextMenu: () => void;
}
const MinesweeperSquare = (props: Props) => {
  const {type, onClick, onContextMenu} = props;

  //TODO TYPE 判斷要完全一點
  // 目前如果是打開的話 就不能再被點
  const clickHandler = () => {
    if (type !== MapUnitType.Flag) {
      onClick();
    }
  }

  const clickContextMenuHandler = (event: any) => {
    if (event.type === 'contextmenu') {
      event.preventDefault();

      if (isSquareCover(type)) {
        onContextMenu();
      }
    }
  }

  const RenderContent = () => {
    switch (type) {
      case null:
      case MapUnitType.Clear:
        return;
      case MapUnitType.NearLevel1:
      case MapUnitType.NearLevel2:
      case MapUnitType.NearLevel3:
      case MapUnitType.NearLevel4:
      case MapUnitType.NearLevel5:
      case MapUnitType.NearLevel6:
      case MapUnitType.NearLevel7:
      case MapUnitType.NearLevel8:
        return type;
      case MapUnitType.Mine:
        return '!!';
    }
  }

  return (
    <StyledSquare
      type={type}
      onClick={clickHandler}
      onContextMenu={clickContextMenuHandler}
    >
      {RenderContent()}
    </StyledSquare>
  )
}

export default MinesweeperSquare;
