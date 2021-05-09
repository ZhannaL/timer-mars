import { StylesProvider, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { theme } from './src/styles/material-ui-theme';
import { GameProvider } from './src/Provider/GameContex';
import { FriendsProvider } from './src/Provider/FriendsContex';
import { TimeProvider } from './src/Provider/TimeContex';
import { GameSessionProvider } from './src/Provider/GameSessionContex';
import './src/styles/normalize.css';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => (
  <FriendsProvider>
    <TimeProvider>
      <GameProvider>
        <GameSessionProvider>
          <StylesProvider injectFirst>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              {element}
            </MuiThemeProvider>
          </StylesProvider>
        </GameSessionProvider>
      </GameProvider>
    </TimeProvider>
  </FriendsProvider>
);
