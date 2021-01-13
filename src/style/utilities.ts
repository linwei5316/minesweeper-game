import {css, DefaultTheme} from 'styled-components';

export const clickable = css`
  cursor: pointer;
`


const borderCSSValue = (color: string, borderWidth: number) => {
  return `${borderWidth}px solid ${color}`;
}

export const generateSquareBorderCSS = (elevatedType: 'high' | 'low', theme: DefaultTheme, borderWidth: number = 1) => {
  if (elevatedType === 'high') {
    return `
      border-top: ${borderCSSValue(theme.palette.grayLight, borderWidth)};
      border-left: ${borderCSSValue(theme.palette.grayLight, borderWidth)};
      border-right: ${borderCSSValue(theme.palette.grayDark, borderWidth)};
      border-bottom: ${borderCSSValue(theme.palette.grayDark, borderWidth)};
    `
  }
  if (elevatedType === 'low') {
    return `
      border-top: ${borderCSSValue(theme.palette.grayDark, borderWidth)};
      border-left: ${borderCSSValue(theme.palette.grayDark, borderWidth)};
      border-right: ${borderCSSValue(theme.palette.grayLight, borderWidth)};
      border-bottom: ${borderCSSValue(theme.palette.grayLight, borderWidth)};
    `
  }
}
