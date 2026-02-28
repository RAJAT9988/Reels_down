"use client";

import { useState } from "react";
import { RKLogo, MadeBy } from "@/app/components/Branding";
import styles from "./page.module.css";

export default function Dashboard() {
  const [instaUrl, setInstaUrl] = useState("");
  const [instaLoading, setInstaLoading] = useState(false);
  const [instaError, setInstaError] = useState("");
  const [mediaList, setMediaList] = useState([]);

  async function handleInstaSubmit(e) {
    e.preventDefault();
    setInstaError("");
    setMediaList([]);
    const url = instaUrl.trim();
    if (!url) {
      setInstaError("Please paste an Instagram post or reel URL.");
      return;
    }
    setInstaLoading(true);
    try {
      const res = await fetch("/api/instagram/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not fetch media");
      setMediaList(data.media || []);
    } catch (err) {
      setInstaError(err.message);
    } finally {
      setInstaLoading(false);
    }
  }

  function getDownloadUrl(item) {
    const params = new URLSearchParams({
      url: item.url,
      filename: item.filename,
    });
    return `/api/instagram/download?${params.toString()}`;
  }

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <RKLogo />
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Download Reels & Posts</h2>
          <p className={styles.sectionSubtitle}>
            Paste an Instagram post or reel URL to get download links.
          </p>
          <form onSubmit={handleInstaSubmit} className={styles.instaForm}>
            <input
              type="url"
              placeholder="https://www.instagram.com/reel/... or /p/..."
              value={instaUrl}
              onChange={(e) => setInstaUrl(e.target.value)}
              className={styles.instaInput}
              disabled={instaLoading}
            />
            <button type="submit" className={styles.instaButton} disabled={instaLoading}>
              {instaLoading ? "Fetching…" : "Download"}
            </button>
          </form>
          {instaError && <p className={styles.error}>{instaError}</p>}
          {mediaList.length > 0 && (
            <div className={styles.mediaList}>
              <p className={styles.mediaListTitle}>Download as .mp4 / image:</p>
              <ul className={styles.mediaUl}>
                {mediaList.map((item, i) => (
                  <li key={i} className={styles.mediaItem}>
                    <a
                      href={getDownloadUrl(item)}
                      download={item.filename}
                      className={styles.downloadLink}
                    >
                      {item.type === "video" ? "▶" : "🖼"} {item.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <MadeBy />
      </footer>
    </main>
  );
}
