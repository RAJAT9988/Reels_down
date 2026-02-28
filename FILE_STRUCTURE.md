# REELS — File structure

This is the full layout. If you only see `next.config.js`, `package.json`, and `PLAN.md` in the root, expand the **app/** and **lib/** folders in your editor or run `find . -type f -not -path './node_modules/*' -not -path './.next/*'` in the project root to list all source files.

```
REELS/
├── app/                        # Next.js App Router
│   ├── layout.js               # Root layout (HTML, font, metadata)
│   ├── page.js                 # Home: form “Enter full name”
│   ├── page.module.css         # Styles for home page
│   ├── globals.css             # Global CSS variables and base styles
│   ├── api/
│   │   └── users/
│   │       └── route.js        # GET = list users, POST = add user
│   └── dashboard/
│       ├── page.js             # Dashboard: list of names from DB
│       └── page.module.css     # Styles for dashboard
│
├── lib/
│   └── db.js                   # Turso (SQLite) client, init table, insert/list
│
├── public/                     # Static assets (favicon, images)
│   └── .gitkeep
│
├── .env.example                # Env template (TURSO_*)
├── .gitignore
├── jsconfig.json               # Path alias @/*
├── next.config.js
├── package.json
├── vercel.json                 # Vercel deploy config
│
├── FILE_STRUCTURE.md           # This file
├── PLAN.md                     # Instagram downloader plan
└── README.md                   # Run + deploy instructions
```

## After `npm install` you also get

- `node_modules/`   — dependencies
- `.next/`          — build output (gitignored)
- `package-lock.json` — lockfile

## Env (create from example)

- Copy `.env.example` to `.env` and set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
