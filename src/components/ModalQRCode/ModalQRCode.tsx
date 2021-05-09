import QRCode from 'qrcode.react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { useGameSessionInfo } from 'Provider/GameSessionContex';
import { useFriends } from 'Provider/FriendsContex';
import { useTimeInfo } from 'Provider/TimeContex';
import { copyToClipboard } from 'helpers/copyToClipBoard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { getQueryString } from './formQuery';
import * as styles from './modalQRCode.module.css';

type Props = {
  isOpen: boolean;
  onClose: (value: string) => void;
};

export const ModalQRCode = ({ isOpen, onClose }: Props): JSX.Element => {
  const [friendsState] = useFriends();
  const [timeState] = useTimeInfo();
  const [gameSessionState] = useGameSessionInfo();

  const linkToShare = getQueryString(gameSessionState, friendsState, timeState);
  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth>
      <DialogTitle>
        <Typography align="center" variant="h4" color="primary">
          Share this game
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography align="center" gutterBottom>
          <Box lineHeight={2} fontWeight="fontWeightBold">
            Scan QR code
          </Box>
        </Typography>
        <Typography align="center">
          <QRCode renderAs="svg" size={256} value={linkToShare} />
        </Typography>
      </DialogContent>

      <DialogContent dividers>
        <Typography align="center">
          <Box lineHeight={2} fontWeight="fontWeightBold">
            or copy link
          </Box>
        </Typography>
        <div className={styles.linkPart}>
          <Typography variant="body1" className={styles.link}>
            {linkToShare}
          </Typography>
          <IconButton
            color="primary"
            onClick={() => {
              copyToClipboard(linkToShare);
            }}
          >
            <FileCopyOutlinedIcon />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
