import { useState } from 'react';
import { TextField, IconButton, makeStyles, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FriendType } from 'domain/FriendType';
import * as styles from './addFriendItem.module.css';
import { ErrorType, getErrorMessage, isNameDuplicated, isNameHasCommaOrAmper } from '../AddFriends';

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.error.dark,
    marginLeft: '10px',
  },
}));

type Props = {
  allFriend: Array<FriendType>;
  index: number;
  friendName: string;
  onChange: (newName: string) => unknown;
  onDelete: () => unknown;
};

export const AddFriendItem = ({
  allFriend,
  index,
  friendName,
  onChange,
  onDelete,
}: Props): JSX.Element => {
  const classes = useStyles();
  const [name, setName] = useState(friendName);
  const [errorType, setErrorType] = useState<ErrorType>('none');

  return (
    <Box display="flex" alignItems="self-end" py={1} mx="auto" className={styles.item}>
      <TextField
        error={errorType !== 'none'}
        helperText={errorType !== 'none' ? getErrorMessage(errorType) : ' '}
        className={styles.input}
        label={`name ${index + 1}`}
        size="small"
        variant="outlined"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setErrorType('none');

          if (isNameDuplicated(allFriend, event.target.value)) {
            setErrorType('duplicate');
          }
          if (isNameHasCommaOrAmper(event.target.value)) {
            setErrorType('symbols');
          }

          if (
            !isNameDuplicated(allFriend, event.target.value) ||
            !isNameHasCommaOrAmper(event.target.value)
          ) {
            onChange(event.target.value);
          }
        }}
      />
      <IconButton className={classes.button} size="small" onClick={() => onDelete()}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};
