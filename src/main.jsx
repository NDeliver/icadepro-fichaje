import React from 'react';
import { Toaster } from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/variables.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#111827',
          color: '#fff',
          borderRadius: '16px',
          padding: '16px',
          fontSize: '14px',
        },

        success: {
          style: {
            background: '#22c55e',
          },
        },

        error: {
          style: {
            background: '#ef4444',
          },
        },
      }}
    />

    <App />
  </React.StrictMode>
);