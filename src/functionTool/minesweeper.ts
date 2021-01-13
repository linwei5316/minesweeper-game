import {MapIndex, MovedIndex} from '@/consts/types';
import {MapUnitType} from '@/consts/enum';

const filterValidPosition = (positionList: MovedIndex[]): MapIndex[] => {
  return positionList.filter((position) => position !== null) as MapIndex[];
}

export class Position {
  constructor(private _position: MapIndex, private _map: [number, number]) {}
  //TODO class content
  public get value(): MapIndex {
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


  // static tool
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
      getMineAdjacentLevel(position: MapIndex, minePosition: MapIndex[]): MapUnitType {
        if (minePosition.includes(position)) {
          return MapUnitType.Mine;
        } else {
          const adjacentPosition: MapIndex[] = this.getAdjacentPosition(position);

          const mergedPosition = [...minePosition, ...adjacentPosition];
          const removeDuplicatedValueLength = new Set(mergedPosition).size;

          const adjacentMineAmount = mergedPosition.length - removeDuplicatedValueLength;

          return adjacentMineAmount === 0
            ? MapUnitType.Clear
            : MapUnitType[ `NearLevel${ adjacentMineAmount }` as keyof typeof MapUnitType ];
        }
      },
      getAdjacentPosition(position: MapIndex): MapIndex[] {
        const positionList = [
          this.leftTopOf(position),    this.topOf(position),       this.rightTopOf(position),
          this.leftOf(position),                                      this.rightOf(position),
          this.leftBottomOf(position), this.bottomOf(position), this.rightBottomOf(position),
        ];

        return filterValidPosition(positionList);
      },
      topOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return y === LimitIndex.Top ? null : yCorrectionHandler(x, y - 1);
      },
      rightOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Right ? null : yCorrectionHandler(x + 1, y);
      },
      bottomOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return y === LimitIndex.Bottom ? null : yCorrectionHandler(x, y + 1);
      },
      leftOf(position: MapIndex): MovedIndex {
        const [x, y] = this.getTwoDimensionalPosition(position);

        return x === LimitIndex.Left ? null : yCorrectionHandler(x - 1, y);
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
