import { Box, Button, makeStyles, Theme, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { colorToPick } from 'styles/colorsToPick';
import { GameSessionInfo } from 'domain/GameSessionType';
import { formatTime } from '../Countdown/formatTime';
import { useCountdown } from '../Countdown/useCountdown';
import * as styles from './currentPlayer.module.css';

type ThemeProps = {
  colorHex: string;
};

const useStyles = makeStyles<Theme, ThemeProps>((theme: Theme) => ({
  btn: (props: ThemeProps) => {
    if (props) {
      const color = theme.palette.getContrastText(props.colorHex);
      return {
        margin: 'auto',
        backgroundColor: props.colorHex,
        width: '100%',
        height: '40vh',
        '&:hover': {
          backgroundColor: props.colorHex,
        },
        '&:focus': {
          backgroundColor: props.colorHex,
        },
        color,
      };
    }
    return {};
  },
}));

type Props = {
  currentPlayer: GameSessionInfo;
  onNextPlayer: () => unknown;
  onTimeOver: () => unknown;
  isActiveTimer: boolean;
};

export const CurrentPlayer = ({
  currentPlayer,
  onNextPlayer,
  onTimeOver,
  isActiveTimer,
}: Props): JSX.Element => {
  const hexColor = colorToPick.find((el) => el.name === currentPlayer.color)?.hex;
  const time = useCountdown(currentPlayer, isActiveTimer, onTimeOver);
  const classes = useStyles({ colorHex: hexColor ?? '#a5a5a6' });

  return (
    <Button
      className={classes.btn}
      variant="contained"
      color="inherit"
      onClick={() => {
        onNextPlayer();
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        <Typography variant="h5" className={styles.name} component="div">
          <Box lineHeight={2} fontWeight="fontWeightBold">
            {currentPlayer.name}
          </Box>
        </Typography>

        <Typography component="div" variant="h6" className={styles.name}>
          <Box lineHeight={2} fontWeight="fontWeightBold">
            {formatTime(time)}
          </Box>
        </Typography>

        <Typography component="div" variant="h5">
          <Box
            lineHeight={2}
            fontWeight="fontWeightBold"
            display="flex"
            alignItems="center"
            marginTop="60px"
          >
            Next Player <ArrowRightAltIcon fontSize="large" />
          </Box>
        </Typography>
      </Box>
    </Button>
  );
};
