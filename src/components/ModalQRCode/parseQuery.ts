import { useEffect } from 'react';
import short from 'short-uuid';
import { useFriends } from 'Provider/FriendsContex';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { useTimeInfo } from 'Provider/TimeContex';
import { colorToPick } from 'styles/colorsToPick';

import { useGameInfo } from 'Provider/GameContex';
import { PageProps } from 'gatsby';

export const parseQuery = (urlParams: PageProps): void => {
  const [, setFriendsState] = useFriends();
  const [, setGameState] = useGameInfo();
  const [, setTimeState] = useTimeInfo();
  const [, setGameSessionState] = useGameSessionInfo();

  useEffect(() => {
    const params = new URLSearchParams(urlParams.location.search);

    setTimeState(Number(params.get('t')) || 2700);

    const allFriendsParam = params.get('af');
    const allFriend = allFriendsParam
      ? allFriendsParam.split(',').map((friend) => ({ id: short.generate(), name: friend }))
      : [];
    // console.log(allFriend);
    setFriendsState(allFriend);

    const generation = Number(params.get('g') || 0);
    const currPlayer = Number(params.get('cp') || 0);
    const colorsParam = params.get('c');
    const colors = colorsParam ? colorsParam.split(',').map((color) => Number(color)) : [];

    const playersParam = params.get('p');
    const players = playersParam ? playersParam.split(',') : [];
    // console.log(colorsParam);

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
    // console.log(timeToLeft);

    const hasPassedParams = params.get('hp');
    const hasPassed = hasPassedParams
      ? hasPassedParams.split(',').map((hp) => Boolean(Number(hp)))
      : [];

    // console.log(hasPassed);

    const playersObj = colors.map((color, index) => ({
      color,
      name: players[index],
      timeToLeft: timeToLeft[index],
      hasPassed: hasPassed[index],
    }));

    // const dateNow = Date.now();
    setGameSessionState({
      players: playersObj,
      currPlayer,
      generation,
      startTime: Date.now(),
      isActive: true,
    });
  }, [urlParams]);
};
