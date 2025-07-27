import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple error handling for the entire application
const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Failed to find the root element');
    return;
  }
  
  const root = createRoot(rootElement);
  
  // Wrap in a try-catch to handle any rendering errors
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering the app:', error);
    // Fallback UI in case of critical error
    root.render(
      <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center', marginTop: '50px' }}>
        <h1>CarpoolConnect</h1>
        <p>We're experiencing technical difficulties. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }
};

// Initialize the application
renderApp();
