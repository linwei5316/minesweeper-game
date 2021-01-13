import styled from "styled-components";
import {clickable, generateSquareBorderCSS} from '@/style/utilities';


export default styled.div`
  ${ ({theme}) => {
    return `
      ${generateSquareBorderCSS('high', theme, 3)}
      background-color: ${theme.palette.grayNormal};
    `
  } }
  ${clickable}
  width: 25px;
  height: 25px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

