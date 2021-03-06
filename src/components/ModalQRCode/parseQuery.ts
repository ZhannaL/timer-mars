import { useEffect } from 'react';
import short from 'short-uuid';
import { useFriends } from 'Provider/FriendsContex';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { useTimeInfo } from 'Provider/TimeContex';
import { colorToPick } from 'styles/colorsToPick';
import { Base64 } from 'js-base64';
import { useGameInfo } from 'Provider/GameContex';
import { useTimeProdInfo } from 'Provider/TimeProdProvider';

export const parseQuery = (stringParams: string): void => {
  const [, setFriendsState] = useFriends();
  const [, setGameState] = useGameInfo();
  const [, setTimeState] = useTimeInfo();
  const [, setGameSessionState] = useGameSessionInfo();
  const [, setTimeProdState] = useTimeProdInfo();

  useEffect(() => {
    const decodedParams = Base64.fromBase64(stringParams);

    const params = new URLSearchParams(decodedParams);

    setTimeState(Number(params.get('t')) || 2700);

    const allFriendsParam = params.get('af');
    const allFriend = allFriendsParam
      ? allFriendsParam
          .split(',')
          .map((friend) => ({ id: short.generate(), name: friend.replace('%20', ' ') }))
      : [];
    setFriendsState(allFriend);

    const generation = Number(params.get('g') || 0);
    const currPlayer = Number(params.get('cp') || 0);
    const colorsParam = params.get('c');
    const colors = colorsParam ? colorsParam.split(',').map((color) => Number(color)) : [];

    const playersParam = params.get('p');
    const players = playersParam
      ? playersParam.split(',').map((player) => player.replace('%20', ' '))
      : [];

    const gameState = colorToPick.map((color) => ({
      color: color.name,
      name: players[colors.indexOf(color.name)] || 'NoOne',
      timeToLeft: Number(params.get('t')) || 2700,
    }));
    setGameState(gameState);

    const timeToLeftParams = params.get('ttl');
    const timeToLeft = timeToLeftParams
      ? timeToLeftParams.split(',').map((time) => Number(time))
      : [];

    const hasPassedParams = params.get('hp');
    const hasPassed = hasPassedParams
      ? hasPassedParams.split(',').map((hp) => Boolean(Number(hp)))
      : [];

    const playersObj = colors.map((color, index) => ({
      color,
      name: players[index],
      timeToLeft: timeToLeft[index],
      hasPassed: hasPassed[index],
    }));

    setGameSessionState({
      players: playersObj,
      currPlayer,
      generation,
      startTime: Date.now(),
      isActive: true,
    });

    const timeProdParams = params.get('tp');
    const timeProd = timeProdParams ? JSON.parse(timeProdParams) : { time: 4 * 60, enabled: false };

    setTimeProdState(timeProd);
  }, [stringParams]);
};
