import { FriendType } from 'domain/FriendType';
import { GameSessionType } from 'domain/GameSessionType';
import { TimeProdType } from 'domain/TimeProdType';

export const getQueryString = (
  gameSession: GameSessionType,
  friendsState: Array<FriendType>,
  timeState: number,
  prodTimeState: TimeProdType,
): string => {
  const { generation } = gameSession;
  const color = gameSession.players.map((el) => el.color).join(',');
  const players = gameSession.players.map((el) => el.name.replace(' ', '%20')).join(',');
  const timeToLeft = gameSession.players.map((el) => el.timeToLeft).join(',');
  const hasPassed = gameSession.players.map((el) => (el.hasPassed ? 1 : 0)).join(',');
  const allFriends = friendsState.map((el) => el.name.replace(' ', '%20'));
  const { currPlayer } = gameSession;
  const timeProd = JSON.stringify(prodTimeState);

  return `g=${generation}&c=${color}&p=${players}&ttl=${timeToLeft}&hp=${hasPassed}&af=${allFriends}&t=${timeState}&cp=${currPlayer}&tp=${timeProd}`;
};
