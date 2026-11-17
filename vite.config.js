import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, 'VITE_');
  const port = Number.parseInt(env.VITE_PORT ?? '3000', 10) || 3000;

  const base =
    process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
      : '/';

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
