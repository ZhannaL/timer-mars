import { GameSessionInfo } from 'domain/GameSessionType';
import { useEffect, useState } from 'react';

export const useCountdown = (
  player: GameSessionInfo,
  isActive: boolean,
  onTimeOver: () => unknown,
): number => {
  const [time, setTime] = useState(player.timeToLeft);
  useEffect(() => {
    setTime(player.timeToLeft);
  }, [player]);

  useEffect(() => {
    const onNextTick = () => {
      if (time === 0) {
        setTime(0);
        onTimeOver();
      }

      if (isActive && time !== 0) setTime(time - 1);
    };
    const timeout = setTimeout(onNextTick, 1000);
    return () => clearTimeout(timeout);
  }, [time, isActive]);

  return time;
};
