
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill process for browser environment immediately
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
}

console.log("INDEX.TSX LOADING...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CRITICAL: Root element not found!");
  throw new Error("Could not find root element to mount to");
}

console.log("Mounting React app...");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log("INDEX.TSX LOADED.");
