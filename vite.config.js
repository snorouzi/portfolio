import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, 'VITE_');
  const port = Number.parseInt(env.VITE_PORT ?? '3000', 10) || 3000;

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true,
    },
    preview: {
      port,
      strictPort: true,
    },
  };
});
