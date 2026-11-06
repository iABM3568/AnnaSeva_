import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Plugins extend what Vite can do. "react" understands JSX; "tailwindcss" generates utility classes.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
