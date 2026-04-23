# cwcopy

A finger-drawing practice tool for Morse code (CW) operators. Draw characters on a touch canvas, group them into words, and review baseline-aligned results — fully offline as a PWA.

## Features

- **Drawing canvas** — finger or stylus input with a baseline reference line; multi-stroke letters (e.g. *t*) supported via debounce reset on pen-down
- **Letter capture** — transparent PNG crop of each character's bounding box, stored with baseline offset for accurate alignment
- **Results view** — words displayed as proportionally scaled, baseline-aligned letter images with a zoom slider (0.5×–2×)
- **Dark / light mode** — defaults to OS preference; medium-gray strokes in dark mode for comfortable viewing
- **Session persistence** — localStorage autosave with resume-or-start-over prompt on reload
- **PWA** — installable, fully offline via Workbox precaching

## Stack

- React 19 + TypeScript
- Vite 6 + Tailwind CSS v4
- vite-plugin-pwa (Workbox)
- Jest 29 + React Testing Library
- ESLint 9 + Prettier 3
- Docker (nginx) + GitHub Actions → ghcr.io

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check + Vite production build |
| `pnpm test` | Jest test suite |
| `pnpm test:coverage` | Tests with 80% line coverage threshold |
| `pnpm lint` | ESLint (zero warnings) |
| `pnpm format` | Prettier write |

## Docker

```bash
docker build -t cwcopy .
docker run -p 8080:80 cwcopy
```

## CI/CD

GitHub Actions runs lint → type-check → tests on every push and PR. On a passing push to `main`, the Docker image is built and pushed to `ghcr.io/<owner>/cwcopy:latest`.

## Deploying with Cloudflare Tunnel

A `docker-compose.yml` is included for self-hosting behind a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (no open inbound ports required).

1. Create a tunnel at **dash.cloudflare.com → Zero Trust → Networks → Tunnels** and copy the token
2. Configure a public hostname in the tunnel pointing to `http://app:80`
3. On your server:

```bash
echo "CLOUDFLARE_TUNNEL_TOKEN=your_token_here" > .env
docker compose pull
docker compose up -d
```
