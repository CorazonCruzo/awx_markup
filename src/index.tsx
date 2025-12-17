import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './shared/config/theme';
import { WithdrawalPage } from './pages/withdrawal';
import './app/styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WithdrawalPage />
    </ThemeProvider>
  </React.StrictMode>
);
