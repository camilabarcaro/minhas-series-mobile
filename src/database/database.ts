import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

let database: SQLiteDatabase | null = null;

export function getDatabase(): SQLiteDatabase {
  if (!database) {
    database = openDatabaseSync('minhas-series.db');
  }

  return database;
}

export async function runMigrations(): Promise<void> {
  const db = getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS series (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      temporadas INTEGER NOT NULL,
      episodios INTEGER NOT NULL,
      nota REAL,
      concluida INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
