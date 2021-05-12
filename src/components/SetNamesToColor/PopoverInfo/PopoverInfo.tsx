import { Box, IconButton, Popover } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Alert } from '@material-ui/lab';
import { MouseEvent, useEffect, useState } from 'react';

export const PopoverInfo = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (anchorEl) {
      setTimeout(() => {
        handleClose();
      }, 5000);
    }
  }, [anchorEl]);

  return (
    <div>
      <IconButton onClick={handleClick}>
        <InfoOutlinedIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert severity="info" icon={false}>
          <Box py={1}>
            • Drag to set the order of players <br />• The time sets for each player
          </Box>
        </Alert>
      </Popover>
    </div>
  );
};
