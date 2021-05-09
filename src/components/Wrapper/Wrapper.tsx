import { ReactNode } from 'react';
import * as styles from './wrapper.module.css';

type Props = {
  children: ReactNode;
};

export const Wrapper = ({ children }: Props): JSX.Element => (
  <div className={styles.wrapper}>{children}</div>
);
