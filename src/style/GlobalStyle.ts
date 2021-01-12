import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
  }
  
  div {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
