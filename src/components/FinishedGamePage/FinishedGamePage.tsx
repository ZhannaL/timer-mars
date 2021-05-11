import { Box, Button, Grow, Typography } from '@material-ui/core';
import { formatTime } from 'components/Game/Countdown/formatTime';
import { Header } from 'components/Header';
import { Wrapper } from 'components/Wrapper';
import { navigate } from 'gatsby';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { useEffect, useState } from 'react';
import { colorToPick } from 'styles/colorsToPick';
import * as styles from './finishedGamePage.module.css';

export const FinishedGamePage = (): JSX.Element => {
  const [gameSessionState] = useGameSessionInfo();
  const [isSlided, setIsSlided] = useState(false);

  useEffect(() => {
    const onloadFn = () => {
      setIsSlided(true);
    };
    const timeout = setTimeout(onloadFn, 100);
    return () => clearTimeout(timeout);
  }, []);

  const nextPage = () => {
    setIsSlided(false);
    setTimeout(() => navigate('/color/'), 100);
  };
  return (
    <Wrapper>
      <Grow in={isSlided}>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          <Header> Finished Game </Header>
          <Box p={2} display="flex" alignItems="center">
            <Typography variant="h6" color="primary" component="div">
              <Box lineHeight={2} fontWeight="fontWeightBold">
                Generations:
              </Box>
            </Typography>
            <Typography variant="h5" component="div">
              <Box lineHeight={2} fontWeight="fontWeightBold">
                &nbsp; {gameSessionState.generation}
              </Box>
            </Typography>
          </Box>
          <Box p={1} display="flex" alignItems="center">
            <Typography variant="h6" color="primary" component="div">
              <Box lineHeight={1} fontWeight="fontWeightBold">
                Time left
              </Box>
            </Typography>
          </Box>
          <Box width="100%">
            {[...gameSessionState.players]
              .sort((a, b) => b.timeToLeft - a.timeToLeft)
              .map((player) => (
                <Box
                  key={player.name}
                  p={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  flexGrow={1}
                >
                  <svg width="50" height="50">
                    <rect
                      x="5"
                      y="5"
                      rx="5"
                      ry="5"
                      width="40"
                      height="40"
                      fill={colorToPick.find((el) => el.name === player.color)?.hex}
                    />
                  </svg>
                  <Typography variant="h6" color="primary" component="div" className={styles.name}>
                    <Box lineHeight={1} fontWeight="fontWeightBold" mx={3}>
                      {player.name} :
                    </Box>
                  </Typography>
                  <Typography variant="h6" component="div">
                    <Box lineHeight={1} fontWeight="fontWeightBold">
                      &nbsp; {formatTime(player.timeToLeft)}
                    </Box>
                  </Typography>
                </Box>
              ))}
          </Box>
          <Box py={4} width="100%" display="flex">
            <Button
              className={styles.finishGameBtn}
              onClick={() => {
                nextPage();
              }}
              variant="contained"
              color="secondary"
              size="large"
            >
              <Box lineHeight={2} fontWeight="fontWeightBold">
                Finish game
              </Box>
            </Button>
          </Box>
        </Box>
      </Grow>
    </Wrapper>
  );
};
