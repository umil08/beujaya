# BEUJAYA — FB Affiliate Tool (UI demo)

A front-end clone built as a UI/portfolio demo. Same design system as the reference site, rebuilt from scratch.

## Live
Hosted on GitHub Pages. Open the site → login with the demo credentials below.

**Demo login** — user: `admin` · password: `beujaya2026`

> The login is a client-side demo gate (static hosting, no backend) — the credentials are not secret.
> The "post" action and account data are **mocked**: nothing is sent to Facebook and no real cookies are stored.

## Pages
- `index.html` — login
- `dashboard.html` — composer (account picker, live FB-style preview, mock post log)
- `accounts.html` — accounts table (demo data)
- `settings.html` — settings

## Run locally (with real session auth)
The repo also ships a tiny zero-dependency Node server with real cookie sessions:

```bash
node server.js     # → http://localhost:8080
```

This version is **not** used by GitHub Pages (Pages serves static files only).

## Deploy with real (server-side) auth — Render

Pages can't run Node, so for real login — password kept in env vars, not in page source — deploy `server.js` to Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/umil08/beujaya)

1. Click the button → sign in to Render (free; you can use your GitHub account).
2. Render reads `render.yaml` automatically. When prompted, set:
   - `BEUJAYA_USER` — your username
   - `BEUJAYA_PASS` — your password (never stored in the repo)
3. Create the service and wait ~2–3 min → you get a URL like `https://beujaya.onrender.com`.

Notes: the free instance sleeps after ~15 min idle (first request after is a slow cold start), and in-memory sessions reset when it restarts.

