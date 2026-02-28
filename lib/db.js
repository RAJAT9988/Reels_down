import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const initSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

const useTurso = () =>
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

function getTursoDb() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. Add them in .env or Vercel env vars."
    );
  }
  return createClient({ url, authToken });
}

function getLocalDb() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const dbPath = path.join(dir, "sqlite.db");
  // dynamic require so better-sqlite3 loads only when using local DB
  const Database = require("better-sqlite3");
  return new Database(dbPath);
}

export async function initDb() {
  if (useTurso()) {
    const db = getTursoDb();
    await db.execute(initSql);
  } else {
    const db = getLocalDb();
    db.exec(initSql);
    db.close();
  }
}

export async function insertUser(fullName) {
  const trimmed = String(fullName).trim();
  if (!trimmed) throw new Error("Full name is required.");

  if (useTurso()) {
    const db = getTursoDb();
    const r = await db.execute({
      sql: "INSERT INTO users (full_name) VALUES (?) RETURNING id, full_name, created_at",
      args: [trimmed],
    });
    return r.rows[0];
  }

  const db = getLocalDb();
  try {
    db.exec(initSql);
    const row = db
      .prepare(
        "INSERT INTO users (full_name) VALUES (?) RETURNING id, full_name, created_at"
      )
      .get(trimmed);
    return row;
  } finally {
    db.close();
  }
}

export async function getUsers() {
  if (useTurso()) {
    const db = getTursoDb();
    const r = await db.execute(
      "SELECT id, full_name, created_at FROM users ORDER BY created_at DESC"
    );
    return r.rows;
  }

  const db = getLocalDb();
  try {
    db.exec(initSql);
    const rows = db
      .prepare(
        "SELECT id, full_name, created_at FROM users ORDER BY created_at DESC"
      )
      .all();
    return rows;
  } finally {
    db.close();
  }
}
