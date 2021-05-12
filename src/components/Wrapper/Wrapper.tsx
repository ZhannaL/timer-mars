import { Box } from '@material-ui/core';
import { ReactNode } from 'react';
import * as styles from './wrapper.module.css';

type Props = {
  children: ReactNode;
};

export const Wrapper = ({ children }: Props): JSX.Element => (
  <Box
    className={styles.wrapper}
    display="flex"
    flexDirection="column"
    alignItems="center"
    py={3}
    px={2}
    mx="auto"
  >
    {children}
  </Box>
);
