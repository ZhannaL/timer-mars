import { ReactNode } from 'react';
import { Typography } from '@material-ui/core';

type Props = {
  children: ReactNode;
};

export const Header = ({ children }: Props): JSX.Element => (
  <Typography variant="h3" gutterBottom>
    {children}
  </Typography>
);
