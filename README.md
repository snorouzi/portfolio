# Personal Portfolio

A personal portfolio website built with [React](https://react.dev/) and [Vite](https://vite.dev/).

This is a clean, minimal foundation. The portfolio UI has not been built yet.

## Prerequisites

- Node.js (LTS recommended)
- npm (included with Node.js)

## Installation

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

The application is served at `http://localhost:3000`. If port 3000 is already in use, Vite fails instead of selecting another port (`strictPort`).

## Production

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Code quality

Lint the source:

```bash
npm run lint
```

Format the source:

```bash
npm run format
```

Check formatting without writing changes:

```bash
npm run format:check
```

## Environment variables

Client-side variables are prefixed with `VITE_` and bundled into the application by Vite. Because they are publicly readable, never store secrets, API keys, database credentials, or private keys in `VITE_*` variables.

Available variables:

- `VITE_APP_NAME` — human-readable application name.
- `VITE_APP_URL` — canonical URL of the running application.
- `VITE_PORT` — port for the Vite development and preview servers (default: `3000`).

The dev and preview ports are read from `VITE_PORT` in `vite.config.js`. Both servers use `strictPort`, so they fail instead of picking another port if the configured port is occupied. The `npm run dev` and `npm run preview` scripts are static commands; the port value comes from `.env.local` (via `.env.example`).

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Adjust the values in `.env.local` as needed. `.env.local` is ignored by Git and must not be committed.
3. Restart the development server after changing environment variables.

Configuration is centralized in `src/config/env.js`, which validates required variables and fails with a clear message if any are missing or invalid.

## Project structure

- `src/main.jsx` — application bootstrap (React root mount, global styles)
- `src/app/App.jsx` — root application component
- `src/config/env.js` — centralized environment configuration and validation
- `src/styles/globals.css` — global CSS reset and defaults
- `src/components/ui/` — shared UI components (to be added)
- `src/utils/` — pure helper functions (to be added)
- `public/` — static assets
