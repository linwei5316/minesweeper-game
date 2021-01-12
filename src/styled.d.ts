import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      black: string;
      white: string;
      grayLight: string;
      grayNormal: string;
      grayDark: string;
      minesweeperContentNormal: string;
      minesweeperContentWarn: string;
      minesweeperContentDanger: string;
      minesweeperContentDangerDark: string;
    }
  }
}
