import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {MinesweeperLevel, MapUnitType} from '@/consts/enum';
import {MinesweeperMapData} from '@/consts/types';
import withGameContainer from '@/components/HOC/GameContainer';
import MinesweeperSquare from '@/components/MinesweeperSquare';

import Square from '@/components/Square';

const squareUnitWidth = 25;

const SquareContainer = styled.div<{xAmount: number}>`
  margin-top: 10px;
  width: ${({xAmount}) => xAmount * squareUnitWidth}px;
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
`



type MapIndex = number;
type MovedIndex = MapIndex | null;

class Position {
  constructor(private _position: MapIndex, private _map: [number, number]) {}

  public get position(): MapIndex {
    return this._position;
  }

  public get twoDimensionalPosition(): [number, number] {
    const [xAmount] = this._map;

    return [
      this._position % xAmount,
      Math.floor(this._position / xAmount)
    ] as [number, number];
  }

  private get LimitIndex() {
    const [xAmount, yAmount] = this._map;

    return {
      Top: 0,
      Left: 0,
      Right: xAmount,
      Bottom: yAmount,
    } as const;
  }

  public static createTool(map: [number, number]) {
    const [xAmount, yAmount] = map;
    const LimitIndex = {
      Top: 0,
      Left: 0,
      Right: xAmount - 1,
      Bottom: yAmount - 1,
    } as const;

    const yCorrectionHandler = (x: number, y: number) => {
      return y * xAmount + x;
    }

    return {
      getTwoDimensionalPosition(position: MapIndex): [number, number] {
        const [xAmount] = map;

        return [
          position % xAmount,
          Math.floor(position / xAmount)
        ] as [number, number];
      },
      getAdjacentPosition(position: MapIndex): MovedIndex[] {
        return [
          this.leftTopOf(position),    this.topOf(position),       this.rightTopOf(position),
          this.leftOf(position),                                      this.rightOf(position),
          this.leftBottomOf(position), this.bottomOf(position), this.rightBottomOf(position),
        ];
      },
      topOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return y === LimitIndex.Top ? null : yCorrectionHandler(x, y - 1);
      },
      rightOf(position: MapIndex): MovedIndex {
        const [x] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Right ? null : x + 1;
      },
      bottomOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return y === LimitIndex.Bottom ? null : yCorrectionHandler(x, y + 1);
      },
      leftOf(position: MapIndex): MovedIndex {
        const [x] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Left ? null : x - 1;
      },
      leftTopOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Left
          ? null
          : y === LimitIndex.Top
            ? null
            : yCorrectionHandler(x - 1, y - 1);
      },
      leftBottomOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Left
          ? null
          : y === LimitIndex.Bottom
            ? null
            : yCorrectionHandler(x - 1, y + 1);
      },
      rightTopOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Right
          ? null
          : y === LimitIndex.Top
            ? null
            : yCorrectionHandler(x + 1, y - 1);
      },
      rightBottomOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Right
          ? null
          : y === LimitIndex.Bottom
            ? null
            : yCorrectionHandler(x + 1, y + 1);
      },
    }
  }
}


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

  const clickSquareHandler = (position: MapIndex) => {
    console.log('clickSquareHandler position', position)
    if (isGameInitial()) {
      //TODO initialMinePosition
      console.log(getInitialMinePosition(position))
      // setMinePosition()

      console.log('阿斯', Position.createTool(levelData.map).getAdjacentPosition(position))


      //TODO 開地圖地迴 ！！！！！！
    } else {

      if (minePosition.includes(position)) {

        // TODO: BOOOOOOOOM!!!
      }

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

  }



  useEffect(() => {
    console.log('初始化地圖')
    getInitialMap();

    console.log('mapData', mapData)
  }, [])

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
