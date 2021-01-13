import React from 'react';
import styled from 'styled-components';
import Square from '@/components/Square';
import {GameResult} from '@/consts/types';
import {generateSquareBorderCSS} from '@/style/utilities';
import Image from '@/components/Image';

const Panel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({theme}) => generateSquareBorderCSS('low', theme, 5)}
  padding: 5px;
`

const MainActionSquare = styled(Square)`
  width: 38px;
  height: 38px;
  border-width: 4px;
  margin: 0 15px;
`

const InfoBox = styled.div<{textAlign?: 'center' | 'left' | 'right'}>`
  min-width: 60px;
  color: ${({theme}) => theme.palette.white};
  font-weight: bolder;
  background-color: #222;
  ${({theme}) => generateSquareBorderCSS('low', theme, 1)}
  padding: 3px 6px;
  text-align: ${ ({textAlign}) => textAlign || 'center'};
`

interface Props {
  flagAmount: number;
  gameResult: GameResult | null;
  onMainActionClick: () => void;
}
const MinesweeperPanel = (props: Props) => {
  const {
    flagAmount,
    gameResult,
    onMainActionClick,
  } = props;

  const faceImageUrl = () => {
    switch (gameResult) {
      case null:
        return 'https://cdn.shopify.com/s/files/1/1061/1924/files/Slightly_Smiling_Face_Emoji_Icon_60x60.png?16228697460559734940';
      case 'win':
        return 'https://cdn.shopify.com/s/files/1/1061/1924/files/Sunglasses_Emoji.png?2976903553660223024';
      case 'lose':
        return 'https://cdn.shopify.com/s/files/1/1061/1924/files/Dizzy_Face_Emoji_60x60.png?8026536574188759287';
    }
  }

  return (
    <Panel>
      <InfoBox textAlign="left">
        {flagAmount}
      </InfoBox>

      <MainActionSquare onClick={onMainActionClick}>
        <Image src={faceImageUrl()} />
      </MainActionSquare>

      <InfoBox textAlign="right">
        {/* TODO: timer */}
        {0}
      </InfoBox>
    </Panel>
  )
}

export default MinesweeperPanel;
