/* eslint-disable react/jsx-props-no-spreading */
import { Link } from 'gatsby';
import { Wrapper } from 'components/Wrapper';
import { useGameInfo } from 'Provider/GameContex';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useState } from 'react';
import { Header } from 'components/Header';
import { Box, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { SetNamesToColorItem } from './SetNamesToColorItem';
import { SetTime } from './SetTime';
import * as styles from './setNamesToColor.module.css';

export const SetNamesToColor = (): JSX.Element => {
  const [gameState, setGameState] = useGameInfo();
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

  return (
    <>
      <Wrapper>
        <Header> Set Color </Header>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId={styles.draggableList}>
            {(provided) => (
              <div
                className={styles.draggableList}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {characters.map((element, index) => (
                  <Draggable key={element.color} draggableId={String(element.color)} index={index}>
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
          <Link to="/">
            <Button variant="contained" color="secondary" startIcon={<ArrowBackIcon />}>
              Friends List
            </Button>
          </Link>
        </div>
        <div className={styles.btnStartGame}>
          <Link
            to={gameState.filter((el) => el.name === 'NoOne').length === 5 ? ' ' : '/game/'}
            className={styles.rightBtn}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                const dateNow = Date.now();
                setGameSessionState({
                  players: gameState
                    .filter((el) => el.name !== 'NoOne')
                    .map((player) => ({ ...player, hasPassed: false })),
                  generation: 1,
                  startTime: dateNow,
                  isActive: true,
                });
              }}
            >
              <Box lineHeight={2} fontWeight="fontWeightBold">
                Start game
              </Box>
            </Button>
          </Link>
        </div>
      </Wrapper>
    </>
  );
};