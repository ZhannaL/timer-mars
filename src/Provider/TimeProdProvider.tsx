import { TimeProdType } from 'domain/TimeProdType';
import { createContext, ReactNode, useState, useMemo, useContext } from 'react';

const TimeProdContext = createContext<[TimeProdType, (newState: TimeProdType) => void]>([
  { time: 4 * 60, enabled: false },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

type Props = {
  children: ReactNode;
};

export const TimeProdProvider = ({ children }: Props): JSX.Element => {
  const params = localStorage.getItem('prodTime');
  const defaultParams = params ? JSON.parse(params) : { time: 4 * 60, enabled: false };

  const [timeState, setTimeState] = useState<TimeProdType>(defaultParams);

  const setState = (newState: TimeProdType): void => {
    setTimeState(newState);
    localStorage.setItem('prodTime', JSON.stringify(newState));
  };

  const value: [TimeProdType, (newState: TimeProdType) => void] = useMemo(
    () => [timeState, setState],
    [timeState],
  );
  return <TimeProdContext.Provider value={value}>{children}</TimeProdContext.Provider>;
};

export const useTimeProdInfo = (): [TimeProdType, (newState: TimeProdType) => void] =>
  useContext(TimeProdContext);
