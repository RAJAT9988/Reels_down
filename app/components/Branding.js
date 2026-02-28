import Link from "next/link";
import styles from "./Branding.module.css";

export function RKLogo({ className = "" }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="REELS home">
      <span className={styles.logoRK}>RK</span>
    </Link>
  );
}

export function MadeBy() {
  return (
    <p className={styles.madeBy}>
      made by <span className={styles.name}>rajat kuchara</span>
    </p>
  );
}
