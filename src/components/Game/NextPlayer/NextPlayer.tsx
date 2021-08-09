import { Box, Typography } from '@material-ui/core';
import { GameSessionInfo } from 'domain/GameSessionType';
import { colorToPick } from 'styles/colorsToPick';

type Props = {
  user: GameSessionInfo;
};

export const NextPlayer = ({ user }: Props): JSX.Element => {
  const hexColor = colorToPick.find((el) => el.name === user.color)?.hex;

  return (
    <Box display="flex" flexDirection="column">
      <Typography component="div" color="primary" align="center">
        <Box fontWeight="fontWeightBold" fontSize={28} py={3}>
          Next Player
        </Box>
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center">
        <svg width="70" height="70">
          <rect x="5" y="5" rx="5" ry="5" width="60" height="60" fill={hexColor} />
        </svg>
        <Typography align="center" variant="h4" component="div">
          <Box fontWeight="fontWeightBold" paddingLeft={4}>
            {user.name}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};
