import { useEffect, useState } from 'react';

export const useCountdownShort = (
  seconds: number,
  isActive: boolean,
  onTimeOver: () => unknown,
): number => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const onNextTick = () => {
      if (time === 6) {
        onTimeOver();
      }
      if (time <= 0) {
        setTime(0);
      }

      if (isActive && time !== 0) setTime(time - 1);
    };
    const timeout = setTimeout(onNextTick, 1000);
    return () => clearTimeout(timeout);
  }, [time, isActive]);

  return time;
};
