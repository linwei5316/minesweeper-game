import React from 'react';
import styled, {DefaultTheme} from "styled-components";
import {MapUnitType} from '@/consts/enum';
import Square from '@/components/Square';
import {MinesweeperMapData} from '@/consts/types';
import {isSquareCover} from '@/functionTool/minesweeper';
import Image from '@/components/Image';

const StyledSquare = styled(Square)<{ type: MinesweeperMapData }>`
  font-size: 14px;
  ${({type, theme}) => {
    return isSquareCover(type) 
      ?  ''
      : `border: 1px solid ${theme.palette.grayLight};`;
  }}
  ${({type}) => type === MapUnitType.Flag ? 'cursor: default;' : ''}
`

const Text = styled.span<{colorKey: keyof DefaultTheme['palette']}>`
  color: ${({theme, colorKey}) => theme.palette[colorKey]};
  font-weight: bolder;
  font-size: 17px;
`

interface Props {
  type: MinesweeperMapData;
  onClick: () => void;
  onContextMenu: () => void;
}
const MinesweeperSquare = (props: Props) => {
  const {type, onClick, onContextMenu} = props;

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
        return <Text colorKey="minesweeperContentNormal">{type}</Text>;
      case MapUnitType.NearLevel2:
        return <Text colorKey="minesweeperContentWarn">{type}</Text>;
      case MapUnitType.NearLevel3:
      case MapUnitType.NearLevel4:
      case MapUnitType.NearLevel5:
      case MapUnitType.NearLevel6:
      case MapUnitType.NearLevel7:
      case MapUnitType.NearLevel8:
        return <Text colorKey="minesweeperContentDanger">{type}</Text>;
      case MapUnitType.Flag:
        return <Image src="https://cdn.shopify.com/s/files/1/1061/1924/files/Red_Pin_Emoji_60x60.png?5754029179590811720" />;
      case MapUnitType.Mine:
        return <Image src="https://cdn.shopify.com/s/files/1/1061/1924/files/Poop_Emoji.png?6135488989279264585" />;
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
