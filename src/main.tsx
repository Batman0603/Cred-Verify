import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CredentialProvider } from './context/CredentialContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CredentialProvider>
            <App />
          </CredentialProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CredentialProvider>
          <App />
        </CredentialProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
