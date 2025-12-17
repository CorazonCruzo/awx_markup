import { createTheme } from '@mui/material/styles';
import { COLORS } from './colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY_BLACK,
      contrastText: COLORS.PRIMARY_WHITE,
    },
    secondary: {
      main: COLORS.PRIMARY_YELLOW,
    },
    background: {
      default: COLORS.BG_PAGE,
      paper: COLORS.BG_CARD,
    },
    text: {
      primary: COLORS.TEXT_PRIMARY,
      secondary: COLORS.TEXT_SECONDARY,
    },
    divider: COLORS.BORDER_DEFAULT,
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    h6: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    subtitle2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.2,
      color: COLORS.TEXT_SECONDARY,
    },
    body1: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body2: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.2,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: '16px',
        },
        body: {
          backgroundColor: COLORS.BG_PAGE,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 6,
          backgroundColor: 'transparent',
        },
        grouped: {
          border: 'none',
          borderRadius: '16px !important',
          '&:not(:first-of-type)': {
            marginLeft: 0,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '15px',
          fontWeight: 500,
          padding: '10px 16px',
          color: COLORS.TEXT_PRIMARY,
          backgroundColor: COLORS.BUTTON_INACTIVE_BG,
          border: 'none',
          borderRadius: '16px',
          '&.Mui-selected': {
            backgroundColor: COLORS.BUTTON_ACTIVE_BG,
            color: COLORS.BUTTON_ACTIVE_TEXT,
            '&:hover': {
              backgroundColor: COLORS.BUTTON_ACTIVE_BG,
            },
          },
          '&:hover': {
            backgroundColor: COLORS.BG_PAGE,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: COLORS.TEXT_PRIMARY,
        },
      },
    },
  },
});
