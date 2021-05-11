import classnames from 'classnames';
import { Box, Typography } from '@material-ui/core';
import { colorToPick } from 'styles/colorsToPick';
import { GameSessionInfo } from 'domain/GameSessionType';
import { formatTime } from '../../Countdown/formatTime';
import * as styles from './otherPlayer.module.css';

type Props = {
  user: GameSessionInfo;
  length: number;
  animationState: 'fadeIn' | 'none' | 'fadeOut';
  isAnimated: boolean;
};

export const OtherPlayer = ({ user, length, animationState, isAnimated }: Props): JSX.Element => {
  const hexColor = colorToPick.find((el) => el.name === user.color)?.hex;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classnames(
        !isAnimated && (user.hasPassed || user.timeToLeft === 0) ? styles.passed : '',
        animationState === 'fadeIn' && styles.fadeIn,
        animationState === 'fadeOut' && styles.fadeOut,
      )}
      style={{ width: `${100 / length}%` }}
    >
      <svg width="50" height="50">
        <rect x="5" y="5" rx="5" ry="5" width="40" height="40" fill={hexColor} />
      </svg>
      <Typography align="center" className={styles.name}>
        {user.name}
      </Typography>
      <Typography component="div" align="center">
        <Box lineHeight={2} fontWeight="fontWeightBold">
          {formatTime(user.timeToLeft)}
        </Box>
      </Typography>
    </Box>
  );
};
