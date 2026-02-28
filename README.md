# REELS

A small web app: users enter their full name on the first screen, it’s stored in a SQLite-compatible database (Turso), then they’re taken to the main dashboard that lists everyone who signed in.

**Full file structure:** see [FILE_STRUCTURE.md](./FILE_STRUCTURE.md).

## Stack

- **Next.js 14** (App Router)
- **Turso** (SQLite-compatible, works on Vercel serverless)
- Styling with CSS modules

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a free Turso database (SQLite-compatible):
   - Go to [turso.tech](https://turso.tech), sign up, and create a database.
   - In the Turso dashboard, open your DB and get:
     - **Database URL** (e.g. `https://your-db-name-your-user.turso.io`)
     - **Auth token** (create under “Tokens”).

3. Copy env example and add your values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   TURSO_DATABASE_URL=https://your-db-name-your-user.turso.io
   TURSO_AUTH_TOKEN=your-token
   ```

4. Run the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub (or connect your repo in Vercel).

2. In [Vercel](https://vercel.com): **New Project** → import this repo → **Deploy** (it will use the existing `next.config.js`).

3. Add environment variables in the Vercel project:
   - **Settings → Environment Variables**
   - Add:
     - `TURSO_DATABASE_URL` = your Turso database URL
     - `TURSO_AUTH_TOKEN` = your Turso auth token

4. Redeploy (or trigger a new deployment) so the build uses the new env vars.

After that, the site will run on Vercel with the same SQLite (Turso) database.

**Important:** Vercel’s filesystem is read-only, so the app **cannot** use the local SQLite fallback in production. If you don’t set the Turso env vars, you’ll get an error like `ENOENT: mkdir '/var/task/data'`.

## Pages

- **`/`** — Form: “Enter full name” → submit → name is saved and user is redirected to `/dashboard`.
- **`/dashboard`** — Instagram URL input + download links.

## Database

The app uses a single table `users`:

- `id` — auto-increment primary key  
- `full_name` — text  
- `created_at` — datetime  

The table is created automatically on first API use (`CREATE TABLE IF NOT EXISTS users ...`).
# Reels_down
