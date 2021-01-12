import {MapUnitType} from '@/consts/enum';

export type ValueOf<T> = T[keyof T];



export type MinesweeperMapData = MapUnitType | null;
