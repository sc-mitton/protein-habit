import * as SQLite from "expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@db/schema";

// Open the database
export const dbName = "recipes.db";
export const sqliteDb = SQLite.openDatabaseSync(dbName);

export function useDrizzleDb() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  return drizzleDb;
}

export * from "./dml";
