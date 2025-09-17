import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/auth/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);