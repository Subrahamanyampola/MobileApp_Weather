import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // 👈 Fixes "global is not defined"
    'process.env': {}, // Optional: required if you're using 'process'
  },
});
