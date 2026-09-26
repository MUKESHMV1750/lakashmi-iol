import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './redux/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#F9F9F4',
              color: '#2D2D2D',
              border: '1px solid #A3B18B',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#3A5A40', secondary: '#F9F9F4' } },
            error: { iconTheme: { primary: '#8D5B4C', secondary: '#F9F9F4' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
