import { Colors } from './ColorType';

export type GameSessionInfo = {
  color: Colors;
  name: string;
  timeToLeft: number;
  hasPassed: boolean;
};

export type GameSessionType = {
  players: Array<GameSessionInfo>;
  generation: number;
  startTime: number;
  isActive: boolean;
};
