import { createMuiTheme } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';

export const theme: Theme = createMuiTheme({
  palette: {
    primary: {
      light: '#e77d11',
      main: '#c1440e',
      dark: '#451804',
    },
    secondary: {
      // light: '#8588FB',
      main: '#fda600',
      // dark: '#0B0FA1',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    grey: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161',
    },
  },
  spacing: [0, 4, 8, 12, 20, 32, 52, 84],
});
