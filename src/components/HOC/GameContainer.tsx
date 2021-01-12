import React, {useState, FunctionComponent} from 'react';
import styled from 'styled-components';

import Square from '@/components/Square';

const ButtonSquare = styled(Square)`
  width: auto;
  height: auto;
  padding: 5px;
  display: inline-block;
`

type Enum = {
  [key: string]: number | string;
}
type WithGameContainer = <L extends Enum>(Game: FunctionComponent<{level: number}>, levelEnum: L) => FunctionComponent;
const withGameContainer: WithGameContainer = (Game, levelEnum) => {
  interface Props {
    Game: FunctionComponent<{level: number}>;
  }

  const GameContainer = (props: Props) => {
    const {Game} = props;
    const [ level, setLevel ] = useState<number | null>(null);

    const RenderLevelOption = () => {
      return Object.values(levelEnum).filter((item) => {
        return typeof item === 'number';
      }).map((levelValue) => {
        return <ButtonSquare onClick={() => {
          setLevel(levelValue as number)
        }}>{levelEnum[levelValue]}</ButtonSquare>
      })

    }

    return (
      <div>
        {
          level === null ? (
            <>
              <p>Select Level To Play !</p>

              {RenderLevelOption()}
            </>
          ) : (

            <Game level={level as number} />
          )
        }
      </div>
    )
  }

  return () => {
    return (
      <GameContainer Game={Game} />
    )
  }
}

export default withGameContainer;
