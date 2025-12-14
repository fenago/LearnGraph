/**
 * Database singleton for Next.js
 * Ensures we only have one database connection across all requests
 * Uses globalThis to persist across hot reloads in dev mode
 */

import { EducationGraphDB } from '../src/db/EducationGraphDB';

const DB_PATH = './data/psychorag-db';

// Declare global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __psychoragDB: EducationGraphDB | undefined;
  var __psychoragDBPromise: Promise<EducationGraphDB> | undefined;
}

/**
 * Get the database instance (creates it if it doesn't exist)
 * Uses globalThis to prevent multiple instances during hot reload
 */
export async function getDB(): Promise<EducationGraphDB> {
  // Return existing instance if available
  if (globalThis.__psychoragDB) {
    return globalThis.__psychoragDB;
  }

  // If already initializing, wait for it
  if (globalThis.__psychoragDBPromise) {
    return globalThis.__psychoragDBPromise;
  }

  // Create and initialize new instance
  globalThis.__psychoragDBPromise = (async () => {
    const db = new EducationGraphDB(DB_PATH);
    await db.open();
    globalThis.__psychoragDB = db;
    return db;
  })();

  return globalThis.__psychoragDBPromise;
}

/**
 * Close the database connection (for cleanup)
 */
export async function closeDB(): Promise<void> {
  if (globalThis.__psychoragDB) {
    await globalThis.__psychoragDB.close();
    globalThis.__psychoragDB = undefined;
    globalThis.__psychoragDBPromise = undefined;
  }
}
