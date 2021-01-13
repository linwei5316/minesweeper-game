import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {MinesweeperLevel, MapUnitType} from '@/consts/enum';
import {MinesweeperMapData, MapIndex} from '@/consts/types';
import withGameContainer from '@/components/HOC/GameContainer';
import MinesweeperSquare from '@/components/MinesweeperSquare';
import {Position} from '@/functionTool/minesweeper';

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

  //TODO 可以把 getLevelData 刪除 改用 levelData？？？？
  // const getLevelData = (): GameLevelContent => {
  //   return levelMapping[level];
  // }

  const getInitialMap = (): MinesweeperMapData[] => {
    const [xAmount, yAmount] = levelData.map;

    const result = [];
    for (let index = 0; index < xAmount * yAmount; index++) {
      result.push(null);
    }

    return result;
  }



  const [minePosition, setMinePosition] = useState<MapIndex[]>([]);
  const [mapData, setMapData] = useState<MinesweeperMapData[]>(() => getInitialMap());

  const getTwoDimensionalPosition = (position: MapIndex): [number, number] => {
    const [xAmount] = levelData.map;

    return [position % xAmount, Math.floor(position / xAmount)];
  }
  const checkAround = (position: MapIndex) => {
    //TODO 在這邊時做遞迴
  //  第一步 先檢查周邊，如果已有地雷，則指標註
  //
  }

  const positionTool = Position.createTool(levelData.map);
  const clickSquareHandler = (clickPosition: MapIndex) => {
    console.log('clickSquareHandler position', clickPosition)

    const _minePosition = minePosition.length > 0 ? minePosition : getInitialMinePosition(clickPosition);
    setMinePosition((previousState) => previousState.length === 0 ? _minePosition : previousState);



    console.log('地雷位置', _minePosition)
    console.log('點後附近座標',
      positionTool.getAdjacentPosition(clickPosition),
      '附近地雷數',
      positionTool.getMineAdjacentLevel(clickPosition, _minePosition)
    )

    const mapDataStack = [...mapData];
    const mineAdjacentLevel = positionTool.getMineAdjacentLevel(clickPosition, _minePosition);
    mapDataStack[clickPosition] = mineAdjacentLevel;

    const sweepSquareSetMapDataRecursive = (
      positionStack: MapIndex[],
      checkedPositionStack: MapIndex[] = [clickPosition]
    ) => {
      console.log('遞迴中')

      positionStack.map((position, index) => {
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
      //TODO 由這邊展開
      // const checkedPositionStack: MapIndex[] = [clickPosition];
      // 要記錄什麼 position 改成什麼值的樣子 ！但如果直接在迴圈中改，應該就不需要

      // 先確認 position 有沒有在 ｓｔａｃｋ 有就濾掉  ？這個好像不用
      // 再來 確認該 position 的 鄰近地雷數量
      // 有地雷資訊，就改 position 對應的地圖資訊後結束
      // 沒有地雷數量，就繼續展開 -> 把 adjacent position 加進 positionStack 中（一樣要避免 merge 後重複，看能不能用 set解


      sweepSquareSetMapDataRecursive(positionTool.getAdjacentPosition(clickPosition))
    }



    setMapData(mapDataStack);

    if (isGameInitial()) {
      //TODO initialMinePosition
      // const _minePosition = getInitialMinePosition(clickPosition);

      // setMinePosition(_minePosition);




    } else {
        //TODO 這段邏輯已在 positionToll 實作
      // if (minePosition.includes(position)) {
      //
      //   // TODO: BOOOOOOOOM!!!
      // }

    }

  }


  const flagAmount = levelData.mineAmount - mapData.filter((mapData) => mapData === MapUnitType.Flag).length;
  //TODO  useFlag => switchFlag  clearFlag flagAmount
  const switchFlagHandler = (position: number) => {
    if (flagAmount > 0) {
      console.log('插旗囉')
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
    return mapData.map((item, index) => {
      return <MinesweeperSquare
        key={index}
        type={item}
        onClick={() => clickSquareHandler(index)}
        onContextMenu={() => switchFlagHandler(index)}
      />
    })
  }

  const isGameInitial = () => {
    let result = true;

    for (let index = 0; index < mapData.length; index++) {
      const condition = [MapUnitType.Flag, null];

      if (!condition.includes(mapData[index])) {
        result = false;
        break;
      }
    }

    return result;
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
    setMinePosition([]);
  };
  useEffect(() => {
    if (minePosition.length === 0) {
      setMapData(getInitialMap());
    }
  }, [minePosition.length]);



  // useEffect(() => {
  //   console.log('初始化地圖')
  //   getInitialMap();
  //
  //   console.log('mapData', mapData)
  // }, [])

  return (
    <div>
      {/* TODO panel*/}
      <div>
        <span>標誌: {flagAmount}</span>

        <Square onClick={initialGame}>R</Square>
      </div>

      <SquareContainer xAmount={levelData.map[0]}>
        {RenderMinesweeperSquare()}
      </SquareContainer>



      {isGameInitial() && '還沒開局'}
    </div>
  )
}

export default withGameContainer<typeof MinesweeperLevel>(GameMinesweeper, MinesweeperLevel);
