# Space Birthday Invitation (React)

React version of the birthday invitation. Design and behavior match the original static site.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

Output is in `dist/`. Upload the **entire** `dist/` folder to your Hostinger document root (e.g. `public_html`). Your host must support **PHP** so that `api/joiners.php` runs.

## Routes

The app uses hash-based routing. Use these URLs:

- `yoursite.com/#/` – Main invitation
- `yoursite.com/#/joiners` – Joiners list (search, count, remove)
- `yoursite.com/#/birthday/listid?key=eventhandler` – Event handler list (auth required)

## Data

- **Form joiners** – Stored in **localStorage** until you click Send; then cleared.
- **Sent joiners** – With `VITE_JOINERS_API_URL` set (see below), joiners are stored in **`data/joiners.json`** on the server and shared across all devices. Without it, they stay in **localStorage** (same browser only).
- **sessionStorage** – listid page access (set when `?key=eventhandler`).

## Hostinger static data

1. Create a `.env` from `.env.example` and set:
   ```env
   VITE_JOINERS_API_URL=/api/joiners.php
   ```
2. Run `npm run build`.
3. Upload the full `dist/` to your site (so `api/joiners.php` and `data/joiners.json` are on the server).
4. When the event ends: delete or clear `data/joiners.json` to start fresh; no need to remove the app.
