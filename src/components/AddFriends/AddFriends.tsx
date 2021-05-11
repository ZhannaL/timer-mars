/* eslint-disable no-nested-ternary */
import { navigate } from 'gatsby';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useEffect, useState } from 'react';
import short from 'short-uuid';
import { Box, Button, Collapse, Grow, TextField } from '@material-ui/core';
import { FriendType } from 'domain/FriendType';
import { useFriends } from 'Provider/FriendsContex';
import { Wrapper } from 'components/Wrapper';
import { Header } from 'components/Header';
import { GameInfo } from 'domain/GameType';
import { useGameInfo } from 'Provider/GameContex';
import { TransitionGroup } from 'react-transition-group';
import { AddFriendItem } from './AddFriendItem';

import * as styles from './addFriends.module.css';

export const isNameDuplicated = (array: Array<FriendType>, name: string): boolean =>
  !!array.find((element) => element.name === name);

export const isNameHasCommaOrAmper = (name: string): boolean =>
  name.includes(',') || name.includes('&') || name.includes('=');

export type ErrorType = 'symbols' | 'duplicate' | 'none';

export const getErrorMessage = (errorType: ErrorType): string => {
  switch (errorType) {
    case 'none':
      return '';
    case 'symbols':
      return ', & = are forbidden';
    case 'duplicate':
      return 'this name already exist';

    default:
      ((_: never) => _)(errorType);
      throw new Error('unknown user type');
  }
};

export const AddFriends = (): JSX.Element => {
  const [friendsState, setFriendsState] = useFriends();
  const [, setGameState] = useGameInfo();

  const [friendsArr, setFriendsArr] = useState<Array<FriendType>>(friendsState);
  const [nameToAdd, setNameToAdd] = useState<string>('');

  const [errorType, setErrorType] = useState<ErrorType>('none');

  const [isSlided, setIsSlided] = useState(false);
  useEffect(() => {
    const onloadFn = () => {
      setIsSlided(true);
    };
    const timeout = setTimeout(onloadFn, 100);
    return () => clearTimeout(timeout);
  }, []);

  const nextPage = () => {
    if (friendsArr.length >= 1) {
      setIsSlided(false);
      setTimeout(() => navigate('/color/'), 100);
    }
  };

  return (
    <>
      <Wrapper>
        <Header> Add Friends </Header>
        <Grow in={isSlided}>
          <div className={styles.transitionPart}>
            <TransitionGroup>
              {friendsArr.map((friend, index) => (
                <Collapse key={friend.id}>
                  <AddFriendItem
                    index={index}
                    key={friend.id}
                    friendName={friend.name}
                    allFriend={friendsArr}
                    onChange={(newName) => {
                      friendsArr[index].name = newName;
                      setFriendsArr([...friendsArr]);
                      setFriendsState([...friendsArr]);
                    }}
                    onDelete={() => {
                      const updatedArr = friendsArr.filter((el) => el.id !== friend.id);
                      setFriendsArr(updatedArr);
                      setFriendsState(updatedArr);

                      const params = localStorage.getItem('game');
                      if (params) {
                        const gameParams: Array<GameInfo> = JSON.parse(params);
                        const updatedParams = gameParams.map((el) => {
                          if (el.name === friend.name) {
                            return { ...el, name: 'NoOne' };
                          }
                          return el;
                        });
                        setGameState(updatedParams);
                      }
                    }}
                  />
                </Collapse>
              ))}
            </TransitionGroup>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginTop={4}
              className={styles.addPart}
            >
              <TextField
                error={errorType !== 'none'}
                helperText={errorType !== 'none' ? getErrorMessage(errorType) : ' '}
                label="new friend"
                size="small"
                variant="outlined"
                value={nameToAdd}
                onChange={(event) => {
                  setErrorType('none');
                  setNameToAdd(event.target.value);
                  if (isNameDuplicated(friendsArr, event.target.value)) {
                    setErrorType('duplicate');
                  }
                  if (isNameHasCommaOrAmper(event.target.value)) {
                    setErrorType('symbols');
                  }
                }}
              />
              <Button
                className={styles.addBtn}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (
                    nameToAdd.length !== 0 &&
                    !isNameDuplicated(friendsArr, nameToAdd) &&
                    !isNameHasCommaOrAmper(nameToAdd)
                  ) {
                    const createdId = short.generate();
                    setFriendsArr(
                      friendsArr.concat({
                        id: createdId,
                        name: nameToAdd,
                      }),
                    );

                    setFriendsState(
                      friendsArr.concat({
                        id: createdId,
                        name: nameToAdd,
                      }),
                    );
                    setNameToAdd('');
                  }
                }}
              >
                add
              </Button>
            </Box>
            <Box display="flex" width="100%">
              <Button
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                className={styles.rightBtn}
                onClick={() => {
                  nextPage();
                }}
              >
                Set colors
              </Button>
            </Box>
          </div>
        </Grow>
      </Wrapper>
    </>
  );
};
