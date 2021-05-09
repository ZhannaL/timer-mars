import { useState } from 'react';
import { TextField, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as styles from './addFriendItem.module.css';

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.error.dark,
    marginLeft: '10px',
  },
}));

type Props = {
  index: number;
  friendName: string;
  onChange: (newName: string) => unknown;
  onDelete: () => unknown;
};

export const AddFriendItem = ({ index, friendName, onChange, onDelete }: Props): JSX.Element => {
  const classes = useStyles();
  const [name, setName] = useState(friendName);

  return (
    <div className={styles.item}>
      <TextField
        className={styles.input}
        label={`name ${index + 1}`}
        size="small"
        variant="outlined"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          onChange(event.target.value);
        }}
      />
      <IconButton className={classes.button} size="small" onClick={() => onDelete()}>
        <CloseIcon />
      </IconButton>
    </div>
  );
};
