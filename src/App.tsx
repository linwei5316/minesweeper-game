import React, { useState } from 'react';
import GameMinesweeper from "@/components/GameMinesweeper";
import { ThemeProvider } from "styled-components";
import theme from "@/style/theme";

function App() {

  return (
    <ThemeProvider theme={ theme }>

      <GameMinesweeper />

    </ThemeProvider>
  );
}

export default App;
