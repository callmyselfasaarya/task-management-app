import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import logo from './assets/logo.png';
import logo01 from './assets/logo01.png';
import { initBrandTheme } from './theme/brandTheme';

// Kick off brand theming based on logo colors
initBrandTheme(logo, logo01).finally(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
});

