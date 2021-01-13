import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import {generateSquareBorderCSS} from '@/style/utilities';
import {MinesweeperLevel, MapUnitType} from '@/consts/enum';
import {MinesweeperMapData, MapIndex, GameResult} from '@/consts/types';
import withGameContainer from '@/components/HOC/GameContainer';
import MinesweeperPanel from '@/components/MinesweeperPanel';
import MinesweeperSquare from '@/components/MinesweeperSquare';
import {Position, isSquareCover} from '@/functionTool/minesweeper';


const squareUnitWidth = 25;

const GameContainer = styled.div`
  ${({theme}) => generateSquareBorderCSS('high', theme, 5)}
  padding: 20px;
  background-color: ${({theme}) => theme.palette.grayNormal};
`

const SquareContainer = styled.div<{xAmount: number}>`
  margin-top: 10px;
  width: ${({xAmount}) => xAmount * squareUnitWidth}px;
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  box-sizing: content-box;
  ${({theme}) => generateSquareBorderCSS('low', theme, 5)}
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


  const getInitialMap = useCallback((): MinesweeperMapData[] => {
    const [xAmount, yAmount] = levelData.map;

    const result = [];
    for (let index = 0; index < xAmount * yAmount; index++) {
      result.push(null);
    }

    return result;
  }, [levelData.map])


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

  const showMine = useCallback(() => {
    const cloneMapData = [...mapData];

    minePosition
      .forEach((position) => {
        cloneMapData[position] = MapUnitType.Mine;
      });

    setMapData(cloneMapData);
  }, [mapData, minePosition])

  const endGame = useCallback((type: 'win' | 'lose') => {
    if (type === 'lose') {
      showMine();
    }

    setGameResult(type);
  }, [showMine])

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
  }, [mapData, endGame, gameResult, minePosition.length])


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
    setMinePosition([]);
  };
  useEffect(() => {
    if (minePosition.length === 0 && mapData.some((type) => !isSquareCover(type))) {
      setGameResult(null);
      setMapData(getInitialMap());
    }
  }, [getInitialMap, mapData, minePosition.length]);


  return (
    <GameContainer>
      <MinesweeperPanel
        flagAmount={flagAmount}
        gameResult={gameResult}
        onMainActionClick={initialGame}
      />

      <SquareContainer xAmount={levelData.map[0]}>
        {RenderMinesweeperSquare()}
      </SquareContainer>

    </GameContainer>
  )
}

export default withGameContainer<typeof MinesweeperLevel>(GameMinesweeper, MinesweeperLevel);
