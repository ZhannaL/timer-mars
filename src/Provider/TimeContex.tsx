import { createContext, ReactNode, useState, useMemo, useContext } from 'react';

const TimeContext = createContext<[number, (newState: number) => void]>([
  45 * 60,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

type Props = {
  children: ReactNode;
};

export const TimeProvider = ({ children }: Props): JSX.Element => {
  const params = localStorage.getItem('gameTime');
  const defaultParams = params ? JSON.parse(params) : 45 * 60;

  const [timeState, setTimeState] = useState<number>(defaultParams);

  const setState = (newState: number): void => {
    setTimeState(newState);
    localStorage.setItem('gameTime', JSON.stringify(newState));
  };

  const value: [number, (newState: number) => void] = useMemo(() => [timeState, setState], [
    timeState,
  ]);
  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export const useTimeInfo = (): [number, (newState: number) => void] => useContext(TimeContext);
