import { createContext, ReactNode, useState, useMemo, useContext } from 'react';
import { GameSessionType } from 'domain/GameSessionType';

const GameSessionContex = createContext<[GameSessionType, (newState: GameSessionType) => void]>([
  {
    players: [],
    currPlayer: 0,
    generation: 1,
    startTime: 0,
    isActive: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

type Props = {
  children: ReactNode;
};

export const GameSessionProvider = ({ children }: Props): JSX.Element => {
  const params = localStorage.getItem('gameSession');
  const defaultParams = params
    ? JSON.parse(params)
    : {
        players: [],
        currPlayer: 0,
        generation: 1,
        startTime: 0,
        isActive: true,
      };

  const [gameSessionState, setGameSessionState] = useState<GameSessionType>(defaultParams);

  const setState = (newState: GameSessionType): void => {
    setGameSessionState(newState);
    localStorage.setItem('gameSession', JSON.stringify(newState));
  };

  const value: [GameSessionType, (newState: GameSessionType) => void] = useMemo(
    () => [gameSessionState, setState],
    [gameSessionState],
  );
  return <GameSessionContex.Provider value={value}>{children}</GameSessionContex.Provider>;
};

export const useGameSessionInfo = (): [GameSessionType, (newState: GameSessionType) => void] =>
  useContext(GameSessionContex);
