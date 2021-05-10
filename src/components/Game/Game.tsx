import { Link } from 'gatsby';
import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { Wrapper } from 'components/Wrapper';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { GameSessionInfo } from 'domain/GameSessionType';
import QRicon from 'src/images/QR-icon.svg';
import { useScreenWakeLock } from 'utils/useScreenWakeLock';
import { ModalQRCode } from 'components/ModalQRCode';
import { CurrentPlayer } from './CurrentPlayer';
import { OtherPlayers } from './OtherPlayers/OtherPlayers';
import * as styles from './game.module.css';

export const Game = (): JSX.Element => {
  const [gameSessionState, setGameSessionState] = useGameSessionInfo();
  const [currGameSessionState, setCurrGameSessionState] = useState(gameSessionState.players);
  const [generation, setGeneration] = useState(gameSessionState.generation);
  const [isActiveTimer, setIsActiveTimer] = useState(gameSessionState.isActive);
  const [currPlayerIndex, setCurrPlayerIndex] = useState(gameSessionState.currPlayer);

  const getDeltaTime = () => Math.floor((Date.now() - gameSessionState.startTime) / 1000);
  const getNewTime = (prevTime: number) => prevTime - getDeltaTime();

  const onPlay = (updatedGameSession: Array<GameSessionInfo>) => {
    setGameSessionState({
      players: updatedGameSession,
      currPlayer: currPlayerIndex,
      generation,
      startTime: Date.now(),
      isActive: true,
    });
    setCurrGameSessionState(updatedGameSession);
  };

  const onPause = (updatedGameSession: Array<GameSessionInfo>) => {
    setGameSessionState({
      players: [...updatedGameSession],
      currPlayer: currPlayerIndex,
      generation,
      startTime: 0,
      isActive: false,
    });
    setCurrGameSessionState([...updatedGameSession]);
  };

  const movePlayersNextGen = (array: Array<GameSessionInfo>) => {
    const arrToMove = [...array];
    const firstEl = arrToMove[0];
    arrToMove.shift();
    arrToMove.push(firstEl);
    return arrToMove;
  };
  useScreenWakeLock();

  const [isOpenModalQR, setIsOpenModalQR] = useState(false);

  const onPauseGame = () => {
    const updatedSession = currGameSessionState.map((el, index) => {
      if (index === currPlayerIndex) {
        return {
          ...el,
          timeToLeft: getNewTime(el.timeToLeft),
        };
      }
      return el;
    });
    onPause(updatedSession);
    setIsActiveTimer(false);
  };

  const onPlayGame = () => {
    onPlay(currGameSessionState);
    setIsActiveTimer(true);
  };

  const onNextPlayer = () => {
    setIsActiveTimer(true);
    if (gameSessionState.startTime !== 0) {
      const updatedSession = currGameSessionState.map((el, index) => {
        if (index === currPlayerIndex) {
          return {
            ...el,
            timeToLeft: getNewTime(el.timeToLeft),
          };
        }
        return el;
      });
      onPlay(updatedSession);
    }

    if (gameSessionState.startTime === 0) {
      onPlay(currGameSessionState);
    }

    setCurrPlayerIndex(
      currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
    );
  };

  const isFinishedGame = () =>
    currGameSessionState.filter((player) => player.timeToLeft === 0).length ===
    currGameSessionState.length;

  const isAllPassed = () =>
    currGameSessionState.filter((player) => player.hasPassed).length ===
    currGameSessionState.length;

  useEffect(() => {
    const onUpdateState = () => {
      if (isActiveTimer && !isAllPassed()) {
        const updatedSession = currGameSessionState.map((el, index) => {
          if (index === currPlayerIndex) {
            return {
              ...el,
              timeToLeft: getNewTime(el.timeToLeft),
            };
          }
          return el;
        });
        onPlay(updatedSession);
      }
    };
    const timeout = setTimeout(onUpdateState, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [currGameSessionState, isActiveTimer]);

  return (
    <Wrapper>
      <div className={styles.otherPlayers}>
        {currGameSessionState.map((otherUser) => (
          <OtherPlayers
            key={otherUser.color}
            user={otherUser}
            length={currGameSessionState.length}
          />
        ))}
      </div>
      <Typography variant="h6" gutterBottom color="primary" component="div">
        <Box lineHeight={2} fontWeight="fontWeightBold">
          Generation: {generation}
        </Box>
      </Typography>
      {currGameSessionState[currPlayerIndex].hasPassed &&
      currGameSessionState.filter((el) => el.hasPassed).length !== currGameSessionState.length
        ? setCurrPlayerIndex(
            currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
          )
        : null}
      {currGameSessionState.filter((el) => el.hasPassed).length !== currGameSessionState.length ? (
        <CurrentPlayer
          currentPlayer={currGameSessionState[currPlayerIndex]}
          isActiveTimer={isActiveTimer}
          onTimeOver={() => {
            setIsActiveTimer(false);
            if (gameSessionState.startTime !== 0) {
              const updatedSession = currGameSessionState.map((el, index) => {
                if (index === currPlayerIndex) {
                  return {
                    ...el,
                    timeToLeft: 0,
                    hasPassed: true,
                  };
                }
                return el;
              });
              onPause(updatedSession);
            }

            if (gameSessionState.startTime === 0) {
              onPause(currGameSessionState);
            }

            setCurrPlayerIndex(
              currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
            );
          }}
          onNextPlayer={() => {
            onNextPlayer();
          }}
        />
      ) : (
        <div className={styles.nextGenField}>
          {isFinishedGame() ? (
            <Box
              className={styles.btnNextGen}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography variant="h6" gutterBottom color="primary" component="div">
                <Box lineHeight={2} fontWeight="fontWeightBold">
                  Time is over for All players
                </Box>
              </Typography>
              <Typography variant="h6" gutterBottom color="primary" component="div">
                <Box lineHeight={2} fontWeight="fontWeightBold">
                  Finish game
                </Box>
              </Typography>
            </Box>
          ) : (
            <Button
              className={styles.btnNextGen}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                const updatedSessionNextGen = movePlayersNextGen(currGameSessionState).map(
                  (player) => {
                    if (player.timeToLeft === 0) {
                      return { ...player };
                    }
                    return { ...player, hasPassed: false };
                  },
                );

                setIsActiveTimer(false);
                setGeneration(generation + 1);
                setCurrGameSessionState(updatedSessionNextGen);
                setGameSessionState({
                  players: updatedSessionNextGen,
                  currPlayer: 0,
                  generation: generation + 1,
                  startTime: 0,
                  isActive: false,
                });

                setCurrPlayerIndex(0);
              }}
            >
              next Generation
            </Button>
          )}
        </div>
      )}

      <div className={styles.btnsBottom}>
        {isActiveTimer ? (
          <Button
            disabled={isFinishedGame() || isAllPassed()}
            className={styles.btnPlay}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              onPauseGame();
            }}
          >
            pause
          </Button>
        ) : (
          <Button
            disabled={isFinishedGame() || isAllPassed()}
            className={styles.btnPlay}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              onPlayGame();
            }}
          >
            play
          </Button>
        )}

        <Button
          disabled={isFinishedGame() || isAllPassed()}
          className={styles.btnPass}
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => {
            if (gameSessionState.startTime !== 0) {
              const updatedSession = currGameSessionState.map((el, index) => {
                if (index === currPlayerIndex) {
                  return {
                    ...el,
                    timeToLeft: getNewTime(el.timeToLeft),
                    hasPassed: true,
                  };
                }
                return el;
              });
              onPlay(updatedSession);
            } else {
              const updatedSession = currGameSessionState.map((el, index) => {
                if (index === currPlayerIndex) {
                  return {
                    ...el,

                    hasPassed: true,
                  };
                }
                return el;
              });
              onPlay(updatedSession);
            }
            setCurrPlayerIndex(
              currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
            );
            setIsActiveTimer(true);
          }}
        >
          pass
        </Button>

        <Link to="/finished-game" className={styles.btnFinish}>
          <Button variant="contained" color="secondary" size="large">
            <Box lineHeight={2} fontWeight="fontWeightBold">
              Finish game
            </Box>
          </Button>
        </Link>
        <Button
          disabled={isFinishedGame()}
          onClick={() => setIsOpenModalQR(true)}
          className={styles.btnQR}
          variant="contained"
          color="secondary"
          size="large"
        >
          <QRicon />
        </Button>
      </div>
      <ModalQRCode isOpen={isOpenModalQR} onClose={() => setIsOpenModalQR(false)} />
    </Wrapper>
  );
};
