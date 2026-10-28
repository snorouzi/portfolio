# Saeed Norouzi — Portfolio

A responsive personal portfolio built with React 19, React Router, and Vite. It presents selected backend projects, career and education details, contribution activity, and a downloadable resume. The interface supports light and dark themes and adapts to the visitor's system preference.

## Pages

- `/` — introduction and up to three featured projects.
- `/projects` — the complete project list.
- `/projects/:slug` — project overview, technologies, features, responsibilities, architecture, challenges, gallery, and links.
- `/about` — profile, career journey, focus areas, GitHub and company contribution calendars, education, and resume.
- Unknown routes and project slugs show a not-found page.

Project content is maintained in `src/data/projects.json`. Profile and career content lives in `src/data/about.js`; the contribution calendars use the JSON exports in `src/data/github.json` and `src/data/gitlab.json`.

## Requirements

- Node.js 22 or newer (the production Docker build uses Node 22).
- npm.

## Run locally

Install dependencies:

```bash
npm install
```

Copy the example environment file and update its values:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

The app is served at <http://localhost:3000> by default. Vite uses a strict port and exits if the configured port is already occupied.

## Configuration

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_APP_NAME` | Yes | — | App name used in page titles. |
| `VITE_APP_URL` | Yes | — | Canonical application URL; must be a valid URL. |
| `VITE_PORT` | No | `3000` | Port used by the Vite development and preview servers. |

Vite reads local values from `.env.local` (start from `.env.example`). Restart the server after changing them. `VITE_*` values are embedded in the browser bundle and are public; do not put secrets, API keys, credentials, or private keys in them. Configuration is validated in `src/config/env.js`.

## Production build

Create and preview the static production build:

```bash
npm run build
npm run preview
```

The build output is written to `dist/`. The preview server uses the same `VITE_PORT` setting as development.

## Docker

Build the production image. The two build arguments are embedded in the client bundle:

```bash
docker build \
  --build-arg VITE_APP_NAME="Saeed Norouzi — Portfolio" \
  --build-arg VITE_APP_URL="https://example.com" \
  -t portfolio .
```

Run it at <http://localhost:8080>:

```bash
docker run --rm -p 8080:80 portfolio
```

The multi-stage image builds the Vite app with Node and serves the static files with Nginx. Nginx serves hashed assets with long-lived caching and falls back to `index.html` for client-side routes.

### Public deployment with Docker Compose

The included Compose stack is configured specifically for `snorouzi.ir`. On the server, start it with:

```bash
docker compose up -d --build
```

It runs the app behind `nginx-proxy` and `acme-companion`, publishes ports 80 and 443, and obtains and renews a Let's Encrypt certificate using HTTP-01 validation. Before starting the stack:

1. Point the domain's DNS A record to the server's public IP (currently configured as `85.198.53.7`).
2. Allow inbound TCP ports 80 and 443 through the server and cloud firewalls.
3. Ensure the domain resolves to that server and port 80 is reachable for certificate issuance.

To receive certificate expiry and recovery notices, set `DEFAULT_EMAIL` on the `acme-companion` service in `docker-compose.yml`.

## Cloudflare Workers coming soon page

`worker.js` is a standalone HTML response for temporarily serving a coming soon page. Its styles and graphics are embedded, so it does not depend on the React app, `dist/`, or external assets. The root `wrangler.toml` points Wrangler at this Worker.

With Wrangler available and authenticated to Cloudflare, preview and deploy it with:

```bash
npx wrangler dev
npx wrangler deploy
```

## Code quality

```bash
npm run lint         # Check JavaScript and JSX with ESLint
npm run format       # Format files with Prettier
npm run format:check # Check formatting without changing files
```

## Project layout

```text
src/
  app/          App composition and route definitions
  assets/       Profile photo and project images
  components/   Layout, home, about, background, and project UI
  config/       Environment and resume configuration
  context/      Theme state and controls
  data/         Project, biography, contribution, and resume content
  lib/          Asset resolution, date formatting, and contribution helpers
  pages/        Home, projects, project details, about, and not-found pages
  styles/       Global styles and theme tokens
```

Static files such as the favicon are in `public/`. The production container and reverse-proxy configuration are in `Dockerfile`, `nginx.conf`, and `docker-compose.yml`.
