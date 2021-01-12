import React from 'react';
import styled from 'styled-components';
import {MinesweeperLevel} from '@/consts/enum';

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

  const initialMap = () => {

  }

  return (
    <div>
      {/* TODO panel*/}
      <Square/>
    </div>
  )
}

export default GameMinesweeper;
