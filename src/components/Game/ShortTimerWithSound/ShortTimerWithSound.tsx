import { Box, Button, Typography } from '@material-ui/core';
import { useTimeProdInfo } from 'Provider/TimeProdProvider';
import { useState } from 'react';
import notification from 'src/styles/media/TF039.wav';
import { formatTime } from '../Countdown/formatTime';
import { useCountdownShort } from '../Countdown/useCountdownShort';

export const ShortTimerWithSound = (): JSX.Element => {
  const [isActiveTimer, setIsActiveTimer] = useState(false);
  const [prodTimeState] = useTimeProdInfo();

  const notificationAudio = new Audio(notification);

  const seconds = prodTimeState.time;
  const onTimeOver = () => {
    notificationAudio.play();
  };
  const time = useCountdownShort(seconds, isActiveTimer, onTimeOver);
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography component="div" color="primary" align="center">
          <Box fontWeight="fontWeightBold" fontSize={26} py={4}>
            Production phase
          </Box>
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => {
            setIsActiveTimer(!isActiveTimer);
          }}
        >
          <Box fontSize={18}>{isActiveTimer ? 'pause' : 'start'}</Box>
        </Button>
      </Box>
      <Typography component="div" variant="h4" align="center">
        <Box lineHeight={2} fontWeight="fontWeightBold" px={3}>
          {formatTime(time)}
        </Box>
      </Typography>
    </Box>
  );
};
