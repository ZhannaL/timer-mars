import { useState } from 'react';
import type { ReactNode } from 'react';

import { Dialog, DialogTitle, DialogActions, Button, Box } from '@material-ui/core';

type Props = Readonly<{
  children: ReactNode;

  onConfirm: () => unknown;
}>;

export const Confirm = ({
  children,

  onConfirm,
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const onClick = () => {
    onConfirm();
    handleClose();
  };
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        onKeyPress={() => setOpen(true)}
      >
        {children}
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Are sure you want to Finish Game</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            <Box fontSize={21}>Cancel</Box>
          </Button>
          <Button onClick={onClick} color="primary" variant="contained">
            <Box fontSize={21}>Yes</Box>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
