
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Polyfill process for browser environment to prevent crashes
// Cast window to any to fix TypeScript error: Property 'process' does not exist on type 'Window & typeof globalThis'
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
