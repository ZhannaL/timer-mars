import { useState } from 'react';
import classnames from 'classnames';
import { TextField, Button, Typography, Box, FormControlLabel, Switch } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';

import AddIcon from '@material-ui/icons/Add';
import AlarmIcon from '@material-ui/icons/Alarm';
import { useTimeProdInfo } from 'Provider/TimeProdProvider';
import * as styles from './setTime.module.css';

export const SetTimeProd = (): JSX.Element => {
  const [timeState, setTimeState] = useTimeProdInfo();
  const [time, setTime] = useState(timeState.time / 60);

  const [checked, setChecked] = useState(timeState.enabled);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setTimeState({ time: time * 60, enabled: event.target.checked });
  };
  return (
    <Box display="flex" flexDirection="column" width="100%" py={1} className={styles.setTimeLine}>
      <Box px={2}>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label={
            <Typography component="div" color="primary">
              <Box fontWeight="fontWeightBold" fontSize={18} py={1}>
                Production Phase
              </Box>
            </Typography>
          }
        />
      </Box>
      {checked ? (
        <Box display="flex" alignItems="center" width="100%" py={1}>
          <div className={styles.timeIcon}>
            <AlarmIcon fontSize="large" />
          </div>
          <div>
            <Button
              className={classnames(styles.inputBtn, styles.leftBtn)}
              variant="contained"
              color="primary"
              onClick={() => {
                setTime(time < 1 ? 0 : time - 1);
                setTimeState({ time: time < 1 ? 0 : (time - 1) * 60, enabled: checked });
              }}
            >
              <RemoveIcon />
            </Button>
            <TextField
              value={time}
              onChange={(event) => {
                setTime(Number(event.target.value));
                setTimeState({ time: Number(event.target.value) * 60, enabled: checked });
              }}
              InputProps={{
                inputProps: {
                  step: '1',
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
                setTime(time + 1);
                setTimeState({ time: (time + 1) * 60, enabled: checked });
              }}
            >
              <AddIcon />
            </Button>
          </div>
          <Typography> &nbsp; Min </Typography>
        </Box>
      ) : null}
    </Box>
  );
};
