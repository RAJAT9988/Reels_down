"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RKLogo, MadeBy } from "@/app/components/Branding";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = fullName.trim();
    if (!trimmed) {
      setError("Please enter your full name.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <RKLogo />
      </header>
      <div className={styles.cardWrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome</h1>
          <p className={styles.subtitle}>
            Enter your full name to continue to the downloader dashboard
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="fullName" className={styles.label}>
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              autoComplete="name"
              disabled={loading}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Saving…" : "Continue to Dashboard"}
            </button>
          </form>
          <p className={styles.hint}>
            You’ll be stored in the database and taken to the main dashboard.
          </p>
        </div>
      </div>
      <footer className={styles.footer}>
        <MadeBy />
      </footer>
    </main>
  );
}
