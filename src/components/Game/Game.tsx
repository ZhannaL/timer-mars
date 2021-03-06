import { Link, navigate } from 'gatsby';

import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { Wrapper } from 'components/Wrapper';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { GameSessionInfo } from 'domain/GameSessionType';
import QRicon from 'src/images/QR-icon.svg';
import { useScreenWakeLock } from 'utils/useScreenWakeLock';
import { ModalQRCode } from 'components/ModalQRCode';
import { useTimeProdInfo } from 'Provider/TimeProdProvider';
import { Confirm } from 'components/Confirm';
import { CurrentPlayer } from './CurrentPlayer';
import * as styles from './game.module.css';
import { AllPlayers } from './AllPlayers';
import { NextPlayer } from './NextPlayer';
import { ShortTimerWithSound } from './ShortTimerWithSound';

export const Game = (): JSX.Element => {
  const [gameSessionState, setGameSessionState] = useGameSessionInfo();
  const [currGameSessionState, setCurrGameSessionState] = useState(gameSessionState.players);
  const [generation, setGeneration] = useState(gameSessionState.generation);
  const [isActiveTimer, setIsActiveTimer] = useState(gameSessionState.isActive);
  const [currPlayerIndex, setCurrPlayerIndex] = useState(gameSessionState.currPlayer);

  const [prodTimeState] = useTimeProdInfo();

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
    setCurrPlayerIndex(
      currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
    );
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

      setGameSessionState({
        players: updatedSession,
        currPlayer:
          currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
        generation,
        startTime: Date.now(),
        isActive: true,
      });
      setCurrGameSessionState(updatedSession);
    }

    if (gameSessionState.startTime === 0) {
      setGameSessionState({
        players: currGameSessionState,
        currPlayer:
          currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
        generation,
        startTime: Date.now(),
        isActive: true,
      });
      setCurrGameSessionState(currGameSessionState);
    }
  };

  const isFinishedGame = () =>
    currGameSessionState.filter((player) => player.timeToLeft === 0).length ===
    currGameSessionState.length;

  const isAllPassed = () =>
    currGameSessionState.filter((player) => player.hasPassed).length ===
    currGameSessionState.length;

  useEffect(() => {
    setGameSessionState({
      players: currGameSessionState,
      currPlayer: currPlayerIndex,
      generation,
      startTime: gameSessionState.startTime,
      isActive: true,
    });
    setCurrGameSessionState(currGameSessionState);

    const onUpdateState = () => {
      if (isActiveTimer && !isAllPassed()) {
        const dateNow = Date.now();
        const updatedSession = currGameSessionState.map((el, index) => {
          if (index === currPlayerIndex) {
            return {
              ...el,
              timeToLeft: el.timeToLeft - Math.floor((dateNow - gameSessionState.startTime) / 1000),
            };
          }
          return el;
        });
        setGameSessionState({
          players: updatedSession,
          currPlayer: currPlayerIndex,
          generation,
          startTime: dateNow,
          isActive: true,
        });
        setCurrGameSessionState(updatedSession);
      }
    };
    const timeout = setTimeout(onUpdateState, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [currGameSessionState, isActiveTimer]);

  return (
    <Wrapper>
      <AllPlayers currGameSessionState={currGameSessionState} generation={generation} />

      <Typography variant="h6" color="primary" component="div">
        <Box lineHeight={2} fontWeight="fontWeightBold">
          Generation: {generation}
        </Box>
      </Typography>
      {currGameSessionState[currPlayerIndex].hasPassed && !isAllPassed()
        ? setCurrPlayerIndex(
            currPlayerIndex === gameSessionState.players.length - 1 ? 0 : currPlayerIndex + 1,
          )
        : null}
      {!isAllPassed() ? (
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
        <Box display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
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
            <Box display="flex" flexDirection="column" height="100%" width="100%">
              <Button
                className={styles.btnNextGen}
                fullWidth
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

                  setIsActiveTimer(true);
                  setGeneration(generation + 1);
                  setCurrGameSessionState(updatedSessionNextGen);
                  setGameSessionState({
                    players: updatedSessionNextGen,
                    currPlayer: 0,
                    generation: generation + 1,
                    startTime: Date.now(),
                    isActive: true,
                  });

                  setCurrPlayerIndex(0);
                }}
              >
                start new Generation
              </Button>
              <Box my="auto">
                <NextPlayer
                  user={
                    currGameSessionState[
                      currPlayerIndex === gameSessionState.players.length - 1
                        ? 0
                        : currPlayerIndex + 1
                    ]
                  }
                />
              </Box>
              {prodTimeState.enabled ? (
                <Box my="auto">
                  <ShortTimerWithSound />
                </Box>
              ) : null}

              <Box marginTop="auto" display="flex" className={styles.btnsBottomNxt}>
                <Confirm onConfirm={() => navigate('/finished-game')}>
                  <Button
                    className={styles.btnFinishNxt}
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                  >
                    <Box lineHeight={2} fontWeight="fontWeightBold">
                      Finish game
                    </Box>
                  </Button>
                </Confirm>
                <Button
                  className={styles.btnQRNxt}
                  disabled={isFinishedGame()}
                  onClick={() => setIsOpenModalQR(true)}
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  <QRicon />
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
      {!isAllPassed() ? (
        <div className={styles.btnsBottom}>
          {isActiveTimer ? (
            <Button
              disabled={isFinishedGame() || isAllPassed()}
              className={styles.btnPlay}
              variant="contained"
              color="secondary"
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
              color="secondary"
              size="large"
              onClick={() => {
                onPlayGame();
              }}
            >
              <Box fontSize={18}>play</Box>
            </Button>
          )}

          <Button
            disabled={isFinishedGame() || isAllPassed()}
            className={styles.btnPass}
            variant="contained"
            color="primary"
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
            <Typography variant="h4">
              <Box fontWeight="bold">pass</Box>
            </Typography>
          </Button>
          {!isActiveTimer ? (
            <>
              <Box className={styles.btnFinish}>
                <Confirm onConfirm={() => navigate('/finished-game')}>
                  <Button variant="contained" color="secondary" size="large" fullWidth>
                    <Box lineHeight={2} fontWeight="fontWeightBold">
                      Finish game
                    </Box>
                  </Button>
                </Confirm>
              </Box>
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
            </>
          ) : null}
        </div>
      ) : null}

      {isOpenModalQR && <ModalQRCode onClose={() => setIsOpenModalQR(false)} />}
    </Wrapper>
  );
};
