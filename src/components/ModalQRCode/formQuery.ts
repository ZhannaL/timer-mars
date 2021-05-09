import { FriendType } from 'domain/FriendType';
import { GameSessionType } from 'domain/GameSessionType';

export const getQueryString = (
  gameSession: GameSessionType,
  friendsState: Array<FriendType>,
  timeState: number,
): string => {
  const webPage = 'https://www.timer-mars.netlify.com/game/';
  const { generation } = gameSession;
  const color = gameSession.players.map((el) => el.color).join(',');
  const players = gameSession.players.map((el) => el.name).join(',');
  const timeToLeft = gameSession.players.map((el) => el.timeToLeft).join(',');
  const hasPassed = gameSession.players.map((el) => (el.hasPassed ? 1 : 0)).join(',');

  const allFriends = friendsState.map((el) => el.name);
  return `${webPage}q?g=${generation}c=${color}&p=${players}&ttp=${timeToLeft}&hp=${hasPassed}&af=${allFriends}&t=${timeState}`;
};
