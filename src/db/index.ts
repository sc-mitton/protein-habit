import * as SQLite from "expo-sqlite";

// Open the database
export const dbName = "recipes.db";
export const sqliteDb = SQLite.openDatabaseSync(dbName);
