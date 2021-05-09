import { Link } from 'gatsby';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useState } from 'react';
import short from 'short-uuid';
import { Button, TextField } from '@material-ui/core';
import { FriendType } from 'domain/FriendType';
import { useFriends } from 'Provider/FriendsContex';
import { Wrapper } from 'components/Wrapper';
import { Header } from 'components/Header';
import { GameInfo } from 'domain/GameType';
import { useGameInfo } from 'Provider/GameContex';
import { AddFriendItem } from './AddFriendItem';
import * as styles from './addFriends.module.css';

const isNameDuplicated = (array: Array<FriendType>, name: string) =>
  !!array.find((element) => element.name === name);

export const AddFriends = (): JSX.Element => {
  const [friendsState, setFriendsState] = useFriends();
  const [, setGameState] = useGameInfo();

  const [friendsArr, setFriendsArr] = useState<Array<FriendType>>(friendsState);
  const [nameToAdd, setNameToAdd] = useState<string>('');
  return (
    <>
      <Wrapper>
        <Header> Add Friends </Header>

        {friendsArr.map((friend, index) => (
          <AddFriendItem
            index={index}
            key={friend.id}
            friendName={friend.name}
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
        ))}
        <div className={styles.addPart}>
          <TextField
            error={isNameDuplicated(friendsArr, nameToAdd)}
            helperText={isNameDuplicated(friendsArr, nameToAdd) ? 'this name already exist' : ' '}
            label="new friend"
            size="small"
            variant="outlined"
            value={nameToAdd}
            onChange={(event) => {
              setNameToAdd(event.target.value);
            }}
          />
          <Button
            className={styles.addBtn}
            variant="contained"
            color="primary"
            onClick={() => {
              if (nameToAdd.length !== 0 && !isNameDuplicated(friendsArr, nameToAdd)) {
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
        </div>
        <div className={styles.btnBottom}>
          <Link to={friendsArr.length >= 1 ? '/color/' : ' '} className={styles.rightBtn}>
            <Button variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>
              Set colors
            </Button>
          </Link>
        </div>
      </Wrapper>
    </>
  );
};
