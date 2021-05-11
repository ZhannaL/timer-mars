import { useState } from 'react';
import { TextField, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FriendType } from 'domain/FriendType';
import * as styles from './addFriendItem.module.css';
import { isNameDuplicated } from '../AddFriends';

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
  const [error, setError] = useState(false);

  return (
    <div className={styles.item}>
      <TextField
        error={error}
        helperText={error ? 'this name already exist' : ' '}
        className={styles.input}
        label={`name ${index + 1}`}
        size="small"
        variant="outlined"
        value={name}
        onChange={(event) => {
          setName(event.target.value);

          if (!isNameDuplicated(allFriend, event.target.value)) {
            onChange(event.target.value);
            setError(false);
          } else {
            setError(true);
          }
        }}
      />
      <IconButton className={classes.button} size="small" onClick={() => onDelete()}>
        <CloseIcon />
      </IconButton>
    </div>
  );
};
