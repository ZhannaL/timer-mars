import { createContext, ReactNode, useState, useMemo, useContext } from 'react';
import { GameInfo } from 'domain/GameType';
import { Colors } from 'domain/ColorType';
import { useTimeInfo } from './TimeContex';

const GameContext = createContext<[Array<GameInfo>, (newState: Array<GameInfo>) => void]>([
  [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

type Props = {
  children: ReactNode;
};

export const GameProvider = ({ children }: Props): JSX.Element => {
  const [timeState] = useTimeInfo();
  const defaultTime = timeState;

  const params = localStorage.getItem('game');
  const defaultParams = params
    ? JSON.parse(params)
    : [
        {
          color: Colors.red,
          name: 'NoOne',
          timeToLeft: defaultTime,
        },
        {
          color: Colors.green,
          name: 'NoOne',
          timeToLeft: defaultTime,
        },
        {
          color: Colors.blue,
          name: 'NoOne',
          timeToLeft: defaultTime,
        },
        {
          color: Colors.black,
          name: 'NoOne',
          timeToLeft: defaultTime,
        },
        {
          color: Colors.yellow,
          name: 'NoOne',
          timeToLeft: defaultTime,
        },
      ];

  const [gameState, setGameState] = useState<Array<GameInfo>>(defaultParams);

  const setState = (newState: Array<GameInfo>): void => {
    setGameState(newState);
    localStorage.setItem('game', JSON.stringify(newState));
  };

  const value: [Array<GameInfo>, (newState: Array<GameInfo>) => void] = useMemo(
    () => [gameState, setState],
    [gameState],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameInfo = (): [Array<GameInfo>, (newState: Array<GameInfo>) => void] =>
  useContext(GameContext);
