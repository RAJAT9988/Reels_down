# REELS

A small web app: users enter their full name on the first screen, then they’re taken to the downloader dashboard. The name is stored in the browser (localStorage) so it can be shown on the dashboard.

**Full file structure:** see [FILE_STRUCTURE.md](./FILE_STRUCTURE.md).

## Stack

- **Next.js 14** (App Router)
- Styling with CSS modules

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub (or connect your repo in Vercel).

2. In [Vercel](https://vercel.com): **New Project** → import this repo → **Deploy** (it will use the existing `next.config.js`).

3. Deploy. No database setup is needed.

## Pages

- **`/`** — Form: “Enter full name” → submit → name is saved and user is redirected to `/dashboard`.
- **`/dashboard`** — Instagram URL input + download links.
