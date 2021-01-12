import styled from "styled-components";

const borderCSSValue = (color: string) => {
  return `3px solid ${color}`;
}

export default styled.div`
  ${ ({theme}) => {
    return `
      border-top: ${borderCSSValue(theme.palette.grayLight)};
      border-left: ${borderCSSValue(theme.palette.grayLight)};
      border-right: ${borderCSSValue(theme.palette.grayDark)};
      border-bottom: ${borderCSSValue(theme.palette.grayDark)};
      background-color: ${theme.palette.grayNormal};
    `
  } }
  width: 25px;
  height: 25px;
`

