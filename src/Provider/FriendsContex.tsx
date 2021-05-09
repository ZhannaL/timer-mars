import { createContext, ReactNode, useState, useMemo, useContext } from 'react';
import { FriendType } from 'domain/FriendType';

const FriendsContext = createContext<[Array<FriendType>, (newState: Array<FriendType>) => void]>([
  [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

type Props = {
  children: ReactNode;
};

export const FriendsProvider = ({ children }: Props): JSX.Element => {
  const params = localStorage.getItem('friends');
  const defaultParams = params ? JSON.parse(params) : [];

  const [friendsState, setFriendsState] = useState<Array<FriendType>>(defaultParams || []);

  const setState = (newState: Array<FriendType>): void => {
    setFriendsState(newState);
    localStorage.setItem('friends', JSON.stringify(newState));
  };

  const value: [Array<FriendType>, (newState: Array<FriendType>) => void] = useMemo(
    () => [friendsState, setState],
    [friendsState],
  );
  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
};

export const useFriends = (): [Array<FriendType>, (newState: Array<FriendType>) => void] =>
  useContext(FriendsContext);
