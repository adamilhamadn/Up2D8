import * as SQLite from 'expo-sqlite';
import { SCHEMA_STATEMENTS } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabaseAsync('up2d8.db');
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  // Enable foreign keys
  await database.execAsync('PRAGMA foreign_keys = ON;');
  
  for (const statement of SCHEMA_STATEMENTS) {
    await database.execAsync(statement);
  }
}
