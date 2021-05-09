import { useState } from 'react';
import classnames from 'classnames';
import { TextField, Button, Typography } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import AlarmIcon from '@material-ui/icons/Alarm';
import { useTimeInfo } from 'Provider/TimeContex';
import * as styles from './setTime.module.css';

type Props = {
  onChange: (newTime: number) => unknown;
};

export const SetTime = ({ onChange }: Props): JSX.Element => {
  const [timeState, setTimeState] = useTimeInfo();
  const [time, setTime] = useState(timeState / 60);
  return (
    <div className={styles.setTimeLine}>
      <div className={styles.timeIcon}>
        <AlarmIcon fontSize="large" />
      </div>
      <div>
        <Button
          className={classnames(styles.inputBtn, styles.leftBtn)}
          variant="contained"
          color="primary"
          onClick={() => {
            setTime(time < 5 ? 0 : time - 5);
            onChange(time < 5 ? 0 : time - 5);
            setTimeState(time < 5 ? 0 : (time - 5) * 60);
          }}
        >
          <RemoveIcon />
        </Button>
        <TextField
          value={time}
          onChange={(event) => {
            setTime(Number(event.target.value));
            onChange(Number(event.target.value));
            setTimeState(Number(event.target.value) * 60);
          }}
          InputProps={{
            inputProps: {
              step: '5',
              min: 0,
              style: {
                textAlign: 'center',
                width: '50px',
              },
            },
          }}
          type="number"
        />
        <Button
          className={classnames(styles.inputBtn, styles.rightBtn)}
          variant="contained"
          color="primary"
          onClick={() => {
            setTime(time + 5);
            onChange(time + 5);
            setTimeState((time + 5) * 60);
          }}
        >
          <AddIcon />
        </Button>
      </div>
      <Typography> &nbsp; Minutes </Typography>
    </div>
  );
};
