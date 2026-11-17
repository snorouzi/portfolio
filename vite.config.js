import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, 'VITE_');
  const port = Number.parseInt(env.VITE_PORT ?? '3000', 10) || 3000;

  // Set VITE_BASE explicitly for Pages: '/' for a custom domain, or '/<repo>/'
  // for the default github.io project URL. Local and Docker builds default to '/'.
  const base = env.VITE_BASE || '/';

  return {
    base,
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
