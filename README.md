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
