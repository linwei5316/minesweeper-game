import React, {useState} from 'react';
import styled from 'styled-components';
import {MinesweeperLevel} from '@/consts/enum';
import withGameContainer from '@/components/HOC/GameContainer';

import Square from '@/components/Square';

interface Props {
  level: MinesweeperLevel;
}
const GameMinesweeper = (props: Props) => {
  const { level } = props;

  type GameLevelContent = {
    map: [number, number];
    mineAmount: number;
  }
  type LevelMapping = {
    [key: string]: GameLevelContent;
  }
  const levelMapping: LevelMapping = {
    [MinesweeperLevel.Easy]: {
      map: [9, 9],
      mineAmount: 10,
    },
    [MinesweeperLevel.Normal]: {
      map: [16, 16],
      mineAmount: 40,
    },
    [MinesweeperLevel.Hard]: {
      map: [30, 16],
      mineAmount: 99,
    },
  }

  // const [mapData, setMapData] = useState()


  //TODO setFlag  記得使用 funciton 確保 async
  const [flag, setFlag] = useState(() => levelMapping[props.level].mineAmount);

  const initialMap = () => {

  }

  const initialGame = () => {

  }

  return (
    <div>
      {/* TODO panel*/}
      <div>
        <span>標誌: {flag}</span>

        <Square onClick={initialGame}>R</Square>
      </div>

      <Square/>
    </div>
  )
}

export default withGameContainer<typeof MinesweeperLevel>(GameMinesweeper, MinesweeperLevel);
