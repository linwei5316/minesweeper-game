import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {MinesweeperLevel, MapUnitType} from '@/consts/enum';
import {MinesweeperMapData, MapIndex, GameResult} from '@/consts/types';
import withGameContainer from '@/components/HOC/GameContainer';
import MinesweeperSquare from '@/components/MinesweeperSquare';
import {Position, isSquareCover} from '@/functionTool/minesweeper';

import Square from '@/components/Square';

const squareUnitWidth = 25;

const SquareContainer = styled.div<{xAmount: number}>`
  margin-top: 10px;
  width: ${({xAmount}) => xAmount * squareUnitWidth}px;
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
`


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

  const levelData = levelMapping[level];


  const getInitialMap = (): MinesweeperMapData[] => {
    const [xAmount, yAmount] = levelData.map;

    const result = [];
    for (let index = 0; index < xAmount * yAmount; index++) {
      result.push(null);
    }

    return result;
  }


  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [minePosition, setMinePosition] = useState<MapIndex[]>([]);
  const [mapData, setMapData] = useState<MinesweeperMapData[]>(() => getInitialMap());



  const positionTool = Position.createTool(levelData.map);
  const clickSquareHandler = (clickPosition: MapIndex) => {
    const _minePosition = minePosition.length > 0
      ? minePosition
      : getInitialMinePosition(clickPosition);
    setMinePosition((previousState) => (
      previousState.length === 0
        ? _minePosition
        : previousState
    ));


    const mapDataStack = [...mapData];
    const mineAdjacentLevel = positionTool.getMineAdjacentLevel(clickPosition, _minePosition);

    mapDataStack[clickPosition] = mineAdjacentLevel;

    const sweepSquareSetMapDataRecursive = (
      positionStack: MapIndex[],
      checkedPositionStack: MapIndex[] = [clickPosition]
    ) => {
      positionStack.forEach((position) => {
        if (!checkedPositionStack.includes(position)) {
          const mineAdjacentLevel = positionTool.getMineAdjacentLevel(position, _minePosition);

          checkedPositionStack.push(position);
          mapDataStack[position] = mineAdjacentLevel;

          if (mineAdjacentLevel === MapUnitType.Clear) {
            sweepSquareSetMapDataRecursive(positionTool.getAdjacentPosition(position), checkedPositionStack);
          }
        }
      })
    }

    if (mineAdjacentLevel === MapUnitType.Clear) {
      sweepSquareSetMapDataRecursive(positionTool.getAdjacentPosition(clickPosition))
    }

    setMapData(mapDataStack);
  }

  useEffect(() => {
    if (gameResult) {
      return;
    }

    if (mapData.includes(MapUnitType.Mine)) {
      endGame('lose');
    }

    const isSweepAllSquare = mapData.filter((type) => isSquareCover(type)).length === minePosition.length;
    if (isSweepAllSquare) {
      endGame('win');
    }
  }, [mapData])


  const showMine = () => {
    const cloneMapData = [...mapData];

    minePosition
      .forEach((position) => {
        cloneMapData[position] = MapUnitType.Mine;
      });

    setMapData(cloneMapData);
  }

  const endGame = (type: 'win' | 'lose') => {
    if (type === 'lose') {
      showMine();
    }
    alert(type);

    setGameResult(type);
  }


  const flagAmount = levelData.mineAmount - mapData.filter((mapData) => mapData === MapUnitType.Flag).length;
  const switchFlagHandler = (position: number) => {
    if (flagAmount > 0) {
      const cloneData = [...mapData];

      switch (cloneData[position]) {
        case null:
          cloneData[position] = MapUnitType.Flag;
          break;
        case MapUnitType.Flag:
          cloneData[position] = null;
          break;
      }

      setMapData(cloneData);
    }
  }



  const RenderMinesweeperSquare = () => {
    const clickActionInGame = (handler: (position: MapIndex) => void, index: MapIndex) => {
      return () => {
        if (gameResult === null) {
          handler(index);
        }
      }
    }

    return mapData.map((item, index) => {
      return <MinesweeperSquare
        key={index}
        type={item}
        onClick={clickActionInGame(clickSquareHandler, index)}
        onContextMenu={clickActionInGame(switchFlagHandler, index)}
      />
    })
  }

  const getInitialMinePosition = (firstClickMapIndex: MapIndex): MapIndex[] => {
    const [xAmount, yAmount] = levelData.map;
    const indexStack = [] as MapIndex[];
    for (let index = 0; index < mapData.length; index++) {
      if (index !== firstClickMapIndex) {
        indexStack.push(index);
      }
    }

    const mineAmount = levelData.mineAmount;
    return [...new Array(mineAmount)]
      .reduce((accumulator) => {
        const randomIndex = Math.floor(Math.random() * indexStack.length);

        return [...accumulator, ...indexStack.splice(randomIndex, 1)]
      }, [] as MapIndex[])
      .sort((a: number, b: number) => a - b);
  }

  const initialGame = () => {
    setGameResult(null);
    setMinePosition([]);
  };
  useEffect(() => {
    if (minePosition.length === 0) {
      setMapData(getInitialMap());
    }
  }, [minePosition.length]);


  return (
    <div>
      {/* TODO panel*/}
      <div>
        <span>Flag: {flagAmount}</span>

        <Square onClick={initialGame}>R</Square>
      </div>

      <SquareContainer xAmount={levelData.map[0]}>
        {RenderMinesweeperSquare()}
      </SquareContainer>

    </div>
  )
}

export default withGameContainer<typeof MinesweeperLevel>(GameMinesweeper, MinesweeperLevel);
