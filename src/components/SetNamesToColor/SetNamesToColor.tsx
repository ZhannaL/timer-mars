/* eslint-disable react/jsx-props-no-spreading */
import { navigate } from 'gatsby';
import { Wrapper } from 'components/Wrapper';
import { useGameInfo } from 'Provider/GameContex';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { Header } from 'components/Header';
import { Box, Button, Grow } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { useFriends } from 'Provider/FriendsContex';
import { SetNamesToColorItem } from './SetNamesToColorItem';
import { SetTime } from './SetTime';
import * as styles from './setNamesToColor.module.css';

export const SetNamesToColor = (): JSX.Element => {
  const [gameState, setGameState] = useGameInfo();
  const [friendsState] = useFriends();
  const [, setGameSessionState] = useGameSessionInfo();

  const [characters, updateCharacters] = useState(gameState);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
    setGameState(items);
  };

  useEffect(() => {
    const updatedGameState = characters.map((character) => {
      if (friendsState.find((friend) => friend.name === character.name)) {
        return character;
      }
      return {
        ...character,
        name: 'NoOne',
      };
    });

    updateCharacters(updatedGameState);
    setGameState(updatedGameState);
  }, []);

  const [isSlided, setIsSlided] = useState(false);
  useEffect(() => {
    const onloadFn = () => {
      setIsSlided(true);
    };
    const timeout = setTimeout(onloadFn, 100);
    return () => clearTimeout(timeout);
  }, []);

  const onPrevPage = () => {
    setIsSlided(false);
    setTimeout(() => navigate('/'), 100);
  };
  const onGamePage = () => {
    if (gameState.filter((el) => el.name === 'NoOne').length !== 5) {
      const dateNow = Date.now();
      setGameSessionState({
        players: gameState
          .filter((el) => el.name !== 'NoOne')
          .map((player) => ({ ...player, hasPassed: false })),
        currPlayer: 0,
        generation: 1,
        startTime: dateNow,
        isActive: true,
      });

      setIsSlided(false);
      setTimeout(() => navigate('/game/'), 500);
    }
  };

  return (
    <Wrapper>
      <Header> Set Color </Header>
      <Grow in={isSlided} mountOnEnter unmountOnExit>
        <div style={{ width: '100%' }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={styles.draggableList}>
              {(provided) => (
                <div
                  className={styles.draggableList}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {characters.map((element, index) => (
                    <Draggable
                      key={element.color}
                      draggableId={String(element.color)}
                      index={index}
                    >
                      {(providedInner) => (
                        <SetNamesToColorItem
                          provided={providedInner}
                          nameAndColor={element}
                          onChange={(newName) => {
                            characters[index].name = newName;
                            updateCharacters([...characters]);
                            setGameState([...characters]);
                          }}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <SetTime
            onChange={(newTime) => {
              const updatedItems = characters.map((el) => ({ ...el, timeToLeft: newTime * 60 }));
              updateCharacters(updatedItems);
              setGameState(updatedItems);
            }}
          />

          <div className={styles.btnBack}>
            <Button
              onClick={() => {
                onPrevPage();
              }}
              variant="contained"
              color="secondary"
              startIcon={<ArrowBackIcon />}
            >
              Friends List
            </Button>
          </div>
          <div className={styles.btnStartGame}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={styles.rightBtn}
              onClick={() => {
                onGamePage();
              }}
            >
              <Box lineHeight={2} fontWeight="fontWeightBold">
                Start game
              </Box>
            </Button>
          </div>
        </div>
      </Grow>
    </Wrapper>
  );
};
