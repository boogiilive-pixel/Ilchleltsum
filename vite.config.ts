
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    // API_KEY-г build болон dev үед process.env-д оноож өгөх
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
