# Instagram Downloader Web Platform — Plan

A Node.js web app where users paste Instagram post/Reel URLs and download media as `.mp4` (and images as `.jpg`/`.png`).

---

## 1. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Backend** | Node.js + Express | Simple API, file handling, streaming |
| **Instagram fetch** | `@sasmeee/igdl` or similar | Get media URLs from post/Reel links |
| **Frontend** | HTML/CSS/JS (or React later) | Start simple; can upgrade |
| **File delivery** | Express static + download endpoints | Serve `.mp4` / images for download |
| **Optional** | FFmpeg (system) | Re-encode to .mp4 if source is other format |

---

## 2. High-Level Flow

```
User pastes Instagram URL → Backend fetches media URLs → 
Backend downloads/caches file → User gets .mp4 (or image) download
```

- **Input:** Instagram post or Reel URL (e.g. `https://www.instagram.com/reel/...` or `.../p/...`).
- **Output:** Download as `.mp4` for video, or `.jpg`/`.png` for images/carousels.

---

## 3. Features (MVP)

1. **Single URL input**  
   - One text field for Instagram post/Reel URL.  
   - “Download” (or “Get link”) button.

2. **Backend: resolve media**  
   - Use a library (e.g. `@sasmeee/igdl`) to get:
     - Video URL(s) for Reels/video posts.  
     - Image URL(s) for photo posts.  
     - For carousels: list of media (videos + images).

3. **Backend: fetch and serve**  
   - Download media from resolved URL to a temp/cache folder (or stream in memory).  
   - If needed, ensure video is served as `.mp4` (either native or via FFmpeg).  
   - Respond with:
     - **Option A:** Direct download (attachment) of the file.  
     - **Option B:** Return a temporary download URL that serves the file.

4. **Frontend**  
   - Show result: “Download video” / “Download image” buttons, or a single “Download” for the first media.  
   - For carousels: list of links (video as .mp4, images as .jpg/.png).

5. **Optional later**  
   - History of last N URLs (in-memory or DB).  
   - Simple rate limiting per IP to avoid abuse.

---

## 4. Project Structure (Suggested)

```
REELS/
├── package.json
├── .env                    # Optional: PORT, any API keys later
├── .gitignore
├── server.js               # Express app entry
├── routes/
│   └── download.js         # POST /api/resolve, GET /api/download/:id
├── services/
│   └── instagram.js        # Use igdl (or similar) to get media URLs + download
├── storage/                # Temp downloaded files (gitignore)
│   └── .gitkeep
├── public/
│   ├── index.html          # Landing page with URL input
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js          # Call API, show download links
├── PLAN.md                 # This file
└── README.md
```

---

## 5. Implementation Steps

### Phase 1 — Project setup
1. `npm init -y` in `REELS`.
2. Install: `express`, `@sasmeee/igdl` (or chosen lib), `dotenv`, `axios` (for fetching media bytes), `uuid` (for temp file IDs).
3. Create `server.js`: start Express, serve `public/`, mount API routes.
4. Add `storage/` and put it in `.gitignore`.

### Phase 2 — Instagram resolution + download
1. In `services/instagram.js`:
   - Function that takes Instagram URL → calls library → returns list of media (type: video/image, url).
   - Function that takes media URL → downloads to `storage/<id>.<ext>` (or stream to memory) and returns local path or buffer.
2. In `routes/download.js`:
   - `POST /api/resolve`: body `{ url: "https://instagram.com/..." }` → returns `{ media: [ { type, downloadId, filename } ] }`.
   - Internally: resolve URL → download to storage with a unique ID → return IDs and suggested filenames (.mp4 / .jpg).
   - `GET /api/download/:id`: stream file from storage, set `Content-Disposition: attachment` so browser downloads as .mp4/.jpg.

### Phase 3 — Ensure .mp4 for video
- If the library returns a URL that already points to .mp4, use it as-is.
- If it returns another format (e.g. .mpd or different codec):
  - **Option A:** Still serve with a `.mp4` extension if the container is compatible (some clients accept).  
  - **Option B:** Use **FFmpeg** (child process or fluent-ffmpeg) to re-encode to .mp4, then serve from storage.

### Phase 4 — Frontend
1. `public/index.html`: input for URL, “Download” button, area for results (list of “Download video/image” links).
2. `public/js/app.js`: on submit, `POST /api/resolve` with URL; for each item in response, show a link to `GET /api/download/:id` (or open in new tab) with suggested filename.
3. Style with `public/css/style.css` so it’s clear and mobile-friendly.

### Phase 5 — Polish
- Add simple error messages (invalid URL, “could not fetch post”, “private post”).
- Optional: cleanup job to delete files in `storage/` older than 1 hour.
- Optional: rate limit (e.g. `express-rate-limit`) per IP.

---

## 6. API Sketch

| Method | Endpoint | Body / Params | Response |
|--------|----------|----------------|----------|
| POST   | `/api/resolve` | `{ "url": "https://www.instagram.com/reel/..." }` | `{ "media": [ { "type": "video", "downloadId": "uuid", "filename": "reel.mp4" } ] }` |
| GET    | `/api/download/:id` | — | File stream (Content-Disposition: attachment) |

---

## 7. Important Notes

- **Terms of Service:** Downloading others’ Instagram content can violate Instagram’s ToS. Use only for your own content or with permission, and for learning purposes. Prefer official APIs where possible (they are limited for bulk download).
- **Unofficial libraries:** Packages like `@sasmeee/igdl` rely on unofficial scraping; they can break when Instagram changes their frontend. Have a fallback or clear error message.
- **Rate limiting:** Implement to avoid IP blocks and to be respectful to Instagram’s servers.
- **Storage:** Don’t keep files forever; purge `storage/` periodically.

---

## 8. Next Step

Start with **Phase 1** (project setup) and **Phase 2** (resolve + download in backend), then wire the frontend in Phase 4. Add FFmpeg (Phase 3) only if the default URLs are not already .mp4.

If you want, the next step can be generating the actual `package.json`, `server.js`, and a minimal `services/instagram.js` + `routes/download.js` so you can run the app and test with one Instagram Reel URL.
