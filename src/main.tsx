import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(0,152, 234)'
    },

  },
});

const manifestUrl = window.location.hostname == 'localhost'
  ? 'https://raw.githubusercontent.com/K0nstantini/ton-args-web/main/local-tonconnect-manifest.json'
  : 'https://K0nstantini.github.io/ton-args-web/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>,
  </ThemeProvider>
)
